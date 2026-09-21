import { supabaseAdmin } from '../config/supabase.js';

/**
 * GET /api/mentorships
 * List mentorship sessions (role-filtered).
 */
export async function listMentorships(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let data = [];
    if (role === 'student') {
      const { data: student } = await supabaseAdmin
        .from('students').select('id').eq('user_id', userId).single();
      const { data: mentorships } = await supabaseAdmin
        .from('mentorships')
        .select('*, mentor:mentor_id(id, name, avatar, role, faculty(designation, dept), industry_profiles(company, designation))')
        .eq('mentee_id', student?.id)
        .order('created_at', { ascending: false });
      data = mentorships || [];
    } else if (role === 'faculty' || role === 'industry') {
      const { data: mentorships } = await supabaseAdmin
        .from('mentorships')
        .select('*, mentee:mentee_id(id, dept, year, skills, users!students_user_id_fkey(name, email, avatar))')
        .eq('mentor_id', userId)
        .order('created_at', { ascending: false });
      data = mentorships || [];
    }

    return res.json({ mentorships: data });
  } catch (err) {
    console.error('[listMentorships]', err);
    return res.status(500).json({ error: 'Failed to list mentorships' });
  }
}

/**
 * POST /api/mentorships
 * Student requests mentorship from a faculty/industry mentor.
 * Body: { mentorId, message?, goals? }
 * Access: student
 */
export async function requestMentorship(req, res) {
  try {
    const userId = req.user.id;
    const { mentorId, message, goals } = req.body;

    const { data: student } = await supabaseAdmin
      .from('students').select('id').eq('user_id', userId).single();

    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    // Check duplicate
    const { data: existing } = await supabaseAdmin
      .from('mentorships')
      .select('id, status')
      .eq('mentee_id', student.id)
      .eq('mentor_id', mentorId)
      .single();

    if (existing && existing.status !== 'rejected') {
      return res.status(409).json({ error: 'Mentorship request already exists' });
    }

    const { data: mentorship, error } = await supabaseAdmin
      .from('mentorships')
      .insert({
        mentor_id: mentorId,
        mentee_id: student.id,
        status: 'pending',
        message: message || null,
        goals: goals || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Notify mentor
    await supabaseAdmin.from('notifications').insert({
      user_id: mentorId,
      type: 'mentorship_request',
      message: 'A student has requested mentorship from you',
      metadata: { mentorship_id: mentorship.id },
    }).catch(() => {});

    return res.status(201).json({ message: 'Mentorship request sent', mentorship });
  } catch (err) {
    console.error('[requestMentorship]', err);
    return res.status(500).json({ error: 'Failed to request mentorship' });
  }
}

/**
 * PUT /api/mentorships/:id/status
 * Mentor accepts or rejects a request.
 * Body: { status: 'accepted' | 'rejected' | 'completed', notes? }
 * Access: faculty, industry
 */
export async function updateMentorshipStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;

    const { data: mentorship } = await supabaseAdmin
      .from('mentorships').select('mentor_id, mentee_id').eq('id', id).single();

    if (!mentorship || mentorship.mentor_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('mentorships')
      .update({ status, notes: notes || null, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Notify mentee
    const { data: student } = await supabaseAdmin
      .from('students').select('user_id').eq('id', mentorship.mentee_id).single();
    if (student) {
      await supabaseAdmin.from('notifications').insert({
        user_id: student.user_id,
        type: `mentorship_${status}`,
        message: status === 'accepted'
          ? '🎉 Your mentorship request has been accepted!'
          : `Your mentorship request was ${status}`,
        metadata: { mentorship_id: id },
      }).catch(() => {});
    }

    return res.json({ message: `Mentorship ${status}`, mentorship: updated });
  } catch (err) {
    console.error('[updateMentorshipStatus]', err);
    return res.status(500).json({ error: 'Failed to update mentorship' });
  }
}

/**
 * GET /api/mentorships/mentors
 * List available mentors (faculty + industry users).
 * Access: student
 */
export async function listMentors(req, res) {
  try {
    const { dept, skill, type } = req.query;

    // Faculty mentors
    let facultyQuery = supabaseAdmin
      .from('faculty')
      .select('*, users!faculty_user_id_fkey(id, name, email, avatar)');

    if (dept) facultyQuery = facultyQuery.ilike('dept', `%${dept}%`);

    const { data: facultyMentors } = await facultyQuery;

    // Industry mentors
    const { data: industryMentors } = await supabaseAdmin
      .from('industry_profiles')
      .select('*, users!industry_profiles_user_id_fkey(id, name, email, avatar)');

    const mentors = [
      ...(facultyMentors || []).map(f => ({ ...f, mentorType: 'faculty', name: f.users?.name })),
      ...(industryMentors || []).map(i => ({ ...i, mentorType: 'industry', name: i.users?.name })),
    ];

    return res.json({ mentors, count: mentors.length });
  } catch (err) {
    console.error('[listMentors]', err);
    return res.status(500).json({ error: 'Failed to list mentors' });
  }
}
