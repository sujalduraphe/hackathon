import { useState } from 'react';
import { Calendar, Users, Clock, MapPin, ChevronRight, X, Check, Beaker, Handshake, DollarSign, FileText } from 'lucide-react';

const RESEARCH_PROJECTS = [
  {
    id: 1, title: 'NLP for Indian Languages', partner: 'Infosys Labs & IIT Bombay',
    icon: '🧪', color: '#0d47a1', type: 'Joint Research',
    duration: '1 Year', mode: 'Collaborative', startDate: '2026-10-15',
    spots: 5, filled: 2, funding: '₹3,00,000/year',
    description: 'Research partnership to build multilingual NLP models for 22 scheduled Indian languages using transformer architectures. Includes access to proprietary datasets and compute clusters.',
    skills: ['NLP', 'Transformers', 'Python', 'Deep Learning'],
    deliverables: ['Research Paper (A* venue)', 'Open-source NLP toolkit', 'Multilingual dataset'],
    status: 'accepting'
  },
  {
    id: 2, title: 'Smart Grid Optimization using Reinforcement Learning', partner: 'NTPC Limited',
    icon: '⚡', color: '#1a73e8', type: 'Industry R&D',
    duration: '6 Months', mode: 'Hybrid', startDate: '2026-11-01',
    spots: 3, filled: 1, funding: '₹1,50,000 (Project)',
    description: 'Develop AI-based optimization algorithms for renewable energy load balancing in smart grid infrastructure. Real-world deployment at NTPC Dadri plant.',
    skills: ['Reinforcement Learning', 'Optimization', 'MATLAB', 'Power Systems'],
    deliverables: ['Optimization Algorithm', 'Simulation Results', 'Technical Report'],
    status: 'accepting'
  },
  {
    id: 3, title: 'Computer Vision for Medical Imaging', partner: 'Manipal Hospitals & IISC',
    icon: '🏥', color: '#10b981', type: 'Joint Research',
    duration: '2 Years', mode: 'Collaborative', startDate: '2026-09-01',
    spots: 4, filled: 3, funding: '₹5,00,000/year (DST Grant)',
    description: 'Build deep learning models for early detection of retinal diseases from fundus images. Access to 50,000+ anonymized patient images. IRB approved.',
    skills: ['Computer Vision', 'TensorFlow', 'Medical AI', 'Image Processing'],
    deliverables: ['Detection Model (>95% accuracy)', 'Clinical validation report', '2 Research Papers'],
    status: 'accepting'
  },
  {
    id: 4, title: 'Blockchain for Academic Credential Verification', partner: 'Polygon & AICTE',
    icon: '🔗', color: '#8b5cf6', type: 'Innovation Project',
    duration: '8 Months', mode: 'Remote', startDate: '2026-12-01',
    spots: 6, filled: 0, funding: '₹2,00,000 (AICTE Grant)',
    description: 'Design and prototype a blockchain-based system for tamper-proof academic credential verification across Indian universities. Polygon zkEVM as the base layer.',
    skills: ['Blockchain', 'Solidity', 'Zero Knowledge Proofs', 'Node.js'],
    deliverables: ['Working Prototype', 'Technical Whitepaper', 'AICTE Pilot Report'],
    status: 'upcoming'
  },
  {
    id: 5, title: 'Edge AI for Precision Agriculture', partner: 'ISRO & IIT Kharagpur',
    icon: '🌾', color: '#f59e0b', type: 'Joint Research',
    duration: '18 Months', mode: 'Hybrid', startDate: '2026-10-01',
    spots: 4, filled: 2, funding: '₹4,00,000/year (ISRO Funding)',
    description: 'Deploy lightweight AI models on edge devices for crop health monitoring using satellite + drone imagery. Field testing in 5 districts across Maharashtra and Karnataka.',
    skills: ['Edge Computing', 'Computer Vision', 'IoT', 'TinyML'],
    deliverables: ['Edge inference pipeline', 'Crop health dataset', '1 Journal Paper'],
    status: 'accepting'
  }
];

