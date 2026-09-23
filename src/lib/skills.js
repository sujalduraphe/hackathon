// Canonical skill vocabulary. Every skill name anywhere in the app (job postings,
// student profiles, candidate data, JD text) is normalised to one of these keys,
// so "ML", "machine-learning" and "Machine Learning" all compare as the same skill.

export const SKILLS = {
  'Python':            { category: 'Programming',     aliases: ['python3', 'py'] },
  'Java':              { category: 'Programming',     aliases: ['core java', 'j2ee'] },
  'C++':               { category: 'Programming',     aliases: ['cpp', 'c plus plus'] },
  'TypeScript':        { category: 'Programming',     aliases: ['ts'] },
  'Go':                { category: 'Programming',     aliases: ['golang'] },
  'Data Structures':   { category: 'CS Fundamentals', aliases: ['dsa', 'algorithms', 'data structures and algorithms', 'data structures & algorithms'] },
  'System Design':     { category: 'Architecture',    aliases: ['distributed systems', 'scalable systems', 'hld', 'lld'] },
  'Microservices':     { category: 'Architecture',    aliases: ['microservice', 'service oriented architecture'] },
  'Machine Learning':  { category: 'AI/ML',           aliases: ['ml', 'scikit-learn', 'sklearn', 'predictive modelling', 'predictive modeling'] },
  'Deep Learning':     { category: 'AI/ML',           aliases: ['dl', 'neural networks', 'cnn', 'rnn', 'transformers'] },
  'TensorFlow':        { category: 'AI/ML',           aliases: ['tf', 'keras'] },
  'PyTorch':           { category: 'AI/ML',           aliases: ['torch'] },
  'Data Analysis':     { category: 'Data',            aliases: ['pandas', 'numpy', 'data analytics', 'exploratory data analysis', 'eda'] },
  'SQL':               { category: 'Data',            aliases: ['sql & databases', 'mysql', 'postgresql', 'postgres', 'rdbms', 'databases'] },
  'MongoDB':           { category: 'Data',            aliases: ['mongo', 'nosql'] },
  'Spark':             { category: 'Data',            aliases: ['apache spark', 'pyspark', 'big data'] },
  'Kafka':             { category: 'Data',            aliases: ['apache kafka'] },
  'Redis':             { category: 'Data',            aliases: [] },
  'React':             { category: 'Frontend',        aliases: ['react.js', 'reactjs', 'react basics'] },
  'JavaScript':        { category: 'Frontend',        aliases: ['js', 'es6', 'ecmascript'] },
  'HTML/CSS':          { category: 'Frontend',        aliases: ['html', 'css', 'tailwind', 'tailwind css'] },
  'Node.js':           { category: 'Backend',         aliases: ['node', 'nodejs', 'express', 'express.js'] },
  'REST APIs':         { category: 'Backend',         aliases: ['rest', 'restful', 'rest api', 'api development'] },
  'Spring Boot':       { category: 'Backend',         aliases: ['spring'] },
  'GraphQL':           { category: 'Backend',         aliases: [] },
  'AWS':               { category: 'Cloud',           aliases: ['cloud (aws)', 'cloud (aws/gcp)', 'amazon web services', 'ec2', 's3'] },
  'Azure':             { category: 'Cloud',           aliases: ['microsoft azure'] },
  'Docker':            { category: 'DevOps',          aliases: ['docker & k8s', 'containers', 'containerization'] },
  'Kubernetes':        { category: 'DevOps',          aliases: ['k8s'] },
  'Git':               { category: 'DevOps',          aliases: ['github', 'version control', 'git & version control'] },
  'Embedded Systems':  { category: 'Hardware',        aliases: ['embedded', 'microcontrollers', 'arduino', 'rtos'] },
  'Signal Processing': { category: 'Hardware',        aliases: ['dsp', 'digital signal processing'] },
  'Communication':     { category: 'Soft Skills',     aliases: ['communication skills', 'verbal communication', 'written communication', 'presentation skills'] },
  'Leadership':        { category: 'Soft Skills',     aliases: ['team leadership', 'people management'] },
  'Teamwork':          { category: 'Soft Skills',     aliases: ['collaboration', 'team player'] },
  'Problem Solving':   { category: 'Soft Skills',     aliases: ['analytical thinking', 'aptitude', 'logical reasoning', 'critical thinking'] },
};

export const SKILL_NAMES = Object.keys(SKILLS);

const key = s => s.toLowerCase().replace(/[^a-z0-9+#]/g, '');

// lookup table: normalised alias -> canonical name
const LOOKUP = {};
for (const [name, { aliases }] of Object.entries(SKILLS)) {
  LOOKUP[key(name)] = name;
  for (const a of aliases) LOOKUP[key(a)] = name;
}

/** Map any skill spelling to its canonical name. Unknown skills pass through trimmed. */
export function canonicalSkill(raw) {
  if (!raw) return raw;
  return LOOKUP[key(raw)] || raw.trim();
}

/** Normalise a { skill: level } map, keeping the higher level if two spellings collide. */
export function canonicalProfile(skills = {}) {
  const out = {};
  for (const [s, v] of Object.entries(skills)) {
    const c = canonicalSkill(s);
    out[c] = Math.max(out[c] ?? 0, v);
  }
  return out;
}

export function skillCategory(name) {
  return SKILLS[canonicalSkill(name)]?.category || 'Other';
}

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Phrases in a JD that signal a skill is mandatory vs nice-to-have.
const REQUIRED_CUES = /(must|required|mandatory|strong|proficien|expert|hands-on|solid)/i;
const OPTIONAL_CUES = /(nice to have|preferred|bonus|plus|good to have|familiarity|exposure)/i;

/**
 * Extract skills from free text (a job description or a resume).
 * Returns [{ skill, required, evidence }] where evidence is the sentence it was found in.
 */
export function extractSkills(text = '') {
  const sentences = text.split(/(?<=[.!?•;])\s+|\n+/);
  const found = new Map();
  const terms = Object.entries(LOOKUP)
    .map(([, name]) => name)
    .filter((v, i, a) => a.indexOf(v) === i);

  for (const name of terms) {
    const spellings = [name, ...SKILLS[name].aliases];
    for (const sp of spellings) {
      // very short spellings ("ML", "JS", "Go") are matched case-sensitively so
      // ordinary words like "go" or "ts" in prose don't count as skills
      const re = sp.length <= 2
        // (a preceding "." is excluded so "Node.js" doesn't count as "JS")
        ? new RegExp(`(^|[^A-Za-z.])(${escapeRe(sp)}|${escapeRe(sp.toUpperCase())})([^A-Za-z]|$)`)
        : new RegExp(`(^|[^A-Za-z0-9])${escapeRe(sp)}([^A-Za-z0-9]|$)`, 'i');
      const sentence = sentences.find(s => re.test(s));
      if (sentence) {
        const required = !OPTIONAL_CUES.test(sentence) || REQUIRED_CUES.test(sentence);
        const prev = found.get(name);
        if (!prev || (required && !prev.required)) {
          found.set(name, { skill: name, required, evidence: sentence.trim().slice(0, 160) });
        }
        break;
      }
    }
  }
  return [...found.values()];
}
