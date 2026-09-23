import Job from '../models/Job.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { canonicalSkill, extractSkills } from '../../src/lib/skills.js';
import { rankCandidates } from '../../src/lib/matching.js';
import { HttpError, toClientStudent } from '../utils/http.js';

/** GET /api/jobs — all open postings; ?mine=1 for a recruiter's own */
export async function listJobs(req, res) {
  const filter = req.query.mine && req.user.role === 'industry' ? { postedBy: req.user.id } : {};
  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  res.json(jobs.map(j => ({ ...j.toJSON(), postedBy: String(j.postedBy), mine: String(j.postedBy) === req.user.id })));
}

/** POST /api/jobs — recruiter posts an opportunity for their own company */
export async function createJob(req, res) {
  const b = req.body;
  if (!b.title?.trim()) throw new HttpError(422, 'Job title is required');
  const skills = [...new Set((b.skills || []).map(canonicalSkill).filter(Boolean))];
  if (!skills.length) throw new HttpError(422, 'Add at least one required skill');

  const recruiter = await User.findById(req.user.id);
  const job = await Job.create({
    title: b.title, type: b.type, location: b.location, mode: b.mode, stipend: b.stipend,
    duration: b.duration, description: b.description, deadline: b.deadline, departments: b.departments,
    skills,
    minSkillLevel: Number(b.minSkillLevel) || 60,
    minCGPA: Number(b.minCGPA) || 0,
    openings: Number(b.openings) || 1,
    category: b.type === 'Full-Time' ? 'fulltime' : /research/i.test(b.type || '') ? 'research' : 'internship',
    company: recruiter.organization,
    logo: '🏢', color: '#f43f5e',
    postedBy: recruiter._id,
  });
  res.status(201).json({ ...job.toJSON(), postedBy: String(job.postedBy), mine: true });
}

/** GET /api/jobs/:id/candidates — talent pool ranked for one of the recruiter's postings */
export async function rankedCandidates(req, res) {
  const job = await Job.findById(req.params.id);
  if (!job) throw new HttpError(404, 'Job not found');
  if (String(job.postedBy) !== req.user.id) throw new HttpError(403, 'You can only rank candidates for your own postings');
  const students = (await Student.find()).map(toClientStudent);
  res.json(rankCandidates(students, job.toJSON()));
}

/** POST /api/jobs/extract-skills — pull required skills out of a job description */
export async function extractFromDescription(req, res) {
  const text = String(req.body.text || '');
  if (!text.trim()) throw new HttpError(422, 'Description text is required');
  res.json(extractSkills(text));
}
