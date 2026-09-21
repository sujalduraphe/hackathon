/**
 * Skill Matcher Utility
 * Computes a match score (0–100) between a student's skill profile
 * and a job's required skills.
 */

/**
 * Compute match percentage between student skills and job required skills.
 * @param {Object} studentSkills  - { 'Python': 78, 'React': 55, ... }
 * @param {string[]} jobSkills    - ['Python', 'Machine Learning', 'SQL']
 * @returns {number}              - 0–100 match score
 */
export function computeMatchScore(studentSkills, jobSkills) {
  if (!jobSkills || jobSkills.length === 0) return 0;

  let totalScore = 0;
  let coveredCount = 0;

  for (const skill of jobSkills) {
    // Case-insensitive fuzzy lookup
    const studentLevel = findSkillLevel(studentSkills, skill);
    if (studentLevel !== null) {
      totalScore += studentLevel;
      coveredCount++;
    }
  }

  // Coverage factor: how many required skills the student has at all
  const coverageRatio = coveredCount / jobSkills.length;

  // Average proficiency of covered skills
  const avgProficiency = coveredCount > 0 ? totalScore / coveredCount : 0;

  // Combined score: 60% proficiency + 40% coverage
  const matchScore = Math.round(avgProficiency * 0.6 + coverageRatio * 100 * 0.4);

  return Math.min(100, Math.max(0, matchScore));
}

/**
 * Find a skill level from a skills map with fuzzy/case-insensitive match.
 * @param {Object} skillsMap
 * @param {string} targetSkill
 * @returns {number|null}
 */
function findSkillLevel(skillsMap, targetSkill) {
  if (!skillsMap) return null;

  const target = targetSkill.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const [key, value] of Object.entries(skillsMap)) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalized.includes(target) || target.includes(normalized)) {
      return value;
    }
  }
  return null;
}

/**
 * Rank a list of jobs by match score for a given student.
 * @param {Object} studentSkills
 * @param {Array} jobs
 * @returns {Array} - Jobs with `match` field added, sorted desc
 */
export function rankJobsByMatch(studentSkills, jobs) {
  return jobs
    .map(job => ({
      ...job,
      match: computeMatchScore(studentSkills, job.skills || []),
    }))
    .sort((a, b) => b.match - a.match);
}

/**
 * Filter candidates who meet minimum CGPA requirement.
 * @param {Array} students
 * @param {number} minCgpa
 * @returns {Array}
 */
export function filterByCGPA(students, minCgpa) {
  if (!minCgpa) return students;
  return students.filter(s => (s.cgpa || 0) >= minCgpa);
}
