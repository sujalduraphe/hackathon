import { useState } from 'react';
import { Users, Briefcase, TrendingUp, Target, Search, Filter, Eye, ChevronRight, BarChart3 } from 'lucide-react';
import { CURRENT_USER, CANDIDATES, JOBS } from '../../data/store';

const PIPELINE_STAGES = ['applied', 'shortlisted', 'assessment', 'interview', 'offered'];
const STAGE_LABELS = { applied: 'Applied', shortlisted: 'Shortlisted', assessment: 'Assessment', interview: 'Tech Interview', offered: 'Offered' };
const STAGE_COLORS = { applied: '#6366f1', shortlisted: '#f59e0b', assessment: '#06b6d4', interview: '#f43f5e', offered: '#10b981' };

export default function IndustryDashboard({ onNavigate }) {
  const user = CURRENT_USER.industry;
  const [activeView, setActiveView] = useState('pipeline');

  const candidatesByStage = PIPELINE_STAGES.reduce((acc, s) => {
    acc[s] = CANDIDATES.filter(c => c.status === s);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, boxShadow: '0 0 20px rgba(244,63,94,0.4)'
          }}>
            {user.avatar}
          </div>
          <div>
            <h1 className="page-hero-title" style={{ fontSize: 28 }}>Welcome, {user.name}! 🏢</h1>
            <p className="page-hero-subtitle">{user.role} · {user.company}</p>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(99,102,241,0.06))',
          border: '1px solid rgba(244,63,94,0.2)', borderRadius: 16,
          padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
        }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>🎯 3 Active Job Postings · 248 Total Applicants</div>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>SWE Intern deadline in 8 days · Review shortlisted candidates</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-rose btn-sm" onClick={() => onNavigate('pipeline')}>View Pipeline</button>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('post-job')}>+ Post Job</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {[
          { label: 'Total Applicants', value: '248', icon: '👥', color: '#6366f1', change: '+12 today' },
          { label: 'Shortlisted', value: '24', icon: '⭐', color: '#f59e0b', change: '4 pending review' },
          { label: 'In Interview', value: '8', icon: '🎙️', color: '#06b6d4', change: '2 this week' },
          { label: 'Offers Made', value: '5', icon: '✅', color: '#10b981', change: '3 accepted' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 32 }}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ATS Pipeline Kanban */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-header">
          <div>
            <div className="section-title">📋 Recruitment Pipeline (ATS)</div>
            <div className="section-subtitle">Real-time candidate tracking across stages</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('pipeline')}>Full View →</button>
        </div>

        <div className="pipeline-grid">
          {PIPELINE_STAGES.map(stage => {
            const cs = candidatesByStage[stage] || [];
            return (
              <div key={stage} className="pipeline-col">
                <div className="pipeline-col-header" style={{ color: STAGE_COLORS[stage] }}>
                  <span>{STAGE_LABELS[stage]}</span>
                  <span style={{
                    background: `${STAGE_COLORS[stage]}22`, color: STAGE_COLORS[stage],
                    padding: '2px 8px', borderRadius: 20, fontSize: 11
                  }}>{cs.length}</span>
                </div>
                {cs.map(c => (
                  <div key={c.id} className="pipeline-card" onClick={() => onNavigate('pipeline')}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700
                      }}>{c.avatar}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: 10, color: '#9ca3af' }}>{c.college}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
                      <span>CGPA: {c.cgpa}</span>
                      <span style={{ color: STAGE_COLORS[stage], fontWeight: 600 }}>{c.match}%</span>
                    </div>
                  </div>
                ))}
                {cs.length === 0 && (
                  <div style={{ fontSize: 12, color: '#d1d5db', textAlign: 'center', padding: '20px 0' }}>No candidates</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Candidates */}
      <div className="section-title" style={{ marginBottom: 16 }}>⭐ Top Matched Candidates</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CANDIDATES.sort((a, b) => b.match - a.match).slice(0, 4).map(c => (
          <div key={c.id} className="gap-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('talent')}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0
            }}>{c.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontWeight: 800, color: c.match >= 90 ? '#10b981' : c.match >= 75 ? '#f59e0b' : '#f43f5e' }}>{c.match}%</div>
              </div>
              <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{c.college} · {c.dept} · CGPA: {c.cgpa}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                {Object.entries(c.skills).slice(0, 3).map(([sk, v]) => (
                  <span key={sk} className="tag">{sk}: {v}%</span>
                ))}
                <span className={`badge ${c.status === 'offered' ? 'badge-emerald' : c.status === 'interview' ? 'badge-cyan' : c.status === 'shortlisted' ? 'badge-amber' : 'badge-gray'}`}>
                  {STAGE_LABELS[c.status]}
                </span>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm"><Eye size={12} /> View</button>
          </div>
        ))}
      </div>
    </div>
  );
}
