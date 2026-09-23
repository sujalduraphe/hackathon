import { useState } from 'react';
import { CheckCircle, Plus, Trash2, Clock, Upload, FileText } from 'lucide-react';
import { useAppState } from '../../state/AppState';

const SECTIONS = {
  projects: {
    title: 'Projects',
    fields: [['title', 'Project title', true], ['tech', 'Technologies (comma-separated)'], ['link', 'Link'], ['description', 'Short description']],
    primary: i => i.title,
    secondary: i => [(i.tech || []).join(', '), i.description].filter(Boolean).join(' · '),
  },
  achievements: {
    title: 'Achievements',
    fields: [['title', 'Achievement', true], ['year', 'Year'], ['description', 'Details']],
    primary: i => i.title,
    secondary: i => [i.year, i.description].filter(Boolean).join(' · '),
  },
};

function VerifiedTag({ verified }) {
  return verified
    ? <span className="badge badge-emerald"><CheckCircle size={10} /> Verified</span>
    : <span className="badge badge-gray"><Clock size={10} /> Pending verification</span>;
}

function Section({ kind, items }) {
  const { addPortfolioItem, removePortfolioItem } = useAppState();
  const cfg = SECTIONS[kind];
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      await addPortfolioItem(kind, form);
      setForm({});
      setAdding(false);
    } catch (err) { setError(err.message); }
  }

  async function remove(id) {
    try { await removePortfolioItem(kind, id); } catch (err) { setError(err.message); }
  }

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="section-header">
        <div className="section-title">{cfg.title} ({items.length})</div>
        {!adding && <button className="btn btn-ghost btn-sm" onClick={() => setAdding(true)}><Plus size={13} /> Add</button>}
      </div>

      {items.length === 0 && !adding && <div style={{ fontSize: 13, color: '#9ca3af' }}>Nothing added yet.</div>}
      {items.map(i => (
        <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{cfg.primary(i)}</div>
            {cfg.secondary(i) && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{cfg.secondary(i)}</div>}
          </div>
          <VerifiedTag verified={i.verified} />
          {!i.verified && (
            <button className="btn btn-ghost btn-sm" onClick={() => remove(i.id)} title="Remove"><Trash2 size={13} /></button>
          )}
        </div>
      ))}

      {adding && (
        <form onSubmit={save} style={{ marginTop: 12, borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
          <div className="grid-2" style={{ gap: 12 }}>
            {cfg.fields.map(([key, label, required]) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}{required ? ' *' : ''}</label>
                <input className="form-input" value={form[key] || ''} required={required}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary btn-sm">Save</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setAdding(false); setForm({}); setError(''); }}>Cancel</button>
          </div>
        </form>
      )}
      {error && <div className="auth-error" role="alert" style={{ marginTop: 10 }}>{error}</div>}
    </div>
  );
}

const LEVELS = [[40, 'Beginner'], [60, 'Intermediate'], [80, 'Advanced']];

function ResumeCard({ profile }) {
  const { uploadResume, deleteResume, addSkills, openResume } = useAppState();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [detected, setDetected] = useState(null); // [{ skill, evidence, current, source }]
  const [picked, setPicked] = useState({});        // skill -> level (only checked ones)
  const [added, setAdded] = useState('');

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(''); setAdded(''); setBusy(true);
    try {
      if (file.type !== 'application/pdf') throw new Error('Please choose a PDF file.');
      if (file.size > 2 * 1024 * 1024) throw new Error('File is larger than 2 MB.');
      const r = await uploadResume(file);
      // offer only skills that aren't already verified by an assessment
      const offer = r.detected.filter(d => d.source !== 'assessment');
      setDetected(offer);
      setPicked(Object.fromEntries(offer.filter(d => d.current == null).map(d => [d.skill, 60])));
      if (!r.textFound) setError('No text found in this PDF (it may be a scanned image). The file was saved, but no skills could be detected.');
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  async function confirm() {
    setBusy(true); setError('');
    try {
      await addSkills(picked);
      setAdded(`${Object.keys(picked).length} skill${Object.keys(picked).length === 1 ? '' : 's'} added to your profile as self-declared. Take an assessment to verify them.`);
      setDetected(null); setPicked({});
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  async function view() {
    setError('');
    try { await openResume(profile.id); } catch (err) { setError(err.message); }
  }

  async function remove() {
    setError(''); setBusy(true);
    try { await deleteResume(); setDetected(null); } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  const toggle = skill => setPicked(p => {
    const n = { ...p };
    if (skill in n) delete n[skill]; else n[skill] = 60;
    return n;
  });

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="section-header">
        <div className="section-title">Resume</div>
        <label className={`btn btn-sm ${profile.resume ? 'btn-ghost' : 'btn-primary'}`} style={{ cursor: busy ? 'wait' : 'pointer' }}>
          <Upload size={13} /> {busy ? 'Working…' : profile.resume ? 'Replace' : 'Upload PDF'}
          <input type="file" accept="application/pdf" onChange={onFile} disabled={busy} hidden />
        </label>
      </div>

      {!profile.resume && <div style={{ fontSize: 13, color: '#9ca3af' }}>Upload your resume (PDF, max 2 MB). Skills found in it can be added to your profile, and recruiters can view it.</div>}
      {profile.resume && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FileText size={18} color="#111111" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{profile.resume.filename}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{Math.ceil(profile.resume.size / 1024)} KB · uploaded {new Date(profile.resume.uploadedAt).toLocaleDateString()}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={view}>View</button>
          <button className="btn btn-ghost btn-sm" onClick={remove} disabled={busy} title="Remove resume"><Trash2 size={13} /></button>
        </div>
      )}

      {detected && (
        <div style={{ marginTop: 16, borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
            {detected.length ? `Skills found in your resume (${detected.length})` : 'No new skills found in your resume.'}
          </div>
          {detected.length > 0 && <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10 }}>Tick the ones to add and choose your level. Skills already verified by an assessment are not shown.</div>}
          {detected.map(d => (
            <div key={d.skill} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', flexWrap: 'wrap' }}>
              <input type="checkbox" checked={d.skill in picked} onChange={() => toggle(d.skill)} id={`sk-${d.skill}`} />
              <label htmlFor={`sk-${d.skill}`} style={{ width: 140, fontWeight: 600, fontSize: 13 }}>{d.skill}</label>
              <select className="form-select" style={{ width: 150, padding: '4px 8px' }} disabled={!(d.skill in picked)}
                value={picked[d.skill] ?? 60} onChange={e => setPicked(p => ({ ...p, [d.skill]: Number(e.target.value) }))}>
                {LEVELS.map(([v, l]) => <option key={v} value={v}>{l} ({v}%)</option>)}
              </select>
              <span style={{ flex: 1, minWidth: 180, fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>
                {d.current != null && `currently ${d.current}% · `}“{d.evidence}”
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {detected.length > 0 && (
              <button className="btn btn-primary btn-sm" onClick={confirm} disabled={busy || !Object.keys(picked).length}>
                Add {Object.keys(picked).length} to profile
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => { setDetected(null); setPicked({}); }}>Close</button>
          </div>
        </div>
      )}
      {added && <div style={{ marginTop: 10, fontSize: 13, color: '#047857' }}>{added}</div>}
      {error && <div className="auth-error" role="alert" style={{ marginTop: 10 }}>{error}</div>}
    </div>
  );
}

export default function DigitalPortfolio() {
  const { profile, applications, jobs } = useAppState();
  const jobById = Object.fromEntries(jobs.map(j => [j.id, j]));
  const internships = applications.filter(a => a.status === 'offered' && jobById[a.jobId]);
  const skills = Object.entries(profile.skills || {}).sort((a, b) => b[1] - a[1]);
  const verifiedCount = ['projects', 'achievements']
    .reduce((n, k) => n + (profile[k] || []).filter(i => i.verified).length, 0);

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">Digital Portfolio</h1>
        <p className="page-hero-subtitle">
          {profile.name} · {[profile.year && `${profile.year} Year`, profile.dept, profile.college].filter(Boolean).join(' · ')}
          {profile.cgpa != null && ` · CGPA ${profile.cgpa}`}
        </p>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
          Items you add are verified by your institution. {verifiedCount} item{verifiedCount === 1 ? '' : 's'} verified so far.
        </div>
      </div>

      <ResumeCard profile={profile} />

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Skills</div>
        {skills.length === 0 && <div style={{ fontSize: 13, color: '#9ca3af' }}>Take a skill assessment or upload your resume to add skills.</div>}
        <div className="skill-tags">
          {skills.map(([sk, v]) => {
            const verified = profile.skillSource?.[sk] === 'assessment';
            return (
              <span key={sk} className="tag" style={verified ? { color: '#047857', borderColor: '#a7f3d0', background: '#ecfdf5' } : undefined}>
                {verified && '✓ '}{sk} · {v}%
              </span>
            );
          })}
        </div>
        {skills.length > 0 && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 10 }}>✓ = verified by assessment on this portal</div>}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Internships & placements</div>
        {internships.length === 0 && <div style={{ fontSize: 13, color: '#9ca3af' }}>Offers you receive through the portal appear here automatically.</div>}
        {internships.map(a => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid #f3f4f6' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{jobById[a.jobId].title}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{jobById[a.jobId].company} · offered {a.history.at(-1).at.slice(0, 10)}</div>
            </div>
            <span className="badge badge-emerald"><CheckCircle size={10} /> Portal record</span>
          </div>
        ))}
      </div>

      {Object.keys(SECTIONS).map(kind => <Section key={kind} kind={kind} items={profile[kind] || []} />)}
    </div>
  );
}
