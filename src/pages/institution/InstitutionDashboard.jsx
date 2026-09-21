import { useState } from 'react';
import { TrendingUp, BarChart3, Users, Building2, Award, ChevronRight, ArrowUpRight } from 'lucide-react';
import { INSTITUTION_STATS } from '../../data/store';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell, PieChart, Pie
} from 'recharts';

const stats = INSTITUTION_STATS;

export default function InstitutionDashboard({ onNavigate }) {
  const [deptFilter, setDeptFilter] = useState('all');

  const depts = stats.departments;
  const filteredDepts = deptFilter === 'all' ? depts : depts.filter(d => d.name === deptFilter);

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">🏛️ Institutional Analytics Dashboard</h1>
        <p className="page-hero-subtitle">
          Real-time placement readiness, recruitment analytics, and curriculum-industry gap intelligence.
        </p>
      </div>

      {/* Key Stats */}
      <div className="stat-grid">
        {[
          { label: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: '👥', color: '#6366f1', change: '2025-26' },
          { label: 'Placement Rate', value: `${stats.placementRate}%`, icon: '📈', color: '#10b981', change: '+3.2% vs last year' },
          { label: 'Avg Package', value: `₹${stats.avgPackage}L`, icon: '💰', color: '#f59e0b', change: '+18% vs last year' },
          { label: 'Highest Package', value: `₹${stats.highestPackage}L`, icon: '🏆', color: '#f43f5e', change: 'Google · CSE 2026' },
          { label: 'Companies Visited', value: stats.companies, icon: '🏢', color: '#06b6d4', change: '+11 new recruiters' },
          { label: 'Total Offers', value: stats.offersMade.toLocaleString(), icon: '📋', color: '#a78bfa', change: '1580 total' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 30 }}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color, fontSize: 22 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Monthly Placements */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">📅 Monthly Placement Offers</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.monthlyPlacements}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white' }} />
              <Bar dataKey="offers" name="Offers" radius={[4, 4, 0, 0]}>
                {stats.monthlyPlacements.map((_, i) => (
                  <Cell key={i} fill={`hsl(${240 + i * 15}, 70%, ${50 + i * 3}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dept Placement Rates */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">🎓 Department Placement Rates</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={depts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} unit="%" />
              <YAxis dataKey="name" type="category" width={40} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white' }} formatter={v => [`${v}%`, 'Placed']} />
              <Bar dataKey="placementRate" radius={[0, 4, 4, 0]} name="Placement Rate">
                {depts.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill Gap Heatmap */}
      <div className="chart-container" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <div>
            <div className="section-title">🗺️ Curriculum vs Industry Skill Gap Heatmap</div>
            <div className="section-subtitle">Identifies skills where student avg. lags behind industry demand</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('skill-heatmap')}>Full Analysis →</button>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {stats.skillGapData.map(item => (
            <div key={item.skill} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 140, fontSize: 13, fontWeight: 500, color: '#374151', flexShrink: 0 }}>{item.skill}</div>
              <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ flex: item.studentAvg, height: 12, borderRadius: 4, background: '#6366f1' }} title={`Student avg: ${item.studentAvg}%`} />
                <div style={{ flex: item.gap, height: 12, borderRadius: 4, background: `rgba(244,63,94,${Math.min(0.3 + item.gap / 100, 0.9)})` }} title={`Gap: ${item.gap}%`} />
              </div>
              <div style={{ width: 100, fontSize: 12, color: '#9ca3af', flexShrink: 0, display: 'flex', gap: 8 }}>
                <span style={{ color: '#6366f1' }}>{item.studentAvg}%</span>
                <span style={{ color: '#f43f5e' }}>-{item.gap}%</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 16, fontSize: 12, color: '#9ca3af' }}>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#6366f1', borderRadius: 3, marginRight: 6 }} />Student Avg</span>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, background: 'rgba(244,63,94,0.7)', borderRadius: 3, marginRight: 6 }} />Gap to Industry Demand</span>
        </div>
      </div>

      {/* Top Recruiters */}
      <div>
        <div className="section-title" style={{ marginBottom: 16 }}>🏢 Top Recruiters 2025-26</div>
        <div className="grid-4">
          {stats.topRecruiters.map((r, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{r.logo}</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{r.company}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-display)' }}>{r.offers}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>offers</div>
              <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600 }}>₹{r.avgPkg}L avg</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
