import { supabaseAdmin } from '../config/supabase.js';
import { computeMatchScore } from '../utils/skillMatcher.js';

/**
 * GET /api/students
 * Query: ?dept=CSE&year=3rd&minCgpa=8&skill=Python&search=arjun&page=1&limit=20
 * Access: industry, institution
 */
export async function listStudents(req, res) {
  try {
    const { dept, year, minCgpa, skill, search, page = 1, limit = 20, jobId } = req.query;

    let query = supabaseAdmin
      .from('students')
      .select(`
        *,
        users!students_user_id_fkey(id, name, email, avatar, created_at)
      `)
      .range((page - 1) * limit, page * limit - 1);

    if (dept) query = query.eq('dept', dept);
    if (year) query = query.eq('year', year);
    if (minCgpa) query = query.gte('cgpa', parseFloat(minCgpa));

    const { data: students, error } = await query;
    if (error) throw error;

    let result = students || [];

    // Filter by skill
    if (skill) {
      result = result.filter(s => {
        const skills = s.skills || {};
        return Object.keys(skills).some(k => k.toLowerCase().includes(skill.toLowerCase()));
      });
    }

    // Search by name
    if (search) {
      result = result.filter(s => {
        const name = s.users?.name || '';
        return name.toLowerCase().includes(search.toLowerCase());
      });
    }

    // Add match scores if jobId is provided
    if (jobId) {
      const { data: job } = await supabaseAdmin.from('jobs').select('skills').eq('id', jobId).single();
      if (job) {
        result = result.map(s => ({
          ...s,
          match: computeMatchScore(s.skills || {}, job.skills || []),
        })).sort((a, b) => b.match - a.match);
      }
    }

    return res.json({ students: result, count: result.length, page: Number(page) });
  } catch (err) {
    console.error('[listStudents]', err);
    return res.status(500).json({ error: 'Failed to list students' });
  }
}

/**
 * GET /api/students/:id
 * Full profile: user + student + portfolio + assessments + applications
 */
export async function getStudent(req, res) {
  try {
    const { id } = req.params;

    const [userRes, portfolioRes, assessmentsRes, applicationsRes] = await Promise.all([
      supabaseAdmin
        .from('students')
        .select('*, users!students_user_id_fkey(id, name, email, avatar, role, created_at)')
        .eq('id', id)
        .single(),
      supabaseAdmin.from('portfolios').select('*').eq('student_id', id).single(),
      supabaseAdmin
        .from('assessments')
        .select('*')
        .eq('student_id', id)
        .order('taken_at', { ascending: false })
        .limit(10),
      supabaseAdmin
        .from('applications')
        .select('*, jobs(id, title, company, type, stipend, status, deadline)')
        .eq('student_id', id)
        .order('applied_at', { ascending: false }),
    ]);

    if (userRes.error || !userRes.data) {
      return res.status(404).json({ error: 'Student not found' });
    }

    return res.json({
      student: userRes.data,
      portfolio: portfolioRes.data || null,
      assessments: assessmentsRes.data || [],
      applications: applicationsRes.data || [],
    });
  } catch (err) {
    console.error('[getStudent]', err);
    return res.status(500).json({ error: 'Failed to fetch student' });
  }
}

/**
 * PUT /api/students/:id/skills
 * Body: { skills: { Python: 78, React: 55, ... } }
 * Access: owner student only
 */
export async function updateSkills(req, res) {
  try {
    const { id } = req.params;
    const { skills } = req.body;

    // Verify ownership
    const { data: student } = await supabaseAdmin
      .from('students')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!student || student.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const { data, error } = await supabaseAdmin
      .from('students')
      .update({ skills, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Also upsert skill_profiles rows for tracking history
    const skillRows = Object.entries(skills).map(([skill, proficiency]) => ({
      student_id: id,
      skill,
      proficiency,
      updated_at: new Date().toISOString(),
    }));

    await supabaseAdmin
      .from('skill_profiles')
      .upsert(skillRows, { onConflict: 'student_id,skill' });

    return res.json({ message: 'Skills updated', student: data });
  } catch (err) {
    console.error('[updateSkills]', err);
    return res.status(500).json({ error: 'Failed to update skills' });
  }
}

/**
 * GET /api/students/:id/applications
 */
export async function getStudentApplications(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.query;

    let query = supabaseAdmin
      .from('applications')
      .select('*, jobs(id, title, company, logo, color, type, location, stipend, deadline, status)')
      .eq('student_id', id)
      .order('applied_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    return res.json({ applications: data || [] });
  } catch (err) {
    console.error('[getStudentApplications]', err);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
}

/**
 * GET /api/students/:id/assessments
 */
export async function getStudentAssessments(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('assessments')
      .select('*')
      .eq('student_id', id)
      .order('taken_at', { ascending: false });

    if (error) throw error;
    return res.json({ assessments: data || [] });
  } catch (err) {
    console.error('[getStudentAssessments]', err);
    return res.status(500).json({ error: 'Failed to fetch assessments' });
  }
}

/**
 * GET /api/students/me/dashboard
 * Returns dashboard summary stats for the logged-in student.
 */
export async function getStudentDashboard(req, res) {
  try {
    const userId = req.user.id;

    const { data: student } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const [appsRes, assessmentsRes, portfolioRes] = await Promise.all([
      supabaseAdmin.from('applications').select('status').eq('student_id', student.id),
      supabaseAdmin.from('assessments').select('category, score').eq('student_id', student.id),
      supabaseAdmin.from('portfolios').select('*').eq('student_id', student.id).single(),
    ]);

    const apps = appsRes.data || [];
    const assessments = assessmentsRes.data || [];
    const portfolio = portfolioRes.data;

    const skills = student.skills || {};
    const avgSkill = Object.values(skills).length > 0
      ? Math.round(Object.values(skills).reduce((a, b) => a + b, 0) / Object.values(skills).length)
      : 0;

    return res.json({
      student,
      stats: {
        totalApplications: apps.length,
        shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        offered: apps.filter(a => a.status === 'offered').length,
        assessmentsTaken: assessments.length,
        avgSkillScore: avgSkill,
        certifications: (portfolio?.certifications || []).length,
        projects: (portfolio?.projects || []).length,
      },
    });
  } catch (err) {
    console.error('[getStudentDashboard]', err);
    return res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
}
