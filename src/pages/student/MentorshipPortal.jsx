import { useState } from 'react';
import { Calendar, Clock, Video, MapPin, Star, ChevronRight, CheckCircle, Plus, X, User } from 'lucide-react';

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const MENTORS = [
  { id: 1, name: 'Dr. Ramesh Babu', role: 'Faculty · Machine Learning', dept: 'CSE', avatar: 'RB', rating: 4.9, sessions: 42, specializations: ['Deep Learning', 'Computer Vision', 'Research Methodology'], availability: 'Mon, Wed, Fri', mode: 'Online', bio: 'Associate Professor with 12+ years of experience in AI/ML research. IEEE Senior Member, published 30+ papers.' },
  { id: 2, name: 'Rahul Nair', role: 'Senior SWE · Google', dept: 'Industry', avatar: 'RN', rating: 4.8, sessions: 28, specializations: ['System Design', 'Competitive Programming', 'SWE Interviews'], availability: 'Tue, Thu', mode: 'Online', bio: 'L5 at Google Bengaluru. Ex-Flipkart, ex-Zomato. IIT Delhi alumnus. Helps students crack top product interviews.' },
  { id: 3, name: 'Ananya Krishnan', role: 'Data Scientist · Microsoft', dept: 'Industry', avatar: 'AK', rating: 4.7, sessions: 19, specializations: ['ML Engineering', 'Python', 'Career Roadmap'], availability: 'Sat, Sun', mode: 'Online', bio: 'Data Scientist at Microsoft Research India. NIT alumna, passionate about bridging the student-industry gap.' },
  { id: 4, name: 'Prof. Sudha Murthy', role: 'Faculty · Web Technologies', dept: 'IT', avatar: 'SM', rating: 4.6, sessions: 35, specializations: ['Full Stack Dev', 'Node.js', 'Cloud', 'Agile'], availability: 'Mon-Fri', mode: 'Hybrid', bio: 'Professor with 8 years of industry experience before academia. Building real products is her teaching philosophy.' },
];

const MY_SESSIONS = [
  { mentor: 'Dr. Ramesh Babu', date: '2026-09-12', time: '10:00 AM', topic: 'Research Methodology & Paper Writing', status: 'upcoming', mode: 'Online' },
  { mentor: 'Rahul Nair', date: '2026-09-08', time: '02:00 PM', topic: 'Mock System Design Interview', status: 'upcoming', mode: 'Online' },
  { mentor: 'Ananya Krishnan', date: '2026-08-30', time: '11:00 AM', topic: 'ML Career Roadmap Review', status: 'completed', feedback: 'Great session! Very practical advice on MLOps and production pipelines.', rating: 5, mode: 'Online' },
];

