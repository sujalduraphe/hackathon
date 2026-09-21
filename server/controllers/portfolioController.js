import { supabaseAdmin } from '../config/supabase.js';

/**
 * GET /api/portfolio/:studentId
 * Returns full digital portfolio.
 */
export async function getPortfolio(req, res) {
  try {
    const { studentId } = req.params;

    const [portfolioRes, studentRes] = await Promise.all([
      supabaseAdmin.from('portfolios').select('*').eq('student_id', studentId).single(),
      supabaseAdmin
        .from('students')
        .select('skills, cgpa, dept, year, users!students_user_id_fkey(name, email, avatar)')
        .eq('id', studentId)
        .single(),
    ]);

    const student = studentRes.data;
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const portfolio = portfolioRes.data || {
      student_id: studentId,
      certifications: [],
      projects: [],
      achievements: [],
      summary: '',
      github: '',
      linkedin: '',
    };

    return res.json({ portfolio, student });
  } catch (err) {
    console.error('[getPortfolio]', err);
    return res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
}

/**
 * PUT /api/portfolio/:studentId
 * Upsert portfolio data.
 * Body: { certifications?, projects?, achievements?, summary?, github?, linkedin? }
 * Access: owner student
 */
export async function updatePortfolio(req, res) {
  try {
    const { studentId } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const { data: student } = await supabaseAdmin
      .from('students').select('user_id').eq('id', studentId).single();

    if (!student || student.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this portfolio' });
    }

    const { data: existing } = await supabaseAdmin
      .from('portfolios').select('id').eq('student_id', studentId).single();

    let result;
    if (existing) {
      const { data, error } = await supabaseAdmin
        .from('portfolios')
        .update({ ...req.body, updated_at: new Date().toISOString() })
        .eq('student_id', studentId)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('portfolios')
        .insert({ student_id: studentId, ...req.body })
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    return res.json({ message: 'Portfolio updated successfully', portfolio: result });
  } catch (err) {
    console.error('[updatePortfolio]', err);
    return res.status(500).json({ error: 'Failed to update portfolio' });
  }
}

/**
 * POST /api/portfolio/:studentId/certifications
 * Add a certification to the portfolio.
 * Body: { title, issuer, date, credentialUrl?, verified? }
 */
export async function addCertification(req, res) {
  try {
    const { studentId } = req.params;

    const { data: portfolio } = await supabaseAdmin
      .from('portfolios').select('certifications').eq('student_id', studentId).single();

    const certifications = [
      ...(portfolio?.certifications || []),
      { ...req.body, id: Date.now(), addedAt: new Date().toISOString() },
    ];

    await supabaseAdmin.from('portfolios').upsert({
      student_id: studentId,
      certifications,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'student_id' });

    return res.status(201).json({ message: 'Certification added', certifications });
  } catch (err) {
    console.error('[addCertification]', err);
    return res.status(500).json({ error: 'Failed to add certification' });
  }
}

/**
 * POST /api/portfolio/:studentId/projects
 * Add a project.
 * Body: { title, description, tech[], github?, liveUrl?, verified? }
 */
export async function addProject(req, res) {
  try {
    const { studentId } = req.params;

    const { data: portfolio } = await supabaseAdmin
      .from('portfolios').select('projects').eq('student_id', studentId).single();

    const projects = [
      ...(portfolio?.projects || []),
      { ...req.body, id: Date.now(), addedAt: new Date().toISOString() },
    ];

    await supabaseAdmin.from('portfolios').upsert({
      student_id: studentId,
      projects,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'student_id' });

    return res.status(201).json({ message: 'Project added', projects });
  } catch (err) {
    console.error('[addProject]', err);
    return res.status(500).json({ error: 'Failed to add project' });
  }
}

/**
 * DELETE /api/portfolio/:studentId/certifications/:certId
 */
export async function removeCertification(req, res) {
  try {
    const { studentId, certId } = req.params;

    const { data: portfolio } = await supabaseAdmin
      .from('portfolios').select('certifications').eq('student_id', studentId).single();

    const certifications = (portfolio?.certifications || []).filter(c => String(c.id) !== String(certId));

    await supabaseAdmin.from('portfolios')
      .update({ certifications, updated_at: new Date().toISOString() })
      .eq('student_id', studentId);

    return res.json({ message: 'Certification removed', certifications });
  } catch (err) {
    console.error('[removeCertification]', err);
    return res.status(500).json({ error: 'Failed to remove certification' });
  }
}
