import { useState } from 'react';
import { Calendar, Clock, Star, ChevronRight, CheckCircle2, MessageSquare, Upload, FileText, TrendingUp } from 'lucide-react';

const INTERNSHIPS = [
  {
    id: 1, company: 'Google', role: 'Software Engineering Intern', logo: '🔵', color: '#4285f4',
    startDate: '2026-07-01', endDate: '2026-12-31', status: 'ongoing',
    mentor: { name: 'Sunita Patel', email: 'sunita@google.com', avatar: 'SP' },
    location: 'Bengaluru', mode: 'Hybrid',
    milestones: [
      { id: 1, title: 'Onboarding & Setup', date: '2026-07-01', status: 'completed', feedback: 'Excellent onboarding. Quickly set up dev environment.' },
      { id: 2, title: 'Week 2 — First PR Merged', date: '2026-07-15', status: 'completed', feedback: 'Clean code, good test coverage. Keep it up!' },
      { id: 3, title: 'Midterm Review', date: '2026-09-01', status: 'completed', feedback: 'Strong progress on recommendation engine. Score: 4.5/5' },
      { id: 4, title: 'Feature Demo to Team', date: '2026-10-15', status: 'upcoming', feedback: null },
      { id: 5, title: 'Final Presentation', date: '2026-12-15', status: 'upcoming', feedback: null },
      { id: 6, title: 'Completion & Certificate', date: '2026-12-31', status: 'upcoming', feedback: null },
    ],
    overallScore: 4.5,
    skills: ['Python', 'TensorFlow', 'System Design', 'Protobuf'],
    reports: [
      { title: 'Week 1-4 Progress Report', date: '2026-07-28', uploaded: true },
      { title: 'Midterm Report', date: '2026-09-05', uploaded: true },
      { title: 'Final Report', date: '2026-12-20', uploaded: false },
    ]
  },
  {
    id: 2, company: 'Flipkart', role: 'Data Science Intern', logo: '🛍️', color: '#f7931a',
    startDate: '2026-05-15', endDate: '2026-08-15', status: 'completed',
    mentor: { name: 'Arjun Nair', email: 'arjun.n@flipkart.com', avatar: 'AN' },
    location: 'Bengaluru', mode: 'On-site',
    milestones: [
      { id: 1, title: 'Onboarding & Data Access', date: '2026-05-15', status: 'completed', feedback: 'Quick learner, adapted to Flipkart data stack well.' },
      { id: 2, title: 'EDA & Feature Engineering', date: '2026-06-01', status: 'completed', feedback: 'Thorough analysis. Good feature selection.' },
      { id: 3, title: 'Model Development', date: '2026-06-30', status: 'completed', feedback: 'Random Forest model achieved 89% accuracy.' },
      { id: 4, title: 'A/B Testing & Deployment', date: '2026-07-31', status: 'completed', feedback: 'Successfully deployed to staging. A/B test showed 12% improvement.' },
      { id: 5, title: 'Final Presentation & Certificate', date: '2026-08-15', status: 'completed', feedback: 'Outstanding presentation. Received letter of recommendation. Score: 4.8/5' },
    ],
    overallScore: 4.8,
    skills: ['Python', 'Machine Learning', 'SQL', 'Spark'],
    reports: [
      { title: 'Monthly Progress Report', date: '2026-06-15', uploaded: true },
      { title: 'Final Internship Report', date: '2026-08-15', uploaded: true },
    ]
  }
];

const statusColors = { completed: '#10b981', upcoming: '#6366f1', ongoing: '#f59e0b' };

