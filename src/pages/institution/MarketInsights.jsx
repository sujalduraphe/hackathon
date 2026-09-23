import { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppState } from '../../state/AppState';

// Market skill demand from real-world job descriptions imported as CSV
// (e.g. a Glassdoor export or a public job-postings dataset).
export default function MarketInsights() {
  const { market, importMarketCSV, deleteMarketBatch } = useAppState();
  const [file, setFile] = useState(null);
  const [source, setSource] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null);

  async function submit(e) {
    e.preventDefault();
    if (!file) { setError('Choose a CSV file first.'); return; }
    setBusy(true); setError(''); setResult('');
    try {
      const r = await importMarketCSV(file, source.trim() || file.name);
      setResult(`Imported ${r.imported} job description${r.imported === 1 ? '' : 's'}${r.skipped ? ` (${r.skipped} rows skipped: no description)` : ''}.`);
      setFile(null); setSource('');
      e.target.reset();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  async function remove(batch) {
    setError('');
    try { await deleteMarketBatch(batch); setConfirm(null); } catch (err) { setError(err.message); }
  }

  const roles = Object.entries(market.roles).sort((a, b) => b[1].postings - a[1].postings);

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">Market Insights</h1>
        <p className="page-hero-subtitle">
          Skill demand measured from real job descriptions. Imported data feeds students' gap analysis and your cohort's skill-gap chart,
          alongside the postings on this portal.
        </p>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div><div className="stat-label">Job descriptions</div><div className="stat-value">{market.total}</div></div></div>
        <div className="stat-card"><div><div className="stat-label">Sources</div><div className="stat-value">{market.batches.length}</div></div></div>
        <div className="stat-card"><div><div className="stat-label">Roles covered</div><div className="stat-value">{roles.length}</div></div></div>
        <div className="stat-card"><div><div className="stat-label">Most asked skill</div><div className="stat-value" style={{ fontSize: 22 }}>{market.topSkills[0]?.skill || '—'}</div></div></div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="chart-container">
          <div className="section-title" style={{ marginBottom: 4 }}>Most requested skills</div>
          <div className="section-subtitle" style={{ marginBottom: 12 }}>Share of imported job descriptions that require each skill</div>
          {market.topSkills.length === 0
            ? <div style={{ fontSize: 13, color: '#9ca3af', padding: 20 }}>No data yet. Import a CSV below.</div>
            : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={market.topSkills.slice(0, 12)} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                  <XAxis type="number" unit="%" domain={[0, 100]} tick={{ fill: '#525252', fontSize: 11 }} />
                  <YAxis dataKey="skill" type="category" width={120} tick={{ fill: '#111111', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #111', color: '#111' }} formatter={(v, _n, p) => [`${v}% (${p.payload.count} of ${market.total})`, 'Required in']} />
                  <Bar dataKey="pct" fill="#111111" />
                </BarChart>
              </ResponsiveContainer>
            )}
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 12 }}>By role</div>
          {roles.length === 0 && <div style={{ fontSize: 13, color: '#9ca3af' }}>No role matches yet.</div>}
          {roles.map(([role, r]) => {
            const top = Object.entries(r.skills).sort((a, b) => b[1] - a[1]).slice(0, 5);
            return (
              <div key={role} style={{ padding: '10px 0', borderTop: '1px solid #eeeeee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <strong>{role}</strong><span style={{ color: '#525252' }}>{r.postings} job descriptions</span>
                </div>
                <div className="skill-tags" style={{ marginTop: 6 }}>
                  {top.map(([s, n]) => <span key={s} className="tag">{s} · {Math.round((n / r.postings) * 100)}%</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid-2">
        <form className="card" onSubmit={submit}>
          <div className="section-title" style={{ marginBottom: 4 }}>Import job descriptions</div>
          <div style={{ fontSize: 12, color: '#525252', marginBottom: 14, lineHeight: 1.6 }}>
            CSV with a description column (e.g. <em>Job Description</em>) and optionally <em>Job Title</em>, <em>Company Name</em>, <em>Location</em>,
            the layout of a Glassdoor export or common job-posting datasets. Use data you are permitted to use. Max 10 MB.
          </div>
          <div className="form-group">
            <label className="form-label">CSV file *</label>
            <input className="form-input" type="file" accept=".csv,text/csv" onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>
          <div className="form-group">
            <label className="form-label">Source name</label>
            <input className="form-input" value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. Glassdoor export – Bengaluru, Sep 2026" />
          </div>
          {error && <div className="auth-error" role="alert">{error}</div>}
          {result && <div style={{ fontSize: 13, color: '#047857', marginBottom: 10 }}>{result}</div>}
          <button type="submit" className="btn btn-primary" disabled={busy}><Upload size={14} /> {busy ? 'Importing…' : 'Import'}</button>
        </form>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 12 }}>Imported sources</div>
          {market.batches.length === 0 && <div style={{ fontSize: 13, color: '#9ca3af' }}>Nothing imported yet.</div>}
          {market.batches.map(b => (
            <div key={b.batch} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid #eeeeee' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{b.source}</div>
                <div style={{ fontSize: 12, color: '#525252' }}>{b.count} job descriptions · {new Date(b.at).toLocaleDateString()}</div>
              </div>
              {b.mine && (confirm === b.batch
                ? <>
                    <button className="btn btn-primary btn-sm" onClick={() => remove(b.batch)}>Confirm remove</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setConfirm(null)}>Keep</button>
                  </>
                : <button className="btn btn-ghost btn-sm" onClick={() => setConfirm(b.batch)} title="Remove this import"><Trash2 size={13} /></button>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
