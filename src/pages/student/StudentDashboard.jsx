import { useState } from 'react';
import { TrendingUp, Briefcase, Brain, Award, ArrowRight, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { CURRENT_USER, JOBS, LEARNING_PATHS } from '../../data/store';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function StudentDashboard({ onNavigate }) {
  const user = CURRENT_USER.student;

  const skillRadarData = Object.entries(user.skills).slice(0, 8).map(([name, value]) => ({
    skill: name.length > 12 ? name.slice(0, 12) + '..' : name, value
  }));

  const statCards = [
    { label: 'Skill Score', value: '72%', icon: Brain, color: '#6366f1', change: '+4%', up: true, bg: 'rgba(99,102,241,0.1)' },
    { label: 'Applications', value: '3', icon: Briefcase, color: '#10b981', change: '2 active', up: true, bg: 'rgba(16,185,129,0.1)' },
    { label: 'Certifications', value: '2', icon: Award, color: '#f59e0b', change: '+1 pending', up: true, bg: 'rgba(245,158,11,0.1)' },
    { label: 'Match Jobs', value: '12', icon: TrendingUp, color: '#f43f5e', change: 'New 3 today', up: true, bg: 'rgba(244,63,94,0.1)' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Greeting */}
      <div className="page-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: 'white', boxShadow: '0 4px 16px rgba(16,185,129,0.3)'
          }}>
            {user.avatar}
          </div>
          <div>
            <h1 className="page-hero-title" style={{ fontSize: 28 }}>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
            <p className="page-hero-subtitle">{user.year} · {user.dept} · {user.college} · CGPA: {user.cgpa}</p>
          </div>
        </div>

        {/* Progress Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #eef2ff, #f0fdf4)',
          border: '1px solid #c7d2fe',
          borderRadius: 16, padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
        }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4, color: '#111827' }}>🎯 Your placement readiness: <span style={{ color: '#6366f1' }}>72%</span></div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>Complete 2 more assessments to improve your profile match score</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('assessment')}>
              Take Assessment <ArrowRight size={12} />
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('skill-gap')}>View Gaps</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="stat-icon" style={{ background: s.bg }}>
                  <Icon size={20} color={s.color} />
                </div>
                <span className="stat-change up">{s.change}</span>
              </div>
              <div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Radar Chart */}
        <div className="chart-container">
          <div className="section-header">
            <div>
              <div className="section-title">Skill Profile</div>
              <div className="section-subtitle">Your current competency overview</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('skill-gap')}>
              View Gap Analysis
            </button>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={skillRadarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
              <Radar name="Skills" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white' }}
                formatter={(v) => [`${v}%`, 'Proficiency']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Levels */}
        <div className="card" style={{ padding: 24 }}>
          <div className="section-header">
            <div>
              <div className="section-title">Top Skills</div>
              <div className="section-subtitle">Proficiency levels</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(user.skills).slice(0, 6).map(([skill, val]) => {
              const color = val >= 75 ? '#10b981' : val >= 55 ? '#f59e0b' : '#f43f5e';
              return (
                <div key={skill} className="progress-container">
                  <div className="progress-label">
                    <span>{skill}</span>
                    <span style={{ color, fontWeight: 600 }}>{val}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${val}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-header">
          <div>
            <div className="section-title">🎯 Top Matches for You</div>
            <div className="section-subtitle">Based on your skill profile and assessment scores</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('internships')}>View All →</button>
        </div>
        <div className="grid-auto">
          {JOBS.slice(0, 3).map(job => (
            <div key={job.id} className="job-card" onClick={() => onNavigate('internships')}>
              <div className="job-card-header">
                <div className="company-logo" style={{ background: `${job.color}22`, fontSize: 24 }}>{job.logo}</div>
                <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2, color: '#111827' }}>{job.title}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af' }}>{job.company}</div>
                  <div className="job-card-meta">
                    <span className="job-meta-item"><span>📍</span>{job.location}</span>
                    <span className="job-meta-item"><span>💰</span>{job.stipend}</span>
                    <span className="job-meta-item"><span>⏱️</span>{job.duration}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="skill-tags">
                  {job.skills.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
                </div>
                <div className="match-score" style={{ color: job.match >= 80 ? '#10b981' : job.match >= 65 ? '#f59e0b' : '#f43f5e' }}>
                  <div className="match-score-bar"><div className="match-score-fill" style={{ width: `${job.match}%` }} /></div>
                  {job.match}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning & Timeline */}
      <div className="grid-2">
        {/* Next Steps */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>📚 Your Learning Roadmap</div>
          <div className="timeline">
            {LEARNING_PATHS[0].path.slice(0, 4).map((step, i) => (
              <div key={i} className="timeline-item">
                <div className={`timeline-dot ${i < 1 ? 'completed' : ''}`} />
                <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{step.step}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{step.resource} · {step.duration}</div>
                  <span className={`badge ${step.type === 'free' ? 'badge-emerald' : 'badge-amber'}`} style={{ marginTop: 4 }}>
                    {step.type === 'free' ? '✓ Free' : '💳 Paid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-sm w-full" style={{ marginTop: 16 }} onClick={() => onNavigate('learning')}>
            View Full Roadmap <ArrowRight size={12} />
          </button>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>📋 Recent Activity</div>
          {[
            { icon: '🔵', text: 'Applied to Google SWE Intern', time: '2h ago', color: '#10b981' },
            { icon: '📊', text: 'Completed Python & ML Assessment (score: 82%)', time: '1d ago', color: '#6366f1' },
            { icon: '📜', text: 'Added certificate: React Basics', time: '3d ago', color: '#f59e0b' },
            { icon: '🎯', text: 'Profile matched with 5 new opportunities', time: '5d ago', color: '#f43f5e' },
            { icon: '✅', text: 'Project "Smart Campus App" verified by TPO', time: '1w ago', color: '#10b981' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: '#374151' }}>{item.text}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                  <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />{item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
