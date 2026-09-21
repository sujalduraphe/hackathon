import { useState } from 'react';
import { CheckCircle, Circle, ChevronRight, BookOpen, ExternalLink, Award } from 'lucide-react';
import { LEARNING_PATHS } from '../../data/store';

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
  }
];

const ALL_PATHS = [...LEARNING_PATHS, ...EXTRA_PATHS];

const TYPE_COLORS = { free: 'emerald', paid: 'amber' };

export default function LearningPathways() {
  const [expanded, setExpanded] = useState(0);
  const [completed, setCompleted] = useState(new Set([0]));

  function toggleStep(pathIdx, stepIdx) {
    const key = `${pathIdx}-${stepIdx}`;
    setCompleted(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  }

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">📚 Personalized Learning Pathways</h1>
        <p className="page-hero-subtitle">
          AI-curated step-by-step roadmaps to close your skill gaps and reach your target role.
        </p>
      </div>

      {/* Summary Row */}
      <div className="stat-grid" style={{ marginBottom: 32 }}>
        {[
          { label: 'Skill Gaps Identified', value: ALL_PATHS.length, color: '#f43f5e' },
          { label: 'Learning Steps', value: ALL_PATHS.reduce((s, p) => s + p.path.length, 0), color: '#6366f1' },
          { label: 'Free Resources', value: ALL_PATHS.reduce((s, p) => s + p.path.filter(st => st.type === 'free').length, 0), color: '#10b981' },
          { label: 'Est. Weeks', value: '~18 weeks', color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Paths */}
      {ALL_PATHS.map((lp, pi) => {
        const isOpen = expanded === pi;
        const pathCompleted = lp.path.filter((_, si) => completed.has(`${pi}-${si}`)).length;

        return (
          <div key={pi} className="card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px',
                cursor: 'pointer', background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent'
              }}
              onClick={() => setExpanded(isOpen ? null : pi)}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                background: lp.priority === 'critical' ? 'rgba(244,63,94,0.1)' : lp.priority === 'recommended' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)'
              }}>
                {lp.priority === 'critical' ? '🔥' : lp.priority === 'recommended' ? '⚡' : '✅'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{lp.skill}</span>
                  <span className={`badge badge-${lp.priority === 'critical' ? 'rose' : lp.priority === 'recommended' ? 'amber' : 'emerald'}`}>
                    {lp.priority === 'critical' ? '🔴 Critical Gap' : lp.priority === 'recommended' ? '🟡 Recommended' : '🟢 On Track'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="progress-track" style={{ width: 120 }}>
                    <div className="progress-fill progress-primary" style={{ width: `${(pathCompleted / lp.path.length) * 100}%` }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{pathCompleted}/{lp.path.length} steps · Gap: {lp.gap}%</span>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: '#9ca3af', transform: isOpen ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
            </div>

            {/* Steps */}
            {isOpen && (
              <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="timeline" style={{ marginTop: 20 }}>
                  {lp.path.map((step, si) => {
                    const done = completed.has(`${pi}-${si}`);
                    return (
                      <div key={si} className="timeline-item">
                        <div className={`timeline-dot ${done ? 'completed' : ''}`} />
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 14, color: done ? '#10b981' : 'white', marginBottom: 4 }}>
                              {step.step}
                            </div>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 12, color: '#9ca3af' }}>📚 {step.resource}</span>
                              <span style={{ fontSize: 12, color: '#9ca3af' }}>⏱ {step.duration}</span>
                              <span className={`badge badge-${TYPE_COLORS[step.type]}`}>{step.type === 'free' ? '✓ Free' : '💳 Paid'}</span>
                            </div>
                          </div>
                          <button
                            className={`btn btn-sm ${done ? 'btn-emerald' : 'btn-ghost'}`}
                            onClick={() => toggleStep(pi, si)}
                          >
                            {done ? <CheckCircle size={14} /> : <Circle size={14} />}
                            {done ? 'Done' : 'Mark Done'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button className="btn btn-primary btn-sm">
                    <ExternalLink size={12} /> Start Learning
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    <Award size={12} /> Get Certificate
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
