import { useState } from 'react';
import { Search, MapPin, Clock, DollarSign, Users, Filter, Bookmark, ChevronRight, X } from 'lucide-react';
import { JOBS, CURRENT_USER } from '../../data/store';

export default function InternshipsJobs() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [mode, setMode] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applied, setApplied] = useState(new Set([1, 3, 5]));
  const [saved, setSaved] = useState(new Set([2]));
  const user = CURRENT_USER.student;

  const filtered = JOBS.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'all' || j.category === category;
    const matchMode = mode === 'all' || j.mode.toLowerCase().includes(mode.toLowerCase());
    return matchSearch && matchCat && matchMode;
  }).sort((a, b) => b.match - a.match);

  function applyJob(id) {
    setApplied(prev => new Set([...prev, id]));
    setSelectedJob(null);
  }

  function toggleSave(id) {
    setSaved(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">💼 Internships & Jobs</h1>
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
        {filtered.length} opportunities found · Sorted by match score
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
              <div className="company-logo" style={{ background: `${job.color}22`, fontSize: 24 }}>{job.logo}</div>
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
              {job.skills.map(s => <span key={s} className="tag">{s}</span>)}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {applied.has(job.id) ? (
                <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 13, color: '#10b981', fontWeight: 600 }}>
                  ✅ Applied
                </div>
              ) : (
                <button className="btn btn-sm btn-primary" style={{ flex: 1 }} onClick={e => { e.stopPropagation(); setSelectedJob(job); }}>
                  Apply Now
                </button>
              )}
              <button
                className={`btn btn-sm ${saved.has(job.id) ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width: 36, padding: 0, justifyContent: 'center' }}
                onClick={e => { e.stopPropagation(); toggleSave(job.id); }}
              >
                <Bookmark size={14} fill={saved.has(job.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div style={{ fontSize: 11, color: '#d1d5db', marginTop: 10 }}>
              Deadline: {job.deadline} · Min CGPA: {job.minCGPA} · {job.openings} openings
            </div>
          </div>
        ))}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="company-logo" style={{ background: `${selectedJob.color}22`, fontSize: 28, width: 56, height: 56 }}>
                  {selectedJob.logo}
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
                ['📍 Location', selectedJob.location],
                ['💰 Stipend', selectedJob.stipend],
                ['⏱️ Duration', selectedJob.duration],
                ['👥 Openings', `${selectedJob.openings} positions`],
                ['📅 Deadline', selectedJob.deadline],
                ['🎓 Min CGPA', selectedJob.minCGPA],
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

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Required Skills</div>
              <div className="skill-tags">
                {selectedJob.skills.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {applied.has(selectedJob.id) ? (
                <div style={{
                  flex: 1, textAlign: 'center', padding: '14px',
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 12, fontSize: 15, color: '#10b981', fontWeight: 700
                }}>✅ Application Submitted</div>
              ) : (
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => applyJob(selectedJob.id)}>
                  Apply Now <ChevronRight size={16} />
                </button>
              )}
              <button
                className={`btn ${saved.has(selectedJob.id) ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '14px 20px' }}
                onClick={() => toggleSave(selectedJob.id)}
              >
                <Bookmark size={16} fill={saved.has(selectedJob.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
