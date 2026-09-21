import { useState } from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { ROLE_META, CURRENT_USER } from '../data/store';

export default function Topbar({ role, onRoleChange }) {
  const [showNotif, setShowNotif] = useState(false);
  const meta = ROLE_META[role];
  const user = CURRENT_USER[role];

  const roles = ['student', 'faculty', 'industry', 'institution'];
  const roleLabels = { student: 'Student', faculty: 'Faculty', industry: 'Industry', institution: 'Institution' };

  const notifications = [
    { id: 1, text: 'Google shortlisted you for SWE Intern!', time: '2h ago', unread: true, icon: '🔵' },
    { id: 2, text: 'New FDP: AI & Deep Learning by Google', time: '1d ago', unread: true, icon: '📚' },
    { id: 3, text: 'Skill Assessment score updated', time: '2d ago', unread: false, icon: '📊' },
    { id: 4, text: 'New internship at Razorpay matches your profile', time: '3d ago', unread: false, icon: '💳' },
  ];

  return (
    <nav className="topbar">
      <div className="topbar-logo">
        <div className="logo-icon">⚡</div>
        <span className="logo-text">SkillBridge</span>
      </div>

      <div className="topbar-center">
        {roles.map(r => (
          <button
            key={r}
            className={`role-tab ${role === r ? `active-${r}` : ''}`}
            onClick={() => onRoleChange(r)}
          >
            {ROLE_META[r].icon} {roleLabels[r]}
          </button>
        ))}
      </div>

      <div className="topbar-right">
        <div style={{ position: 'relative' }}>
          <button className="notif-btn" onClick={() => setShowNotif(!showNotif)}>
            <Bell size={16} />
            <span className="notif-dot" />
          </button>
          {showNotif && (
            <div style={{
              position: 'absolute', right: 0, top: '44px',
              width: '320px', background: '#ffffff',
              border: '1px solid #e8eaf0',
              borderRadius: '16px', padding: '8px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              zIndex: 2000
            }}>
              <div style={{ padding: '8px 12px 12px', fontWeight: 600, fontSize: 14, borderBottom: '1px solid #f1f3f8', marginBottom: 8, color: '#111827' }}>
                Notifications
              </div>
              {notifications.map(n => (
                <div key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`}>
                  <span style={{ fontSize: 20 }}>{n.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: n.unread ? '#111827' : '#6b7280' }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{n.time}</div>
                  </div>
                  {n.unread && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="topbar-avatar"
          style={{
            background: `linear-gradient(135deg, ${meta.color}, ${meta.color}99)`,
            borderColor: `${meta.color}60`
          }}
          title={user.name}
        >
          {user.avatar}
        </div>
      </div>
    </nav>
  );
}
