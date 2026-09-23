import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User, { ROLES } from '../models/User.js';
import Student from '../models/Student.js';
import { generateToken, signPurpose, verifyPurpose } from '../utils/jwt.js';
import { HttpError, initials, toClientStudent } from '../utils/http.js';

function session(user) {
  return {
    token: generateToken({ id: String(user._id), role: user.role, student: user.student ? String(user.student) : undefined }),
    user: user.toJSON(),
  };
}

/**
 * Validate the role-specific signup fields and create the account (plus the
 * student profile for students). Shared by password and social signup.
 */
async function createAccount({ name, email, role, organization, dept, designation, year, cgpa, passwordHash, googleId, linkedinId }) {
  if (!name?.trim() || !email?.trim()) throw new HttpError(422, 'Name and email are required');
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
  return User.create({
    name: name.trim(), email, role, organization, dept, designation,
    avatar: initials(name), passwordHash, googleId, linkedinId, student: student?._id,
  });
}

/** POST /api/auth/register */
export async function register(req, res) {
  const { password } = req.body;
  if (!password) throw new HttpError(422, 'Password is required');
  if (password.length < 8) throw new HttpError(422, 'Password must be at least 8 characters');
  const user = await createAccount({ ...req.body, passwordHash: await bcrypt.hash(password, 12), googleId: undefined, linkedinId: undefined });
  res.status(201).json(session(user));
}

/** POST /api/auth/login */
export async function login(req, res) {
  const { email, password } = req.body;
  const user = email && await User.findOne({ email: String(email).toLowerCase().trim() });
  // same message for unknown email, wrong password and social-only accounts,
  // so accounts can't be enumerated
  if (!user?.passwordHash || !(await bcrypt.compare(password || '', user.passwordHash))) {
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

// ---------------------------------------------------------------------------
// Social sign-in (Google, LinkedIn). The provider proves who the person is;
// we never see their provider password. A first-time user gets a short-lived
// "pending signup" token and chooses their role before an account is created.
// ---------------------------------------------------------------------------

const PROVIDER_FIELD = { google: 'googleId', linkedin: 'linkedinId' };

/**
 * Find the account for a verified identity, linking by email when the provider
 * has verified that email. Returns a session, or a pending-signup token.
 */
async function signInWithIdentity({ provider, subject, email, emailVerified, name }) {
  const field = PROVIDER_FIELD[provider];
  let user = await User.findOne({ [field]: subject });
  if (!user && email && emailVerified) {
    user = await User.findOne({ email: email.toLowerCase() });
    if (user) { user[field] = subject; await user.save(); }
  }
  if (user) return { status: 'signed-in', ...session(user) };
  if (!email || !emailVerified) throw new HttpError(422, `Your ${provider} account has no verified email address`);
  return {
    status: 'needs-signup',
    pending: signPurpose({ provider, subject, email: email.toLowerCase(), name }, 'pending-signup', '15m'),
    profile: { name, email },
  };
}

/** GET /api/auth/providers — which social sign-ins are configured (public info only) */
export function providers(_req, res) {
  res.json({
    google: process.env.GOOGLE_CLIENT_ID || null,
    linkedin: Boolean(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
  });
}

/** POST /api/auth/google — body { credential }: the ID token from Google Identity Services */
export async function google(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new HttpError(503, 'Google sign-in is not configured');
  let payload;
  try {
    const ticket = await new OAuth2Client(clientId).verifyIdToken({ idToken: String(req.body.credential || ''), audience: clientId });
    payload = ticket.getPayload();
  } catch {
    throw new HttpError(401, 'Google sign-in could not be verified');
  }
  res.json(await signInWithIdentity({
    provider: 'google', subject: payload.sub, email: payload.email, emailVerified: payload.email_verified === true, name: payload.name || payload.email,
  }));
}

/** POST /api/auth/social/complete — body { pending, role, organization, ... } */
export async function completeSocialSignup(req, res) {
  let p;
  try { p = verifyPurpose(String(req.body.pending || ''), 'pending-signup'); } catch {
    throw new HttpError(401, 'Sign-up session expired. Please sign in again.');
  }
  const user = await createAccount({
    ...req.body, name: req.body.name?.trim() || p.name, email: p.email, passwordHash: undefined,
    googleId: p.provider === 'google' ? p.subject : undefined,
    linkedinId: p.provider === 'linkedin' ? p.subject : undefined,
  });
  res.status(201).json(session(user));
}

// ----- LinkedIn (OpenID Connect, authorization-code flow) -----

const linkedinRedirectUri = () => process.env.LINKEDIN_REDIRECT_URI || `http://localhost:${process.env.PORT || 5050}/api/auth/linkedin/callback`;
const frontendUrl = () => (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0].trim();

/** GET /api/auth/linkedin/start — redirects the browser to LinkedIn's login page */
export function linkedinStart(_req, res) {
  if (!process.env.LINKEDIN_CLIENT_ID) throw new HttpError(503, 'LinkedIn sign-in is not configured');
  // signed, short-lived state protects the callback against forged requests
  const state = signPurpose({ nonce: crypto.randomUUID() }, 'oauth-state', '10m');
  const url = new URL('https://www.linkedin.com/oauth/v2/authorization');
  url.search = new URLSearchParams({
    response_type: 'code', client_id: process.env.LINKEDIN_CLIENT_ID, redirect_uri: linkedinRedirectUri(),
    scope: 'openid profile email', state,
  });
  res.redirect(url.toString());
}

/**
 * GET /api/auth/linkedin/callback — LinkedIn sends the user back here with a code.
 * We exchange it for the user's profile, then return to the frontend with the
 * result in the URL fragment (fragments are never sent to servers or logs).
 */
export async function linkedinCallback(req, res) {
  const back = params => res.redirect(`${frontendUrl()}/#${new URLSearchParams(params)}`);
  try {
    if (req.query.error) return back({ oauth_error: 'LinkedIn sign-in was cancelled' });
    verifyPurpose(String(req.query.state || ''), 'oauth-state');
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code', code: String(req.query.code || ''), redirect_uri: linkedinRedirectUri(),
        client_id: process.env.LINKEDIN_CLIENT_ID, client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
    });
    if (!tokenRes.ok) throw new Error('token exchange failed');
    const { access_token: accessToken } = await tokenRes.json();
    const infoRes = await fetch('https://api.linkedin.com/v2/userinfo', { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!infoRes.ok) throw new Error('userinfo failed');
    const info = await infoRes.json();
    const result = await signInWithIdentity({
      provider: 'linkedin', subject: info.sub, email: info.email, emailVerified: info.email_verified !== false,
      name: info.name || [info.given_name, info.family_name].filter(Boolean).join(' ') || info.email,
    });
    return result.status === 'signed-in'
      ? back({ oauth_token: result.token })
      : back({ oauth_pending: result.pending, name: result.profile.name, email: result.profile.email });
  } catch (err) {
    return back({ oauth_error: err instanceof HttpError ? err.message : 'LinkedIn sign-in failed. Please try again.' });
  }
}
