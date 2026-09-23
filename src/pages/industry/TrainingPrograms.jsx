import { useState } from 'react';
import { Calendar, Users, Clock, Award, ChevronRight, X, Check, Plus, BookOpen, ExternalLink } from 'lucide-react';

const TRAINING_PROGRAMS = [
  {
    id: 1, title: 'Google Cloud Professional Track', company: 'Google',
    icon: '☁️', color: '#4285f4', type: 'Course',
    duration: '8 Weeks', mode: 'Online', startDate: '2026-10-15',
    enrolled: 342, capacity: 500, fee: 'Free (Sponsored)',
    description: 'Complete program covering Google Cloud Platform services including Compute Engine, Cloud Functions, BigQuery, and Kubernetes Engine. Includes hands-on labs.',
    skills: ['Cloud Computing', 'GCP', 'Kubernetes', 'BigQuery'],
    modules: ['Cloud Fundamentals', 'Compute & Networking', 'Data & Analytics', 'Security & IAM', 'Assessment Prep'],
    mentorship: true
  },
  {
    id: 2, title: 'Full Stack Web Development Bootcamp', company: 'Microsoft',
    icon: '💻', color: '#00a4ef', type: 'Bootcamp',
    duration: '12 Weeks', mode: 'Hybrid', startDate: '2026-11-01',
    enrolled: 178, capacity: 300, fee: '₹2,999',
    description: 'Comprehensive bootcamp covering React, Node.js, Azure, and TypeScript. Build 5 real-world projects with industry mentors. Top performers get interview opportunities at Microsoft.',
    skills: ['React', 'Node.js', 'TypeScript', 'Azure'],
    modules: ['HTML/CSS/JS Deep Dive', 'React & State Management', 'Backend with Node.js', 'Database Design', 'Cloud Deployment', 'Capstone Project'],
    mentorship: true
  },
  {
    id: 3, title: 'AI/ML Engineer Career Track', company: 'Amazon (AWS)',
    icon: '🤖', color: '#ff9900', type: 'Career Track',
    duration: '16 Weeks', mode: 'Online', startDate: '2026-10-01',
    enrolled: 567, capacity: 1000, fee: 'Free (AWS Credits)',
    description: 'Industry-designed curriculum to become a production ML engineer. Covers classical ML, deep learning, MLOps, and deployment on AWS SageMaker. Includes $500 AWS credits.',
    skills: ['Machine Learning', 'Python', 'TensorFlow', 'AWS SageMaker'],
    modules: ['Python for ML', 'Classical ML Algorithms', 'Deep Learning', 'NLP & Computer Vision', 'MLOps & Deployment', 'Capstone'],
    mentorship: false
  },
  {
    id: 4, title: 'Cybersecurity Fundamentals Workshop', company: 'Cisco',
    icon: '🛡️', color: '#049fd9', type: 'Workshop',
    duration: '3 Days', mode: 'On-site', startDate: '2026-10-20',
    enrolled: 45, capacity: 60, fee: 'Free',
    description: 'Intensive workshop on network security, ethical hacking basics, incident response, and security operations. Hands-on exercises with Cisco Packet Tracer and CyberOps tools.',
    skills: ['Network Security', 'Ethical Hacking', 'Incident Response'],
    modules: ['Network Fundamentals', 'Threat Landscape', 'Hands-on Labs'],
    mentorship: false
  },
  {
    id: 5, title: 'Data Engineering with Spark & Kafka', company: 'Flipkart',
    icon: '📊', color: '#f7931a', type: 'Course',
    duration: '6 Weeks', mode: 'Online', startDate: '2026-11-15',
    enrolled: 120, capacity: 200, fee: '₹1,499',
    description: 'Learn to build production data pipelines at Flipkart scale. Covers Apache Spark, Kafka, Airflow, and data warehouse design. Real datasets from e-commerce domain.',
    skills: ['Apache Spark', 'Kafka', 'Data Engineering', 'SQL'],
    modules: ['Data Pipeline Architecture', 'Spark Fundamentals', 'Kafka Streaming', 'Airflow Orchestration', 'Data Warehouse Design'],
    mentorship: true
  },
  {
    id: 6, title: 'UI/UX Design Masterclass', company: 'Swiggy Design Lab',
    icon: '🎨', color: '#fc8019', type: 'Workshop',
    duration: '2 Weeks', mode: 'Virtual', startDate: '2026-12-01',
    enrolled: 89, capacity: 150, fee: 'Free',
    description: 'From wireframes to high-fidelity prototypes. Learn design thinking, Figma workflows, user research methods, and accessibility best practices used at Swiggy.',
    skills: ['UI/UX Design', 'Figma', 'Design Thinking', 'User Research'],
    modules: ['Design Thinking', 'Wireframing', 'Figma Mastery', 'Prototyping', 'User Testing'],
    mentorship: false
  }
];

