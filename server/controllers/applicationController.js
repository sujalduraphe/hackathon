import Application, { STAGES } from '../models/Application.js';
import Job from '../models/Job.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { explainMatch } from '../../src/lib/matching.js';
import { HttpError, plain, toClientApplication } from '../utils/http.js';

// Allowed recruiter moves. Rejection is possible from any open stage.
const NEXT = { applied: 'shortlisted', shortlisted: 'assessment', assessment: 'interview', interview: 'offered' };

/**
 * GET /api/applications
 * Students see their own; recruiters see applications to their postings;
 * institutions see applications from their college's students.
 */
export async function listApplications(req, res) {
  let filter;
  if (req.user.role === 'student') filter = { student: req.user.student };
  else if (req.user.role === 'industry') filter = { job: { $in: await Job.find({ postedBy: req.user.id }).distinct('_id') } };
  else if (req.user.role === 'institution') {
    const u = await User.findById(req.user.id);
    filter = { student: { $in: await Student.find({ college: u.organization }).distinct('_id') } };
  } else throw new HttpError(403, 'Not available for this role');
  const apps = await Application.find(filter).sort({ createdAt: -1 });
  res.json(apps.map(toClientApplication));
}

/** POST /api/applications — student applies to a job */
export async function apply(req, res) {
  const job = await Job.findById(req.body.jobId);
  if (!job) throw new HttpError(404, 'Job not found');
  const student = await Student.findById(req.user.student);
  const m = explainMatch(plain(student.skills), job.toJSON(), student.cgpa);
  if (!m.eligible) throw new HttpError(422, `Not eligible: minimum CGPA is ${job.minCGPA}`);
  if (await Application.exists({ job: job._id, student: student._id })) throw new HttpError(409, 'You have already applied to this job');

  const app = await Application.create({
    job: job._id, student: student._id, matchAtApply: m.score,
    history: [{ status: 'applied', by: req.user.id }],
  });
  await Job.updateOne({ _id: job._id }, { $inc: { applicants: 1 } });
  res.status(201).json(toClientApplication(app));
}

/** PATCH /api/applications/:id — recruiter moves an applicant through the pipeline */
export async function updateStatus(req, res) {
  const { status } = req.body;
  if (!STAGES.includes(status)) throw new HttpError(422, `Unknown status: ${status}`);
  const app = await Application.findById(req.params.id).populate('job');
  if (!app) throw new HttpError(404, 'Application not found');
  if (String(app.job.postedBy) !== req.user.id) throw new HttpError(403, 'You can only manage applications to your own postings');
  const allowed = status === 'rejected' ? !['offered', 'rejected'].includes(app.status) : NEXT[app.status] === status;
  if (!allowed) throw new HttpError(422, `Cannot move an application from ${app.status} to ${status}`);

  app.status = status;
  app.history.push({ status, by: req.user.id });
  await app.save();
  res.json(toClientApplication(app));
}
