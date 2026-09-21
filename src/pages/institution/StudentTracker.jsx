import { useState } from 'react';
import { Search, TrendingUp, Briefcase, Brain, Award, ChevronRight, Eye } from 'lucide-react';
import { CANDIDATES, INSTITUTION_STATS } from '../../data/store';

const STUDENT_DATA = [
  ...CANDIDATES,
  { id: 7, name: 'Nandini Rao', college: 'NITK Surathkal', dept: 'IT', year: '3rd', cgpa: 8.0, skills: { 'Python': 70, 'SQL': 72, 'React': 60 }, match: 72, status: 'applied', avatar: 'NR', assessmentScore: 68, internshipStatus: 'Searching', placementStatus: 'Eligible' },
  { id: 8, name: 'Karan Patel', college: 'NITK Surathkal', dept: 'ECE', year: '4th', cgpa: 7.5, skills: { 'C++': 75, 'Embedded': 70, 'Python': 55 }, match: 60, status: 'applied', avatar: 'KP', assessmentScore: 62, internshipStatus: 'Completed', placementStatus: 'Placed' },
];

const internshipStatusColors = { Searching: '#f59e0b', Completed: '#10b981', 'In Progress': '#6366f1', 'Not Started': '#9ca3af' };
const placementStatusColors = { Placed: '#10b981', Eligible: '#6366f1', 'Not Eligible': '#f43f5e', Offered: '#8b5cf6' };

