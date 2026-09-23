import { useState } from 'react';
import { Calendar, Users, Clock, MapPin, ChevronRight, X, Check, Mic, Plus, Video, ExternalLink } from 'lucide-react';

const GUEST_LECTURES = [
  {
    id: 1, title: 'Future of Generative AI in Enterprise', speaker: 'Dr. Karan Desai',
    company: 'NVIDIA India', icon: '🎤', color: '#76b900',
    date: '2026-09-25', time: '3:00 PM - 5:00 PM', mode: 'Virtual',
    seats: 200, registered: 187, topic: 'AI/ML',
    description: 'Expert session on deploying LLMs in enterprise workflows, RAG architectures, and NVIDIA NIM platform. Learn how leading companies are integrating generative AI into production systems.',
    tags: ['Generative AI', 'LLMs', 'Enterprise AI', 'CUDA'],
    recording: false
  },
  {
    id: 2, title: 'Building Scalable Systems at Google', speaker: 'Anjali Verma',
    company: 'Google', icon: '🌐', color: '#4285f4',
    date: '2026-10-05', time: '2:00 PM - 4:00 PM', mode: 'Hybrid',
    seats: 150, registered: 89, topic: 'System Design',
    description: 'Deep dive into how Google designs systems that handle billions of requests. Covers load balancing, sharding, caching strategies, and real-world case studies from YouTube and Gmail.',
    tags: ['System Design', 'Distributed Systems', 'Cloud Architecture'],
    recording: true
  },
  {
    id: 3, title: 'Cybersecurity in the Age of AI', speaker: 'Maj. Gen. Ravi Shankar (Retd.)',
    company: 'DRDO / Cyber Command', icon: '🛡️', color: '#ef4444',
    date: '2026-10-12', time: '10:00 AM - 12:00 PM', mode: 'On-site',
    seats: 100, registered: 45, topic: 'Cybersecurity',
    description: 'Understanding emerging cyber threats in AI-driven warfare, quantum computing impacts on cryptography, and India\'s national cybersecurity framework.',
    tags: ['Cybersecurity', 'AI Security', 'Quantum Computing'],
    recording: false
  },
  {
    id: 4, title: 'Product Management for Engineers', speaker: 'Neha Kapoor',
    company: 'Razorpay', icon: '📦', color: '#3395ff',
    date: '2026-10-18', time: '4:00 PM - 5:30 PM', mode: 'Virtual',
    seats: 300, registered: 210, topic: 'Product Management',
    description: 'How to think like a PM as an engineer. Covers user research, roadmap prioritization, metrics-driven development, and cross-functional collaboration at a fintech startup.',
    tags: ['Product Management', 'Fintech', 'Career Skills'],
    recording: true
  },
  {
    id: 5, title: 'Open Source Contributions & Career Growth', speaker: 'Tanay Pratap',
    company: 'Microsoft (Ex)', icon: '🐙', color: '#8b5cf6',
    date: '2026-10-22', time: '11:00 AM - 1:00 PM', mode: 'Virtual',
    seats: 500, registered: 342, topic: 'Career',
    description: 'How contributing to open source projects accelerates your career. Real stories from maintainers of React, Kubernetes, and Linux kernel. Includes live demo of making your first PR.',
    tags: ['Open Source', 'GitHub', 'Career Growth'],
    recording: true
  },
  {
    id: 6, title: 'Research to Startup: Commercializing Academic Work', speaker: 'Dr. Prateek Jain',
    company: 'IISc Bangalore & DeepTech Ventures', icon: '🚀', color: '#f59e0b',
    date: '2026-11-01', time: '2:00 PM - 4:00 PM', mode: 'Hybrid',
    seats: 80, registered: 23, topic: 'Entrepreneurship',
    description: 'Bridge the gap between research papers and viable startups. Covers IP protection, grant applications, incubators, and case studies of successful deep-tech spinoffs from Indian universities.',
    tags: ['Entrepreneurship', 'Research', 'Deep Tech', 'IP'],
    recording: false
  }
];

const PAST_LECTURES = [
  { title: 'Blockchain in Supply Chain', speaker: 'Amit Shah', company: 'IBM', date: '2026-08-15', attendees: 145, recording: true },
  { title: 'ML Ops Best Practices', speaker: 'Shreya Joshi', company: 'Amazon', date: '2026-07-20', attendees: 198, recording: true },
  { title: 'Ethics in AI Development', speaker: 'Prof. Raj Reddy', company: 'CMU / IIIT-H', date: '2026-06-10', attendees: 210, recording: false },
];

