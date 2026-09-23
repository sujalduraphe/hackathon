import { Calendar, Users, ArrowRight } from 'lucide-react';
import { useAppState } from '../../state/AppState';
import { PROGRAM_KINDS } from '../../lib/programs';

// which faculty page lists each program kind
const PAGE_FOR = {
  fdp: 'fdp', 'industrial-training': 'industrial', 'faculty-internship': 'industrial', consultancy: 'consultancy',
  research: 'research', 'guest-lecture': 'guest-lectures', workshop: 'workshops', 'live-project': 'workshops',
};

export default function FacultyDashboard({ onNavigate }) {
  const { user, programs, registrations } = useAppState();
  const count = (...kinds) => programs.filter(p => kinds.includes(p.kind)).length;
  const registered = new Set(registrations.map(r => r.programId));

  const stats = [
    { label: 'FDPs', value: count('fdp'), color: '#f59e0b' },
    { label: 'Industrial training & internships', value: count('industrial-training', 'faculty-internship'), color: '#10b981' },
    { label: 'Consultancy & research', value: count('consultancy', 'research'), color: '#111111' },
    { label: 'My registrations', value: registrations.length, color: '#f43f5e' },
  ];

  const upcoming = [...programs]
    .filter(p => !registered.has(p.id))
    .sort((a, b) => (a.startDate || '9999').localeCompare(b.startDate || '9999'))
    .slice(0, 3);
  const pending = registrations.filter(r => r.status === 'pending').length;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="page-hero">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: '#111111',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700
          }}>
            {user.avatar}
          </div>
          <div>
            <h1 className="page-hero-title" style={{ fontSize: 28 }}>Welcome, {user.name}!</h1>
            <p className="page-hero-subtitle">{[user.designation, user.dept, user.organization].filter(Boolean).join(' · ')}</p>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #111111', borderRadius: 16,
          padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
        }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{programs.length} industry opportunities open to academicians</div>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>
              {registrations.length ? `${registrations.length} registration${registrations.length === 1 ? '' : 's'}, ${pending} awaiting confirmation` : 'You have not registered for any yet.'}
            </div>
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
            <div className="section-title">Upcoming opportunities</div>
            <div className="section-subtitle">Earliest start dates you haven't registered for</div>
          </div>
        </div>
        <div className="grid-auto">
          {upcoming.length === 0 && <div style={{ fontSize: 13, color: '#9ca3af' }}>Nothing new right now.</div>}
          {upcoming.map(p => {
            const k = PROGRAM_KINDS[p.kind];
            return (
              <div key={p.id} className="job-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate(PAGE_FOR[p.kind])}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-amber" style={{ marginBottom: 4 }}>{k.label}</span>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{p.title}</div>
                    <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{p.organization}</div>
                  </div>
                </div>
                <div className="job-card-meta">
                  {p.startDate && <span className="job-meta-item"><Calendar size={11} />{p.startDate}</span>}
                  {p.seats && <span className="job-meta-item"><Users size={11} />{Math.max(0, p.seats - p.accepted)} seats left</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                  <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600 }}>{p.compensation}</span>
                  <span style={{ fontSize: 13, color: '#111111', fontWeight: 600 }}>View & register <ArrowRight size={12} /></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
