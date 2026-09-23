import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAppState } from '../../state/AppState';

const color = v => (v >= 70 ? '#10b981' : v >= 50 ? '#f59e0b' : '#f43f5e');

export default function StudentTracker() {
  const { analytics, candidates, openResume } = useAppState();
  const [error, setError] = useState('');
  const hasResume = Object.fromEntries(candidates.map(c => [c.id, Boolean(c.resume)]));
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('readiness');

  const rows = analytics.readiness
    .filter(r => `${r.name} ${r.dept || ''}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : b[sort] - a[sort]));

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">📈 Placement Readiness</h1>
        <p className="page-hero-subtitle">
          Readiness is each student's skill fit for the role they are closest to, measured against live postings on the portal.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
          <Search size={14} className="search-icon" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or department..." />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['readiness', 'Readiness'], ['applications', 'Applications'], ['offers', 'Offers'], ['name', 'Name']].map(([k, l]) => (
            <button key={k} className={`btn btn-sm ${sort === k ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSort(k)}>{l}</button>
          ))}
        </div>
      </div>

      {error && <div className="auth-error" role="alert">{error}</div>}
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'left', color: '#6b7280' }}>
              {['Student', 'Dept', 'CGPA', 'Closest role', 'Readiness', 'Verified skills', 'Applications', 'Offers', 'Resume'].map(h => (
                <th key={h} style={{ padding: '12px 16px', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{r.name}</td>
                <td style={{ padding: '12px 16px' }}>{r.dept || '—'}</td>
                <td style={{ padding: '12px 16px' }}>{r.cgpa ?? '—'}</td>
                <td style={{ padding: '12px 16px' }}>{r.bestRole}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
                    <div className="progress-track" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${r.readiness}%`, background: color(r.readiness) }} />
                    </div>
                    <strong style={{ color: color(r.readiness) }}>{r.readiness}%</strong>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>{r.verifiedSkills}</td>
                <td style={{ padding: '12px 16px' }}>{r.applications}</td>
                <td style={{ padding: '12px 16px' }}>{r.offers}</td>
                <td style={{ padding: '12px 16px' }}>
                  {hasResume[r.id]
                    ? <button className="btn btn-ghost btn-sm" onClick={() => openResume(r.id).catch(err => setError(err.message))}>View</button>
                    : <span style={{ color: '#9ca3af' }}>—</span>}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={9} style={{ padding: 24, textAlign: 'center', color: '#9ca3af' }}>No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