export default function InternshipTracker() {
  const [selectedInternship, setSelectedInternship] = useState(INTERNSHIPS[0]);
  const [tab, setTab] = useState('timeline');

  const completedMilestones = selectedInternship.milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = selectedInternship.milestones.length;
  const progress = Math.round((completedMilestones / totalMilestones) * 100);

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">📋 Internship Progress Tracker</h1>
        <p className="page-hero-subtitle">
          Track your internship milestones, mentor feedback, reports, and completion status.
        </p>
      </div>

      {/* Internship selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto' }}>
        {INTERNSHIPS.map(internship => (
          <div
            key={internship.id}
            className="card"
            style={{
              cursor: 'pointer', minWidth: 280, flex: '0 0 auto',
              border: selectedInternship.id === internship.id ? `2px solid ${internship.color}` : '1px solid transparent',
              background: selectedInternship.id === internship.id ? `${internship.color}08` : undefined
            }}
            onClick={() => setSelectedInternship(internship)}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 44, height: 44, background: `${internship.color}22`, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
              }}>{internship.logo}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{internship.role}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{internship.company}</div>
              </div>
              <span style={{
                marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                padding: '2px 10px', borderRadius: 20,
                background: `${statusColors[internship.status]}22`,
                color: statusColors[internship.status]
              }}>
                {internship.status === 'ongoing' ? '🟡 Ongoing' : '✅ Completed'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 28 }}>
        {[
          { label: 'Progress', value: `${progress}%`, icon: '📊', color: '#6366f1' },
          { label: 'Milestones', value: `${completedMilestones}/${totalMilestones}`, icon: '🎯', color: '#10b981' },
          { label: 'Mentor Score', value: `${selectedInternship.overallScore}/5`, icon: '⭐', color: '#f59e0b' },
          { label: 'Reports', value: `${selectedInternship.reports.filter(r => r.uploaded).length}/${selectedInternship.reports.length}`, icon: '📄', color: '#06b6d4' },
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

      {/* Overall progress bar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedInternship.role} at {selectedInternship.company}</div>
            <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>
              {selectedInternship.startDate} → {selectedInternship.endDate} · {selectedInternship.mode} · {selectedInternship.location}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12
            }}>{selectedInternship.mentor.avatar}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Mentor: {selectedInternship.mentor.name}</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>{selectedInternship.mentor.email}</div>
            </div>
          </div>
        </div>
        <div className="progress-track" style={{ height: 8 }}>
          <div className="progress-fill progress-primary" style={{ width: `${progress}%`, transition: 'width 0.8s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
          <span>{progress}% complete</span>
          <span>{totalMilestones - completedMilestones} milestones remaining</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { key: 'timeline', icon: TrendingUp, label: 'Timeline & Milestones' },
          { key: 'feedback', icon: MessageSquare, label: 'Mentor Feedback' },
          { key: 'reports', icon: FileText, label: 'Reports & Documents' },
        ].map(t => (
          <button key={t.key} className={`btn btn-sm ${tab === t.key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab(t.key)}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {tab === 'timeline' && (
        <div style={{ position: 'relative', paddingLeft: 32 }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 15, top: 0, bottom: 0, width: 2,
            background: 'linear-gradient(to bottom, #6366f1, #6366f133)'
          }} />

          {selectedInternship.milestones.map((milestone, i) => (
            <div key={milestone.id} style={{ position: 'relative', marginBottom: 20 }}>
              {/* Dot */}
              <div style={{
                position: 'absolute', left: -24, top: 4,
                width: 18, height: 18, borderRadius: '50%',
                background: milestone.status === 'completed' ? '#10b981' : '#1e293b',
                border: `3px solid ${milestone.status === 'completed' ? '#10b981' : '#6366f1'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {milestone.status === 'completed' && <CheckCircle2 size={10} color="white" />}
              </div>

              <div className="card" style={{
                borderLeft: `3px solid ${milestone.status === 'completed' ? '#10b981' : '#6366f166'}`,
                opacity: milestone.status === 'upcoming' ? 0.7 : 1
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{milestone.title}</div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                    background: `${statusColors[milestone.status]}22`,
                    color: statusColors[milestone.status]
                  }}>
                    {milestone.status === 'completed' ? '✅ Completed' : '🔜 Upcoming'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>
                  <Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />
                  {milestone.date}
                </div>
                {milestone.feedback && (
                  <div style={{
                    background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#4b5563', lineHeight: 1.6
                  }}>
                    <strong style={{ color: '#10b981' }}>💬 Mentor Feedback:</strong> {milestone.feedback}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback */}
      {tab === 'feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {selectedInternship.milestones.filter(m => m.feedback).map(m => (
            <div key={m.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontWeight: 700 }}>{m.title}</div>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>{m.date}</span>
              </div>
              <div style={{
                background: 'rgba(99,102,241,0.06)', borderRadius: 10, padding: '12px 16px',
                fontSize: 14, color: '#4b5563', lineHeight: 1.7, borderLeft: '3px solid #6366f1'
              }}>
                "{m.feedback}"
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} fill={s <= selectedInternship.overallScore ? '#f59e0b' : 'none'} color={s <= selectedInternship.overallScore ? '#f59e0b' : '#d1d5db'} />
                ))}
              </div>
            </div>
          ))}
          {selectedInternship.milestones.filter(m => m.feedback).length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
              <div style={{ fontWeight: 600 }}>No feedback yet</div>
              <div style={{ fontSize: 13 }}>Mentor feedback will appear here after milestone reviews.</div>
            </div>
          )}
        </div>
      )}

      {/* Reports */}
      {tab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {selectedInternship.reports.map((report, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: report.uploaded ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
              }}>
                {report.uploaded ? '✅' : '📤'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{report.title}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Due: {report.date}</div>
              </div>
              {report.uploaded ? (
                <span className="verified-badge"><CheckCircle2 size={10} /> Uploaded</span>
              ) : (
                <button className="btn btn-sm btn-primary"><Upload size={12} /> Upload</button>
              )}
            </div>
          ))}

          <div className="card" style={{
            border: '2px dashed rgba(99,102,241,0.3)', textAlign: 'center', padding: 24,
            cursor: 'pointer', background: 'rgba(99,102,241,0.02)'
          }}>
            <Upload size={24} color="#6366f1" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 600, color: '#6366f1' }}>Upload Additional Document</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>PDF, DOCX, or image files up to 10MB</div>
          </div>
        </div>
      )}
    </div>
  );
}
