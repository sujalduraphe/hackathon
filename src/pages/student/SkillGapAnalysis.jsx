import { useState } from 'react';
import { AlertTriangle, ChevronRight, BookOpen, Target } from 'lucide-react';
import { useAppState } from '../../state/AppState';
import { ROLE_FAMILIES, roleGap } from '../../lib/matching';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const short = n => (n.length > 12 ? n.slice(0, 10) + '..' : n);

export default function SkillGapAnalysis({ onNavigate }) {
  const { profile, jobs } = useAppState();
  const [targetRole, setTargetRole] = useState(ROLE_FAMILIES[0].role);
  const roles = ROLE_FAMILIES.map(f => f.role);

  // Benchmarks come from live postings for the chosen role, not a fixed table
  const { postings, gaps: skillGaps, readiness: overallReadiness } = roleGap(profile.skills, targetRole, jobs);

  const radarData = skillGaps.map(g => ({ skill: short(g.name), student: g.current, industry: g.target }));
  const gapData = skillGaps.map(g => ({ skill: short(g.name), gap: g.gap, current: g.current })).sort((a, b) => b.gap - a.gap);

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">🎯 Skill Gap Analysis</h1>
        <p className="page-hero-subtitle">Compare your current skills against what employers on the portal are asking for in your target role.</p>
      </div>

      {/* Target Role Selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {roles.map(r => (
          <button
            key={r}
            className={`btn btn-sm ${targetRole === r ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTargetRole(r)}
          >
            {targetRole === r && <Target size={12} />}
            {r}
          </button>
        ))}
      </div>

      {/* Readiness Score Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.06))',
        border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20,
        padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28, flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'center', minWidth: 100 }}>
          <div style={{ fontSize: 52, fontWeight: 800, fontFamily: 'var(--font-display)', color: '#a78bfa', lineHeight: 1 }}>
            {overallReadiness}%
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Overall Readiness</div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Target: {targetRole}</div>
          <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
            You are <strong style={{ color: '#a78bfa' }}>{overallReadiness}% ready</strong> for this role.
            Focus on closing {skillGaps.filter(g => g.priority === 'critical').length} critical skill gaps to boost your match score significantly.
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
            {postings.length > 0
              ? <>Requirements derived from {postings.length} live posting{postings.length > 1 ? 's' : ''}: {postings.map(p => `${p.company} – ${p.title}`).join('; ')}</>
              : <>No live postings for this role yet, so a baseline skill set is shown.</>}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <span className="badge badge-rose">🔴 {skillGaps.filter(g => g.priority === 'critical').length} Critical</span>
            <span className="badge badge-amber">🟡 {skillGaps.filter(g => g.priority === 'recommended').length} Recommended</span>
            <span className="badge badge-emerald">🟢 {skillGaps.filter(g => g.priority === 'good').length} On Track</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('learning')}>
          Get Learning Plan <ChevronRight size={14} />
        </button>
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Radar Comparison */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">You vs Industry Benchmark</div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#6b7280', fontSize: 10 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 9 }} />
              <Radar name="Your Skills" dataKey="student" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="Industry Benchmark" dataKey="industry" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 2" />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, color: '#111827' }}
              />
              <Legend wrapperStyle={{ color: '#6b7280', fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Gap Chart */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">Skill Gap Breakdown</div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={gapData.slice(0, 7)} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
              <YAxis dataKey="skill" type="category" width={80} tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, color: '#111827' }}
                formatter={(v) => [`${v}%`, 'Gap']}
              />
              <Bar dataKey="gap" name="Gap to Close" fill="url(#gapGrad)" radius={[0, 4, 4, 0]} />
              <defs>
                <linearGradient id="gapGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Gap List */}
      <div className="section-title" style={{ marginBottom: 16 }}>Skill-by-Skill Analysis</div>
      {skillGaps.map(g => (
        <div key={g.name} className="gap-card">
          <div className={`gap-priority gap-${g.priority}`} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{g.name}</span>
              <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                <span style={{ color: '#9ca3af' }}>You: <strong style={{ color: '#6366f1' }}>{g.current}%</strong></span>
                <span style={{ color: '#9ca3af' }}>Target: <strong style={{ color: '#10b981' }}>{g.target}%</strong></span>
                <span style={{ color: '#9ca3af' }}>Asked in: <strong>{g.postings ? `${g.demand}% of postings` : 'baseline'}</strong></span>
                {profile.skillSource?.[g.name] && (
                  <span className={`badge ${profile.skillSource[g.name] === 'assessment' ? 'badge-emerald' : 'badge-gray'}`} style={{ fontSize: 10 }}>
                    {profile.skillSource[g.name] === 'assessment' ? 'Verified' : 'Self-declared'}
                  </span>
                )}
                {g.gap > 0 && <span style={{ color: '#9ca3af' }}>Gap: <strong style={{ color: '#f43f5e' }}>{g.gap}%</strong></span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div className="progress-track" style={{ flex: 1 }}>
                <div className="progress-fill progress-primary" style={{ width: `${g.current}%` }} />
              </div>
              <span className={`badge badge-${g.priority === 'critical' ? 'rose' : g.priority === 'recommended' ? 'amber' : 'emerald'}`} style={{ whiteSpace: 'nowrap', fontSize: 10 }}>
                {g.priority === 'critical' ? '🔴 Critical' : g.priority === 'recommended' ? '🟡 Recommended' : '🟢 On Track'}
              </span>
            </div>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary btn-lg w-full" onClick={() => onNavigate('learning')}>
          <BookOpen size={16} /> Get Personalized Learning Plan for {targetRole}
        </button>
      </div>
    </div>
  );
}
