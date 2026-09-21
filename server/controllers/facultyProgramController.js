import { supabaseAdmin } from '../config/supabase.js';

/**
 * GET /api/faculty-programs
 * Query: ?type=FDP&mode=Online&skill=AI&page=1&limit=20
 * Public access (optional auth for registration status)
 */
export async function listPrograms(req, res) {
  try {
    const { type, mode, skill, page = 1, limit = 20 } = req.query;

    let query = supabaseAdmin
      .from('faculty_programs')
      .select('*')
      .order('date', { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

    if (type) query = query.ilike('type', `%${type}%`);
    if (mode) query = query.ilike('mode', `%${mode}%`);

    const { data: programs, error } = await query;
    if (error) throw error;

    let result = programs || [];

    // Filter by skill
    if (skill) {
      result = result.filter(p =>
        (p.skills || []).some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    // If authenticated, add registration status
    if (req.user?.role === 'faculty') {
      const { data: faculty } = await supabaseAdmin
        .from('faculty').select('id').eq('user_id', req.user.id).single();

      if (faculty) {
        const { data: registrations } = await supabaseAdmin
          .from('faculty_registrations')
          .select('program_id, status')
          .eq('faculty_id', faculty.id);

        const regMap = {};
        (registrations || []).forEach(r => { regMap[r.program_id] = r.status; });

        result = result.map(p => ({
          ...p,
          myStatus: regMap[p.id] || null,
        }));
      }
    }

    return res.json({ programs: result, count: result.length, page: Number(page) });
  } catch (err) {
    console.error('[listPrograms]', err);
    return res.status(500).json({ error: 'Failed to list programs' });
  }
}

/**
 * POST /api/faculty-programs
 * Body: { type, title, organizer, duration, mode, date, seats, stipend, skills, description, certificate }
 * Access: industry
 */
export async function createProgram(req, res) {
  try {
    const { data: program, error } = await supabaseAdmin
      .from('faculty_programs')
      .insert({
        ...req.body,
        posted_by: req.user.id,
        registered: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ message: 'Program created successfully', program });
  } catch (err) {
    console.error('[createProgram]', err);
    return res.status(500).json({ error: 'Failed to create program' });
  }
}

/**
 * GET /api/faculty-programs/:id
 */
export async function getProgram(req, res) {
  try {
    const { data: program, error } = await supabaseAdmin
      .from('faculty_programs').select('*').eq('id', req.params.id).single();

    if (error || !program) return res.status(404).json({ error: 'Program not found' });

    // Count registrations
    const { count } = await supabaseAdmin
      .from('faculty_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('program_id', program.id);

    program.registered = count || 0;

    return res.json({ program });
  } catch (err) {
    console.error('[getProgram]', err);
    return res.status(500).json({ error: 'Failed to fetch program' });
  }
}

/**
 * POST /api/faculty-programs/:id/register
 * Faculty registers for a program.
 * Access: faculty
 */
export async function registerForProgram(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: faculty } = await supabaseAdmin
      .from('faculty').select('id').eq('user_id', userId).single();

    if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });

    // Check program exists and has seats
    const { data: program } = await supabaseAdmin
      .from('faculty_programs').select('*').eq('id', id).single();

    if (!program) return res.status(404).json({ error: 'Program not found' });

    // Check available seats
    const { count: currentRegistrations } = await supabaseAdmin
      .from('faculty_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('program_id', id);

    if (program.seats && currentRegistrations >= program.seats) {
      return res.status(400).json({ error: 'Program is fully booked' });
    }

    // Check duplicate
    const { data: existing } = await supabaseAdmin
      .from('faculty_registrations')
      .select('id')
      .eq('faculty_id', faculty.id)
      .eq('program_id', id)
      .single();

    if (existing) return res.status(409).json({ error: 'Already registered for this program' });

    const { data: registration, error } = await supabaseAdmin
      .from('faculty_registrations')
      .insert({
        faculty_id: faculty.id,
        program_id: id,
        status: 'registered',
        registered_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: `Successfully registered for "${program.title}"`,
      registration,
    });
  } catch (err) {
    console.error('[registerForProgram]', err);
    return res.status(500).json({ error: 'Failed to register' });
  }
}

/**
 * DELETE /api/faculty-programs/:id/register
 * Faculty cancels registration.
 */
export async function cancelRegistration(req, res) {
  try {
    const { id } = req.params;

    const { data: faculty } = await supabaseAdmin
      .from('faculty').select('id').eq('user_id', req.user.id).single();

    if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });

    await supabaseAdmin
      .from('faculty_registrations')
      .delete()
      .eq('faculty_id', faculty.id)
      .eq('program_id', id);

    return res.json({ message: 'Registration cancelled' });
  } catch (err) {
    console.error('[cancelRegistration]', err);
    return res.status(500).json({ error: 'Failed to cancel registration' });
  }
}

/**
 * GET /api/faculty-programs/my
 * Faculty's registered programs.
 */
export async function getMyPrograms(req, res) {
  try {
    const { data: faculty } = await supabaseAdmin
      .from('faculty').select('id').eq('user_id', req.user.id).single();

    if (!faculty) return res.json({ programs: [] });

    const { data: registrations, error } = await supabaseAdmin
      .from('faculty_registrations')
      .select('*, faculty_programs(*)')
      .eq('faculty_id', faculty.id)
      .order('registered_at', { ascending: false });

    if (error) throw error;

    return res.json({ programs: (registrations || []).map(r => ({ ...r.faculty_programs, registration: { status: r.status, registered_at: r.registered_at } })) });
  } catch (err) {
    console.error('[getMyPrograms]', err);
    return res.status(500).json({ error: 'Failed to fetch programs' });
  }
}

/**
 * GET /api/faculty-programs/dashboard
 * Faculty dashboard summary.
 */
export async function getFacultyDashboard(req, res) {
  try {
    const userId = req.user.id;

    const { data: faculty } = await supabaseAdmin
      .from('faculty').select('*').eq('user_id', userId).single();

    if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });

    const [programsRes, registrationsRes] = await Promise.all([
      supabaseAdmin.from('faculty_programs').select('*').limit(5).order('date', { ascending: true }),
      supabaseAdmin.from('faculty_registrations').select('*, faculty_programs(type, title, date)').eq('faculty_id', faculty.id),
    ]);

    return res.json({
      faculty,
      upcomingPrograms: programsRes.data || [],
      myRegistrations: registrationsRes.data || [],
      stats: {
        totalRegistrations: (registrationsRes.data || []).length,
        activePrograms: (programsRes.data || []).length,
      },
    });
  } catch (err) {
    console.error('[getFacultyDashboard]', err);
    return res.status(500).json({ error: 'Failed to fetch faculty dashboard' });
  }
}
