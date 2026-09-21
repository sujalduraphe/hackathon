import { useState } from 'react';
import { BookOpen, Calendar, Users, Award, ChevronRight, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { CURRENT_USER, FACULTY_PROGRAMS } from '../../data/store';

export default function FacultyDashboard({ onNavigate }) {
  const user = CURRENT_USER.faculty;

  const stats = [
    { label: 'FDPs Available', value: '6', icon: '📚', color: '#f59e0b' },
    { label: 'Students Mentored', value: '12', icon: '👥', color: '#10b981' },
    { label: 'Publications', value: user.publications, icon: '📄', color: '#6366f1' },
    { label: 'R&D Projects', value: '2', icon: '🔬', color: '#f43f5e' },
  ];

  const upcoming = FACULTY_PROGRAMS.slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="page-hero">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, boxShadow: '0 0 20px rgba(245,158,11,0.4)'
          }}>
            {user.avatar}
          </div>
          <div>
            <h1 className="page-hero-title" style={{ fontSize: 28 }}>Welcome, {user.name}! 🎓</h1>
            <p className="page-hero-subtitle">{user.designation} · {user.dept} · {user.college}</p>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(99,102,241,0.06))',
          border: '1px solid rgba(245,158,11,0.2)', borderRadius: 16,
          padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
        }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>🔔 2 New FDPs match your specialization in AI/ML</div>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>Google Advanced AI FDP closes in 8 days · 18 seats remaining</div>
          </div>
          <button className="btn btn-amber btn-sm" onClick={() => onNavigate('fdp')}>
            View FDPs <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 32 }}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Programs */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-header">
          <div>
            <div className="section-title">🗓️ Upcoming Programs</div>
            <div className="section-subtitle">FDPs, industrial training and collaborations</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('fdp')}>View All →</button>
        </div>
        <div className="grid-auto">
          {upcoming.map(prog => (
            <div key={prog.id} className="job-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('fdp')}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, background: `${prog.color}22`, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0
                }}>
                  {prog.icon}
                </div>
                <div>
                  <span className="badge badge-amber" style={{ marginBottom: 4 }}>{prog.type}</span>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{prog.title}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{prog.organizer}</div>
                </div>
              </div>
              <div className="job-card-meta">
                <span className="job-meta-item"><Calendar size={11} />{prog.date}</span>
                <span className="job-meta-item"><Users size={11} />{prog.seats - prog.registered} seats left</span>
              </div>
              <div className="skill-tags" style={{ marginTop: 10 }}>
                {prog.skills.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600 }}>{prog.stipend}</span>
                <button className="btn btn-amber btn-sm">Register →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid-2">
        {/* Research Areas */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>🔬 My Specializations</div>
          {user.specialization.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0', borderBottom: i < user.specialization.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
            }}>
              <Star size={14} color="#f59e0b" />
              <span style={{ fontWeight: 500 }}>{s}</span>
              <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>Expert</span>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-ghost btn-sm w-full" onClick={() => onNavigate('consultancy')}>
              Post for Industry Collaboration <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Students mentored */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>👨‍🎓 Students I'm Mentoring</div>
          {[
            { name: 'Arjun Sharma', area: 'ML Engineering', year: '3rd Year', progress: 72 },
            { name: 'Priya Menon', area: 'NLP Research', year: '4th Year', progress: 88 },
            { name: 'Rohan Gupta', area: 'Cloud DevOps', year: '4th Year', progress: 55 },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12
              }}>
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{s.area} · {s.year}</div>
              </div>
              <div style={{ fontSize: 12, color: s.progress >= 75 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{s.progress}%</div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm w-full" style={{ marginTop: 12 }} onClick={() => onNavigate('mentorship')}>
            View All Students <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
