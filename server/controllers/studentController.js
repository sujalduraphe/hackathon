import Student from '../models/Student.js';
import User from '../models/User.js';
import { extractText, getDocumentProxy } from 'unpdf';
import { canonicalSkill, extractSkills } from '../../src/lib/skills.js';
import { HttpError, plain, toClientStudent } from '../utils/http.js';

/** GET /api/students/me — the logged-in student's skill profile */
export async function myProfile(req, res) {
  const s = await Student.findById(req.user.student);
  if (!s) throw new HttpError(404, 'Student profile not found');
  res.json(toClientStudent(s));
}

/**
 * GET /api/students — the talent pool.
 * Recruiters see every student; an institution sees only its own college.
 */
export async function listStudents(req, res) {
  const filter = {};
  if (req.user.role === 'institution') {
    const u = await User.findById(req.user.id);
    filter.college = u.organization;
  }
  const students = await Student.find(filter).sort({ name: 1 });
  res.json(students.map(toClientStudent));
}

const KINDS = {
  projects: b => ({ title: b.title, description: b.description, link: b.link, tech: Array.isArray(b.tech) ? b.tech : String(b.tech || '').split(',').map(t => t.trim()).filter(Boolean) }),
  achievements: b => ({ title: b.title, year: b.year, description: b.description }),
};

function kindOf(req) {
  const pick = KINDS[req.params.kind];
  if (!pick) throw new HttpError(404, 'Unknown portfolio section');
  return pick;
}

/** POST /api/students/me/portfolio/:kind — add an item (always starts unverified) */
export async function addPortfolioItem(req, res) {
  const pick = kindOf(req);
  const s = await Student.findById(req.user.student);
  s[req.params.kind].push(pick(req.body));
  await s.save();
  res.status(201).json(toClientStudent(s));
}

/** DELETE /api/students/me/portfolio/:kind/:itemId */
export async function removePortfolioItem(req, res) {
  kindOf(req);
  const s = await Student.findById(req.user.student);
  const entry = s[req.params.kind].id(req.params.itemId);
  if (!entry) throw new HttpError(404, 'Item not found');
  entry.deleteOne();
  await s.save();
  res.json(toClientStudent(s));
}

/**
 * PATCH /api/students/:id/portfolio/:kind/:itemId — institution verifies (or
 * un-verifies) an item. Only for students of the verifier's own college.
 */
export async function verifyPortfolioItem(req, res) {
  kindOf(req);
  const verifier = await User.findById(req.user.id);
  const s = await Student.findById(req.params.id);
  if (!s) throw new HttpError(404, 'Student not found');
  if (s.college !== verifier.organization) throw new HttpError(403, 'You can only verify students of your own institution');
  const entry = s[req.params.kind].id(req.params.itemId);
  if (!entry) throw new HttpError(404, 'Item not found');
  const verified = req.body.verified !== false;
  entry.verified = verified;
  entry.verifiedBy = verified ? verifier._id : undefined;
  entry.verifiedAt = verified ? new Date() : undefined;
  await s.save();
  res.json(toClientStudent(s));
}

/**
 * POST /api/students/me/resume (multipart, field "resume", PDF ≤ 2 MB).
 * Stores the file and returns the skills detected in its text. Nothing is added
 * to the profile until the student confirms (see addSkills).
 */
export async function uploadResume(req, res) {
  if (!req.file) throw new HttpError(422, 'Attach a PDF file');
  let text;
  try {
    const pdf = await getDocumentProxy(new Uint8Array(req.file.buffer));
    ({ text } = await extractText(pdf, { mergePages: true }));
  } catch {
    throw new HttpError(422, 'Could not read this PDF. Try exporting it again from your editor.');
  }
  const s = await Student.findById(req.user.student);
  s.resume = { filename: req.file.originalname, size: req.file.size, uploadedAt: new Date(), data: req.file.buffer };
  await s.save();
  const detected = extractSkills(text || '').map(({ skill, evidence }) => ({
    skill, evidence, current: plain(s.skills)[skill] ?? null, source: plain(s.skillSource)[skill] ?? null,
  }));
  res.status(201).json({ profile: toClientStudent(s), detected, textFound: Boolean(text?.trim()) });
}

/** DELETE /api/students/me/resume */
export async function deleteResume(req, res) {
  const s = await Student.findById(req.user.student);
  s.resume = undefined;
  await s.save();
  res.json(toClientStudent(s));
}

/**
 * GET /api/students/:id/resume — the PDF. Allowed for the student themself,
 * any recruiter, and the student's own institution.
 */
export async function downloadResume(req, res) {
  const s = await Student.findById(req.params.id).select('+resume.data');
  if (!s?.resume?.data) throw new HttpError(404, 'No resume uploaded');
  const { role, student } = req.user;
  let allowed = role === 'industry' || (role === 'student' && student === String(s._id));
  if (role === 'institution') allowed = (await User.findById(req.user.id)).organization === s.college;
  if (!allowed) throw new HttpError(403, 'Not allowed to view this resume');
  res.set('Content-Type', 'application/pdf');
  res.set('Content-Disposition', `inline; filename="${encodeURIComponent(s.resume.filename)}"`);
  res.send(s.resume.data);
}

/**
 * POST /api/students/me/skills — body { skills: { name: level } }.
 * Adds self-reported levels (e.g. confirmed from a resume). Levels already
 * verified by an assessment are left untouched.
 */
export async function addSkills(req, res) {
  const input = req.body.skills;
  if (!input || typeof input !== 'object') throw new HttpError(422, 'skills must be an object of { skill: level }');
  const s = await Student.findById(req.user.student);
  const skills = plain(s.skills), source = plain(s.skillSource);
  for (const [raw, lvl] of Object.entries(input)) {
    const name = canonicalSkill(raw);
    const level = Math.round(Number(lvl));
    if (!name || Number.isNaN(level) || level < 0 || level > 100) throw new HttpError(422, `Invalid level for ${raw}`);
    if (source[name] === 'assessment') continue;
    skills[name] = level;
    source[name] = 'resume';
  }
  s.skills = skills;
  s.skillSource = source;
  await s.save();
  res.json(toClientStudent(s));
}
