import { useState } from 'react';
import { Plus, X, ChevronRight, Lightbulb, FlaskConical, Handshake, BookOpen } from 'lucide-react';
import { CURRENT_USER } from '../../data/store';

const ACTIVE_PROJECTS = [
  {
    id: 1, title: 'AI-Powered Crop Disease Detection', type: 'R&D Project', partner: 'ICAR (Indian Council of Agricultural Research)',
    icon: '🌾', color: '#10b981', status: 'Active', duration: 'Jun 2026 – May 2027',
    stipend: '₹50,000/month', skills: ['Computer Vision', 'PyTorch', 'Python', 'Transfer Learning'],
    description: 'Collaborate on building a CNN-based crop disease detection system using drone imagery. ICAR will provide labeled dataset and field testing infrastructure.',
    progress: 35, members: 3
  },
  {
    id: 2, title: 'Blockchain for Academic Credential Verification', type: 'Consultancy', partner: 'CredTech Pvt. Ltd.',
    icon: '⛓️', color: '#6366f1', status: 'Active', duration: 'Aug 2026 – Feb 2027',
    stipend: '₹1,20,000 (project fee)', skills: ['Blockchain', 'Solidity', 'Ethereum', 'Smart Contracts'],
    description: 'Consulting engagement to design and prototype a blockchain-based credentialing system for Indian universities. Academic lead + 2 student RAs.',
    progress: 60, members: 2
  },
  {
    id: 3, title: 'NLP-Based Regional Language Translation', type: 'Collaborative Research', partner: 'IIIT Hyderabad',
    icon: '🌐', color: '#f59e0b', status: 'Proposal Review', duration: 'Pending',
    stipend: '₹40,000/month + travel', skills: ['NLP', 'Transformers', 'HuggingFace', 'Kannada/Telugu Corpus'],
    description: 'Joint research with IIIT-H to build low-resource language translation models for Kannada and Telugu. Publishing target: ACL 2027.',
    progress: 10, members: 1
  },
];

const TYPES = ['R&D Project', 'Consultancy', 'Collaborative Research', 'Tech Transfer', 'Industry Partnership'];
const SKILL_AREAS = ['AI/ML', 'Blockchain', 'IoT', 'Cloud', 'Cybersecurity', 'NLP', 'Robotics', 'Data Science'];