export default function ResearchCollaboration() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [applied, setApplied] = useState(new Set([3]));

  const types = ['all', 'Joint Research', 'Industry R&D', 'Innovation Project'];
  const filtered = RESEARCH_PROJECTS.filter(p => filter === 'all' || p.type === filter);

  function handleApply(id) {
    setApplied(prev => new Set([...prev, id]));
    setSelected(null);
  }

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">🔬 Research & Collaboration</h1>
        <p className="page-hero-subtitle">
          Joint research projects, industry R&D partnerships, and innovation collaborations between academia and industry.
        </p>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 28 }}>
        {[
          { label: 'Active Projects', value: '5', icon: '🔬', color: '#6366f1' },
          { label: 'Industry Partners', value: '8', icon: '🤝', color: '#10b981' },
          { label: 'Total Funding', value: '₹18.5L', icon: '💰', color: '#f59e0b' },
          { label: 'Publications', value: '12', icon: '📄', color: '#f43f5e' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 32 }}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {types.map(t => (
          <button key={t} className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(t)}>
            {t === 'all' ? 'All Projects' : t}
          </button>
        ))}
      </div>

      <div className="grid-auto">
        {filtered.map(project => {
          const isApplied = applied.has(project.id);
          const spotsLeft = project.spots - project.filled;

          return (
            <div key={project.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(project)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span className={`badge ${project.type === 'Joint Research' ? 'badge-primary' : project.type === 'Industry R&D' ? 'badge-cyan' : 'badge-amber'}`}>
                  {project.type}
                </span>
                {isApplied && <span className="verified-badge"><Check size={10} /> Applied</span>}
                {project.status === 'upcoming' && <span className="badge badge-gray">Upcoming</span>}
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 48, height: 48, background: `${project.color}22`, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0
                }}>{project.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{project.title}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{project.partner}</div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 14 }}>
                {project.description.slice(0, 110)}...
              </p>

              <div className="job-card-meta" style={{ marginBottom: 12 }}>
                <span className="job-meta-item"><Calendar size={11} />{project.startDate}</span>
                <span className="job-meta-item"><Clock size={11} />{project.duration}</span>
                <span className="job-meta-item"><Users size={11} />{spotsLeft} spots</span>
              </div>

              <div className="skill-tags" style={{ marginBottom: 14 }}>
                {project.skills.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>{project.funding}</span>
                <button
                  className={`btn btn-sm ${isApplied ? 'btn-ghost' : 'btn-primary'}`}
                  onClick={e => { e.stopPropagation(); if (!isApplied) handleApply(project.id); }}
                >
                  {isApplied ? '✅ Applied' : 'Express Interest →'}
                </button>
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
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ fontSize: 36 }}>{selected.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{selected.title}</div>
                  <div style={{ color: '#9ca3af', fontSize: 14 }}>{selected.partner}</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={16} /></button>
            </div>

            <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, marginBottom: 20 }}>{selected.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                ['📅 Start Date', selected.startDate], ['⏱️ Duration', selected.duration],
                ['📍 Mode', selected.mode], ['🪑 Spots', `${selected.spots - selected.filled} of ${selected.spots} remaining`],
                ['💰 Funding', selected.funding], ['📋 Type', selected.type]
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Required Expertise</div>
              <div className="skill-tags">
                {selected.skills.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Expected Deliverables</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selected.deliverables.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: '#4b5563' }}>
                    <FileText size={14} color="#6366f1" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {applied.has(selected.id) ? (
              <div style={{ textAlign: 'center', padding: 16, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, color: '#10b981', fontWeight: 700 }}>
                ✅ You have expressed interest in this project
              </div>
            ) : (
              <button className="btn btn-primary btn-lg w-full" onClick={() => handleApply(selected.id)}>
                Express Interest <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
