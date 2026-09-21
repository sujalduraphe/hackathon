import { supabaseAdmin } from '../config/supabase.js';

/**
 * POST /api/applications
 * Body: { jobId, coverLetter? }
 * Access: student
 */
export async function applyToJob(req, res) {
  try {
    const userId = req.user.id;
    const { jobId, coverLetter } = req.body;

    // Get student record
    const { data: student, error: stErr } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (stErr || !student) {
      return res.status(404).json({ error: 'Student profile not found. Complete your profile first.' });
    }

    // Check if job exists and is active
    const { data: job } = await supabaseAdmin
      .from('jobs')
      .select('id, title, company, deadline, status, min_cgpa, openings')
      .eq('id', jobId)
      .single();

    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.status !== 'active') return res.status(400).json({ error: 'This job is no longer accepting applications' });

    const now = new Date();
    if (job.deadline && new Date(job.deadline) < now) {
      return res.status(400).json({ error: 'Application deadline has passed' });
    }

    // Check duplicate application
    const { data: existing } = await supabaseAdmin
      .from('applications')
      .select('id')
      .eq('student_id', student.id)
      .eq('job_id', jobId)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'You have already applied to this job' });
    }

    // Check CGPA requirement
    const { data: studentData } = await supabaseAdmin
      .from('students')
      .select('cgpa')
      .eq('id', student.id)
      .single();

    if (job.min_cgpa && studentData?.cgpa < job.min_cgpa) {
      return res.status(400).json({
        error: `Your CGPA (${studentData.cgpa}) does not meet the minimum requirement (${job.min_cgpa})`,
      });
    }

    // Create application
    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .insert({
        student_id: student.id,
        job_id: jobId,
        status: 'applied',
        cover_letter: coverLetter || null,
        applied_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Increment job applicants count
    await supabaseAdmin.rpc('increment_applicants', { job_id: jobId }).catch(() => {});

    // Create notification for industry
    await supabaseAdmin.from('notifications').insert({
      user_id: job.posted_by,
      type: 'new_application',
      message: `New application received for "${job.title}"`,
      metadata: { job_id: jobId, application_id: application.id },
    }).catch(() => {});

    return res.status(201).json({
      message: `Successfully applied to ${job.title} at ${job.company}`,
      application,
    });
  } catch (err) {
    console.error('[applyToJob]', err);
    return res.status(500).json({ error: 'Failed to submit application' });
  }
}

/**
 * GET /api/applications
 * Students see their own; industry sees all for their jobs.
 */
export async function listApplications(req, res) {
  try {
    const { status, jobId, page = 1, limit = 20 } = req.query;
    const userId = req.user.id;
    const role = req.user.role;

    let data = [];

    if (role === 'student') {
      const { data: student } = await supabaseAdmin
        .from('students').select('id').eq('user_id', userId).single();

      if (!student) return res.json({ applications: [] });

      let q = supabaseAdmin
        .from('applications')
        .select('*, jobs(id, title, company, logo, color, type, location, stipend, deadline, status, posted_by)')
        .eq('student_id', student.id)
        .order('applied_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (status) q = q.eq('status', status);
      const { data: apps } = await q;
      data = apps || [];

    } else if (role === 'industry') {
      // Get all jobs posted by this user
      const { data: myJobs } = await supabaseAdmin
        .from('jobs').select('id').eq('posted_by', userId);

      const jobIds = (myJobs || []).map(j => j.id);
      if (jobIds.length === 0) return res.json({ applications: [] });

      let q = supabaseAdmin
        .from('applications')
        .select(`
          *,
          jobs(id, title, company),
          students!applications_student_id_fkey(
            id, dept, year, cgpa, skills,
            users!students_user_id_fkey(id, name, email, avatar)
          )
        `)
        .in('job_id', jobIds)
        .order('applied_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (status) q = q.eq('status', status);
      if (jobId) q = q.eq('job_id', jobId);
      const { data: apps } = await q;
      data = apps || [];
    }

    return res.json({ applications: data, count: data.length, page: Number(page) });
  } catch (err) {
    console.error('[listApplications]', err);
    return res.status(500).json({ error: 'Failed to list applications' });
  }
}

/**
 * PUT /api/applications/:id/status
 * Body: { status: 'shortlisted' | 'interview' | 'offered' | 'rejected', notes? }
 * Access: industry
 */
export async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const VALID_STATUSES = ['applied', 'assessment', 'shortlisted', 'interview', 'offered', 'rejected'];
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    // Verify the application belongs to a job posted by this user
    const { data: app } = await supabaseAdmin
      .from('applications')
      .select('*, jobs(posted_by, title, company)')
      .eq('id', id)
      .single();

    if (!app) return res.status(404).json({ error: 'Application not found' });
    if (app.jobs?.posted_by !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('applications')
      .update({ status, notes: notes || null, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Notify student
    const { data: student } = await supabaseAdmin
      .from('students')
      .select('user_id')
      .eq('id', app.student_id)
      .single();

    if (student) {
      const messages = {
        shortlisted: `🎉 You've been shortlisted for "${app.jobs.title}" at ${app.jobs.company}!`,
        interview: `📅 You have an interview scheduled for "${app.jobs.title}" at ${app.jobs.company}`,
        offered: `🏆 Congratulations! You've received an offer from ${app.jobs.company} for "${app.jobs.title}"!`,
        rejected: `Your application for "${app.jobs.title}" at ${app.jobs.company} was not selected this time`,
        assessment: `📝 You've been invited to take an assessment for "${app.jobs.title}" at ${app.jobs.company}`,
      };

      await supabaseAdmin.from('notifications').insert({
        user_id: student.user_id,
        type: `application_${status}`,
        message: messages[status] || `Application status updated to ${status}`,
        metadata: { application_id: id, job_id: app.job_id },
      }).catch(() => {});
    }

    return res.json({ message: `Application status updated to ${status}`, application: updated });
  } catch (err) {
    console.error('[updateApplicationStatus]', err);
    return res.status(500).json({ error: 'Failed to update status' });
  }
}

/**
 * DELETE /api/applications/:id
 * Withdraw an application. Access: student (owner)
 */
export async function withdrawApplication(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: student } = await supabaseAdmin
      .from('students').select('id').eq('user_id', userId).single();

    const { data: app } = await supabaseAdmin
      .from('applications').select('student_id, status').eq('id', id).single();

    if (!app || app.student_id !== student?.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (['offered', 'interview'].includes(app.status)) {
      return res.status(400).json({ error: 'Cannot withdraw after reaching interview/offer stage' });
    }

    await supabaseAdmin.from('applications').delete().eq('id', id);

    return res.json({ message: 'Application withdrawn successfully' });
  } catch (err) {
    console.error('[withdrawApplication]', err);
    return res.status(500).json({ error: 'Failed to withdraw application' });
  }
}
