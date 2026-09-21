import { supabaseAdmin } from '../config/supabase.js';
import { INDUSTRY_DEMAND } from '../utils/gapAnalyzer.js';

/**
 * GET /api/analytics/institution
 * Full institution placement & skill analytics dashboard.
 * Access: institution
 */
export async function getInstitutionAnalytics(req, res) {
  try {
    const userId = req.user.id;

    // Get institution profile
    const { data: institution } = await supabaseAdmin
      .from('institution_profiles').select('*').eq('user_id', userId).single();

    // Fetch all students
    const { data: students } = await supabaseAdmin
      .from('students').select('dept, year, cgpa, skills, user_id');

    // Fetch all applications with status
    const { data: applications } = await supabaseAdmin
      .from('applications').select('status, student_id, applied_at, jobs(type, company, stipend)');

    // Fetch jobs count
    const { count: activeJobs } = await supabaseAdmin
      .from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active');

    const allStudents = students || [];
    const allApps = applications || [];

    // ── Placement stats ──────────────────────────────────────────────────────
    const totalStudents = allStudents.length;
    const placed = allApps.filter(a => a.status === 'offered').length;
    const internships = allApps.filter(a => a.status === 'offered' && a.jobs?.type?.toLowerCase().includes('intern')).length;

    // ── Department breakdown ──────────────────────────────────────────────────
    const deptMap = {};
    allStudents.forEach(s => {
      if (!s.dept) return;
      if (!deptMap[s.dept]) deptMap[s.dept] = { students: 0, placed: 0, avgCgpa: [], colors: [] };
      deptMap[s.dept].students++;
      deptMap[s.dept].avgCgpa.push(s.cgpa || 0);
    });

    // Add placement data per student
    allApps.filter(a => a.status === 'offered').forEach(app => {
      const student = allStudents.find(s => s.user_id === app.student_id);
      if (student?.dept && deptMap[student.dept]) {
        deptMap[student.dept].placed++;
      }
    });

    const DEPT_COLORS = {
      'CSE': '#6366f1', 'IT': '#8b5cf6', 'ECE': '#06b6d4', 'EEE': '#f59e0b',
      'MECH': '#f43f5e', 'CIVIL': '#10b981', 'CHE': '#ec4899', 'META': '#f97316',
    };

    const departments = Object.entries(deptMap).map(([name, d]) => ({
      name,
      students: d.students,
      placed: d.placed,
      placementRate: d.students > 0 ? Math.round((d.placed / d.students) * 100 * 10) / 10 : 0,
      avgCgpa: d.avgCgpa.length ? Math.round((d.avgCgpa.reduce((a, b) => a + b, 0) / d.avgCgpa.length) * 10) / 10 : 0,
      color: DEPT_COLORS[name] || '#6b7280',
    }));

    // ── Skill gap heatmap ────────────────────────────────────────────────────
    const skillAggregates = {};
    allStudents.forEach(s => {
      Object.entries(s.skills || {}).forEach(([skill, level]) => {
        if (!skillAggregates[skill]) skillAggregates[skill] = [];
        skillAggregates[skill].push(level);
      });
    });

    const skillGapData = Object.entries(skillAggregates)
      .map(([skill, levels]) => {
        const studentAvg = Math.round(levels.reduce((a, b) => a + b, 0) / levels.length);
        const industryDemand = INDUSTRY_DEMAND[skill] || 75;
        return { skill, industryDemand, studentAvg, gap: Math.max(0, industryDemand - studentAvg) };
      })
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 10);

    // ── Monthly trend (mock if no date data) ─────────────────────────────────
    const monthlyData = {};
    allApps.filter(a => a.status === 'offered').forEach(app => {
      if (app.applied_at) {
        const month = new Date(app.applied_at).toLocaleString('default', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      }
    });

    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const monthlyPlacements = months.map(m => ({ month: m, offers: monthlyData[m] || 0 }));

    // ── Top recruiters ────────────────────────────────────────────────────────
    const recruiterMap = {};
    allApps.filter(a => a.status === 'offered').forEach(app => {
      const company = app.jobs?.company || 'Unknown';
      recruiterMap[company] = (recruiterMap[company] || 0) + 1;
    });

    const topRecruiters = Object.entries(recruiterMap)
      .map(([company, offers]) => ({ company, offers }))
      .sort((a, b) => b.offers - a.offers)
      .slice(0, 8);

    return res.json({
      summary: {
        totalStudents,
        placed,
        internships,
        placementRate: totalStudents > 0 ? Math.round((placed / totalStudents) * 100 * 10) / 10 : 0,
        activeJobs: activeJobs || 0,
        companies: topRecruiters.length,
      },
      departments,
      skillGapData,
      monthlyPlacements,
      topRecruiters,
    });
  } catch (err) {
    console.error('[getInstitutionAnalytics]', err);
    return res.status(500).json({ error: 'Failed to fetch institution analytics' });
  }
}

