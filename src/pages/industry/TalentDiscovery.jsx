import { useState } from 'react';
import { Search, Star, Check, X, GraduationCap, Send } from 'lucide-react';
import { useAppState, APPLICATION_STAGES, STAGE_LABELS, STAGE_COLORS } from '../../state/AppState';
import { rankCandidates, matchTier, TIER_COLOR } from '../../lib/matching';

const NEXT_ACTION = {
  applied: { to: 'shortlisted', label: 'Shortlist', icon: Star, cls: 'btn-amber' },
  shortlisted: { to: 'assessment', label: 'Send Assessment', icon: Send, cls: 'btn-cyan' },
  assessment: { to: 'interview', label: 'Schedule Interview', icon: null, cls: 'btn-rose' },
  interview: { to: 'offered', label: 'Make Offer', icon: Check, cls: 'btn-emerald' },
};

const STATUS_COLOR = { strong: '#10b981', partial: '#f59e0b', missing: '#f43f5e' };

export default function TalentDiscovery() {
  const { jobs, candidates, applications, setApplicationStatus, openResume } = useAppState();
  const [jobId, setJobId] = useState(jobs[0]?.id);
  const [tab, setTab] = useState('applicants');
  const [search, setSearch] = useState('');
  const [minMatch, setMinMatch] = useState(0);
  const [selectedId, setSelectedId] = useState(null);

  const [actionError, setActionError] = useState('');
  const job = jobs.find(j => j.id === jobId) || jobs[0];

  async function move(appId, status) {
    setActionError('');
    try { await setApplicationStatus(appId, status); } catch (err) { setActionError(err.message); }
  }

  if (!job) {
    return (
      <div className="animate-fade-in">
        <div className="page-hero">
          <h1 className="page-hero-title">Talent Discovery</h1>
          <p className="page-hero-subtitle">Candidates are ranked against one of your postings.</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
          You haven't posted any opportunities yet. Post one to see ranked candidates.
        </div>
      </div>
    );
  }

  const jobApps = applications.filter(a => a.jobId === job.id);
  const appByCandidate = Object.fromEntries(jobApps.map(a => [a.candidateId, a]));

  const ranked = rankCandidates(candidates, job)
    .map(c => ({ ...c, application: appByCandidate[c.id] }))
    .filter(c => (tab === 'applicants' ? c.application : !c.application))
    .filter(c => {
      const q = search.toLowerCase();
      const matchSearch = c.name.toLowerCase().includes(q) ||
        (c.college || '').toLowerCase().includes(q) ||
        Object.keys(c.skills).some(s => s.toLowerCase().includes(q));
      return matchSearch && c.match.score >= minMatch;
    });

  const selected = ranked.find(c => c.id === selectedId);
  const applicantCount = jobApps.length;

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">Talent Discovery</h1>
        <p className="page-hero-subtitle">Candidates ranked by verified skill match for a specific opening, with the reason for every score.</p>
      </div>

      {/* Job selector */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <label className="form-label">Ranking candidates for</label>
          <select className="form-select" value={job.id} onChange={e => { setJobId(e.target.value); setSelectedId(null); }}>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>{j.title} ({j.applicants || 0} applicants)</option>
            ))}
          </select>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280' }}>
          Requires: {job.skills.join(', ')} at {job.minSkillLevel || 60}%+{job.minCGPA ? ` · CGPA ≥ ${job.minCGPA}` : ''}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className={`btn btn-sm ${tab === 'applicants' ? 'btn-rose' : 'btn-ghost'}`} onClick={() => setTab('applicants')}>
            Applicants ({applicantCount})
          </button>
          <button className={`btn btn-sm ${tab === 'recommended' ? 'btn-rose' : 'btn-ghost'}`} onClick={() => setTab('recommended')}>
            Recommended, not applied ({candidates.length - applicantCount})
          </button>
        </div>
        <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
          <Search size={14} className="search-icon" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidates, colleges, skills..." />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>Min Match:</span>
          {[0, 60, 80].map(m => (
            <button key={m} className={`btn btn-sm ${minMatch === m ? 'btn-rose' : 'btn-ghost'}`} onClick={() => setMinMatch(m)}>
              {m === 0 ? 'All' : `${m}%+`}
            </button>
          ))}
        </div>
      </div>

      {actionError && <div className="auth-error" role="alert">{actionError}</div>}
      {ranked.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
          {tab === 'applicants' ? 'No applicants match these filters yet.' : 'Every candidate in the pool has already applied.'}
        </div>
      )}

      {/* Candidate Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ranked.map((c, rank) => {
          const color = TIER_COLOR[matchTier(c.match.score)];
          const app = c.application;
          const next = app && NEXT_ACTION[app.status];
          return (
            <div key={c.id} className="card" style={{ padding: 20, cursor: 'pointer' }} onClick={() => setSelectedId(c.id)}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', flexShrink: 0, color: 'white',
                  background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18
                }}>{c.avatar}</div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>#{rank + 1}</span>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</span>
                    {app && (
                      <span className="badge" style={{ background: `${STAGE_COLORS[app.status]}22`, color: STAGE_COLORS[app.status] }}>
                        {STAGE_LABELS[app.status]}
                      </span>
                    )}
                    {!c.match.eligible && <span className="badge badge-rose">Below CGPA cut-off</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>
                    <GraduationCap size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {c.college} · {c.dept} · {c.year} Year · CGPA: <strong style={{ color: '#10b981' }}>{c.cgpa}</strong>
                  </div>
                  <div className="skill-tags">
                    {c.match.breakdown.map(b => (
                      <span key={b.skill} className="tag" style={{ color: STATUS_COLOR[b.status], borderColor: STATUS_COLOR[b.status] + '55' }}>
                        {b.skill}: {b.level}%
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1, color }}>{c.match.score}%</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>skill match</div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 10 }}>{c.match.reasons.join(' · ')}</div>

              <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
                {app && app.status !== 'offered' && app.status !== 'rejected' && (
                  <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); move(app.id, 'rejected'); }}>
                    <X size={12} /> Reject
                  </button>
                )}
                {next && (
                  <button className={`btn ${next.cls} btn-sm`} onClick={e => { e.stopPropagation(); move(app.id, next.to); }}>
                    {next.icon && <next.icon size={12} />} {next.label}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelectedId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', color: 'white',
                background: TIER_COLOR[matchTier(selected.match.score)],
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22
              }}>{selected.avatar}</div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{selected.name}</h2>
                <div style={{ color: '#9ca3af' }}>{selected.college} · {selected.dept}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <span className="badge badge-primary">CGPA: {selected.cgpa}</span>
                  <span className="badge badge-emerald">{selected.match.score}% match for {job.title}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Match breakdown</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10 }}>
                Candidate level ÷ required level ({selected.match.target}%) per skill, capped at 100%, averaged.
              </div>
              {selected.match.breakdown.map(b => (
                <div key={b.skill} className="progress-container" style={{ marginBottom: 10 }}>
                  <div className="progress-label">
                    <span>{b.skill}</span>
                    <span style={{ color: STATUS_COLOR[b.status], fontWeight: 600 }}>{b.level}% / {b.target}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.round(b.readiness * 100)}%`, background: STATUS_COLOR[b.status] }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Other skills on profile</div>
              <div className="skill-tags">
                {Object.entries(selected.skills)
                  .filter(([sk]) => !job.skills.includes(sk))
                  .map(([sk, v]) => <span key={sk} className="tag">{sk}: {v}%</span>)}
              </div>
            </div>

            {selected.application && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Current Stage</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {APPLICATION_STAGES.map(s => {
                    const active = selected.application.status === s;
                    return (
                      <div key={s} style={{
                        flex: 1, textAlign: 'center', padding: '6px 4px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                        background: active ? `${STAGE_COLORS[s]}22` : '#f9fafb',
                        color: active ? STAGE_COLORS[s] : '#9ca3af',
                        border: `1px solid ${active ? STAGE_COLORS[s] + '44' : '#e5e7eb'}`
                      }}>
                        {STAGE_LABELS[s]}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              {selected.resume && (
                <button className="btn btn-primary" style={{ flex: 1 }}
                  onClick={() => openResume(selected.id).catch(err => setActionError(err.message))}>
                  View resume
                </button>
              )}
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSelectedId(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
