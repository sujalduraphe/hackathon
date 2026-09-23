import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppState, STAGE_LABELS, STAGE_COLORS } from '../../state/AppState';

const FUNNEL = ['applied', 'shortlisted', 'assessment', 'interview', 'offered'];

export default function InstitutionDashboard({ onNavigate }) {
  const { user, analytics, candidates } = useAppState();
  const a = analytics;
  const verifiedStudents = a.readiness.filter(r => r.verifiedSkills > 0).length;
  const withApplications = a.readiness.filter(r => r.applications > 0).length;
  const placed = a.readiness.filter(r => r.offers > 0).length;
  const pendingVerification = candidates.reduce((n, s) =>
    n + ['projects', 'achievements'].reduce((m, k) => m + (s[k] || []).filter(i => !i.verified).length, 0), 0);

  // "reached" counts: an application that got to interview also passed applied and shortlisted
  const funnel = FUNNEL.map((st, i) => ({
    stage: STAGE_LABELS[st],
    key: st,
    count: FUNNEL.slice(i).reduce((n, s) => n + (a.funnel[s] || 0), 0),
  }));

  const gaps = a.skillGaps.filter(g => g.studentsBelowBar > 0).slice(0, 8);

  const stats = [
    { label: 'Students', value: a.students, note: `${verifiedStudents} with verified skills`, color: '#6366f1' },
    { label: 'Applying', value: withApplications, note: `${a.students ? Math.round((withApplications / a.students) * 100) : 0}% of cohort`, color: '#06b6d4' },
    { label: 'Offers', value: placed, note: `${a.funnel.offered || 0} offers received`, color: '#10b981' },
    { label: 'Pending verification', value: pendingVerification, note: 'portfolio items', color: '#f59e0b' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">🏛️ {a.college}</h1>
        <p className="page-hero-subtitle">{user.name}{user.designation ? ` · ${user.designation}` : ''} · skill development, internship participation and placement progress</p>
      </div>

      <div className="stat-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{s.note}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="chart-container">
          <div className="section-header">
            <div>
              <div className="section-title">Skill gaps vs industry demand</div>
              <div className="section-subtitle">Students below the 60% bar in skills employers on the portal ask for</div>
            </div>
          </div>
          {gaps.length === 0
            ? <div style={{ fontSize: 13, color: '#9ca3af', padding: 20 }}>No gaps against current postings.</div>
            : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={gaps} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis type="number" allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis dataKey="skill" type="category" width={110} tick={{ fill: '#374151', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, color: '#111827' }}
                    formatter={(v, _n, p) => [`${v} of ${a.students} students (asked in ${p.payload.demand}% of postings)`, 'Below bar']}
                  />
                  <Bar dataKey="studentsBelowBar" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 4 }}>Placement funnel</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>Applications from your students that reached each stage</div>
          {funnel.map(f => (
            <div key={f.key} className="progress-container" style={{ marginBottom: 12 }}>
              <div className="progress-label">
                <span>{f.stage}</span>
                <span style={{ fontWeight: 600 }}>{f.count}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${funnel[0].count ? (f.count / funnel[0].count) * 100 : 0}%`, background: STAGE_COLORS[f.key] }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: '#9ca3af' }}>{a.funnel.rejected || 0} not selected</div>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <div className="section-title">Least placement-ready students</div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('pri')}>View all →</button>
        </div>
        {[...a.readiness].reverse().slice(0, 5).map(r => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid #f3f4f6' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{[r.dept, r.bestRole && `closest role: ${r.bestRole}`].filter(Boolean).join(' · ')}</div>
            </div>
            <div style={{ fontWeight: 700, color: r.readiness >= 70 ? '#10b981' : r.readiness >= 50 ? '#f59e0b' : '#f43f5e' }}>{r.readiness}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
