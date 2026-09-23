import Program from '../models/Program.js';
import Registration from '../models/Registration.js';
import User from '../models/User.js';
import { PROGRAM_KINDS, kindsFor } from '../../src/lib/programs.js';
import { canonicalSkill } from '../../src/lib/skills.js';
import { HttpError } from '../utils/http.js';

const regToClient = (r, extra = {}) => ({
  id: String(r._id), programId: String(r.program?._id ?? r.program), status: r.status,
  message: r.message, at: r.createdAt.toISOString(), ...extra,
});

async function withCounts(programs) {
  const counts = await Registration.aggregate([
    { $match: { program: { $in: programs.map(p => p._id) } } },
    { $group: { _id: '$program', total: { $sum: 1 }, accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } } } },
  ]);
  const by = Object.fromEntries(counts.map(c => [String(c._id), c]));
  return programs.map(p => ({ ...p.toJSON(), postedBy: String(p.postedBy), registrations: by[String(p._id)]?.total || 0, accepted: by[String(p._id)]?.accepted || 0 }));
}

/**
 * GET /api/programs — industry sees its own; students and academicians see the
 * kinds open to them; institutions see everything (read-only).
 */
export async function listPrograms(req, res) {
  const { role, id } = req.user;
  const filter = role === 'industry' ? { postedBy: id }
    : role === 'institution' ? {}
    : { kind: { $in: kindsFor(role) } };
  res.json(await withCounts(await Program.find(filter).sort({ createdAt: -1 })));
}

/** POST /api/programs — industry publishes a program under its own organisation */
export async function createProgram(req, res) {
  const b = req.body;
  if (!PROGRAM_KINDS[b.kind]) throw new HttpError(422, 'Choose a program type');
  if (!b.title?.trim()) throw new HttpError(422, 'Title is required');
  const seats = b.seats === '' || b.seats == null ? undefined : Number(b.seats);
  if (seats !== undefined && (!Number.isInteger(seats) || seats < 1)) throw new HttpError(422, 'Seats must be a whole number of at least 1');
  const me = await User.findById(req.user.id);
  const p = await Program.create({
    kind: b.kind, title: b.title, description: b.description, mode: b.mode || 'Online', location: b.location,
    startDate: b.startDate, duration: b.duration, seats, compensation: b.compensation,
    skills: [...new Set((b.skills || []).map(canonicalSkill).filter(Boolean))],
    organization: me.organization, postedBy: me._id,
  });
  res.status(201).json((await withCounts([p]))[0]);
}

/** DELETE /api/programs/:id — owner only; removes its registrations too */
export async function deleteProgram(req, res) {
  const p = await Program.findById(req.params.id);
  if (!p) throw new HttpError(404, 'Program not found');
  if (String(p.postedBy) !== req.user.id) throw new HttpError(403, 'You can only delete your own programs');
  await Registration.deleteMany({ program: p._id });
  await p.deleteOne();
  res.json({ ok: true });
}

/** POST /api/programs/:id/register — a student or academician registers */
export async function register(req, res) {
  const p = await Program.findById(req.params.id);
  if (!p) throw new HttpError(404, 'Program not found');
  if (!PROGRAM_KINDS[p.kind].audience.includes(req.user.role)) throw new HttpError(403, 'This program is not open to your role');
  if (await Registration.exists({ program: p._id, user: req.user.id })) throw new HttpError(409, 'You have already registered');
  if (p.seats) {
    const accepted = await Registration.countDocuments({ program: p._id, status: 'accepted' });
    if (accepted >= p.seats) throw new HttpError(422, 'All seats are filled');
  }
  const r = await Registration.create({ program: p._id, user: req.user.id, message: String(req.body.message || '').slice(0, 500) });
  res.status(201).json(regToClient(r));
}

/** GET /api/registrations — the caller's own registrations */
export async function myRegistrations(req, res) {
  const list = await Registration.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(list.map(r => regToClient(r)));
}

/** GET /api/programs/:id/registrations — owner sees who registered */
export async function programRegistrations(req, res) {
  const p = await Program.findById(req.params.id);
  if (!p) throw new HttpError(404, 'Program not found');
  if (String(p.postedBy) !== req.user.id) throw new HttpError(403, 'You can only view registrations for your own programs');
  const list = await Registration.find({ program: p._id }).populate('user', 'name email role organization dept designation').sort({ createdAt: 1 });
  res.json(list.map(r => regToClient(r, {
    user: { name: r.user.name, email: r.user.email, role: r.user.role, organization: r.user.organization, dept: r.user.dept, designation: r.user.designation },
  })));
}

/** PATCH /api/registrations/:id — owner accepts or declines */
export async function decide(req, res) {
  const { status } = req.body;
  if (!['accepted', 'declined'].includes(status)) throw new HttpError(422, 'Status must be accepted or declined');
  const r = await Registration.findById(req.params.id).populate('program');
  if (!r) throw new HttpError(404, 'Registration not found');
  if (String(r.program.postedBy) !== req.user.id) throw new HttpError(403, 'You can only manage your own programs');
  if (status === 'accepted' && r.status !== 'accepted' && r.program.seats) {
    const accepted = await Registration.countDocuments({ program: r.program._id, status: 'accepted' });
    if (accepted >= r.program.seats) throw new HttpError(422, 'All seats are filled');
  }
  r.status = status;
  await r.save();
  res.json(regToClient(r));
}
