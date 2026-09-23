import { useState } from 'react';
import { Plus, X, CheckCircle, Briefcase, Users, Tag, Wand2 } from 'lucide-react';
import { useAppState } from '../../state/AppState';
import { SKILL_NAMES, canonicalSkill } from '../../lib/skills';
import { SAMPLE_JDS } from '../../data/sampleJobDescriptions';
import { rankCandidates, TIER_COLOR, matchTier } from '../../lib/matching';

const SKILL_OPTIONS = SKILL_NAMES;


export default function PostJob({ onNavigate }) {
  const { postJob, candidates, extractSkills } = useAppState();
  const [submitError, setSubmitError] = useState('');
  const [busy, setBusy] = useState(false);
  const [posted, setPosted] = useState(null);
  const [extracted, setExtracted] = useState([]);
  const [form, setForm] = useState({
    title: '', type: 'Internship', location: '', mode: 'Hybrid',
    stipend: '', duration: '', minCGPA: '', openings: '',
    deadline: '', description: '', skills: [],
    minSkillLevel: 60, departments: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});

  const depts = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CHE', 'All Departments'];

  function addSkill(s) {
    const sk = canonicalSkill(s.trim());
    if (sk && !form.skills.includes(sk)) {
      setForm(f => ({ ...f, skills: [...f.skills, sk] }));
    }
    setSkillInput('');
  }

  function removeSkill(s) {
    setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }));
  }

  function toggleDept(d) {
    setForm(f => ({
      ...f,
      departments: f.departments.includes(d)
        ? f.departments.filter(x => x !== d)
        : [...f.departments, d]
    }));
  }

  function validate() {
    const e = {};
    if (!form.title) e.title = 'Job title is required';
    if (!form.location) e.location = 'Location is required';
    if (!form.stipend) e.stipend = 'Stipend/Salary is required';
    if (!form.duration) e.duration = 'Duration is required';
    if (!form.deadline) e.deadline = 'Application deadline is required';
    if (!form.description) e.description = 'Job description is required';
    if (form.skills.length === 0) e.skills = 'Add at least one required skill';
    return e;
  }

  async function runExtraction(text = form.description) {
    setSubmitError('');
    try {
      const found = await extractSkills(text);
      setExtracted(found);
      setForm(f => ({ ...f, skills: [...new Set([...f.skills, ...found.filter(x => x.required).map(x => x.skill)])] }));
    } catch (err) {
      setSubmitError(err.message);
    }
  }

  // Load a sample job description into the form and extract its skills right away
  function loadSample(index) {
    const sample = SAMPLE_JDS[index];
    if (!sample) return;
    setErrors({});
    setForm(f => ({ ...f, ...sample.form, description: sample.description, skills: [] }));
    runExtraction(sample.description);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setBusy(true);
    setSubmitError('');
    try {
      setPosted(await postJob(form));
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (posted) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '80px 20px', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}></div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, marginBottom: 10, color: '#111827' }}>
          Opportunity Posted!
        </h2>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 32 }}>
          <strong style={{ color: '#10b981' }}>{form.title}</strong> is now live and visible to{' '}
          {form.departments.length > 0 ? form.departments.join(', ') : 'all departments'} students.
          Students now see it ranked by their match score.
        </p>
        <div className="card" style={{ textAlign: 'left', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Top matching students right now</div>
          {rankCandidates(candidates, posted).slice(0, 4).map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name} <span style={{ color: '#9ca3af', fontWeight: 400 }}>· {c.college}</span></div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{c.match.reasons[0] || 'No overlapping skills yet'}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 18, color: TIER_COLOR[matchTier(c.match.score)] }}>{c.match.score}%</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ textAlign: 'left', marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Role', form.title], ['Type', form.type], ['Mode', form.mode],
              ['Location', form.location], ['Stipend', form.stipend], ['Duration', form.duration],
              ['Min CGPA', form.minCGPA || 'None'], ['Deadline', form.deadline],
            ].map(([k, v]) => (
              <div key={k} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px', border: '1px solid #e8eaf0' }}>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>Required Skills</div>
            <div className="skill-tags">
              {form.skills.map(s => <span key={s} className="tag">{s}</span>)}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => { setPosted(null); setExtracted([]); setForm({ title:'',type:'Internship',location:'',mode:'Hybrid',stipend:'',duration:'',minCGPA:'',openings:'',deadline:'',description:'',skills:[],minSkillLevel:60,departments:[] }); }}>
            + Post Another
          </button>
          <button className="btn btn-ghost" onClick={() => onNavigate('talent')}>Review Candidates</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-hero">
        <h1 className="page-hero-title">Post an Opportunity</h1>
        <p className="page-hero-subtitle">Create an internship, job, or project posting. Matched candidates will be automatically recommended.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Briefcase size={16} color="#111111" /> Basic Details
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input className="form-input" placeholder="e.g. Software Engineering Intern" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              {errors.title && <span style={{ fontSize: 11, color: '#f43f5e' }}>{errors.title}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Opportunity Type *</label>
              <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option>Internship</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Research Project</option>
                <option>Apprenticeship</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input className="form-input" placeholder="e.g. Bengaluru, Karnataka" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              {errors.location && <span style={{ fontSize: 11, color: '#f43f5e' }}>{errors.location}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Work Mode</label>
              <select className="form-select" value={form.mode} onChange={e => setForm(f => ({ ...f, mode: e.target.value }))}>
                <option>Remote</option><option>Hybrid</option><option>On-site</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Stipend / Salary *</label>
              <input className="form-input" placeholder="e.g. ₹60,000/month or ₹12 LPA" value={form.stipend} onChange={e => setForm(f => ({ ...f, stipend: e.target.value }))} />
              {errors.stipend && <span style={{ fontSize: 11, color: '#f43f5e' }}>{errors.stipend}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Duration *</label>
              <input className="form-input" placeholder="e.g. 6 months / Permanent" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
              {errors.duration && <span style={{ fontSize: 11, color: '#f43f5e' }}>{errors.duration}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Number of Openings</label>
              <input className="form-input" type="number" placeholder="e.g. 10" value={form.openings} onChange={e => setForm(f => ({ ...f, openings: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Application Deadline *</label>
              <input className="form-input" type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
              {errors.deadline && <span style={{ fontSize: 11, color: '#f43f5e' }}>{errors.deadline}</span>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Minimum CGPA</label>
            <input className="form-input" type="number" step="0.1" min="0" max="10" placeholder="e.g. 7.5 (leave blank for no minimum)" value={form.minCGPA} onChange={e => setForm(f => ({ ...f, minCGPA: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <textarea className="form-textarea" rows={4} placeholder="Describe the role, responsibilities, team, and what the candidate will learn or build..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ minHeight: 110 }} />
            {errors.description && <span style={{ fontSize: 11, color: '#f43f5e' }}>{errors.description}</span>}
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => runExtraction()} disabled={!form.description.trim()}>
                <Wand2 size={13} /> Extract skills from description
              </button>
              <select className="form-select" style={{ width: 'auto', padding: '4px 10px', fontSize: 12 }} value=""
                onChange={e => loadSample(Number(e.target.value))} aria-label="Use a sample job description">
                <option value="" disabled>Use a sample job description…</option>
                {SAMPLE_JDS.map((j, i) => <option key={j.label} value={i}>{j.label}</option>)}
              </select>

            </div>
            {extracted.length > 0 && (
              <div style={{ marginTop: 12, background: '#f9fafb', border: '1px solid #e8eaf0', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
                  Found {extracted.length} skills. Required ones were added below; "nice to have" ones can be added manually.
                </div>
                {extracted.map(x => (
                  <div key={x.skill} style={{ fontSize: 12, marginBottom: 6, display: 'flex', gap: 8 }}>
                    <span className={`badge ${x.required ? 'badge-primary' : 'badge-gray'}`} style={{ whiteSpace: 'nowrap' }}>
                      {x.skill} · {x.required ? 'required' : 'nice to have'}
                    </span>
                    <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>“{x.evidence}”</span>
                    {!x.required && !form.skills.includes(x.skill) && (
                      <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '0 8px' }} onClick={() => addSkill(x.skill)}>+ add</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag size={16} color="#111111" /> Required Skills
          </div>
          {errors.skills && <div style={{ marginBottom: 10, fontSize: 12, color: '#f43f5e' }}>{errors.skills}</div>}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <input
              className="form-input" style={{ flex: 1 }}
              placeholder="Type a skill and press Enter..."
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
            />
            <button type="button" className="btn btn-primary btn-sm" onClick={() => addSkill(skillInput)}><Plus size={14} /> Add</button>
          </div>
          {/* Quick-add common skills */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>Quick add:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SKILL_OPTIONS.filter(s => !form.skills.includes(s)).slice(0, 14).map(s => (
                <button key={s} type="button" onClick={() => addSkill(s)} style={{
                  padding: '3px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 500,
                  background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280', cursor: 'pointer'
                }}>+ {s}</button>
              ))}
            </div>
          </div>
          {form.skills.length > 0 && (
            <div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>Selected skills ({form.skills.length}):</div>
              <div className="skill-tags">
                {form.skills.map(s => (
                  <span key={s} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                    background: '#f5f5f5', border: '1px solid #111111', color: '#111111'
                  }}>
                    {s}
                    <X size={11} onClick={() => removeSkill(s)} style={{ cursor: 'pointer', opacity: 0.6 }} />
                  </span>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <label className="form-label">Minimum Skill Proficiency Required: {form.minSkillLevel}%</label>
            <input type="range" min={30} max={95} value={form.minSkillLevel}
              onChange={e => setForm(f => ({ ...f, minSkillLevel: +e.target.value }))}
              style={{ width: '100%', accentColor: '#111111', marginTop: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
              <span>30% (Beginner)</span><span>60% (Intermediate)</span><span>95% (Expert)</span>
            </div>
          </div>
        </div>

        {/* Eligibility */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} color="#111111" /> Target Departments
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {depts.map(d => (
              <button key={d} type="button"
                className={`btn btn-sm ${form.departments.includes(d) ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => toggleDept(d)}
              >
                {form.departments.includes(d) && <CheckCircle size={12} />} {d}
              </button>
            ))}
          </div>
          {form.departments.length === 0 && (
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 10 }}>No selection = visible to all departments</div>
          )}
        </div>

        {submitError && <div className="auth-error" role="alert">{submitError}</div>}
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn btn-rose btn-lg" style={{ flex: 1 }} disabled={busy}>
            <Briefcase size={16} /> {busy ? 'Publishing…' : 'Publish Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
}
