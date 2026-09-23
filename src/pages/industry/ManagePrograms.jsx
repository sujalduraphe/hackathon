import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useAppState } from '../../state/AppState';
import { PROGRAM_KINDS } from '../../lib/programs';
import { SKILL_NAMES } from '../../lib/skills';

const EMPTY = { kind: 'training', title: '', description: '', mode: 'Online', location: '', startDate: '', duration: '', seats: '', compensation: '', skills: [] };
const AUDIENCE = { student: 'students', faculty: 'academicians' };
const STATUS_BADGE = { pending: 'badge-amber', accepted: 'badge-emerald', declined: 'badge-gray' };

function Registrations({ program, onClose }) {
  const { programRegistrations, decideRegistration } = useAppState();
  const [list, setList] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    programRegistrations(program.id).then(setList).catch(e => setError(e.message));
  }, [program.id, programRegistrations]);

  async function decide(id, status) {
    setError('');
    try {
      const updated = await decideRegistration(id, status);
      setList(l => l.map(r => (r.id === id ? { ...r, status: updated.status } : r)));
    } catch (e) { setError(e.message); }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{program.title}</div>
            <div style={{ color: '#6b7280', fontSize: 13 }}>
              Registrations{program.seats ? ` · ${list ? list.filter(r => r.status === 'accepted').length : program.accepted} of ${program.seats} seats filled` : ''}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        {error && <div className="auth-error" role="alert">{error}</div>}
        {list === null && !error && <div style={{ color: '#9ca3af', fontSize: 13 }}>Loading…</div>}
        {list?.length === 0 && <div style={{ color: '#9ca3af', fontSize: 13 }}>No registrations yet.</div>}
        {list?.map(r => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid #f3f4f6', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.user.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                {[r.user.role === 'faculty' ? 'Academician' : 'Student', r.user.designation, r.user.dept, r.user.organization].filter(Boolean).join(' · ')} · {r.user.email}
              </div>
              {r.message && <div style={{ fontSize: 12, color: '#4b5563', marginTop: 4, fontStyle: 'italic' }}>“{r.message}”</div>}
            </div>
            <span className={`badge ${STATUS_BADGE[r.status]}`}>{r.status}</span>
            {r.status !== 'accepted' && <button className="btn btn-emerald btn-sm" onClick={() => decide(r.id, 'accepted')}>Accept</button>}
            {r.status !== 'declined' && <button className="btn btn-ghost btn-sm" onClick={() => decide(r.id, 'declined')}>Decline</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ManagePrograms() {
  const { user, programs, createProgram, deleteProgram } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [skill, setSkill] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function addSkill(s) {
    const v = s.trim();
    if (v && !form.skills.includes(v)) setForm(f => ({ ...f, skills: [...f.skills, v] }));
    setSkill('');
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await createProgram(form);
      setForm(EMPTY); setShowForm(false);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  async function remove(id) {
    setError('');
    try { await deleteProgram(id); setConfirmDelete(null); } catch (err) { setError(err.message); }
  }

  const kind = PROGRAM_KINDS[form.kind];

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">Programs & Collaboration</h1>
        <p className="page-hero-subtitle">
          Publish training, workshops, mentorship, innovation challenges and live projects for students, and FDPs, industrial training,
          faculty internships, consultancy, research and guest lectures for academicians.
        </p>
      </div>

      {!showForm && (
        <button className="btn btn-rose" style={{ marginBottom: 20 }} onClick={() => { setShowForm(true); setError(''); }}>
          <Plus size={14} /> New program
        </button>
      )}

      {showForm && (
        <form className="card" style={{ marginBottom: 24 }} onSubmit={submit}>
          <div className="section-title" style={{ marginBottom: 16 }}>New program · {user.organization}</div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Type *</label>
              <select className="form-select" value={form.kind} onChange={set('kind')}>
                {Object.entries(PROGRAM_KINDS).map(([id, k]) => <option key={id} value={id}>{k.label}</option>)}
              </select>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Open to {kind.audience.map(a => AUDIENCE[a]).join(' and ')}</span>
            </div>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" value={form.title} onChange={set('title')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Mode</label>
              <select className="form-select" value={form.mode} onChange={set('mode')}>
                <option>Online</option><option>Hybrid</option><option>On-site</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={set('location')} placeholder="City, if not online" />
            </div>
            <div className="form-group">
              <label className="form-label">Start date</label>
              <input className="form-input" type="date" value={form.startDate} onChange={set('startDate')} />
            </div>
            <div className="form-group">
              <label className="form-label">Duration</label>
              <input className="form-input" value={form.duration} onChange={set('duration')} placeholder="e.g. 6 weeks" />
            </div>
            <div className="form-group">
              <label className="form-label">Seats</label>
              <input className="form-input" type="number" min="1" value={form.seats} onChange={set('seats')} placeholder="Leave blank for unlimited" />
            </div>
            <div className="form-group">
              <label className="form-label">Fee / stipend / prize</label>
              <input className="form-input" value={form.compensation} onChange={set('compensation')} placeholder="e.g. Free, ₹20,000 stipend" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={3} value={form.description} onChange={set('description')} />
          </div>
          <div className="form-group">
            <label className="form-label">Skills covered</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" list="program-skills" value={skill} onChange={e => setSkill(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skill); } }} placeholder="Type a skill and press Enter" />
              <datalist id="program-skills">{SKILL_NAMES.map(s => <option key={s} value={s} />)}</datalist>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => addSkill(skill)}>Add</button>
            </div>
            <div className="skill-tags" style={{ marginTop: 8 }}>
              {form.skills.map(s => (
                <span key={s} className="tag">{s} <X size={10} style={{ cursor: 'pointer' }} onClick={() => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }))} /></span>
              ))}
            </div>
          </div>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-rose" disabled={busy}>{busy ? 'Publishing…' : 'Publish'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setForm(EMPTY); setError(''); }}>Cancel</button>
          </div>
        </form>
      )}

      {!showForm && error && <div className="auth-error" role="alert">{error}</div>}
      {programs.length === 0 && !showForm && (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>You haven't published any programs yet.</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {programs.map(p => {
          const k = PROGRAM_KINDS[p.kind];
          return (
            <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  {k.label} · for {k.audience.map(a => AUDIENCE[a]).join(' & ')} · {[p.startDate, p.duration, p.mode].filter(Boolean).join(' · ')}
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#374151' }}>
                <strong>{p.registrations}</strong> registered{p.seats ? ` · ${p.accepted}/${p.seats} seats` : ` · ${p.accepted} accepted`}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewing(p)}>Registrations</button>
              {confirmDelete === p.id
                ? <>
                    <button className="btn btn-rose btn-sm" onClick={() => remove(p.id)}>Confirm delete</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}>Keep</button>
                  </>
                : <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(p.id)} title="Delete program"><Trash2 size={13} /></button>}
            </div>
          );
        })}
      </div>

      {viewing && <Registrations program={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
