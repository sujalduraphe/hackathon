import { useState } from 'react';
import { X } from 'lucide-react';
import { useAppState } from '../../state/AppState';
import { PROGRAM_KINDS, kindsFor } from '../../lib/programs';

const STATUS = {
  pending: { label: 'Registered · awaiting confirmation', badge: 'badge-amber' },
  accepted: { label: 'Confirmed', badge: 'badge-emerald' },
  declined: { label: 'Not selected', badge: 'badge-gray' },
};

/**
 * Programs open to the logged-in student or academician.
 * `kinds` narrows the list (e.g. only FDPs); `title`/`subtitle` label the page.
 */
export default function ProgramsBrowse({ kinds, title, subtitle }) {
  const { user, programs, registrations, registerProgram } = useAppState();
  const allowed = kinds || kindsFor(user.role);
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const regByProgram = Object.fromEntries(registrations.map(r => [r.programId, r]));
  const inScope = programs.filter(p => allowed.includes(p.kind));
  const shown = tab === 'mine'
    ? inScope.filter(p => regByProgram[p.id])
    : inScope.filter(p => tab === 'all' || p.kind === tab);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await registerProgram(selected.id, message);
      setSelected(null); setMessage('');
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  // with a single kind there's nothing to filter, so only All / My registrations
  const kindTabs = allowed.length > 1 ? allowed.map(k => [k, PROGRAM_KINDS[k].label]) : [];
  const tabs = [['all', 'All'], ...kindTabs, ['mine', `My registrations (${inScope.filter(p => regByProgram[p.id]).length})`]];

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">{title}</h1>
        <p className="page-hero-subtitle">{subtitle}</p>
      </div>

      {allowed.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {tabs.map(([k, l]) => (
            <button key={k} className={`btn btn-sm ${tab === k ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      )}

      {shown.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
          {tab === 'mine' ? "You haven't registered for anything here yet." : 'No programs posted yet.'}
        </div>
      )}

      <div className="grid-auto">
        {shown.map(p => {
          const k = PROGRAM_KINDS[p.kind];
          const reg = regByProgram[p.id];
          const full = p.seats && p.accepted >= p.seats;
          return (
            <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{p.organization} · {k.label}</div>
                </div>
              </div>
              {p.description && <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>{p.description}</div>}
              <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {p.startDate && <span>{p.startDate}</span>}
                {p.duration && <span>{p.duration}</span>}
                <span>{p.mode}{p.location ? ` · ${p.location}` : ''}</span>
                {p.compensation && <span>{p.compensation}</span>}
                {p.seats && <span>{Math.max(0, p.seats - p.accepted)} of {p.seats} seats left</span>}
              </div>
              {p.skills?.length > 0 && (
                <div className="skill-tags">{p.skills.map(s => <span key={s} className="tag">{s}</span>)}</div>
              )}
              <div style={{ marginTop: 'auto' }}>
                {reg
                  ? <span className={`badge ${STATUS[reg.status].badge}`}>{STATUS[reg.status].label}</span>
                  : <button className="btn btn-primary btn-sm" disabled={full} onClick={() => { setSelected(p); setError(''); }}>
                      {full ? 'Seats full' : 'Register'}
                    </button>}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{selected.title}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>{selected.organization} · {PROGRAM_KINDS[selected.kind].label}</div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={16} /></button>
            </div>
            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label">Message to the organiser (optional)</label>
                <textarea className="form-textarea" rows={3} maxLength={500} value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Why you're interested, or any details they should know" />
              </div>
              {error && <div className="auth-error" role="alert">{error}</div>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={busy}>{busy ? 'Registering…' : 'Confirm registration'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