export default function GuestLectures() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [registered, setRegistered] = useState(new Set([1]));
  const [showPropose, setShowPropose] = useState(false);
  const [tab, setTab] = useState('upcoming');

  const topics = ['all', 'AI/ML', 'System Design', 'Cybersecurity', 'Career', 'Entrepreneurship'];
  const filtered = GUEST_LECTURES.filter(l => filter === 'all' || l.topic === filter);

  function handleRegister(id) {
    setRegistered(prev => new Set([...prev, id]));
    setSelected(null);
  }

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">🎤 Guest Lectures & Knowledge Exchange</h1>
        <p className="page-hero-subtitle">
          Industry experts share insights on cutting-edge topics. Attend, learn, and propose lectures for your department.
        </p>
      </div>

      {/* Tab Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button className={`btn btn-sm ${tab === 'upcoming' ? 'btn-amber' : 'btn-ghost'}`} onClick={() => setTab('upcoming')}>
          <Mic size={14} /> Upcoming Lectures
        </button>
        <button className={`btn btn-sm ${tab === 'past' ? 'btn-amber' : 'btn-ghost'}`} onClick={() => setTab('past')}>
          <Video size={14} /> Past Recordings
        </button>
        <button className="btn btn-sm btn-ghost" style={{ marginLeft: 'auto' }} onClick={() => setShowPropose(true)}>
          <Plus size={14} /> Propose a Lecture
        </button>
      </div>

      {tab === 'upcoming' && (
        <>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
            {topics.map(t => (
              <button key={t} className={`btn btn-sm ${filter === t ? 'btn-amber' : 'btn-ghost'}`} onClick={() => setFilter(t)}>
                {t === 'all' ? 'All Topics' : t}
              </button>
            ))}
          </div>

          <div className="grid-auto">
            {filtered.map(lecture => {
              const isReg = registered.has(lecture.id);
              const pctFull = Math.round((lecture.registered / lecture.seats) * 100);
              const daysLeft = Math.max(0, Math.ceil((new Date(lecture.date) - new Date()) / 86400000));

              return (
                <div key={lecture.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(lecture)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span className="badge badge-amber">{lecture.topic}</span>
                    {isReg && <span className="verified-badge"><Check size={10} /> Registered</span>}
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                    <div style={{
                      width: 48, height: 48, background: `${lecture.color}22`, borderRadius: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0
                    }}>{lecture.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{lecture.title}</div>
                      <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{lecture.speaker} · {lecture.company}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 14 }}>
                    {lecture.description.slice(0, 100)}...
                  </p>

                  <div className="job-card-meta" style={{ marginBottom: 12 }}>
                    <span className="job-meta-item"><Calendar size={11} />{lecture.date}</span>
                    <span className="job-meta-item"><Clock size={11} />{lecture.time}</span>
                    <span className="job-meta-item"><MapPin size={11} />{lecture.mode}</span>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
                      <span>{lecture.registered}/{lecture.seats} registered</span>
                      <span>{daysLeft} days left</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill progress-amber" style={{ width: `${pctFull}%` }} />
                    </div>
                  </div>

                  <div className="skill-tags" style={{ marginBottom: 14 }}>
                    {lecture.tags.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {lecture.recording && <span className="tag" style={{ fontSize: 10 }}>📹 Recording</span>}
                    </div>
                    <button
                      className={`btn btn-sm ${isReg ? 'btn-ghost' : 'btn-amber'}`}
                      onClick={e => { e.stopPropagation(); if (!isReg) handleRegister(lecture.id); }}
                    >
                      {isReg ? '✅ Registered' : 'Register →'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'past' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PAST_LECTURES.map((l, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(245,158,11,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
              }}>🎬</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{l.title}</div>
                <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{l.speaker} · {l.company} · {l.date}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{l.attendees} attended</div>
              </div>
              {l.recording ? (
                <button className="btn btn-sm btn-amber"><Video size={12} /> Watch Recording</button>
              ) : (
                <span style={{ fontSize: 12, color: '#9ca3af' }}>No recording</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ fontSize: 36 }}>{selected.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{selected.title}</div>
                  <div style={{ color: '#9ca3af', fontSize: 14 }}>{selected.speaker} · {selected.company}</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={16} /></button>
            </div>

            <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, marginBottom: 20 }}>{selected.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                ['📅 Date', selected.date], ['⏱️ Time', selected.time],
                ['📍 Mode', selected.mode], ['🪑 Seats', `${selected.seats - selected.registered} remaining`],
                ['📹 Recording', selected.recording ? 'Will be shared' : 'Not available'],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Topics Covered</div>
              <div className="skill-tags">
                {selected.tags.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>

            {registered.has(selected.id) ? (
              <div style={{ textAlign: 'center', padding: 16, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, color: '#10b981', fontWeight: 700 }}>
                ✅ You are registered for this lecture
              </div>
            ) : (
              <button className="btn btn-amber btn-lg w-full" onClick={() => handleRegister(selected.id)}>
                Register Now <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Propose Lecture Modal */}
      {showPropose && (
        <div className="modal-overlay" onClick={() => setShowPropose(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontWeight: 700, fontSize: 20 }}>📝 Propose a Guest Lecture</div>
              <button className="modal-close" onClick={() => setShowPropose(false)}><X size={16} /></button>
            </div>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
              Suggest a guest lecture topic or invite an industry expert to speak at your department.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Lecture Title', placeholder: 'e.g., Introduction to Quantum Computing' },
                { label: 'Suggested Speaker (optional)', placeholder: 'e.g., Dr. John Doe, Google' },
                { label: 'Topic / Domain', placeholder: 'e.g., AI/ML, Cybersecurity, Career' },
                { label: 'Preferred Date', placeholder: 'e.g., October 2026', type: 'date' },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>{f.label}</div>
                  <input type={f.type || 'text'} placeholder={f.placeholder} className="input" style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    border: '1px solid #e5e7eb', fontSize: 14, background: '#fafafa'
                  }} />
                </div>
              ))}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Why this lecture?</div>
                <textarea placeholder="Briefly explain why this lecture would benefit faculty and students..." rows={3} style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  border: '1px solid #e5e7eb', fontSize: 14, resize: 'vertical', background: '#fafafa'
                }} />
              </div>
              <button className="btn btn-amber btn-lg w-full" onClick={() => setShowPropose(false)}>
                Submit Proposal <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
