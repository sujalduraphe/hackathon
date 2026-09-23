import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { LEARNING_PATHS } from '../../data/store';
import { useAppState } from '../../state/AppState';
import { canonicalSkill } from '../../lib/skills';
import { closestRole } from '../../lib/matching';

const EXTRA_PATHS = [
  {
    skill: 'React.js', gap: 27, priority: 'recommended',
    path: [
      { step: 'HTML/CSS Fundamentals', duration: '1 week', resource: 'freeCodeCamp', type: 'free' },
      { step: 'JavaScript ES6+', duration: '2 weeks', resource: 'javascript.info', type: 'free' },
      { step: 'React Core Concepts', duration: '3 weeks', resource: 'official React docs', type: 'free' },
      { step: 'Build 3 Projects', duration: '4 weeks', resource: 'GitHub', type: 'free' },
    ]
  },
  {
    skill: 'Node.js', gap: 35, priority: 'critical',
    path: [
      { step: 'JavaScript Async & Promises', duration: '1 week', resource: 'MDN Web Docs', type: 'free' },
      { step: 'Node.js Fundamentals', duration: '2 weeks', resource: 'nodejs.dev', type: 'free' },
      { step: 'Express.js & REST APIs', duration: '3 weeks', resource: 'Traversy Media', type: 'free' },
      { step: 'Authentication & Databases', duration: '3 weeks', resource: 'Full Stack Open', type: 'free' },
    ]
  },
  ...[
    ['Spark', [['PySpark DataFrames & SQL', '2 weeks', 'Apache Spark docs', 'free'], ['Spark on a real dataset', '2 weeks', 'Databricks Community Edition', 'free'], ['Performance: partitioning & caching', '1 week', 'Spark docs – Tuning guide', 'free']]],
    ['TensorFlow', [['Keras basics', '2 weeks', 'TensorFlow tutorials', 'free'], ['CNNs & transfer learning', '3 weeks', 'TensorFlow tutorials', 'free'], ['Deploy a model with TF Serving', '1 week', 'TensorFlow docs', 'free']]],
    ['Azure', [['Azure Fundamentals path', '2 weeks', 'Microsoft Learn', 'free'], ['Deploy a web app on App Service', '1 week', 'Microsoft Learn', 'free'], ['Practice with Azure sandbox labs', '1 week', 'Microsoft Learn', 'free']]],
    ['Java', [['Core Java & OOP', '3 weeks', 'dev.java (Oracle)', 'free'], ['Collections & streams', '2 weeks', 'dev.java (Oracle)', 'free'], ['Build a REST API with Spring Boot', '2 weeks', 'spring.io guides', 'free']]],
    ['Microservices', [['Service boundaries & REST design', '1 week', 'microservices.io', 'free'], ['Containerise services with Docker', '1 week', 'Docker docs', 'free'], ['Build 2 services that communicate', '2 weeks', 'spring.io guides', 'free']]],
    ['Kafka', [['Kafka concepts: topics, partitions, consumers', '1 week', 'Apache Kafka docs', 'free'], ['Producer/consumer in your language', '1 week', 'Confluent Developer', 'free'], ['Event-driven mini project', '2 weeks', 'GitHub', 'free']]],
    ['Redis', [['Data types & caching patterns', '1 week', 'Redis University', 'free'], ['Add a cache to an API', '1 week', 'Redis docs', 'free']]],
    ['SQL', [['SELECT, JOIN, GROUP BY', '2 weeks', 'SQLBolt', 'free'], ['Window functions & indexing', '2 weeks', 'PostgreSQL docs', 'free'], ['Practice problems', '2 weeks', 'LeetCode Database', 'free']]],
    ['Python', [['Python fundamentals', '2 weeks', 'docs.python.org tutorial', 'free'], ['Data handling with pandas', '2 weeks', 'pandas user guide', 'free'], ['Small automation project', '1 week', 'GitHub', 'free']]],
    ['Data Structures', [['Arrays, hashing, two pointers', '2 weeks', 'NeetCode roadmap', 'free'], ['Trees, graphs, BFS/DFS', '3 weeks', 'NeetCode roadmap', 'free'], ['Timed practice', '3 weeks', 'LeetCode', 'free']]],
    ['C++', [['Modern C++ basics', '3 weeks', 'learncpp.com', 'free'], ['STL containers & algorithms', '2 weeks', 'cppreference', 'free']]],
    ['Signal Processing', [['Signals & systems fundamentals', '3 weeks', 'MIT OpenCourseWare 6.003', 'free'], ['Filtering & FFT in Python', '2 weeks', 'SciPy signal docs', 'free']]],
    ['Embedded Systems', [['Microcontroller basics', '2 weeks', 'Arduino docs', 'free'], ['Embedded C & peripherals', '3 weeks', 'NPTEL Embedded Systems', 'free']]],
  ].map(([skill, steps]) => ({ skill, path: steps.map(([step, duration, resource, type]) => ({ step, duration, resource, type })) })),
];

