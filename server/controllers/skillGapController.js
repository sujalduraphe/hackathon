import { supabaseAdmin } from '../config/supabase.js';
import { computeSkillGaps, getLearningPath, INDUSTRY_DEMAND } from '../utils/gapAnalyzer.js';

/**
 * GET /api/skill-gap
 * Compute and return skill gaps for logged-in student.
 * Query: ?studentId=... (institution role can query any student)
 */
export async function getSkillGap(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let studentId = req.query.studentId;

    // Resolve student
    let student;
    if (studentId && (role === 'institution' || role === 'industry')) {
      const { data } = await supabaseAdmin
        .from('students').select('*').eq('id', studentId).single();
      student = data;
    } else {
      const { data } = await supabaseAdmin
        .from('students').select('*').eq('user_id', userId).single();
      student = data;
    }

    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const gaps = computeSkillGaps(student.skills || {});

    // Categorize
    const critical = gaps.filter(g => g.status === 'critical' || g.status === 'missing');
    const moderate = gaps.filter(g => g.status === 'moderate');
    const good = gaps.filter(g => g.status === 'good');

    // Overall profile score
    const skills = student.skills || {};
    const avgScore = Object.values(skills).length > 0
      ? Math.round(Object.values(skills).reduce((a, b) => a + b, 0) / Object.values(skills).length)
      : 0;

    const profileStrength = Math.round(
      (Object.keys(skills).length / Object.keys(INDUSTRY_DEMAND).length) * 50 + avgScore * 0.5
    );

    return res.json({
      student: {
        id: student.id,
        skills: student.skills,
        avgScore,
        profileStrength: Math.min(100, profileStrength),
      },
      gaps,
      summary: {
        critical: critical.length,
        moderate: moderate.length,
        good: good.length,
        total: gaps.length,
      },
      industryDemand: INDUSTRY_DEMAND,
    });
  } catch (err) {
    console.error('[getSkillGap]', err);
    return res.status(500).json({ error: 'Failed to compute skill gap' });
  }
}

/**
 * GET /api/skill-gap/recommendations
 * Returns personalized learning path recommendations.
 * Query: ?top=3 (number of priority skills)
 */
export async function getRecommendations(req, res) {
  try {
    const userId = req.user.id;
    const top = parseInt(req.query.top) || 3;

    const { data: student } = await supabaseAdmin
      .from('students').select('skills, dept').eq('user_id', userId).single();

    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const gaps = computeSkillGaps(student.skills || {});

    // Top N priority gaps
    const priorityGaps = gaps
      .filter(g => g.gap > 0)
      .slice(0, top);

    const recommendations = priorityGaps.map(gap => ({
      ...gap,
      learningPath: getLearningPath(gap.skill, gap.studentLevel),
      estimatedTime: `${Math.ceil(gap.gap / 10) + 2} weeks`,
      priority: gap.gap > 40 ? 'High' : gap.gap > 20 ? 'Medium' : 'Low',
    }));

    // Also recommend jobs matching current skills
    const { data: matchingJobs } = await supabaseAdmin
      .from('jobs')
      .select('id, title, company, type, stipend, skills, match')
      .eq('status', 'active')
      .limit(5);

    return res.json({
      recommendations,
      suggestedJobs: matchingJobs || [],
      message: `Found ${recommendations.length} priority skills to improve`,
    });
  } catch (err) {
    console.error('[getRecommendations]', err);
    return res.status(500).json({ error: 'Failed to generate recommendations' });
  }
}

/**
 * GET /api/skill-gap/industry-demand
 * Returns market demand scores for all tracked skills.
 */
export async function getIndustryDemand(req, res) {
  try {
    const demandList = Object.entries(INDUSTRY_DEMAND)
      .map(([skill, demand]) => ({ skill, demand }))
      .sort((a, b) => b.demand - a.demand);

    return res.json({ skills: demandList });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch industry demand data' });
  }
}
