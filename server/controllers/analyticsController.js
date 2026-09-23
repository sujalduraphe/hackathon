import Student from '../models/Student.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import { canonicalSkill } from '../../src/lib/skills.js';
import { closestRole } from '../../src/lib/matching.js';
import { plain } from '../utils/http.js';
import { marketRoles, marketSkillCounts } from './marketController.js';

/**
 * GET /api/analytics/institution — cohort skill health for the TPO's college:
 * which in-demand skills students lack, and where they sit in the hiring pipeline.
 */
export async function institutionOverview(req, res) {
  const u = await User.findById(req.user.id);
  const students = await Student.find({ college: u.organization });
  const jobs = (await Job.find()).map(j => j.toJSON());
  const apps = await Application.find({ student: { $in: students.map(s => s._id) } });
  const [market, marketCounts] = await Promise.all([marketRoles(), marketSkillCounts()]);

  // demand: share of portal postings + imported market job descriptions asking for each skill
  const demand = { ...marketCounts.skills };
  for (const j of jobs) for (const s of new Set(j.skills.map(canonicalSkill))) demand[s] = (demand[s] || 0) + 1;
  const totalPostings = jobs.length + marketCounts.total;

  const skillGaps = Object.entries(demand).map(([skill, n]) => {
    const levels = students.map(s => plain(s.skills)[skill] ?? 0);
    const below = levels.filter(l => l < 60).length;
    return {
      skill,
      demand: Math.round((n / totalPostings) * 100),
      avgLevel: levels.length ? Math.round(levels.reduce((a, b) => a + b, 0) / levels.length) : 0,
      studentsBelowBar: below,
    };
  }).sort((a, b) => b.demand * b.studentsBelowBar - a.demand * a.studentsBelowBar);

  const funnel = Object.fromEntries(['applied', 'shortlisted', 'assessment', 'interview', 'offered', 'rejected']
    .map(st => [st, apps.filter(a => a.status === st).length]));

  const readiness = students.map(s => {
    const best = closestRole(plain(s.skills), jobs, market);
    const verified = Object.values(plain(s.skillSource)).filter(v => v === 'assessment').length;
    return { id: String(s._id), name: s.name, dept: s.dept, cgpa: s.cgpa, bestRole: best.role, readiness: best.readiness, verifiedSkills: verified,
      applications: apps.filter(a => String(a.student) === String(s._id)).length,
      offers: apps.filter(a => String(a.student) === String(s._id) && a.status === 'offered').length };
  }).sort((a, b) => b.readiness - a.readiness);

  res.json({ college: u.organization, students: students.length, openings: jobs.length, marketPostings: marketCounts.total, skillGaps, funnel, readiness });
}