// Curated resource library, keyed by canonical skill name
const LIBRARY = Object.fromEntries([...LEARNING_PATHS, ...EXTRA_PATHS].map(p => [canonicalSkill(p.skill), p.path]));

const TYPE_COLORS = { free: 'emerald', paid: 'amber' };
const PRIORITY = {
  critical: { icon: '🔥', badge: 'rose', label: 'Critical gap' },
  recommended: { icon: '⚡', badge: 'amber', label: 'Recommended' },
};

export default function LearningPathways({ onNavigate }) {
  const { profile, jobs, programs } = useAppState();
  const programsFor = skill => programs.filter(p => (p.skills || []).includes(skill));
  const target = closestRole(profile.skills, jobs);
  const gaps = target.gaps.filter(g => g.gap > 0);
  const [expanded, setExpanded] = useState(gaps[0]?.name ?? null);
  const withPath = gaps.filter(g => LIBRARY[g.name] || programsFor(g.name).length);

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">📚 Learning Pathways</h1>
        <p className="page-hero-subtitle">
          Recommendations for the skills you are missing for <strong>{target.role}</strong>, the role you are currently closest to.
        </p>
      </div>

      <div className="stat-grid" style={{ marginBottom: 32 }}>
        {[
          { label: 'Skill gaps', value: gaps.length, color: '#f43f5e' },
          { label: 'Critical', value: gaps.filter(g => g.priority === 'critical').length, color: '#f59e0b' },
          { label: 'With a path or program', value: withPath.length, color: '#6366f1' },
          { label: 'Free resources', value: withPath.reduce((n, g) => n + LIBRARY[g.name].filter(st => st.type === 'free').length, 0), color: '#10b981' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {gaps.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
          {Object.keys(profile.skills || {}).length === 0
            ? <>Take a skill assessment first so we can find your gaps. <button className="btn btn-primary btn-sm" onClick={() => onNavigate('assessment')}>Take assessment</button></>
            : 'You meet every skill requirement for this role.'}
        </div>
      )}

      {gaps.map(g => {
        const path = LIBRARY[g.name];
        const offered = programsFor(g.name);
        const isOpen = expanded === g.name;
        const pr = PRIORITY[g.priority] || PRIORITY.recommended;
        return (
          <div key={g.name} className="card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', cursor: path ? 'pointer' : 'default' }}
              onClick={() => (path || offered.length) && setExpanded(isOpen ? null : g.name)}
            >
              <div style={{ fontSize: 22 }}>{pr.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{g.name}</span>
                  <span className={`badge badge-${pr.badge}`}>{pr.label}</span>
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  You: {g.current}% · Needed: {g.target}% · Asked in {g.postings ? `${g.demand}% of ${target.role} postings` : 'the baseline for this role'}
                </div>
              </div>
              {path || offered.length
                ? <ChevronRight size={16} style={{ color: '#9ca3af', transform: isOpen ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
                : <span style={{ fontSize: 12, color: '#9ca3af' }}>No resources yet</span>}
            </div>

            {isOpen && (path || offered.length > 0) && (
              <div style={{ padding: '0 24px 24px', borderTop: '1px solid #f3f4f6' }}>
                {offered.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Industry programs covering {g.name}</div>
                    {offered.map(p => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                        <span style={{ flex: 1, fontSize: 13 }}>
                          <strong>{p.title}</strong> · {p.organization}{p.startDate ? ` · starts ${p.startDate}` : ''}{p.compensation ? ` · ${p.compensation}` : ''}
                        </span>
                        <button className="btn btn-primary btn-sm" onClick={() => onNavigate('programs')}>View</button>
                      </div>
                    ))}
                  </div>
                )}
                {path && <div className="timeline" style={{ marginTop: 20 }}>
                  {path.map((step, si) => (
                    <div key={si} className="timeline-item">
                      <div className="timeline-dot" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 4 }}>{step.step}</div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, color: '#6b7280' }}>📚 {step.resource}</span>
                          <span style={{ fontSize: 12, color: '#6b7280' }}>⏱ {step.duration}</span>
                          <span className={`badge badge-${TYPE_COLORS[step.type]}`}>{step.type === 'free' ? 'Free' : 'Paid'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>}
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 12 }}>
                  When you're ready, retake the matching assessment to update your verified level.
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
