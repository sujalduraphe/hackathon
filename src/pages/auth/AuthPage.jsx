import { useEffect, useRef, useState } from 'react';
import { useAppState } from '../../state/AppState';
import { api, BASE } from '../../lib/api';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'industry', label: 'Industry' },
  { value: 'faculty', label: 'Academician' },
  { value: 'institution', label: 'Institution' },
];

const ORG_LABEL = { student: 'College', industry: 'Company', faculty: 'Institution', institution: 'Institution' };

const EMPTY_FORM = { name: '', email: '', password: '', role: 'student', organization: '', dept: '', year: '', cgpa: '', designation: '' };

const GLASSDOOR_JOBS = 'https://www.glassdoor.co.in/Job/index.htm';

function Field({ label, children }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

/** Google's own sign-in button (Google Identity Services). We only receive a signed ID token. */
function GoogleButton({ clientId, onCredential }) {
  const ref = useRef(null);
  const callback = useRef(onCredential);
  useEffect(() => { callback.current = onCredential; }, [onCredential]);

  useEffect(() => {
    let cancelled = false;
    const render = () => {
      if (cancelled || !window.google?.accounts?.id || !ref.current) return;
      window.google.accounts.id.initialize({ client_id: clientId, callback: r => callback.current(r.credential) });
      window.google.accounts.id.renderButton(ref.current, { theme: 'outline', size: 'large', shape: 'rectangular', text: 'continue_with', width: 400 });
    };
    if (window.google?.accounts?.id) render();
    else {
      let script = document.querySelector('script[data-gsi]');
      if (!script) {
        script = Object.assign(document.createElement('script'), { src: 'https://accounts.google.com/gsi/client', async: true });
        script.dataset.gsi = '1';
        document.head.appendChild(script);
      }
      script.addEventListener('load', render);
    }
    return () => { cancelled = true; };
  }, [clientId]);

  return <div ref={ref} style={{ display: 'flex', justifyContent: 'center', minHeight: 44 }} />;
}

/** Role and organisation fields, shared by normal signup and finishing a social signup. */
function RoleFields({ form, set, setForm }) {
  return (
    <>
      <Field label="I am a">
        <div className="auth-roles">
          {ROLE_OPTIONS.map(r => (
            <button key={r.value} type="button" className={form.role === r.value ? 'active' : ''}
              onClick={() => setForm(f => ({ ...f, role: r.value }))}>{r.label}</button>
          ))}
        </div>
      </Field>
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
  );
}

export default function AuthPage() {
  const { login, register, googleSignIn, completeSocialSignup, oauthResult } = useAppState();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, name: oauthResult?.profile.name || '' }));
  const [error, setError] = useState(oauthResult?.error || '');
  const [busy, setBusy] = useState(false);
  const [providers, setProviders] = useState({ google: null, linkedin: false });
  // a verified Google/LinkedIn identity that still needs a role before the account exists
  const [pending, setPending] = useState(() => (oauthResult?.pending ? { token: oauthResult.pending, profile: oauthResult.profile } : null));

  useEffect(() => {
    api('/auth/providers').then(setProviders).catch(() => {});
  }, []);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (pending) await completeSocialSignup(pending.token, form);
      else if (mode === 'login') await login(form.email, form.password);
      else await register(form);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function onGoogle(credential) {
    setError('');
    try {
      const r = await googleSignIn(credential);
      if (r.status === 'needs-signup') {
        setPending({ token: r.pending, profile: r.profile });
        setForm(f => ({ ...f, name: r.profile.name || '' }));
      }
    } catch (err) { setError(err.message); }
  }

  function switchMode(m) {
    setMode(m);
    setError('');
  }

  const isSignup = mode === 'signup';
  const social = providers.google || providers.linkedin;

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">
          <div className="logo-icon">S</div>
          <div>
            <div className="auth-title">SkillBridge</div>
            <div className="auth-subtitle">Academia–Industry Collaboration Portal</div>
          </div>
        </div>

        {pending ? (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Finish signing up</div>
            <div style={{ fontSize: 13, color: '#525252', marginBottom: 16 }}>
              Signed in as <strong>{pending.profile.email}</strong>. Tell us who you are to create your account.
            </div>
            <Field label="Full name">
              <input className="form-input" value={form.name} onChange={set('name')} autoComplete="name" required />
            </Field>
            <RoleFields form={form} set={set} setForm={setForm} />
            {error && <div className="auth-error" role="alert">{error}</div>}
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={busy} style={{ marginTop: 8 }}>
              {busy ? 'Please wait…' : 'Create account'}
            </button>
            <div className="auth-switch">
              <button type="button" onClick={() => { setPending(null); setError(''); }}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="auth-tabs">
              <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Log in</button>
              <button type="button" className={isSignup ? 'active' : ''} onClick={() => switchMode('signup')}>Sign up</button>
            </div>

            {social && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {providers.google && <GoogleButton clientId={providers.google} onCredential={onGoogle} />}
                  {providers.linkedin && (
                    <a className="btn btn-ghost btn-lg w-full" href={`${BASE}/auth/linkedin/start`} style={{ justifyContent: 'center', textDecoration: 'none' }}>
                      Continue with LinkedIn
                    </a>
                  )}
                </div>
                <div className="auth-divider"><span>or with email</span></div>
              </>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {isSignup && (
                <Field label="Full name">
                  <input className="form-input" value={form.name} onChange={set('name')} autoComplete="name" required />
                </Field>
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
              {isSignup && <RoleFields form={form} set={set} setForm={setForm} />}

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
          </>
        )}

        <div className="auth-external">
          Looking for more openings? <a href={GLASSDOOR_JOBS} target="_blank" rel="noopener noreferrer">Browse jobs on Glassdoor ↗</a>
        </div>
      </div>
    </div>
  );
}
