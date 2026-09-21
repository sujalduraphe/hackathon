import { useState } from 'react';
import { Search, Filter, ChevronRight, Eye, Star, Check, MessageCircle, GraduationCap } from 'lucide-react';
import { CANDIDATES } from '../../data/store';

const PIPELINE_STAGES = ['applied', 'shortlisted', 'assessment', 'interview', 'offered'];
const STAGE_LABELS = { applied: 'Applied', shortlisted: 'Shortlisted', assessment: 'Assessment', interview: 'Tech Interview', offered: 'Offered' };
const STAGE_COLORS = { applied: '#6366f1', shortlisted: '#f59e0b', assessment: '#06b6d4', interview: '#f43f5e', offered: '#10b981' };

export default function TalentDiscovery() {
  const [search, setSearch] = useState('');
  const [minMatch, setMinMatch] = useState(0);
  const [selected, setSelected] = useState(null);
  const [candidates, setCandidates] = useState(CANDIDATES);

  function moveStage(id, newStage) {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStage } : c));
  }

  const filtered = candidates
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.college.toLowerCase().includes(search.toLowerCase()) ||
        Object.keys(c.skills).some(s => s.toLowerCase().includes(search.toLowerCase()));
      return matchSearch && c.match >= minMatch;
    })
    .sort((a, b) => b.match - a.match);

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">🔍 Talent Discovery</h1>
        <p className="page-hero-subtitle">Find and shortlist top candidates from across universities. Filter by skills, CGPA, and match score.</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <Search size={14} className="search-icon" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidates, colleges, skills..." />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>Min Match:</span>
          {[0, 70, 80, 90].map(m => (
            <button key={m} className={`btn btn-sm ${minMatch === m ? 'btn-rose' : 'btn-ghost'}`} onClick={() => setMinMatch(m)}>
              {m === 0 ? 'All' : `${m}%+`}
            </button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
        {filtered.length} candidates found
      </div>

      {/* Candidate Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(c => (
          <div key={c.id} className="card" style={{ padding: 20, cursor: 'pointer' }} onClick={() => setSelected(c)}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div style={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${c.match >= 90 ? '#10b981' : c.match >= 75 ? '#6366f1' : '#f59e0b'}, ${c.match >= 90 ? '#059669' : c.match >= 75 ? '#4f46e5' : '#d97706'})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18,
                boxShadow: `0 0 20px ${c.match >= 90 ? 'rgba(16,185,129,0.3)' : c.match >= 75 ? 'rgba(99,102,241,0.3)' : 'rgba(245,158,11,0.3)'}`
              }}>{c.avatar}</div>

              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</span>
                  <span className={`badge ${c.status === 'offered' ? 'badge-emerald' : c.status === 'interview' ? 'badge-cyan' : c.status === 'shortlisted' ? 'badge-amber' : 'badge-gray'}`}>
                    {STAGE_LABELS[c.status]}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>
                  <GraduationCap size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {c.college} · {c.dept} · {c.year} Year · CGPA: <strong style={{ color: '#10b981' }}>{c.cgpa}</strong>
                </div>
                <div className="skill-tags">
                  {Object.entries(c.skills).map(([sk, v]) => (
                    <span key={sk} className="tag">{sk}: {v}%</span>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1,
                  color: c.match >= 90 ? '#10b981' : c.match >= 75 ? '#6366f1' : '#f59e0b'
                }}>{c.match}%</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>match score</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                  Assessment: <strong style={{ color: '#6366f1' }}>{c.assessmentScore}%</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={e => e.stopPropagation()}>
                <MessageCircle size={12} /> Message
              </button>
              {c.status === 'applied' && (
                <button className="btn btn-amber btn-sm" onClick={e => { e.stopPropagation(); moveStage(c.id, 'shortlisted'); }}>
                  <Star size={12} /> Shortlist
                </button>
              )}
              {c.status === 'shortlisted' && (
                <button className="btn btn-cyan btn-sm" onClick={e => { e.stopPropagation(); moveStage(c.id, 'assessment'); }}>
                  Send Assessment
                </button>
              )}
              {c.status === 'assessment' && (
                <button className="btn btn-rose btn-sm" onClick={e => { e.stopPropagation(); moveStage(c.id, 'interview'); }}>
                  Schedule Interview
                </button>
              )}
              {c.status === 'interview' && (
                <button className="btn btn-emerald btn-sm" onClick={e => { e.stopPropagation(); moveStage(c.id, 'offered'); }}>
                  <Check size={12} /> Make Offer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22
              }}>{selected.avatar}</div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{selected.name}</h2>
                <div style={{ color: '#9ca3af' }}>{selected.college} · {selected.dept}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <span className="badge badge-primary">CGPA: {selected.cgpa}</span>
                  <span className="badge badge-emerald">{selected.match}% match</span>
                  <span className="badge badge-amber">Assessment: {selected.assessmentScore}%</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>Skill Proficiency</div>
              {Object.entries(selected.skills).map(([sk, v]) => {
                const color = v >= 80 ? '#10b981' : v >= 65 ? '#f59e0b' : '#f43f5e';
                return (
                  <div key={sk} className="progress-container" style={{ marginBottom: 10 }}>
                    <div className="progress-label">
                      <span>{sk}</span>
                      <span style={{ color, fontWeight: 600 }}>{v}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${v}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Current Stage</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {PIPELINE_STAGES.map((s, i) => (
                  <div key={s} style={{
                    flex: 1, textAlign: 'center', padding: '6px 4px',
                    borderRadius: 6, fontSize: 10, fontWeight: 600,
                    background: selected.status === s ? `${STAGE_COLORS[s]}22` : 'rgba(255,255,255,0.04)',
                    color: selected.status === s ? STAGE_COLORS[s] : 'rgba(255,255,255,0.2)',
                    border: selected.status === s ? `1px solid ${STAGE_COLORS[s]}44` : '1px solid rgba(255,255,255,0.06)'
                  }}>
                    {STAGE_LABELS[s]}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }}>
                <MessageCircle size={14} /> Message Candidate
              </button>
              <button className="btn btn-rose" style={{ flex: 1 }}>
                <Eye size={14} /> View Full Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