export default function ConsultancyHub() {
  const user = CURRENT_USER.faculty;
  const [projects, setProjects] = useState(ACTIVE_PROJECTS);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', type: TYPES[0], partner: '', duration: '', stipend: '', description: '', skills: [] });
  const [skillInput, setSkillInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function addSkill(s) {
    const sk = s.trim();
    if (sk && !form.skills.includes(sk)) setForm(f => ({ ...f, skills: [...f.skills, sk] }));
    setSkillInput('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.partner) return;
    setProjects(prev => [...prev, { ...form, id: Date.now(), icon: '🔬', color: '#06b6d4', status: 'Proposal Submitted', progress: 5, members: 1 }]);
    setSubmitted(true);
    setTimeout(() => { setShowForm(false); setSubmitted(false); setForm({ title: '', type: TYPES[0], partner: '', duration: '', stipend: '', description: '', skills: [] }); }, 2200);
  }

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-hero-title">🔬 Consultancy & R&D Hub</h1>
            <p className="page-hero-subtitle">Manage active research collaborations, consultancy projects, and industry-academia partnerships.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={14} /> Submit Proposal
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 28 }}>
        {[
          { label: 'Active Projects', value: projects.filter(p => p.status === 'Active').length, color: '#10b981', icon: '🔬' },
          { label: 'Proposals Under Review', value: projects.filter(p => p.status.includes('Review') || p.status.includes('Submitted')).length, color: '#f59e0b', icon: '📋' },
          { label: 'Total Funding', value: '₹2.7L', color: '#6366f1', icon: '💰' },
          { label: 'Publications Pipeline', value: user.publications, color: '#f43f5e', icon: '📄' },
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

      {/* Project cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {projects.map(proj => (
          <div key={proj.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(proj)}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${proj.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, border: `1px solid ${proj.color}33` }}>
                {proj.icon}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{proj.title}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                    background: proj.status === 'Active' ? '#ecfdf5' : '#fffbeb',
                    color: proj.status === 'Active' ? '#059669' : '#d97706',
                    border: `1px solid ${proj.status === 'Active' ? '#a7f3d0' : '#fde68a'}`
                  }}>● {proj.status}</span>
                </div>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>
                  <span className={`badge badge-${proj.type === 'R&D Project' ? 'primary' : proj.type === 'Consultancy' ? 'amber' : 'cyan'}`}>{proj.type}</span>
                  <span style={{ marginLeft: 10 }}>🤝 {proj.partner}</span>
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 12 }}>{proj.description.slice(0, 120)}...</p>
                <div className="skill-tags">
                  {proj.skills.map(s => <span key={s} className="tag">{s}</span>)}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4 }}>📅 {proj.duration || 'TBD'}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#10b981', marginBottom: 12 }}>{proj.stipend}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>Progress</div>
                <div style={{ width: 100, height: 6, background: '#f1f3f8', borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
                  <div style={{ width: `${proj.progress}%`, height: '100%', background: `linear-gradient(90deg, ${proj.color}, ${proj.color}cc)`, borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: proj.color }}>{proj.progress}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Proposal Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 56 }}>🎉</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginTop: 16, color: '#111827' }}>Proposal Submitted!</h3>
                <p style={{ color: '#6b7280', marginTop: 8 }}>Your proposal has been sent to the R&D committee for review.</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <div style={{ fontWeight: 700, fontSize: 20, color: '#111827' }}>📝 Submit New Proposal</div>
                  <button className="modal-close" onClick={() => setShowForm(false)}><X size={14} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Project Title *</label>
                      <input className="form-input" placeholder="e.g. AI in Healthcare Diagnostics" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Collaboration Type *</label>
                      <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                        {TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Industry Partner / Organisation *</label>
                      <input className="form-input" placeholder="e.g. Infosys, DRDO, CSIR..." value={form.partner} onChange={e => setForm(f => ({ ...f, partner: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Expected Duration</label>
                      <input className="form-input" placeholder="e.g. 6 months, 1 year" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label">Expected Funding / Stipend</label>
                      <input className="form-input" placeholder="e.g. ₹80,000/month or ₹5L project grant" value={form.stipend} onChange={e => setForm(f => ({ ...f, stipend: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project Description *</label>
                    <textarea className="form-textarea" rows={3} placeholder="Describe the research objectives, expected outcomes, and scope of collaboration..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Key Skills / Technologies</label>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input className="form-input" style={{ flex: 1 }} placeholder="Type and press Enter..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }} />
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => addSkill(skillInput)}>Add</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                      {SKILL_AREAS.filter(s => !form.skills.includes(s)).map(s => (
                        <button key={s} type="button" onClick={() => addSkill(s)} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11.5, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280', cursor: 'pointer' }}>+ {s}</button>
                      ))}
                    </div>
                    <div className="skill-tags">
                      {form.skills.map(s => (
                        <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 6, fontSize: 12, background: '#eef2ff', border: '1px solid #c7d2fe', color: '#4f46e5' }}>
                          {s} <X size={10} onClick={() => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }))} style={{ cursor: 'pointer' }} />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>🚀 Submit Proposal</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ fontSize: 30 }}>{selected.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#111827' }}>{selected.title}</div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>{selected.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
              {[['Partner', selected.partner], ['Type', selected.type], ['Duration', selected.duration || 'TBD'], ['Funding', selected.stipend], ['Status', selected.status], ['Progress', `${selected.progress}%`]].map(([k, v]) => (
                <div key={k} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px', border: '1px solid #e8eaf0' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="skill-tags" style={{ marginBottom: 20 }}>{selected.skills.map(s => <span key={s} className="tag">{s}</span>)}</div>
            <button className="btn btn-primary w-full">📧 Contact Partner</button>
          </div>
        </div>
      )}
    </div>
  );
}
