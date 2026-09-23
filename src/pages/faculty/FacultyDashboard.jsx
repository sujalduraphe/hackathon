import { Calendar, Users, ArrowRight } from 'lucide-react';
import { FACULTY_PROGRAMS } from '../../data/store';
import { useAppState } from '../../state/AppState';

export default function FacultyDashboard({ onNavigate }) {
  const { user } = useAppState();
  const countType = t => FACULTY_PROGRAMS.filter(p => p.type === t).length;

  const stats = [
    { label: 'FDPs Available', value: countType('FDP'), icon: '📚', color: '#f59e0b' },
    { label: 'Industrial Internships', value: countType('Industrial Internship'), icon: '🏭', color: '#10b981' },
    { label: 'Consultancy Openings', value: countType('Consultancy'), icon: '🔬', color: '#6366f1' },
    { label: 'Guest Lectures', value: countType('Guest Lecture'), icon: '🎤', color: '#f43f5e' },
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
            <p className="page-hero-subtitle">{[user.designation, user.dept, user.organization].filter(Boolean).join(' · ')}</p>
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

    </div>
  );
}