export default function MentorshipPortal({ role = 'student' }) {
  const [view, setView] = useState('browse');
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState({ date: '', slot: '', topic: '' });
  const [booked, setBooked] = useState(false);
  const [sessions, setSessions] = useState(MY_SESSIONS);

  function handleBook(e) {
    e.preventDefault();
    if (!booking.date || !booking.slot || !booking.topic) return;
    setSessions(prev => [{
      mentor: selected.name, date: booking.date, time: booking.slot,
      topic: booking.topic, status: 'upcoming', mode: selected.mode
    }, ...prev]);
    setBooked(true);
    setTimeout(() => { setBooked(false); setSelected(null); setBooking({ date: '', slot: '', topic: '' }); setView('my-sessions'); }, 2000);
  }

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">🤝 Mentorship Portal</h1>
        <p className="page-hero-subtitle">Connect with faculty experts and industry professionals for 1-on-1 guidance sessions.</p>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 10, padding: 4, width: 'fit-content', marginBottom: 24 }}>
        {[['browse', '🔍 Find Mentors'], ['my-sessions', '📅 My Sessions']].map(([key, label]) => (
          <button key={key} className={`btn btn-sm ${view === key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView(key)} style={{ border: 'none' }}>{label}</button>
        ))}
      </div>

      {/* Browse Mentors */}
      {view === 'browse' && (
        <div className="grid-2">
          {MENTORS.map(mentor => (
            <div key={mentor.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(mentor)}>
              <div style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                  background: mentor.dept === 'Industry'
                    ? 'linear-gradient(135deg, #f43f5e, #e11d48)'
                    : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 18, color: 'white',
                  boxShadow: `0 4px 12px ${mentor.dept === 'Industry' ? 'rgba(244,63,94,0.25)' : 'rgba(99,102,241,0.25)'}`
                }}>{mentor.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 2 }}>{mentor.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{mentor.role}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>⭐ {mentor.rating}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{mentor.sessions} sessions</span>
                    <span className={`badge ${mentor.dept === 'Industry' ? 'badge-rose' : 'badge-primary'}`} style={{ fontSize: 10 }}>
                      {mentor.dept === 'Industry' ? '🏢 Industry' : '🎓 Faculty'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="skill-tags" style={{ marginBottom: 12 }}>
                {mentor.specializations.map(s => <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#9ca3af' }}>
                <span><Calendar size={11} style={{ display: 'inline', marginRight: 3 }} />{mentor.availability}</span>
                <span><Video size={11} style={{ display: 'inline', marginRight: 3 }} />{mentor.mode}</span>
              </div>
              <button className="btn btn-primary btn-sm w-full" style={{ marginTop: 14 }} onClick={e => { e.stopPropagation(); setSelected(mentor); }}>
                Book Session <ChevronRight size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* My Sessions */}
      {view === 'my-sessions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4 }}>{sessions.length} sessions total</div>
          {sessions.map((s, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 14, flexShrink: 0 }}>
                {s.mentor.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 2 }}>{s.topic}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>with {s.mentor}</div>
                <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 12, color: '#9ca3af' }}>
                  <span><Calendar size={11} style={{ display: 'inline', marginRight: 3 }} />{s.date}</span>
                  <span><Clock size={11} style={{ display: 'inline', marginRight: 3 }} />{s.time}</span>
                  <span><Video size={11} style={{ display: 'inline', marginRight: 3 }} />{s.mode}</span>
                </div>
                {s.feedback && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6, fontStyle: 'italic' }}>💬 "{s.feedback}"</div>}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span className={`badge ${s.status === 'upcoming' ? 'badge-primary' : 'badge-emerald'}`}>
                  {s.status === 'upcoming' ? '🟢 Upcoming' : '✅ Completed'}
                </span>
                {s.status === 'upcoming' && (
                  <div style={{ marginTop: 10 }}>
                    <button className="btn btn-primary btn-sm"><Video size={12} /> Join</button>
                  </div>
                )}
                {s.rating && <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 4, fontWeight: 600 }}>{'⭐'.repeat(s.rating)}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => { setSelected(null); setBooked(false); }}>
          <div className="modal-content" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            {booked ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 60 }}>🎉</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginTop: 14, color: '#111827' }}>Session Booked!</h3>
                <p style={{ color: '#6b7280', marginTop: 6 }}>Your session with <strong>{selected.name}</strong> on {booking.date} at {booking.slot} has been confirmed.</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <div style={{ fontWeight: 700, fontSize: 19, color: '#111827' }}>📅 Book a Session</div>
                  <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
                </div>
                {/* Mentor info */}
                <div style={{ display: 'flex', gap: 12, padding: '12px 16px', background: '#f9fafb', borderRadius: 12, marginBottom: 20, border: '1px solid #e8eaf0' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 14 }}>{selected.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#111827' }}>{selected.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{selected.role} · ⭐ {selected.rating}</div>
                  </div>
                </div>

                <form onSubmit={handleBook}>
                  <div className="form-group">
                    <label className="form-label">Preferred Date</label>
                    <input className="form-input" type="date" value={booking.date} onChange={e => setBooking(b => ({ ...b, date: e.target.value }))} required min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time Slot</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {TIME_SLOTS.map(slot => (
                        <button key={slot} type="button"
                          className={`btn btn-sm ${booking.slot === slot ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => setBooking(b => ({ ...b, slot }))}
                        >{slot}</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Topic / Questions to Discuss</label>
                    <textarea className="form-textarea" rows={3} placeholder="What do you want to discuss? e.g. Resume review, career roadmap, specific technical doubt..." value={booking.topic} onChange={e => setBooking(b => ({ ...b, topic: e.target.value }))} required />
                  </div>
                  <button type="submit" className="btn btn-primary w-full btn-lg">
                    <CheckCircle size={15} /> Confirm Booking
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