const typeColors = {
  'Course': 'primary', 'Bootcamp': 'emerald', 'Career Track': 'amber',
  'Workshop': 'cyan'
};

export default function TrainingPrograms() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [enrolled, setEnrolled] = useState(new Set([3]));

  const types = ['all', 'Course', 'Bootcamp', 'Career Track', 'Workshop'];
  const filtered = TRAINING_PROGRAMS.filter(p => filter === 'all' || p.type === filter);

  function handleEnroll(id) {
    setEnrolled(prev => new Set([...prev, id]));
    setSelected(null);
  }

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">📚 Training Programs</h1>
        <p className="page-hero-subtitle">
          Industry-designed learning programs to help students acquire in-demand skills. Courses, bootcamps, workshops, and career tracks.
        </p>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 28 }}>
        {[
          { label: 'Active Programs', value: '6', icon: '📚', color: '#6366f1' },
          { label: 'Students Enrolled', value: '1,341', icon: '👥', color: '#10b981' },
          { label: 'Industry Partners', value: '12', icon: '🤝', color: '#f43f5e' },
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
            {t === 'all' ? 'All Programs' : t}
          </button>
        ))}
        <button className="btn btn-sm btn-rose" style={{ marginLeft: 'auto' }}>
          <Plus size={14} /> Create Program
        </button>
      </div>

      <div className="grid-auto">
        {filtered.map(prog => {
          const isEnrolled = enrolled.has(prog.id);
          const pctFull = Math.round((prog.enrolled / prog.capacity) * 100);

          return (
            <div key={prog.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(prog)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span className={`badge badge-${typeColors[prog.type] || 'primary'}`}>{prog.type}</span>
                {isEnrolled && <span className="verified-badge"><Check size={10} /> Enrolled</span>}
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 48, height: 48, background: `${prog.color}22`, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0
                }}>{prog.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{prog.title}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{prog.company}</div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 14 }}>
                {prog.description.slice(0, 100)}...
              </p>

              <div className="job-card-meta" style={{ marginBottom: 12 }}>
                <span className="job-meta-item"><Calendar size={11} />{prog.startDate}</span>
                <span className="job-meta-item"><Clock size={11} />{prog.duration}</span>
                <span className="job-meta-item"><Users size={11} />{prog.capacity - prog.enrolled} seats</span>
              </div>

              {/* Enrollment progress */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
                  <span>{prog.enrolled}/{prog.capacity} enrolled</span>
                  <span>{pctFull}% full</span>
                </div>
                <div className="progress-track">
                  <div className={`progress-fill progress-${typeColors[prog.type] || 'primary'}`} style={{ width: `${pctFull}%` }} />
                </div>
              </div>

              <div className="skill-tags" style={{ marginBottom: 14 }}>
                {prog.skills.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: prog.fee === 'Free' || prog.fee.includes('Free') ? '#10b981' : '#f59e0b' }}>{prog.fee}</span>
                </div>
                <button
                  className={`btn btn-sm ${isEnrolled ? 'btn-ghost' : 'btn-rose'}`}
                  onClick={e => { e.stopPropagation(); if (!isEnrolled) handleEnroll(prog.id); }}
                >
                  {isEnrolled ? '✅ Enrolled' : 'Enroll Now →'}
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
                  <div style={{ color: '#9ca3af', fontSize: 14 }}>{selected.company}</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={16} /></button>
            </div>

            <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, marginBottom: 20 }}>{selected.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                ['📅 Start Date', selected.startDate], ['⏱️ Duration', selected.duration],
                ['📍 Mode', selected.mode], ['💰 Fee', selected.fee],
                ['🪑 Capacity', `${selected.capacity - selected.enrolled} seats remaining`],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Curriculum Modules</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selected.modules.map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: '#4b5563' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', background: `${selected.color}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: selected.color, flexShrink: 0
                    }}>{i + 1}</div>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Skills You'll Gain</div>
              <div className="skill-tags">
                {selected.skills.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>

            {enrolled.has(selected.id) ? (
              <div style={{ textAlign: 'center', padding: 16, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, color: '#10b981', fontWeight: 700 }}>
                ✅ You are enrolled in this program
              </div>
            ) : (
              <button className="btn btn-rose btn-lg w-full" onClick={() => handleEnroll(selected.id)}>
                Enroll Now <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
