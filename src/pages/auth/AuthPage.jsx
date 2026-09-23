import { useState } from 'react';
import { useAppState } from '../../state/AppState';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'industry', label: 'Industry' },
  { value: 'faculty', label: 'Academician' },
  { value: 'institution', label: 'Institution' },
];

const ORG_LABEL = { student: 'College', industry: 'Company', faculty: 'Institution', institution: 'Institution' };

const EMPTY_FORM = { name: '', email: '', password: '', role: 'student', organization: '', dept: '', year: '', cgpa: '', designation: '' };

function Field({ label, children }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

export default function AuthPage() {
  const { login, register } = useAppState();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  function switchMode(m) {
    setMode(m);
    setError('');
  }

  const isSignup = mode === 'signup';

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">
          <div className="logo-icon">⚡</div>
          <div>
            <div className="auth-title">SkillBridge</div>
            <div className="auth-subtitle">Academia–Industry Collaboration Portal</div>
          </div>
        </div>

        <div className="auth-tabs">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Log in</button>
          <button type="button" className={isSignup ? 'active' : ''} onClick={() => switchMode('signup')}>Sign up</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {isSignup && (
            <>
              <Field label="I am a">
                <div className="auth-roles">
                  {ROLE_OPTIONS.map(r => (
                    <button
                      key={r.value} type="button"
                      className={form.role === r.value ? 'active' : ''}
                      onClick={() => setForm(f => ({ ...f, role: r.value }))}
                    >{r.label}</button>
                  ))}
                </div>
              </Field>
              <Field label="Full name">
                <input className="form-input" value={form.name} onChange={set('name')} autoComplete="name" required />
              </Field>
            </>
          )}

          <Field label="Email">
            <input className="form-input" type="email" value={form.email} onChange={set('email')} autoComplete="email" required />
          </Field>
          <Field label="Password">
            <input
              className="form-input" type="password" value={form.password} onChange={set('password')}
              autoComplete={isSignup ? 'new-password' : 'current-password'} required
              placeholder={isSignup ? 'At least 8 characters' : ''}
            />
          </Field>

          {isSignup && (
            <>
              <Field label={ORG_LABEL[form.role]}>
                <input className="form-input" value={form.organization} onChange={set('organization')} required />
              </Field>

              {form.role === 'student' && (
                <div className="grid-3" style={{ gap: 12 }}>
                  <Field label="Department">
                    <input className="form-input" value={form.dept} onChange={set('dept')} placeholder="e.g. CSE" />
                  </Field>
                  <Field label="Year">
                    <select className="form-select" value={form.year} onChange={set('year')}>
                      <option value="">Select</option>
                      {['1st', '2nd', '3rd', '4th', '5th'].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </Field>
                  <Field label="CGPA">
                    <input className="form-input" type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={set('cgpa')} />
                  </Field>
                </div>
              )}

              {form.role !== 'student' && (
                <div className="grid-2" style={{ gap: 12 }}>
                  {form.role === 'faculty' && (
                    <Field label="Department">
                      <input className="form-input" value={form.dept} onChange={set('dept')} />
                    </Field>
                  )}
                  <Field label="Designation">
                    <input className="form-input" value={form.designation} onChange={set('designation')} />
                  </Field>
                </div>
              )}
            </>
          )}

          {error && <div className="auth-error" role="alert">{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={busy} style={{ marginTop: 8 }}>
            {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
          </button>
        </form>

        <div className="auth-switch">
          {isSignup
            ? <>Already have an account? <button type="button" onClick={() => switchMode('login')}>Log in</button></>
            : <>New here? <button type="button" onClick={() => switchMode('signup')}>Create an account</button></>}
        </div>
      </div>
    </div>
  );
}
