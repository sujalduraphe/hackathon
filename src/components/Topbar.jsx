import { LogOut } from 'lucide-react';
import { ROLE_META } from '../data/store';

const ROLE_LABEL = { student: 'Student', faculty: 'Academician', industry: 'Industry', institution: 'Institution' };

export default function Topbar({ user, onLogout }) {
  const meta = ROLE_META[user.role];
  return (
    <nav className="topbar">
      <div className="topbar-logo">
        <div className="logo-icon">⚡</div>
        <span className="logo-text">SkillBridge</span>
      </div>

      <div className="topbar-right">
        <div style={{ textAlign: 'right', lineHeight: 1.3 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{user.name}</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>
            {ROLE_LABEL[user.role]}{user.organization ? ` · ${user.organization}` : ''}
          </div>
        </div>
        <div
          className="topbar-avatar"
          style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}99)`, borderColor: `${meta.color}60` }}
          title={user.email}
        >
          {user.avatar}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onLogout} title="Log out">
          <LogOut size={14} /> Log out
        </button>
      </div>
    </nav>
  );
}
