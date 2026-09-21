import { useState } from 'react';
import { GitBranch, ExternalLink, Award, CheckCircle, Plus, Download, Share2, QrCode } from 'lucide-react';
import { CURRENT_USER } from '../../data/store';

export default function DigitalPortfolio() {
  const user = CURRENT_USER.student;
  const [activeTab, setActiveTab] = useState('overview');
  const [showQR, setShowQR] = useState(false);

  const tabs = ['overview', 'projects', 'certifications', 'skills'];

  return (
    <div className="animate-fade-in">
      {/* Hero Profile */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.1))',
        border: '1px solid rgba(16,185,129,0.2)', borderRadius: 24,
        padding: '28px 32px', marginBottom: 28, position: 'relative', overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', right: -20, top: -20,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent)',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, flexShrink: 0,
            boxShadow: '0 0 30px rgba(16,185,129,0.4), 0 0 60px rgba(99,102,241,0.2)'
          }}>
            {user.avatar}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800 }}>{user.name}</h1>
              <span className="verified-badge"><CheckCircle size={10} /> Verified Student</span>
            </div>
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 10 }}>
              {user.year} · {user.dept} · {user.college}
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#4b5563' }}>📊 CGPA: <strong style={{ color: '#10b981' }}>{user.cgpa}</strong></span>
              <span style={{ fontSize: 13, color: '#4b5563' }}>🏆 {user.certifications.length} Certifications</span>
              <span style={{ fontSize: 13, color: '#4b5563' }}>💼 {user.projects.length} Projects</span>
              <span style={{ fontSize: 13, color: '#4b5563' }}>✅ {user.projects.filter(p => p.verified).length} Verified</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-sm btn-primary" onClick={() => setShowQR(true)}>
              <QrCode size={13} /> Share Portfolio
            </button>
            <button className="btn btn-sm btn-ghost">
              <Download size={13} /> ATS Resume
            </button>
          </div>
        </div>

        {/* Skills quick view */}
        <div style={{ marginTop: 20, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Object.entries(user.skills).slice(0, 8).map(([skill, val]) => (
            <div key={skill} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
              background: `rgba(${val >= 75 ? '16,185,129' : val >= 55 ? '245,158,11' : '244,63,94'}, 0.1)`,
              border: `1px solid rgba(${val >= 75 ? '16,185,129' : val >= 55 ? '245,158,11' : '244,63,94'}, 0.2)`,
              color: val >= 75 ? '#10b981' : val >= 55 ? '#f59e0b' : '#f43f5e'
            }}>
              {skill} · {val}%
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4, marginBottom: 24, width: 'fit-content' }}>
        {tabs.map(t => (
          <button
            key={t}
            className={`btn btn-sm ${activeTab === t ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab(t)}
            style={{ textTransform: 'capitalize' }}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid-2">
          {/* Achievements */}
          <div className="card">
            <div className="section-title" style={{ marginBottom: 16 }}>🏆 Achievements</div>
            {[
              { icon: '🥇', title: 'Smart India Hackathon 2025', desc: 'Regional Finalist', color: '#f59e0b' },
              { icon: '📊', title: 'Top 5% Assessment Score', desc: 'Python & ML · 82nd percentile', color: '#6366f1' },
              { icon: '🌟', title: 'Dean\'s List', desc: '2024-25 Academic Year', color: '#10b981' },
              { icon: '💡', title: 'Research Paper Published', desc: 'IEEE · Image Classification using CNNs', color: '#f43f5e' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: `${a.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0
                }}>
                  {a.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Stats */}
          <div className="card">
            <div className="section-title" style={{ marginBottom: 16 }}>📈 Profile Strength</div>
            {[
              { label: 'Skill Completeness', val: 72 },
              { label: 'Assessment Score', val: 82 },
              { label: 'Portfolio Quality', val: 68 },
              { label: 'Application Activity', val: 55 },
            ].map((item, i) => (
              <div key={i} className="progress-container" style={{ marginBottom: 14 }}>
                <div className="progress-label">
                  <span>{item.label}</span>
                  <span style={{ color: '#6366f1', fontWeight: 600 }}>{item.val}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill progress-primary" style={{ width: `${item.val}%` }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(99,102,241,0.08)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.15)', fontSize: 13, color: '#4b5563' }}>
              💡 <strong>Tip:</strong> Add 2 more certifications to boost your profile strength to 85%
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm"><Plus size={12} /> Add Project</button>
          </div>
          <div className="grid-auto">
            {user.projects.map((p, i) => (
              <div key={i} className="portfolio-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{p.title}</div>
                  {p.verified && <span className="verified-badge"><CheckCircle size={10} /> Verified</span>}
                </div>
                <div className="skill-tags" style={{ marginBottom: 16 }}>
                  {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost btn-sm"><GitBranch size={12} /> GitHub</button>
                  <button className="btn btn-ghost btn-sm"><ExternalLink size={12} /> Live Demo</button>
                </div>
              </div>
            ))}
            {/* Add card */}
            <div className="portfolio-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: 140, border: '1px dashed rgba(255,255,255,0.1)', flexDirection: 'column', gap: 8, color: '#9ca3af' }}>
              <Plus size={24} />
              <span style={{ fontSize: 13 }}>Add New Project</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'certifications' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm"><Plus size={12} /> Add Certificate</button>
          </div>
          <div className="grid-auto">
            {[
              { name: 'Python for Data Science', issuer: 'Coursera · IBM', date: 'Aug 2025', id: 'CRSA-8721-PDS', verified: true, icon: '🐍' },
              { name: 'React Basics', issuer: 'Udemy', date: 'Jun 2025', id: 'UDM-4521-RB', verified: true, icon: '⚛️' },
              { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: 'In Progress', id: 'Pending', verified: false, icon: '☁️' },
            ].map((cert, i) => (
              <div key={i} className="portfolio-card">
                <div style={{ fontSize: 36, marginBottom: 12 }}>{cert.icon}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{cert.name}</div>
                  {cert.verified && <span className="verified-badge"><CheckCircle size={10} /> Verified</span>}
                </div>
                <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>{cert.issuer} · {cert.date}</div>
                {cert.verified && (
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#9ca3af' }}>ID: {cert.id}</div>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn btn-ghost btn-sm"><ExternalLink size={11} /> View</button>
                  <button className="btn btn-ghost btn-sm"><Share2 size={11} /> Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="grid-2">
          {Object.entries(user.skills).map(([skill, val]) => {
            const color = val >= 75 ? '#10b981' : val >= 55 ? '#f59e0b' : '#f43f5e';
            return (
              <div key={skill} className="gap-card">
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 16, color, flexShrink: 0
                }}>
                  {val}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{skill}</div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${val}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
                  </div>
                </div>
                {val >= 75 && <CheckCircle size={16} color="#10b981" />}
              </div>
            );
          })}
        </div>
      )}

      {/* QR Modal */}
      {showQR && (
        <div className="modal-overlay" onClick={() => setShowQR(false)}>
          <div className="modal-content" style={{ maxWidth: 380, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>📱 Share Portfolio</div>
            <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>Share your verified digital portfolio with recruiters</p>
            {/* QR Placeholder */}
            <div style={{
              width: 200, height: 200, margin: '0 auto 20px',
              background: 'white', borderRadius: 12, padding: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 40
            }}>
              📊
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#9ca3af', marginBottom: 20 }}>
              skillbridge.edu/portfolio/arjun-sharma-nitk
            </div>
            <button className="btn btn-primary w-full">Copy Link</button>
          </div>
        </div>
      )}
    </div>
  );
}
