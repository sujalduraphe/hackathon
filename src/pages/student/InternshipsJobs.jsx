import { useState } from 'react';
import { Search, MapPin, Clock, DollarSign, Users, ChevronRight, X } from 'lucide-react';
import { useAppState } from '../../state/AppState';
import { explainMatch } from '../../lib/matching';

const STATUS_STYLE = {
  strong: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Meets bar' },
  partial: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Below bar' },
  missing: { color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', label: 'Missing' },
};

function MatchBreakdown({ m, onNavigate }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Why {m.score}% match?</div>
      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
        Each required skill scores your level ÷ the {m.target}% level the employer asks for (capped at 100%). The match is the average.
      </div>
      {m.breakdown.map(b => {
        const st = STATUS_STYLE[b.status];
        return (
          <div key={b.skill} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ width: 130, fontSize: 13, fontWeight: 600 }}>{b.skill}</span>
            <div className="progress-track" style={{ flex: 1 }}>
              <div className="progress-fill" style={{ width: `${Math.round(b.readiness * 100)}%`, background: st.color }} />
            </div>
            <span style={{ width: 88, fontSize: 12, color: '#6b7280', textAlign: 'right' }}>{b.level}% / {b.target}%</span>
            <span style={{ width: 78, fontSize: 11, fontWeight: 600, color: st.color, background: st.bg, borderRadius: 10, padding: '2px 8px', textAlign: 'center' }}>{st.label}</span>
          </div>
        );
      })}
      {!m.eligible && (
        <div style={{ marginTop: 10, fontSize: 13, color: '#f43f5e' }}>{m.reasons[m.reasons.length - 1]}</div>
      )}
      {(m.partial.length > 0 || m.missing.length > 0) && (
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => onNavigate?.('learning')}>
          Close the gap in {[...m.missing, ...m.partial].map(b => b.skill).slice(0, 3).join(', ')} →
        </button>
      )}
    </div>
  );
}

