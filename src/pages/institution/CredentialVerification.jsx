import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useAppState } from '../../state/AppState';

const KINDS = {
  projects: { label: 'Project', title: i => i.title, detail: i => [(i.tech || []).join(', '), i.description].filter(Boolean).join(' · '), link: i => i.link },
  achievements: { label: 'Achievement', title: i => i.title, detail: i => [i.year, i.description].filter(Boolean).join(' · '), link: () => null },
};

export default function CredentialVerification() {
  const { candidates, verifyPortfolioItem } = useAppState();
  const [tab, setTab] = useState('pending');
  const [error, setError] = useState('');

  const items = candidates.flatMap(s => Object.keys(KINDS).flatMap(kind =>
    (s[kind] || []).map(i => ({ ...i, kind, student: s }))
  )).filter(i => (tab === 'pending' ? !i.verified : i.verified));

  async function setVerified(i, verified) {
    setError('');
    try { await verifyPortfolioItem(i.student.id, i.kind, i.id, verified); } catch (err) { setError(err.message); }
  }

  const pendingCount = candidates.reduce((n, s) => n + Object.keys(KINDS).reduce((m, k) => m + (s[k] || []).filter(i => !i.verified).length, 0), 0);

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">Credential Verification</h1>
        <p className="page-hero-subtitle">Verify projects and achievements your students add to their portfolios. Verified items are marked on their profile for recruiters.</p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        <button className={`btn btn-sm ${tab === 'pending' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('pending')}>Pending ({pendingCount})</button>
        <button className={`btn btn-sm ${tab === 'verified' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('verified')}>Verified</button>
      </div>

      {error && <div className="auth-error" role="alert">{error}</div>}

      <div className="card">
        {items.length === 0 && <div style={{ fontSize: 13, color: '#9ca3af' }}>{tab === 'pending' ? 'Nothing waiting for verification.' : 'No verified items yet.'}</div>}
        {items.map(i => {
          const k = KINDS[i.kind];
          const link = k.link(i);
          return (
            <div key={`${i.student.id}-${i.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid #f3f4f6', flexWrap: 'wrap' }}>
              <span className="badge badge-gray" style={{ minWidth: 92, justifyContent: 'center' }}>{k.label}</span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{k.title(i)}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                  {i.student.name}{i.student.dept ? ` · ${i.student.dept}` : ''}{k.detail(i) ? ` · ${k.detail(i)}` : ''}
                  {link && <> · <a href={link} target="_blank" rel="noreferrer" style={{ color: '#111111' }}>view</a></>}
                </div>
              </div>
              {i.verified
                ? <button className="btn btn-ghost btn-sm" onClick={() => setVerified(i, false)}><X size={12} /> Revoke</button>
                : <button className="btn btn-emerald btn-sm" onClick={() => setVerified(i, true)}><CheckCircle size={12} /> Verify</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
