import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../config/supabase.js';
import { generateToken } from '../utils/jwt.js';

/**
 * POST /api/auth/register
 * Body: { name, email, password, role, ...roleSpecificFields }
 */
export async function register(req, res) {
  try {
    const { name, email, password, role, ...extra } = req.body;

    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const avatarInitials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    // Insert user
    const { data: user, error: userErr } = await supabaseAdmin
      .from('users')
      .insert({
        name,
        email,
        password_hash: passwordHash,
        role,
        avatar: avatarInitials,
      })
      .select()
      .single();

    if (userErr) throw userErr;

    // Insert role-specific profile
    await insertRoleProfile(user.id, role, extra);

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return res.json({
      message: 'Login successful',
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ error: 'Login failed' });
  }
}

/**
 * GET /api/auth/me
 * Returns full profile of logged-in user with role-specific data.
 */
export async function getMe(req, res) {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !user) return res.status(404).json({ error: 'User not found' });

    // Fetch role-specific profile
    const profile = await getRoleProfile(user.id, user.role);

    return res.json({ user: sanitizeUser(user), profile });
  } catch (err) {
    console.error('[getMe]', err);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

/**
 * PUT /api/auth/me
 * Update name, avatar, and role-specific fields.
 */
export async function updateMe(req, res) {
  try {
    const { name, avatar, ...profileData } = req.body;
    const userId = req.user.id;

    // Update base user
    const updates = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;

    if (Object.keys(updates).length > 0) {
      await supabaseAdmin.from('users').update(updates).eq('id', userId);
    }

    // Update role profile
    await updateRoleProfile(userId, req.user.role, profileData);

    const { data: user } = await supabaseAdmin.from('users').select('*').eq('id', userId).single();
    const profile = await getRoleProfile(userId, req.user.role);

    return res.json({ user: sanitizeUser(user), profile, message: 'Profile updated' });
  } catch (err) {
    console.error('[updateMe]', err);
    return res.status(500).json({ error: 'Update failed' });
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sanitizeUser(user) {
  const { password_hash, ...safe } = user;
  return safe;
}

async function insertRoleProfile(userId, role, data) {
  const tableMap = {
    student: 'students',
    faculty: 'faculty',
    industry: 'industry_profiles',
    institution: 'institution_profiles',
  };
  const table = tableMap[role];
  if (!table) return;

  await supabaseAdmin.from(table).insert({ user_id: userId, ...data });
}

async function getRoleProfile(userId, role) {
  const tableMap = {
    student: 'students',
    faculty: 'faculty',
    industry: 'industry_profiles',
    institution: 'institution_profiles',
  };
  const table = tableMap[role];
  if (!table) return null;

  const { data } = await supabaseAdmin.from(table).select('*').eq('user_id', userId).single();
  return data;
}

async function updateRoleProfile(userId, role, data) {
  const tableMap = {
    student: 'students',
    faculty: 'faculty',
    industry: 'industry_profiles',
    institution: 'institution_profiles',
  };
  const table = tableMap[role];
  if (!table || Object.keys(data).length === 0) return;

  await supabaseAdmin.from(table).update(data).eq('user_id', userId);
}
