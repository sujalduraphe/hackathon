// Explainable skill matching. Every score produced here can be broken down,
// skill by skill, into the reason it was given — no hidden weights.

import { canonicalSkill, canonicalProfile } from './skills.js';

export const DEFAULT_REQUIRED_LEVEL = 60;

/**
 * Compare a skill profile against a job.
 *
 * Readiness for one skill = student level ÷ level the job asks for, capped at 100%.
 * Match score = average readiness over the job's required skills.
 * CGPA is an eligibility gate, reported separately rather than blended into the score.
 */
export function explainMatch(profile, job, cgpa) {
  const skills = canonicalProfile(profile);
  const target = Number(job.minSkillLevel) || DEFAULT_REQUIRED_LEVEL;
  const required = [...new Set((job.skills || []).map(canonicalSkill))];

  const breakdown = required.map(skill => {
    const level = skills[skill] ?? 0;
    const readiness = Math.min(level / target, 1);
    const status = level >= target ? 'strong' : level > 0 ? 'partial' : 'missing';
    return { skill, level, target, readiness, status, gap: Math.max(0, target - level) };
  });

  const score = breakdown.length
    ? Math.round((breakdown.reduce((s, b) => s + b.readiness, 0) / breakdown.length) * 100)
    : 0;

  const minCGPA = Number(job.minCGPA) || 0;
  const eligible = cgpa == null || !minCGPA || cgpa >= minCGPA;

  const strong = breakdown.filter(b => b.status === 'strong');
  const partial = breakdown.filter(b => b.status === 'partial');
  const missing = breakdown.filter(b => b.status === 'missing');

  const reasons = [];
  if (strong.length) reasons.push(`Meets the ${target}% bar in ${strong.map(b => b.skill).join(', ')}`);
  if (partial.length) reasons.push(`Below the bar in ${partial.map(b => `${b.skill} (${b.level}% of ${target}%)`).join(', ')}`);
  if (missing.length) reasons.push(`No evidence yet for ${missing.map(b => b.skill).join(', ')}`);
  if (!eligible) reasons.push(`CGPA ${cgpa} is below the minimum of ${minCGPA}`);

  return { score, eligible, breakdown, strong, partial, missing, reasons, target };
}

export const matchTier = score => (score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low');
export const TIER_COLOR = { high: '#10b981', medium: '#f59e0b', low: '#f43f5e' };

// Target roles for gap analysis. A role's requirements are derived from the live
// postings whose title matches it; the fallback skill list is only used if no
// posting matches yet.
export const ROLE_FAMILIES = [
  { role: 'ML Engineer',          pattern: /\bml\b|machine learning|data scien|\bai\b/i, fallback: ['Python', 'Machine Learning', 'SQL', 'Deep Learning', 'Data Analysis'] },
  { role: 'Full Stack Developer', pattern: /full.?stack|frontend|web/i,               fallback: ['React', 'JavaScript', 'Node.js', 'SQL', 'REST APIs'] },
  { role: 'Backend Engineer',     pattern: /backend|sde|software eng/i,               fallback: ['Java', 'Data Structures', 'System Design', 'SQL', 'Microservices'] },
  { role: 'Data Analyst',         pattern: /analyst|analytics/i,                      fallback: ['SQL', 'Python', 'Data Analysis', 'Communication'] },
  { role: 'Research / Embedded',  pattern: /research|embedded|hardware/i,             fallback: ['C++', 'Embedded Systems', 'Signal Processing', 'Python'] },
];

/**
 * Industry requirement for a target role, aggregated from postings:
 * for each skill, how many matching postings ask for it and at what level.
 * `market` (optional) is per-role skill counts from imported real-world job
 * descriptions: { [role]: { postings, skills: { skill: count } } }. Those
 * descriptions don't state a level, so they count at the default bar.
 */
export function roleRequirements(role, jobs, market = null) {
  const family = ROLE_FAMILIES.find(f => f.role === role);
  const postings = family ? jobs.filter(j => family.pattern.test(j.title)) : [];
  const m = market?.[role];
  const marketPostings = m?.postings || 0;
  const total = postings.length + marketPostings;
  const counts = {};
  for (const [skill, n] of Object.entries(m?.skills || {})) {
    counts[skill] = { skill, postings: n, levelSum: n * DEFAULT_REQUIRED_LEVEL };
  }
  for (const j of postings) {
    const level = Number(j.minSkillLevel) || DEFAULT_REQUIRED_LEVEL;
    for (const s of new Set(j.skills.map(canonicalSkill))) {
      counts[s] ??= { skill: s, postings: 0, levelSum: 0 };
      counts[s].postings++;
      counts[s].levelSum += level;
    }
  }
  let reqs = Object.values(counts).map(c => ({
    skill: c.skill,
    demand: Math.round((c.postings / total) * 100),
    target: Math.round(c.levelSum / c.postings),
    postings: c.postings,
  }));
  if (!reqs.length && family) {
    reqs = family.fallback.map(s => ({ skill: s, demand: 100, target: DEFAULT_REQUIRED_LEVEL + 10, postings: 0 }));
  }
  // with market data, ignore one-off mentions so the list stays focused
  if (marketPostings >= 10) reqs = reqs.filter(r => r.demand >= 10);
  return { postings, marketPostings, requirements: reqs.sort((a, b) => b.demand - a.demand || a.skill.localeCompare(b.skill)) };
}

/** Gap for each required skill of a role, ordered by what hurts readiness most. */
export function roleGap(profile, role, jobs, market = null) {
  const skills = canonicalProfile(profile);
  const { postings, marketPostings, requirements } = roleRequirements(role, jobs, market);
  const gaps = requirements.map(r => {
    const current = skills[r.skill] ?? 0;
    const gap = Math.max(0, r.target - current);
    // weight the gap by how often the skill is demanded, so rare asks rank lower
    const impact = gap * (r.demand / 100);
    const priority = gap === 0 ? 'good' : impact > 25 || current === 0 ? 'critical' : 'recommended';
    return { name: r.skill, current, target: r.target, gap, demand: r.demand, postings: r.postings, impact, priority };
  }).sort((a, b) => b.impact - a.impact);

  const readiness = gaps.length
    ? Math.round((gaps.reduce((s, g) => s + Math.min(g.current / g.target, 1) * g.demand, 0) /
        gaps.reduce((s, g) => s + g.demand, 0)) * 100)
    : 0;
  return { postings, marketPostings, gaps, readiness };
}

/**
 * The role a student is currently closest to. Roles backed by live postings win
 * over roles that only have the baseline skill list.
 */
export function closestRole(profile, jobs, market = null) {
  const evidence = r => r.postings.length + r.marketPostings > 0;
  return ROLE_FAMILIES
    .map(f => ({ role: f.role, ...roleGap(profile, f.role, jobs, market) }))
    .sort((a, b) => evidence(b) - evidence(a) || b.readiness - a.readiness)[0];
}

/** Rank candidates for a job, best first, with the full explanation attached. */
export function rankCandidates(candidates, job) {
  return candidates
    .map(c => ({ ...c, match: explainMatch(c.skills, job, c.cgpa) }))
    .sort((a, b) => (b.match.eligible - a.match.eligible) || b.match.score - a.match.score);
}
