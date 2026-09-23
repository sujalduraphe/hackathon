import { useState } from 'react';
import { Calendar, Users, Award, ChevronRight, X, Check, Clock } from 'lucide-react';
import { FACULTY_PROGRAMS } from '../../data/store';

export default function FacultyPrograms() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [registered, setRegistered] = useState(new Set([3]));

  const types = ['all', 'FDP', 'Industrial Internship', 'Consultancy', 'Guest Lecture', 'R&D Project'];
  const filtered = FACULTY_PROGRAMS.filter(p => filter === 'all' || p.type === filter);

  function registerProg(id) {
    setRegistered(prev => new Set([...prev, id]));
    setSelected(null);
  }

  const typeColors = {
    'FDP': 'amber', 'Industrial Internship': 'emerald', 'Consultancy': 'primary',
    'Guest Lecture': 'rose', 'R&D Project': 'cyan'
  };

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">📚 Faculty Development Programs</h1>
        <p className="page-hero-subtitle">FDPs, industrial training, consultancy, guest lectures, and R&D collaborations curated for faculty.</p>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {types.map(t => (
          <button key={t} className={`btn btn-sm ${filter === t ? 'btn-amber' : 'btn-ghost'}`} onClick={() => setFilter(t)}>
            {t === 'all' ? 'All Programs' : t}
          </button>
        ))}
      </div>

      <div className="grid-auto">
        {filtered.map(prog => {
          const isReg = registered.has(prog.id);
          const pctFull = Math.round((prog.registered / prog.seats) * 100);
          const colorKey = typeColors[prog.type] || 'primary';

          return (
            <div key={prog.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(prog)}>
              {/* Top badges */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span className={`badge badge-${colorKey}`}>{prog.type}</span>
                {isReg && <span className="verified-badge"><Check size={10} /> Registered</span>}
              </div>

              {/* Icon + Title */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 48, height: 48, background: `${prog.color}22`, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0
                }}>
                  {prog.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{prog.title}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{prog.organizer}</div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 14 }}>
                {prog.description.slice(0, 100)}...
              </p>

              {/* Meta */}
              <div className="job-card-meta" style={{ marginBottom: 12 }}>
                <span className="job-meta-item"><Calendar size={11} />{prog.date}</span>
                <span className="job-meta-item"><Clock size={11} />{prog.duration}</span>
                <span className="job-meta-item"><Users size={11} />{prog.seats - prog.registered} left</span>
              </div>

              {/* Seat progress */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
                  <span>{prog.registered}/{prog.seats} registered</span>
                  <span>{pctFull}% full</span>
                </div>
                <div className="progress-track">
                  <div className={`progress-fill progress-${colorKey}`} style={{ width: `${pctFull}%` }} />
                </div>
              </div>

              <div className="skill-tags" style={{ marginBottom: 14 }}>
                {prog.skills.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>{prog.stipend}</span>
                <button
                  className={`btn btn-sm ${isReg ? 'btn-ghost' : 'btn-amber'}`}
                  onClick={e => { e.stopPropagation(); if (!isReg) registerProg(prog.id); }}
                >
                  {isReg ? '✅ Registered' : 'Register Now'}
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
                  <div style={{ color: '#9ca3af', fontSize: 14 }}>{selected.organizer}</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={16} /></button>
            </div>

            <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, marginBottom: 20 }}>{selected.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                ['📅 Date', selected.date], ['⏱️ Duration', selected.duration],
                ['📍 Mode', selected.mode], ['💰 Stipend', selected.stipend],
                ['🪑 Seats', `${selected.seats - selected.registered} remaining`],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Skills Covered</div>
              <div className="skill-tags">
                {selected.skills.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>

            {registered.has(selected.id) ? (
              <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, color: '#10b981', fontWeight: 700 }}>
                ✅ You are registered for this program
              </div>
            ) : (
              <button className="btn btn-amber btn-lg w-full" onClick={() => registerProg(selected.id)}>
                Register Now <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
