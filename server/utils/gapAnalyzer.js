/**
 * Skill Gap Analyzer
 * Computes gaps between student's current skill levels and industry demand benchmarks.
 */

// Industry benchmark demand scores (0-100) from market data
export const INDUSTRY_DEMAND = {
  'Python': 94,
  'Machine Learning': 91,
  'Data Structures': 92,
  'React.js': 88,
  'SQL': 87,
  'Cloud (AWS/GCP)': 89,
  'Node.js': 82,
  'System Design': 85,
  'Docker & Kubernetes': 78,
  'Java': 80,
  'Communication': 88,
  'Leadership': 75,
  'TypeScript': 76,
  'Django': 70,
  'TensorFlow': 80,
  'Git & Version Control': 91,
  'REST APIs': 85,
  'MongoDB': 72,
  'Redis': 68,
  'Kafka': 65,
  'Microservices': 78,
  'CI/CD': 75,
  'Agile/Scrum': 80,
  'Problem Solving': 90,
  'Data Analysis': 82,
};

/**
 * Compute skill gaps for a student.
 * @param {Object} studentSkills - { 'Python': 78, 'React': 55, ... }
 * @returns {Array} - Array of gap objects sorted by gap size desc
 */
export function computeSkillGaps(studentSkills) {
  const gaps = [];

  // Check gaps in skills the student HAS
  for (const [skill, level] of Object.entries(studentSkills || {})) {
    const demand = findDemand(skill);
    if (demand !== null) {
      const gap = demand - level;
      gaps.push({
        skill,
        studentLevel: level,
        industryDemand: demand,
        gap: Math.max(0, gap),
        status: gap > 30 ? 'critical' : gap > 15 ? 'moderate' : 'good',
      });
    }
  }

  // Check gaps for in-demand skills the student DOESN'T have
  for (const [skill, demand] of Object.entries(INDUSTRY_DEMAND)) {
    const studentHas = Object.keys(studentSkills || {}).some(
      s => s.toLowerCase().replace(/[^a-z0-9]/g, '') === skill.toLowerCase().replace(/[^a-z0-9]/g, '')
    );
    if (!studentHas && demand >= 80) {
      gaps.push({
        skill,
        studentLevel: 0,
        industryDemand: demand,
        gap: demand,
        status: 'missing',
      });
    }
  }

  // Sort by gap descending
  return gaps.sort((a, b) => b.gap - a.gap);
}

/**
 * Generate a priority learning path for a given skill gap.
 * @param {string} skill
 * @param {number} currentLevel
 * @returns {Object}
 */
export function getLearningPath(skill, currentLevel) {
  const paths = {
    'Machine Learning': [
      { step: 'Mathematics Refresher (Linear Algebra, Probability)', duration: '2 weeks', resource: 'Khan Academy', type: 'free', url: 'https://khanacademy.org' },
      { step: 'Python for ML (NumPy, Pandas)', duration: '3 weeks', resource: 'Coursera', type: 'free', url: 'https://coursera.org' },
      { step: 'Scikit-learn & Classical ML', duration: '4 weeks', resource: 'Fast.ai', type: 'free', url: 'https://fast.ai' },
      { step: 'Deep Learning with TensorFlow/PyTorch', duration: '6 weeks', resource: 'DeepLearning.AI', type: 'paid', url: 'https://deeplearning.ai' },
      { step: 'Kaggle ML Project + Competition', duration: '2 weeks', resource: 'Kaggle', type: 'free', url: 'https://kaggle.com' },
    ],
    'System Design': [
      { step: 'OS & Networking Fundamentals', duration: '2 weeks', resource: 'MIT OCW', type: 'free', url: 'https://ocw.mit.edu' },
      { step: 'Database Design & Scaling', duration: '3 weeks', resource: 'Neetcode.io', type: 'free', url: 'https://neetcode.io' },
      { step: 'Distributed Systems Concepts', duration: '4 weeks', resource: 'ByteByteGo', type: 'paid', url: 'https://bytebytego.com' },
      { step: 'Design Case Studies (Netflix, Uber, Twitter)', duration: '3 weeks', resource: 'GitHub', type: 'free', url: 'https://github.com' },
    ],
    'Cloud (AWS/GCP)': [
      { step: 'Cloud Fundamentals (IaaS, PaaS, SaaS)', duration: '1 week', resource: 'AWS Free Tier', type: 'free', url: 'https://aws.amazon.com/free' },
      { step: 'AWS Core Services (EC2, S3, RDS, Lambda)', duration: '3 weeks', resource: 'AWS Skill Builder', type: 'free', url: 'https://skillbuilder.aws' },
      { step: 'AWS Solutions Architect (SAA-C03)', duration: '6 weeks', resource: 'Adrian Cantrill', type: 'paid', url: 'https://learn.cantrill.io' },
      { step: 'Practice Exams & Certification', duration: '2 weeks', resource: 'Tutorials Dojo', type: 'paid', url: 'https://tutorialsdojo.com' },
    ],
    'React.js': [
      { step: 'Modern JavaScript (ES6+, async/await)', duration: '2 weeks', resource: 'javascript.info', type: 'free', url: 'https://javascript.info' },
      { step: 'React Fundamentals (Hooks, Context)', duration: '3 weeks', resource: 'React Docs', type: 'free', url: 'https://react.dev' },
      { step: 'State Management (Zustand/Redux Toolkit)', duration: '2 weeks', resource: 'Udemy', type: 'paid', url: 'https://udemy.com' },
      { step: 'Build 3 Portfolio Projects', duration: '4 weeks', resource: 'FreeCodeCamp', type: 'free', url: 'https://freecodecamp.org' },
    ],
    'Docker & Kubernetes': [
      { step: 'Linux & Shell Scripting Basics', duration: '1 week', resource: 'Linux Journey', type: 'free', url: 'https://linuxjourney.com' },
      { step: 'Docker: Containers & Images', duration: '2 weeks', resource: 'Docker Docs', type: 'free', url: 'https://docs.docker.com' },
      { step: 'Kubernetes Core Concepts', duration: '3 weeks', resource: 'Kodekloud', type: 'paid', url: 'https://kodekloud.com' },
      { step: 'CKA Certification Practice', duration: '3 weeks', resource: 'Killer.sh', type: 'paid', url: 'https://killer.sh' },
    ],
  };

  const defaultPath = [
    { step: `Beginner: ${skill} Fundamentals`, duration: '2 weeks', resource: 'YouTube / FreeCodeCamp', type: 'free', url: 'https://freecodecamp.org' },
    { step: `Intermediate: ${skill} Projects`, duration: '4 weeks', resource: 'Udemy / Coursera', type: 'paid', url: 'https://udemy.com' },
    { step: `Advanced: Build & Showcase Portfolio`, duration: '3 weeks', resource: 'GitHub', type: 'free', url: 'https://github.com' },
  ];

  return {
    skill,
    currentLevel,
    path: paths[skill] || defaultPath,
  };
}

/**
 * Find industry demand score for a skill (fuzzy match).
 */
function findDemand(skill) {
  const normalized = skill.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [key, val] of Object.entries(INDUSTRY_DEMAND)) {
    const keyNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (keyNorm.includes(normalized) || normalized.includes(keyNorm)) {
      return val;
    }
  }
  return null;
}
