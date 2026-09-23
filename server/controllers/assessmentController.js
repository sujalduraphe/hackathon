import Assessment from '../models/Assessment.js';
import Student from '../models/Student.js';
import { gradeAssessment, applyAssessment } from '../../src/lib/assessment.js';
import { HttpError, plain, toClientStudent } from '../utils/http.js';

const toClient = a => ({ ...a.toJSON(), skillResults: plain(a.skillResults), at: a.createdAt.toISOString() });

/**
 * POST /api/assessments — body { category, answers: [optionIndex, ...] }.
 * Graded on the server against the answer key, then folded into the profile,
 * so a student can't submit their own score.
 */
export async function submit(req, res) {
  const { category, answers } = req.body;
  if (!Array.isArray(answers)) throw new HttpError(422, 'answers must be an array of option indexes');
  let graded;
  try { graded = gradeAssessment(category, answers); } catch (e) { throw new HttpError(422, e.message); }

  const student = await Student.findById(req.user.student);
  const { skills, skillSource, changes } = applyAssessment(plain(student.skills), plain(student.skillSource), graded.skillResults);
  student.skills = skills;
  student.skillSource = skillSource;
  await student.save();

  const a = await Assessment.create({
    student: student._id, category, answers, score: graded.score, skillResults: graded.skillResults, changes,
  });
  res.status(201).json({ assessment: toClient(a), changes, profile: toClientStudent(student) });
}

/** GET /api/assessments — the student's history, newest first */
export async function mine(req, res) {
  const list = await Assessment.find({ student: req.user.student }).sort({ createdAt: -1 });
  res.json(list.map(toClient));
}