export default function InternshipsJobs({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [mode, setMode] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const { jobs, profile, applications, apply } = useAppState();
  const applied = new Set(applications.map(a => a.jobId));
  const [applyError, setApplyError] = useState('');
  const [applying, setApplying] = useState(false);

  const filtered = jobs.map(j => {
    const m = explainMatch(profile.skills, j, profile.cgpa);
    return { ...j, match: m.score, m };
  }).filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'all' || j.category === category;
    const matchMode = mode === 'all' || j.mode.toLowerCase().includes(mode.toLowerCase());
    return matchSearch && matchCat && matchMode;
  }).sort((a, b) => (b.m.eligible - a.m.eligible) || b.match - a.match);

  async function applyJob(id) {
    setApplyError('');
    setApplying(true);
    try {
      await apply(id);
      setSelectedJob(null);
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplying(false);
    }
  }


  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">Internships & Jobs</h1>
        <p className="page-hero-subtitle">Curated opportunities matched to your skill profile. Apply with 1 click.</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <Search size={14} className="search-icon" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by role, company, or skill..." />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all', 'All'], ['internship', 'Internships'], ['fulltime', 'Full-Time'], ['research', 'Research']].map(([val, label]) => (
            <button key={val} className={`btn btn-sm ${category === val ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setCategory(val)}>{label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all', 'Any Mode'], ['remote', 'Remote'], ['hybrid', 'Hybrid'], ['on-site', 'On-site']].map(([val, label]) => (
            <button key={val} className={`btn btn-sm ${mode === val ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode(val)}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
        {filtered.length} opportunities found · Ranked by live match against your current skill profile
      </div>

      <div className="grid-auto">
        {filtered.map(job => (
          <div key={job.id} className="job-card" onClick={() => setSelectedJob(job)}>
            {/* Match badge */}
            <div style={{
              position: 'absolute', top: 16, right: 16,
              background: job.match >= 80 ? 'rgba(16,185,129,0.15)' : job.match >= 65 ? 'rgba(245,158,11,0.15)' : 'rgba(244,63,94,0.1)',
              border: `1px solid ${job.match >= 80 ? 'rgba(16,185,129,0.3)' : job.match >= 65 ? 'rgba(245,158,11,0.3)' : 'rgba(244,63,94,0.2)'}`,
              borderRadius: 20, padding: '3px 10px',
              fontSize: 12, fontWeight: 700,
              color: job.match >= 80 ? '#10b981' : job.match >= 65 ? '#f59e0b' : '#f43f5e'
            }}>
              {job.match}% match
            </div>

            <div className="job-card-header">
              <div className="company-logo" style={{ background: '#111111', color: '#ffffff', fontSize: 18, fontWeight: 700 }}>{job.company[0]}</div>
              <div style={{ flex: 1, paddingRight: 70 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{job.title}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{job.company}</div>
              </div>
            </div>

            <div className="job-card-meta">
              <span className="job-meta-item"><MapPin size={11} />{job.location}</span>
              <span className="job-meta-item"><Clock size={11} />{job.duration}</span>
              <span className="job-meta-item"><DollarSign size={11} />{job.stipend}</span>
              <span className="job-meta-item"><Users size={11} />{job.applicants} applicants</span>
            </div>

            <div style={{ margin: '14px 0' }}>
              <span className={`badge ${job.type === 'Internship' ? 'badge-primary' : job.type === 'Full-Time' ? 'badge-emerald' : 'badge-amber'}`}>
                {job.type}
              </span>
              <span className="badge badge-gray" style={{ marginLeft: 6 }}>{job.mode}</span>
            </div>

            <div className="skill-tags">
              {job.m.breakdown.map(b => (
                <span key={b.skill} className="tag" style={{ color: STATUS_STYLE[b.status].color, borderColor: STATUS_STYLE[b.status].color + '55', background: STATUS_STYLE[b.status].bg }}>
                  {b.status === 'strong' ? '✓' : b.status === 'partial' ? '◐' : '✗'} {b.skill}
                </span>
              ))}
            </div>
            {!job.m.eligible && (
              <div style={{ fontSize: 12, color: '#f43f5e', marginTop: 8 }}>Not eligible: min CGPA {job.minCGPA}</div>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {applied.has(job.id) ? (
                <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 13, color: '#10b981', fontWeight: 600 }}>
                  Applied
                </div>
              ) : (
                <button className="btn btn-sm btn-primary" style={{ flex: 1 }} onClick={e => { e.stopPropagation(); setSelectedJob(job); }}>
                  Apply Now
                </button>
              )}

            </div>

            <div style={{ fontSize: 11, color: '#d1d5db', marginTop: 10 }}>
              Deadline: {job.deadline} · Min CGPA: {job.minCGPA} · {job.openings} openings
            </div>
          </div>
        ))}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => { setSelectedJob(null); setApplyError(''); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="company-logo" style={{ background: '#111111', color: '#ffffff', fontSize: 18, fontWeight: 700, width: 56, height: 56 }}>
                  {selectedJob.company[0]}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{selectedJob.title}</div>
                  <div style={{ color: '#6b7280' }}>{selectedJob.company}</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelectedJob(null)}><X size={16} /></button>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
              <span className="badge badge-primary">{selectedJob.type}</span>
              <span className="badge badge-gray">{selectedJob.mode}</span>
              <span className={`badge ${selectedJob.match >= 80 ? 'badge-emerald' : 'badge-amber'}`}>{selectedJob.match}% match</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                ['Location', selectedJob.location],
                ['Stipend', selectedJob.stipend],
                ['Duration', selectedJob.duration],
                ['Openings', `${selectedJob.openings} positions`],
                ['Deadline', selectedJob.deadline],
                ['Min CGPA', selectedJob.minCGPA],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>About the Role</div>
              <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>{selectedJob.description}</p>
            </div>

            <MatchBreakdown m={selectedJob.m} onNavigate={onNavigate} />
            {applyError && <div className="auth-error" role="alert">{applyError}</div>}

            <div style={{ display: 'flex', gap: 10 }}>
              {applied.has(selectedJob.id) ? (
                <div style={{
                  flex: 1, textAlign: 'center', padding: '14px',
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 12, fontSize: 15, color: '#10b981', fontWeight: 700
                }}>Application Submitted</div>
              ) : (
                <button className="btn btn-primary btn-lg" style={{ flex: 1, opacity: selectedJob.m.eligible ? 1 : 0.5 }} disabled={!selectedJob.m.eligible || applying} onClick={() => applyJob(selectedJob.id)}>
                  Apply Now <ChevronRight size={16} />
                </button>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