/**
 * GET /api/analytics/industry
 * Recruitment pipeline analytics for an industry user.
 * Access: industry
 */
export async function getIndustryAnalytics(req, res) {
  try {
    const userId = req.user.id;

    // Get jobs by this company
    const { data: jobs } = await supabaseAdmin
      .from('jobs')
      .select('id, title, type, posted_at, status, openings')
      .eq('posted_by', userId);

    if (!jobs || jobs.length === 0) {
      return res.json({ summary: { totalJobs: 0, totalApplications: 0, shortlisted: 0, offered: 0 }, pipeline: [], funnel: [] });
    }

    const jobIds = jobs.map(j => j.id);

    // Get all applications for these jobs
    const { data: applications } = await supabaseAdmin
      .from('applications')
      .select('*, students!applications_student_id_fkey(cgpa, dept, skills)')
      .in('job_id', jobIds);

    const allApps = applications || [];

    const statusCounts = {
      applied: 0, assessment: 0, shortlisted: 0, interview: 0, offered: 0, rejected: 0,
    };
    allApps.forEach(a => { if (statusCounts[a.status] !== undefined) statusCounts[a.status]++; });

    // Pipeline per job
    const pipeline = jobs.map(job => {
      const jobApps = allApps.filter(a => a.job_id === job.id);
      return {
        job: job.title,
        type: job.type,
        applied: jobApps.length,
        shortlisted: jobApps.filter(a => ['shortlisted', 'interview', 'offered'].includes(a.status)).length,
        offered: jobApps.filter(a => a.status === 'offered').length,
        openings: job.openings,
        fillRate: job.openings > 0 ? Math.round((jobApps.filter(a => a.status === 'offered').length / job.openings) * 100) : 0,
      };
    });

    // Skill distribution of applicants
    const skillFreq = {};
    allApps.forEach(app => {
      Object.keys(app.students?.skills || {}).forEach(skill => {
        skillFreq[skill] = (skillFreq[skill] || 0) + 1;
      });
    });
    const topSkills = Object.entries(skillFreq)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // CGPA distribution
    const cgpaBuckets = { '≥9.0': 0, '8.0-8.9': 0, '7.0-7.9': 0, '<7.0': 0 };
    allApps.forEach(app => {
      const cgpa = app.students?.cgpa || 0;
      if (cgpa >= 9.0) cgpaBuckets['≥9.0']++;
      else if (cgpa >= 8.0) cgpaBuckets['8.0-8.9']++;
      else if (cgpa >= 7.0) cgpaBuckets['7.0-7.9']++;
      else cgpaBuckets['<7.0']++;
    });

    return res.json({
      summary: {
        totalJobs: jobs.length,
        totalApplications: allApps.length,
        ...statusCounts,
        conversionRate: allApps.length > 0 ? Math.round((statusCounts.offered / allApps.length) * 100) : 0,
      },
      pipeline,
      funnel: Object.entries(statusCounts).map(([stage, count]) => ({ stage, count })),
      topSkills,
      cgpaDistribution: Object.entries(cgpaBuckets).map(([range, count]) => ({ range, count })),
    });
  } catch (err) {
    console.error('[getIndustryAnalytics]', err);
    return res.status(500).json({ error: 'Failed to fetch industry analytics' });
  }
}

/**
 * GET /api/analytics/skill-demand
 * Public skill demand data.
 */
export async function getSkillDemand(req, res) {
  try {
    const { data: students } = await supabaseAdmin
      .from('students').select('skills, dept');

    const allStudents = students || [];

    const skillData = Object.entries(INDUSTRY_DEMAND).map(([skill, industryDemand]) => {
      const levels = [];
      allStudents.forEach(s => {
        const val = (s.skills || {})[skill];
        if (val !== undefined) levels.push(val);
      });

      const studentAvg = levels.length > 0
        ? Math.round(levels.reduce((a, b) => a + b, 0) / levels.length)
        : Math.round(industryDemand * 0.6); // fallback

      return {
        skill,
        industryDemand,
        studentAvg,
        gap: Math.max(0, industryDemand - studentAvg),
        studentsWithSkill: levels.length,
      };
    }).sort((a, b) => b.gap - a.gap);

    return res.json({ skills: skillData });
  } catch (err) {
    console.error('[getSkillDemand]', err);
    return res.status(500).json({ error: 'Failed to fetch skill demand data' });
  }
}
