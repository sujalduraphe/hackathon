import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'dev-only-secret');
if (!SECRET) throw new Error('JWT_SECRET must be set in production');
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a signed JWT for a user.
 * @param {{ id: string, email: string, role: string }} payload
 * @returns {string}
 */
export function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Verify a JWT and return the decoded payload.
 * Throws if invalid or expired.
 * @param {string} token
 * @returns {{ id: string, email: string, role: string }}
 */
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

/**
 * Short-lived single-purpose tokens (OAuth state, pending social signup).
 * They carry a `purpose` claim, which session authentication rejects, so they
 * can never be used as a login session.
 */
export function signPurpose(payload, purpose, expiresIn = '10m') {
  return jwt.sign({ ...payload, purpose }, SECRET, { expiresIn });
}

export function verifyPurpose(token, purpose) {
  const decoded = jwt.verify(token, SECRET);
  if (decoded.purpose !== purpose) throw new Error('Wrong token type');
  return decoded;
}
