// Assessment grading and profile update, shared by the browser (offline mode)
// and the API server, so a score is computed the same way wherever it runs.

import { QUIZ_QUESTIONS, QUIZ_SKILLS } from '../data/store.js';

/**
 * Grade a submitted quiz. answers[i] is the chosen option index for question i
 * (null/undefined if unanswered). Returns the overall score and a per-skill
 * score from the questions tagged with each skill.
 */
export function gradeAssessment(category, answers = []) {
  const questions = QUIZ_QUESTIONS[category];
  if (!questions) throw new Error(`Unknown assessment category: ${category}`);
  let correct = 0;
  const perSkill = {};
  questions.forEach((q, i) => {
    const ok = answers[i] === q.correct;
    if (ok) correct++;
    const skill = QUIZ_SKILLS[category]?.[i];
    if (!skill) return;
    perSkill[skill] ??= { right: 0, total: 0 };
    perSkill[skill].total++;
    if (ok) perSkill[skill].right++;
  });
  const skillResults = Object.fromEntries(
    Object.entries(perSkill).map(([sk, { right, total }]) => [sk, Math.round((right / total) * 100)])
  );
  return { score: Math.round((correct / questions.length) * 100), correct, total: questions.length, skillResults };
}

/**
 * Fold assessment results into a profile. The first verified result for a skill
 * replaces a self-declared level; later results are averaged with the previous
 * verified level, so one bad attempt doesn't erase earlier evidence.
 */
export function applyAssessment(skills, skillSource, skillResults) {
  const nextSkills = { ...skills };
  const nextSource = { ...skillSource };
  const changes = {};
  for (const [skill, pct] of Object.entries(skillResults)) {
    const before = nextSkills[skill];
    const after = nextSource[skill] === 'assessment' ? Math.round((before + pct) / 2) : pct;
    nextSkills[skill] = after;
    nextSource[skill] = 'assessment';
    changes[skill] = { before: before ?? null, after, pct };
  }
  return { skills: nextSkills, skillSource: nextSource, changes };
}
