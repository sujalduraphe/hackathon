import { useState } from 'react';
import { Calendar, Users, Clock, Trophy, ChevronRight, X, Check, Plus, Zap, Star, ArrowRight } from 'lucide-react';

const CHALLENGES = [
  {
    id: 1, title: 'Smart India Hackathon 2026 — AI Track', organizer: 'AICTE & Ministry of Education',
    icon: '🇮🇳', color: '#ff6b35', type: 'Hackathon',
    startDate: '2026-11-15', endDate: '2026-11-17', mode: 'On-site (National)',
    teamSize: '3-6 members', prizes: '₹1,00,000 + Internships',
    registered: 45200, maxTeams: null,
    description: 'India\'s largest hackathon — solve real-world government and industry problem statements using AI/ML. Winners get direct placement opportunities and seed funding for startups.',
    tracks: ['Healthcare AI', 'Smart Agriculture', 'Education Tech', 'FinTech', 'Cybersecurity'],
    status: 'registering', difficulty: 'Advanced'
  },
  {
    id: 2, title: 'Build with Google Cloud Challenge', organizer: 'Google Developer Student Clubs',
    icon: '☁️', color: '#4285f4', type: 'Challenge',
    startDate: '2026-10-01', endDate: '2026-10-31', mode: 'Online',
    teamSize: 'Individual', prizes: '₹50,000 + Google Swag + Cloud Credits',
    registered: 8900, maxTeams: null,
    description: 'Month-long challenge to build innovative applications on Google Cloud. Complete skill badges, build a capstone project, and present to Google engineers.',
    tracks: ['Cloud Architecture', 'ML on GCP', 'App Development', 'Data Analytics'],
    status: 'active', difficulty: 'Intermediate'
  },
  {
    id: 3, title: 'Flipkart GRiD 6.0 — E-Commerce Innovation', organizer: 'Flipkart',
    icon: '🛍️', color: '#f7931a', type: 'Innovation Challenge',
    startDate: '2026-10-20', endDate: '2026-11-20', mode: 'Online + Final On-site',
    teamSize: '2-4 members', prizes: '₹3,00,000 + PPO',
    registered: 12500, maxTeams: null,
    description: 'Build innovative solutions for e-commerce challenges — recommendation engines, supply chain optimization, customer experience, and fraud detection. Top teams get Pre-Placement Offers.',
    tracks: ['Recommendation Systems', 'Supply Chain', 'Customer Experience', 'Fraud Detection'],
    status: 'registering', difficulty: 'Advanced'
  },
  {
    id: 4, title: 'Microsoft Imagine Cup — India Finals', organizer: 'Microsoft',
    icon: '🏆', color: '#00a4ef', type: 'Competition',
    startDate: '2026-12-01', endDate: '2026-12-15', mode: 'Hybrid',
    teamSize: '3-5 members', prizes: '₹5,00,000 + Mentorship + Azure Credits',
    registered: 3400, maxTeams: 500,
    description: 'Build technology solutions that address social, environmental, or economic challenges. India winners advance to the global Imagine Cup finals. Access to Microsoft mentors and Azure resources.',
    tracks: ['Earth', 'Education', 'Healthcare', 'Lifestyle'],
    status: 'upcoming', difficulty: 'Advanced'
  },
  {
    id: 5, title: 'Open Source Contribution Sprint', organizer: 'GitHub India + FOSS United',
    icon: '🐙', color: '#8b5cf6', type: 'Sprint',
    startDate: '2026-10-01', endDate: '2026-10-31', mode: 'Online',
    teamSize: 'Individual', prizes: 'Limited Edition GitHub T-shirts + Stickers',
    registered: 2100, maxTeams: null,
    description: 'Contribute to popular open source projects during October. Make at least 4 meaningful pull requests to earn swag. Mentors available for first-time contributors.',
    tracks: ['Frontend (React/Vue)', 'Backend (Node/Python)', 'DevOps', 'Documentation'],
    status: 'active', difficulty: 'Beginner'
  },
  {
    id: 6, title: 'Live Industry Project — Smart Campus IoT', organizer: 'Bosch India',
    icon: '🏫', color: '#e3000b', type: 'Live Project',
    startDate: '2026-11-01', endDate: '2027-01-31', mode: 'Hybrid',
    teamSize: '4-6 members', prizes: '₹75,000 + Internship',
    registered: 340, maxTeams: 50,
    description: 'Work on a live industry project with Bosch engineers. Design and prototype a smart campus monitoring system using IoT sensors, edge computing, and cloud dashboards.',
    tracks: ['IoT Sensor Integration', 'Edge Computing', 'Cloud Dashboard', 'Data Analytics'],
    status: 'registering', difficulty: 'Intermediate'
  }
];

