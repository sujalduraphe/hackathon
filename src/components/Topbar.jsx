import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { ROLE_META } from '../data/store';
import { useAppState } from '../state/AppState';
import { DEMO_SWITCH_ENABLED } from '../lib/demo';

const ROLE_LABEL = { student: 'Student', faculty: 'Academician', industry: 'Industry', institution: 'Institution' };

export default function Topbar({ user, onLogout, onSwitched }) {
  const meta = ROLE_META[user.role];
  const { switchRole } = useAppState();
  const [switching, setSwitching] = useState(null);
  const [error, setError] = useState('');

  async function switchTo(role) {
    if (role === user.role || switching) return;
    setSwitching(role); setError('');
    try {
      await switchRole(role);
      onSwitched?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSwitching(null);
    }
  }
  return (
    <nav className="topbar">
      <div className="topbar-logo">
        <div className="logo-icon">⚡</div>
        <span className="logo-text">SkillBridge</span>
      </div>

      {DEMO_SWITCH_ENABLED && (
        <div className="topbar-center" title={error || 'Switch to the demo account for another role'}>
          {Object.keys(ROLE_LABEL).map(r => (
            <button
              key={r}
              className={`role-tab ${user.role === r ? `active-${r}` : ''}`}
              onClick={() => switchTo(r)}
              disabled={Boolean(switching)}
              aria-pressed={user.role === r}
            >
              {ROLE_META[r].icon} {switching === r ? 'Switching…' : ROLE_LABEL[r]}
            </button>
          ))}
        </div>
      )}
      {error && <div style={{ fontSize: 12, color: '#b91c1c' }}>{error}</div>}

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
