import { supabaseAdmin } from '../config/supabase.js';
import { rankJobsByMatch, filterByCGPA } from '../utils/skillMatcher.js';

/**
 * GET /api/jobs
 * Query: ?type=internship&location=Bengaluru&skill=Python&category=internship&page=1&limit=20&match=true
 * Access: public (optional auth for match scoring)
 */
export async function listJobs(req, res) {
  try {
    const { type, location, category, skill, page = 1, limit = 20, sortBy = 'posted_at' } = req.query;

    let query = supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order(sortBy === 'deadline' ? 'deadline' : 'posted_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (type) query = query.ilike('type', `%${type}%`);
    if (location) query = query.ilike('location', `%${location}%`);
    if (category) query = query.eq('category', category);

    const { data: jobs, error } = await query;
    if (error) throw error;

    let result = jobs || [];

    // Filter by skill (skills is a jsonb array)
    if (skill) {
      result = result.filter(j =>
        (j.skills || []).some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    // Compute match scores if user is a student
    if (req.user?.role === 'student') {
      const { data: student } = await supabaseAdmin
        .from('students')
        .select('skills')
        .eq('user_id', req.user.id)
        .single();

      if (student?.skills) {
        result = rankJobsByMatch(student.skills, result);
      }
    }

    return res.json({ jobs: result, count: result.length, page: Number(page) });
  } catch (err) {
    console.error('[listJobs]', err);
    return res.status(500).json({ error: 'Failed to list jobs' });
  }
}

/**
 * POST /api/jobs
 * Body: { title, type, location, mode, stipend, duration, skills, minCgpa, openings, description, deadline, category, company }
 * Access: industry
 */
export async function createJob(req, res) {
  try {
    const userId = req.user.id;

    // Get industry profile for company info
    const { data: profile } = await supabaseAdmin
      .from('industry_profiles')
      .select('company')
      .eq('user_id', userId)
      .single();

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('name')
      .eq('id', userId)
      .single();

    const jobData = {
      ...req.body,
      posted_by: userId,
      company: req.body.company || profile?.company || user?.name,
      status: 'active',
      applicants: 0,
      posted_at: new Date().toISOString(),
    };

    const { data: job, error } = await supabaseAdmin
      .from('jobs')
      .insert(jobData)
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ message: 'Job posted successfully', job });
  } catch (err) {
    console.error('[createJob]', err);
    return res.status(500).json({ error: 'Failed to create job' });
  }
}

/**
 * GET /api/jobs/:id
 */
export async function getJob(req, res) {
  try {
    const { data: job, error } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !job) return res.status(404).json({ error: 'Job not found' });

    // Attach match score for students
    if (req.user?.role === 'student') {
      const { data: student } = await supabaseAdmin
        .from('students')
        .select('skills')
        .eq('user_id', req.user.id)
        .single();

      if (student?.skills) {
        const { computeMatchScore } = await import('../utils/skillMatcher.js');
        job.match = computeMatchScore(student.skills, job.skills || []);
      }
    }

    // Count applicants
    const { count } = await supabaseAdmin
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('job_id', job.id);

    job.applicants = count || 0;

    return res.json({ job });
  } catch (err) {
    console.error('[getJob]', err);
    return res.status(500).json({ error: 'Failed to fetch job' });
  }
}

/**
 * PUT /api/jobs/:id
 * Access: owner (industry)
 */
export async function updateJob(req, res) {
  try {
    const { id } = req.params;

    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from('jobs')
      .select('posted_by')
      .eq('id', id)
      .single();

    if (!existing || existing.posted_by !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    const { data: job, error } = await supabaseAdmin
      .from('jobs')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ message: 'Job updated', job });
  } catch (err) {
    console.error('[updateJob]', err);
    return res.status(500).json({ error: 'Failed to update job' });
  }
}

/**
 * DELETE /api/jobs/:id
 * Access: owner (industry)
 */
export async function deleteJob(req, res) {
  try {
    const { id } = req.params;

    const { data: existing } = await supabaseAdmin
      .from('jobs')
      .select('posted_by')
      .eq('id', id)
      .single();

    if (!existing || existing.posted_by !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    await supabaseAdmin.from('jobs').update({ status: 'closed' }).eq('id', id);

    return res.json({ message: 'Job closed successfully' });
  } catch (err) {
    console.error('[deleteJob]', err);
    return res.status(500).json({ error: 'Failed to delete job' });
  }
}

/**
 * GET /api/jobs/my
 * Jobs posted by logged-in industry user.
 */
export async function getMyJobs(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .select(`
        *,
        applications(count)
      `)
      .eq('posted_by', req.user.id)
      .order('posted_at', { ascending: false });

    if (error) throw error;
    return res.json({ jobs: data || [] });
  } catch (err) {
    console.error('[getMyJobs]', err);
    return res.status(500).json({ error: 'Failed to fetch jobs' });
  }
}

/**
 * GET /api/jobs/:id/candidates
 * Returns applicants for a job with match scores.
 * Access: industry (owner)
 */
export async function getJobCandidates(req, res) {
  try {
    const { id } = req.params;
    const { status, minMatch } = req.query;

    // Verify job ownership
    const { data: job } = await supabaseAdmin
      .from('jobs')
      .select('posted_by, skills, min_cgpa')
      .eq('id', id)
      .single();

    if (!job || job.posted_by !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    let query = supabaseAdmin
      .from('applications')
      .select(`
        *,
        students!applications_student_id_fkey(
          id, dept, year, cgpa, skills,
          users!students_user_id_fkey(id, name, email, avatar)
        )
      `)
      .eq('job_id', id)
      .order('applied_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data: applications, error } = await query;
    if (error) throw error;

    let candidates = (applications || []).map(app => {
      const student = app.students;
      const match = computeMatchScore ? computeMatchScore(student?.skills || {}, job.skills || []) : 0;
      return { ...app, match };
    });

    if (minMatch) {
      candidates = candidates.filter(c => c.match >= Number(minMatch));
    }

    candidates = filterByCGPA(candidates.map(c => ({
      ...c,
      cgpa: c.students?.cgpa,
    })), job.min_cgpa);

    candidates.sort((a, b) => b.match - a.match);

    return res.json({ candidates, total: candidates.length });
  } catch (err) {
    console.error('[getJobCandidates]', err);
    return res.status(500).json({ error: 'Failed to fetch candidates' });
  }
}

function computeMatchScore(studentSkills, jobSkills) {
  if (!jobSkills || jobSkills.length === 0) return 0;
  let total = 0, covered = 0;
  for (const skill of jobSkills) {
    const target = skill.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [k, v] of Object.entries(studentSkills || {})) {
      const kn = k.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (kn.includes(target) || target.includes(kn)) { total += v; covered++; break; }
    }
  }
  const coverageRatio = covered / jobSkills.length;
  const avgProf = covered > 0 ? total / covered : 0;
  return Math.min(100, Math.round(avgProf * 0.6 + coverageRatio * 100 * 0.4));
}