const typeColors = {
  'Hackathon': 'rose', 'Challenge': 'primary', 'Innovation Challenge': 'amber',
  'Competition': 'cyan', 'Sprint': 'emerald', 'Live Project': 'rose'
};
const statusColors = { registering: '#f59e0b', active: '#10b981', upcoming: '#6366f1', ended: '#9ca3af' };
const statusLabels = { registering: 'Registration Open', active: 'Active Now', upcoming: 'Coming Soon', ended: 'Ended' };
const difficultyColors = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#f43f5e' };

export default function IndustryChallenges() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [registered, setRegistered] = useState(new Set([2, 5]));

  const types = ['all', 'Hackathon', 'Challenge', 'Innovation Challenge', 'Competition', 'Live Project'];
  const filtered = CHALLENGES.filter(c => filter === 'all' || c.type === filter);

  function handleRegister(id) {
    setRegistered(prev => new Set([...prev, id]));
    setSelected(null);
  }

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">🏆 Hackathons, Challenges & Live Projects</h1>
        <p className="page-hero-subtitle">
          Innovation challenges, hackathons, coding sprints, and live industry projects. Showcase your skills and win exciting prizes.
        </p>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 28 }}>
        {[
          { label: 'Active Challenges', value: '6', icon: '🏆', color: '#f43f5e' },
          { label: 'Total Participants', value: '72K+', icon: '👥', color: '#6366f1' },
          { label: 'Prizes Pool', value: '₹10L+', icon: '💰', color: '#f59e0b' },
          { label: 'Industry Partners', value: '8', icon: '🤝', color: '#10b981' },
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
          <button key={t} className={`btn btn-sm ${filter === t ? 'btn-rose' : 'btn-ghost'}`} onClick={() => setFilter(t)}>
            {t === 'all' ? 'All Challenges' : t}
          </button>
        ))}
        <button className="btn btn-sm btn-rose" style={{ marginLeft: 'auto' }}>
          <Plus size={14} /> Create Challenge
        </button>
      </div>

      <div className="grid-auto">
        {filtered.map(challenge => {
          const isReg = registered.has(challenge.id);

          return (
            <div key={challenge.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(challenge)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span className={`badge badge-${typeColors[challenge.type] || 'primary'}`}>{challenge.type}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: statusColors[challenge.status],
                    display: 'flex', alignItems: 'center', gap: 4
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[challenge.status] }} />
                    {statusLabels[challenge.status]}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 48, height: 48, background: `${challenge.color}22`, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0
                }}>{challenge.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{challenge.title}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{challenge.organizer}</div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 14 }}>
                {challenge.description.slice(0, 100)}...
              </p>

              <div className="job-card-meta" style={{ marginBottom: 12 }}>
                <span className="job-meta-item"><Calendar size={11} />{challenge.startDate}</span>
                <span className="job-meta-item"><Users size={11} />{challenge.teamSize}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 8,
                  background: `${difficultyColors[challenge.difficulty]}22`,
                  color: difficultyColors[challenge.difficulty]
                }}>{challenge.difficulty}</span>
              </div>

              <div className="skill-tags" style={{ marginBottom: 14 }}>
                {challenge.tracks.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
                {challenge.tracks.length > 3 && <span className="tag">+{challenge.tracks.length - 3}</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>{challenge.prizes}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{challenge.registered.toLocaleString()} registered</div>
                </div>
                {isReg ? (
                  <span className="verified-badge"><Check size={10} /> Registered</span>
                ) : (
                  <button className="btn btn-sm btn-rose" onClick={e => { e.stopPropagation(); handleRegister(challenge.id); }}>
                    Register →
                  </button>
                )}
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
                ['📅 Start Date', selected.startDate], ['📅 End Date', selected.endDate],
                ['📍 Mode', selected.mode], ['👥 Team Size', selected.teamSize],
                ['🏆 Prizes', selected.prizes], ['📊 Difficulty', selected.difficulty],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Tracks / Problem Statements</div>
              <div className="skill-tags">
                {selected.tracks.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>

            {registered.has(selected.id) ? (
              <div style={{ textAlign: 'center', padding: 16, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, color: '#10b981', fontWeight: 700 }}>
                ✅ You are registered for this challenge
              </div>
            ) : (
              <button className="btn btn-rose btn-lg w-full" onClick={() => handleRegister(selected.id)}>
                Register Now <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
