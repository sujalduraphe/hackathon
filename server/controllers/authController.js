import bcrypt from 'bcryptjs';
import User, { ROLES } from '../models/User.js';
import Student from '../models/Student.js';
import { generateToken } from '../utils/jwt.js';
import { HttpError, initials, toClientStudent } from '../utils/http.js';

function session(user) {
  return {
    token: generateToken({ id: String(user._id), role: user.role, student: user.student ? String(user.student) : undefined }),
    user: user.toJSON(),
  };
}

/** POST /api/auth/register */
export async function register(req, res) {
  const { name, email, password, role, organization, dept, designation, year, cgpa } = req.body;
  if (!name?.trim() || !email?.trim() || !password) throw new HttpError(422, 'Name, email and password are required');
  if (password.length < 8) throw new HttpError(422, 'Password must be at least 8 characters');
  if (!ROLES.includes(role)) throw new HttpError(422, `Role must be one of: ${ROLES.join(', ')}`);
  if (role !== 'student' && !organization?.trim()) throw new HttpError(422, 'Organisation is required');
  if (await User.exists({ email: email.toLowerCase().trim() })) throw new HttpError(409, 'An account with this email already exists');

  let student;
  if (role === 'student') {
    const g = Number(cgpa);
    if (cgpa !== undefined && cgpa !== '' && (Number.isNaN(g) || g < 0 || g > 10)) throw new HttpError(422, 'CGPA must be between 0 and 10');
    // New students start with an empty profile: the skill assessment builds it.
    student = await Student.create({
      name: name.trim(), avatar: initials(name), college: organization, dept, year,
      cgpa: cgpa === '' || cgpa === undefined ? undefined : g,
    });
  }

  const user = await User.create({
    name: name.trim(), email, role, organization, dept, designation,
    avatar: initials(name),
    passwordHash: await bcrypt.hash(password, 12),
    student: student?._id,
  });
  res.status(201).json(session(user));
}

/** POST /api/auth/login */
export async function login(req, res) {
  const { email, password } = req.body;
  const user = email && await User.findOne({ email: String(email).toLowerCase().trim() });
  // same message for unknown email and wrong password, so accounts can't be enumerated
  if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
    throw new HttpError(401, 'Invalid email or password');
  }
  res.json(session(user));
}

/** GET /api/auth/me */
export async function me(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) throw new HttpError(401, 'Account no longer exists');
  const student = user.student ? await Student.findById(user.student) : null;
  res.json({ user: user.toJSON(), student: student && toClientStudent(student) });
}
