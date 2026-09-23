import MarketJob from '../models/MarketJob.js';
import { parseCSV } from '../utils/csv.js';
import { extractSkills } from '../../src/lib/skills.js';
import { ROLE_FAMILIES } from '../../src/lib/matching.js';
import { HttpError } from '../utils/http.js';

// Header names used by common exports (Glassdoor, LinkedIn, Naukri, Kaggle datasets)
const COLUMNS = {
  title: ['job title', 'title', 'position', 'job_title', 'jobtitle', 'role'],
  company: ['company name', 'company', 'employer', 'company_name', 'organization'],
  location: ['location', 'city', 'job location', 'job_location'],
  description: ['job description', 'description', 'jd', 'job_description', 'details', 'summary'],
};
const MAX_ROWS = 5000;

function pickColumn(headers, names) {
  const lower = headers.map(h => h.toLowerCase());
  for (const n of names) {
    const i = lower.indexOf(n);
    if (i !== -1) return headers[i];
  }
  return null;
}

export const roleForTitle = title => ROLE_FAMILIES.find(f => f.pattern.test(title))?.role || null;

/** Turn raw rows into MarketJob documents; rows without a description are skipped. */
export function rowsToJobs(rows, { batch, source, importedBy }) {
  if (!rows.length) return { jobs: [], skipped: 0, columns: {} };
  const headers = Object.keys(rows[0]);
  const cols = Object.fromEntries(Object.entries(COLUMNS).map(([k, names]) => [k, pickColumn(headers, names)]));
  if (!cols.description) throw new HttpError(422, `No job description column found. Expected one of: ${COLUMNS.description.join(', ')}`);
  let skipped = 0;
  const jobs = [];
  for (const r of rows.slice(0, MAX_ROWS)) {
    const description = r[cols.description];
    if (!description || description.length < 30) { skipped++; continue; }
    const title = (cols.title && r[cols.title]) || 'Untitled role';
    jobs.push({
      batch, source, importedBy, title,
      company: cols.company ? r[cols.company].split('\n')[0] : undefined, // Glassdoor appends the rating on a new line
      location: cols.location ? r[cols.location] : undefined,
      description: description.slice(0, 8000),
      skills: extractSkills(description).filter(s => s.required).map(s => s.skill),
      role: roleForTitle(title),
    });
  }
  return { jobs, skipped: skipped + Math.max(0, rows.length - MAX_ROWS), columns: cols };
}

/** POST /api/market/import — multipart: file (CSV), source (label, e.g. "Glassdoor export, Sep 2026") */
export async function importCSV(req, res) {
  if (!req.file) throw new HttpError(422, 'Attach a CSV file');
  const source = String(req.body.source || '').trim() || req.file.originalname;
  const rows = parseCSV(req.file.buffer.toString('utf8'));
  if (!rows.length) throw new HttpError(422, 'The CSV has no data rows');
  const batch = `b${Date.now().toString(36)}`;
  const { jobs, skipped, columns } = rowsToJobs(rows, { batch, source, importedBy: req.user.id });
  if (!jobs.length) throw new HttpError(422, 'No usable job descriptions found in the file');
  await MarketJob.insertMany(jobs);
  res.status(201).json({ batch, source, imported: jobs.length, skipped, columns });
}

/** DELETE /api/market/batches/:batch — remove an import you made */
export async function deleteBatch(req, res) {
  const r = await MarketJob.deleteMany({ batch: req.params.batch, importedBy: req.user.id });
  if (!r.deletedCount) throw new HttpError(404, 'Import not found (you can only remove imports you made)');
  res.json({ deleted: r.deletedCount });
}

/** Per-role skill counts from imported job descriptions: { role: { postings, skills: { skill: n } } } */
export async function marketRoles() {
  const byRole = await MarketJob.aggregate([
    { $match: { role: { $ne: null } } },
    { $group: { _id: '$role', postings: { $sum: 1 }, skills: { $push: '$skills' } } },
  ]);
  return Object.fromEntries(byRole.map(r => {
    const counts = {};
    for (const list of r.skills) for (const sk of new Set(list)) counts[sk] = (counts[sk] || 0) + 1;
    return [r._id, { postings: r.postings, skills: counts }];
  }));
}

/** Overall skill counts across all imported job descriptions */
export async function marketSkillCounts() {
  const [total, rows] = await Promise.all([
    MarketJob.countDocuments(),
    MarketJob.aggregate([{ $unwind: '$skills' }, { $group: { _id: '$skills', count: { $sum: 1 } } }]),
  ]);
  return { total, skills: Object.fromEntries(rows.map(r => [r._id, r.count])) };
}

/**
 * GET /api/market/summary — skill demand across imported job descriptions:
 * overall top skills, per-role skill counts (used by gap analysis), and the import batches.
 */
export async function summary(req, res) {
  const [total, batches, overall, roles] = await Promise.all([
    MarketJob.countDocuments(),
    MarketJob.aggregate([
      { $group: { _id: '$batch', source: { $first: '$source' }, count: { $sum: 1 }, at: { $min: '$createdAt' }, importedBy: { $first: '$importedBy' } } },
      { $sort: { at: -1 } },
    ]),
    MarketJob.aggregate([{ $unwind: '$skills' }, { $group: { _id: '$skills', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 20 }]),
    marketRoles(),
  ]);
  res.json({
    total,
    batches: batches.map(b => ({ batch: b._id, source: b.source, count: b.count, at: b.at, mine: String(b.importedBy) === req.user.id })),
    topSkills: overall.map(o => ({ skill: o._id, count: o.count, pct: total ? Math.round((o.count / total) * 100) : 0 })),
    roles,
  });
}