export default function StudentTracker() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const depts = ['all', 'CSE', 'IT', 'ECE', 'EEE', 'MECH'];

  const filtered = STUDENT_DATA.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.college.toLowerCase().includes(search.toLowerCase()) ||
      s.dept.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'all' || s.dept === deptFilter;
    return matchSearch && matchDept;
  });

  const priScore = s => Math.round(
    (s.cgpa / 10 * 35) + (s.assessmentScore / 100 * 40) + (s.match / 100 * 25)
  );

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">👥 Student Tracker</h1>
        <p className="page-hero-subtitle">Monitor each student's skill development, internship participation, and placement readiness.</p>
      </div>

      {/* Summary stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Tracked', value: STUDENT_DATA.length, color: '#6366f1', icon: '👥' },
          { label: 'Placement Ready (PRI ≥70)', value: STUDENT_DATA.filter(s => priScore(s) >= 70).length, color: '#10b981', icon: '✅' },
          { label: 'Internship Secured', value: STUDENT_DATA.filter(s => s.status === 'offered' || s.status === 'interview').length, color: '#f59e0b', icon: '🏢' },
          { label: 'Avg Assessment Score', value: `${Math.round(STUDENT_DATA.reduce((a, s) => a + s.assessmentScore, 0) / STUDENT_DATA.length)}%`, color: '#f43f5e', icon: '📊' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
          <Search size={14} className="search-icon" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, department..." />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {depts.map(d => (
            <button key={d} className={`btn btn-sm ${deptFilter === d ? 'btn-cyan' : 'btn-ghost'}`} onClick={() => setDeptFilter(d)} style={{ textTransform: d === 'all' ? 'none' : undefined }}>
              {d === 'all' ? 'All Depts' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Student cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(s => {
          const pri = priScore(s);
          const priColor = pri >= 80 ? '#10b981' : pri >= 65 ? '#f59e0b' : '#f43f5e';
          return (
            <div key={s.id} className="card" style={{ padding: '16px 20px', cursor: 'pointer' }} onClick={() => setSelected(s)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                {/* Avatar */}
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${s.match >= 85 ? '#10b981, #059669' : s.match >= 70 ? '#6366f1, #4f46e5' : '#f59e0b, #d97706'})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: 'white'
                }}>{s.avatar}</div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>
                    {s.college} · {s.dept} · {s.year} Year · CGPA: <strong style={{ color: '#374151' }}>{s.cgpa}</strong>
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Assessment */}
                  <div style={{ textAlign: 'center', minWidth: 60 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#6366f1', fontFamily: 'var(--font-display)' }}>{s.assessmentScore}%</div>
                    <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assessment</div>
                  </div>
                  {/* Skills match */}
                  <div style={{ textAlign: 'center', minWidth: 60 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-display)' }}>{s.match}%</div>
                    <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skill Match</div>
                  </div>
                  {/* PRI */}
                  <div style={{ textAlign: 'center', minWidth: 60 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: priColor, fontFamily: 'var(--font-display)' }}>{pri}%</div>
                    <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Readiness</div>
                  </div>
                </div>

                {/* Status badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end', flexShrink: 0 }}>
                  {s.internshipStatus && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                      background: `${internshipStatusColors[s.internshipStatus]}18`,
                      color: internshipStatusColors[s.internshipStatus],
                      border: `1px solid ${internshipStatusColors[s.internshipStatus]}33`
                    }}>🏢 {s.internshipStatus}</span>
                  )}
                  {s.placementStatus && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                      background: `${placementStatusColors[s.placementStatus]}18`,
                      color: placementStatusColors[s.placementStatus],
                      border: `1px solid ${placementStatusColors[s.placementStatus]}33`
                    }}>💼 {s.placementStatus}</span>
                  )}
                </div>

                <ChevronRight size={16} color="#d1d5db" />
              </div>

              {/* Skill mini bars */}
              <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                {Object.entries(s.skills).slice(0, 4).map(([sk, v]) => (
                  <div key={sk} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120 }}>
                    <span style={{ fontSize: 11, color: '#6b7280', minWidth: 55 }}>{sk}</span>
                    <div style={{ flex: 1, height: 4, background: '#f1f3f8', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${v}%`, height: '100%', background: v >= 75 ? '#10b981' : v >= 55 ? '#6366f1' : '#f59e0b', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 10, color: '#9ca3af', minWidth: 26 }}>{v}%</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: 'white' }}>{selected.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 20, color: '#111827' }}>{selected.name}</div>
                  <div style={{ color: '#9ca3af', fontSize: 13 }}>{selected.college} · {selected.dept} · CGPA {selected.cgpa}</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            {/* PRI breakdown */}
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: '16px 20px', marginBottom: 20, border: '1px solid #e8eaf0' }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: '#111827' }}>🎯 Placement Readiness Index (PRI)</div>
              {[
                { label: 'CGPA Score (35%)', val: Math.round(selected.cgpa / 10 * 35), max: 35, color: '#6366f1' },
                { label: 'Assessment Score (40%)', val: Math.round(selected.assessmentScore / 100 * 40), max: 40, color: '#10b981' },
                { label: 'Skill Match (25%)', val: Math.round(selected.match / 100 * 25), max: 25, color: '#f59e0b' },
              ].map(item => (
                <div key={item.label} className="progress-container" style={{ marginBottom: 12 }}>
                  <div className="progress-label">
                    <span style={{ color: '#374151' }}>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 700 }}>{item.val}/{item.max}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${(item.val / item.max) * 100}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)` }} />
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontWeight: 700, color: '#111827', fontSize: 15 }}>
                <span>Total PRI Score</span>
                <span style={{ color: priScore(selected) >= 70 ? '#10b981' : '#f59e0b' }}>{priScore(selected)}%</span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#111827' }}>Skill Profile</div>
              {Object.entries(selected.skills).map(([sk, v]) => {
                const c = v >= 75 ? '#10b981' : v >= 55 ? '#6366f1' : '#f59e0b';
                return (
                  <div key={sk} className="progress-container" style={{ marginBottom: 10 }}>
                    <div className="progress-label"><span>{sk}</span><span style={{ color: c, fontWeight: 600 }}>{v}%</span></div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${v}%`, background: `linear-gradient(90deg, ${c}, ${c}aa)` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1 }}><Eye size={14} /> View Full Portfolio</button>
              <button className="btn btn-ghost" style={{ flex: 1 }}>Send Notification</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
