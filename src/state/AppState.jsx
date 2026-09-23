// Session + data store backed by the API. After login it loads only the data
// the user's role is allowed to see (the server enforces the same rules), and
// exposes the actions that role can take.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokenStore, setUnauthorizedHandler } from '../lib/api';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../lib/demo';

const AppStateContext = createContext(null);

const EMPTY = { profile: null, jobs: [], candidates: [], applications: [], assessments: [], analytics: null, programs: [], registrations: [], market: null };

async function loadRoleData(role) {
  if (role === 'student') {
    const [profile, jobs, applications, assessments, programs, registrations, market] = await Promise.all([
      api('/students/me'), api('/jobs'), api('/applications'), api('/assessments'), api('/programs'), api('/registrations'), api('/market/summary'),
    ]);
    return { ...EMPTY, profile, jobs, applications, assessments, programs, registrations, market };
  }
  if (role === 'industry') {
    const [jobs, candidates, applications, programs] = await Promise.all([
      api('/jobs?mine=1'), api('/students'), api('/applications'), api('/programs'),
    ]);
    return { ...EMPTY, jobs, candidates, applications, programs };
  }
  if (role === 'institution') {
    const [candidates, applications, jobs, analytics, market] = await Promise.all([
      api('/students'), api('/applications'), api('/jobs'), api('/analytics/institution'), api('/market/summary'),
    ]);
    return { ...EMPTY, candidates, applications, jobs, analytics, market };
  }
  if (role === 'faculty') {
    const [programs, registrations] = await Promise.all([api('/programs'), api('/registrations')]);
    return { ...EMPTY, programs, registrations };
  }
  return { ...EMPTY };
}

export function AppStateProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(tokenStore.get() ? 'loading' : 'anonymous'); // loading | anonymous | ready
  const [data, setData] = useState(EMPTY);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setData(EMPTY);
    setStatus('anonymous');
  }, []);

  useEffect(() => { setUnauthorizedHandler(logout); }, [logout]);

  const startSession = useCallback(async u => {
    setData(await loadRoleData(u.role));
    setUser(u);
    setStatus('ready');
  }, []);

  // restore a session from a stored token
  useEffect(() => {
    if (!tokenStore.get()) return;
    api('/auth/me').then(({ user: u }) => startSession(u)).catch(logout);
  }, [startSession, logout]);

  const actions = useMemo(() => ({
    async login(email, password) {
      const { token, user: u } = await api('/auth/login', { method: 'POST', body: { email, password } });
      tokenStore.set(token);
      await startSession(u);
    },
    async register(form) {
      const { token, user: u } = await api('/auth/register', { method: 'POST', body: form });
      tokenStore.set(token);
      await startSession(u);
    },
    logout,

    // demo: log in as the seeded account for a role
    async switchRole(role) {
      const { token, user: u } = await api('/auth/login', { method: 'POST', body: { email: DEMO_ACCOUNTS[role], password: DEMO_PASSWORD } });
      tokenStore.set(token);
      await startSession(u);
    },

    // student
    async submitAssessment(category, answers) {
      const r = await api('/assessments', { method: 'POST', body: { category, answers } });
      setData(d => ({ ...d, profile: r.profile, assessments: [r.assessment, ...d.assessments] }));
      return r;
    },
    async apply(jobId) {
      const app = await api('/applications', { method: 'POST', body: { jobId } });
      setData(d => ({
        ...d,
        applications: [app, ...d.applications],
        jobs: d.jobs.map(j => (j.id === jobId ? { ...j, applicants: (j.applicants || 0) + 1 } : j)),
      }));
    },

    async uploadResume(file) {
      const form = new FormData();
      form.append('resume', file);
      const r = await api('/students/me/resume', { method: 'POST', body: form });
      setData(d => ({ ...d, profile: r.profile }));
      return r;
    },
    async deleteResume() {
      const profile = await api('/students/me/resume', { method: 'DELETE' });
      setData(d => ({ ...d, profile }));
    },
    async addSkills(skills) {
      const profile = await api('/students/me/skills', { method: 'POST', body: { skills } });
      setData(d => ({ ...d, profile }));
    },

    async addPortfolioItem(kind, item) {
      const profile = await api(`/students/me/portfolio/${kind}`, { method: 'POST', body: item });
      setData(d => ({ ...d, profile }));
    },
    async removePortfolioItem(kind, itemId) {
      const profile = await api(`/students/me/portfolio/${kind}/${itemId}`, { method: 'DELETE' });
      setData(d => ({ ...d, profile }));
    },

    // institution
    async verifyPortfolioItem(studentId, kind, itemId, verified = true) {
      const student = await api(`/students/${studentId}/portfolio/${kind}/${itemId}`, { method: 'PATCH', body: { verified } });
      setData(d => ({ ...d, candidates: d.candidates.map(c => (c.id === studentId ? student : c)) }));
    },

    // student & faculty
    async registerProgram(programId, message) {
      const reg = await api(`/programs/${programId}/register`, { method: 'POST', body: { message } });
      setData(d => ({
        ...d,
        registrations: [reg, ...d.registrations],
        programs: d.programs.map(p => (p.id === programId ? { ...p, registrations: p.registrations + 1 } : p)),
      }));
    },

    // institution: market job-description imports (e.g. Glassdoor exports)
    async importMarketCSV(file, source) {
      const form = new FormData();
      form.append('file', file);
      form.append('source', source);
      const result = await api('/market/import', { method: 'POST', body: form });
      const [market, analytics] = await Promise.all([api('/market/summary'), api('/analytics/institution')]);
      setData(d => ({ ...d, market, analytics }));
      return result;
    },
    async deleteMarketBatch(batch) {
      await api(`/market/batches/${batch}`, { method: 'DELETE' });
      const [market, analytics] = await Promise.all([api('/market/summary'), api('/analytics/institution')]);
      setData(d => ({ ...d, market, analytics }));
    },

    // industry: programs
    async createProgram(program) {
      const created = await api('/programs', { method: 'POST', body: program });
      setData(d => ({ ...d, programs: [created, ...d.programs] }));
    },
    async deleteProgram(id) {
      await api(`/programs/${id}`, { method: 'DELETE' });
      setData(d => ({ ...d, programs: d.programs.filter(p => p.id !== id) }));
    },
    programRegistrations: id => api(`/programs/${id}/registrations`),
    async decideRegistration(regId, status) {
      const updated = await api(`/registrations/${regId}`, { method: 'PATCH', body: { status } });
      const programs = await api('/programs'); // refresh seat counts from the server
      setData(d => ({ ...d, programs }));
      return updated;
    },

    // industry: jobs
    async postJob(job) {
      const created = await api('/jobs', { method: 'POST', body: job });
      setData(d => ({ ...d, jobs: [created, ...d.jobs] }));
      return created;
    },
    extractSkills: text => api('/jobs/extract-skills', { method: 'POST', body: { text } }),
    async setApplicationStatus(id, next) {
      const updated = await api(`/applications/${id}`, { method: 'PATCH', body: { status: next } });
      setData(d => ({ ...d, applications: d.applications.map(a => (a.id === id ? updated : a)) }));
    },
  }), [logout, startSession]);

  // Resumes need the auth header, so fetch the PDF and open it from a blob URL.
  // The tab is opened first (synchronously) so popup blockers allow it.
  const openResume = useCallback(async studentId => {
    const tab = window.open('', '_blank');
    try {
      const res = await api(`/students/${studentId}/resume`, { raw: true });
      const url = URL.createObjectURL(await res.blob());
      if (tab) tab.location.href = url; else window.location.href = url;
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      tab?.close();
      throw err;
    }
  }, []);

  const value = useMemo(() => ({ user, status, ...data, ...actions, openResume }), [user, status, data, actions, openResume]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
}

export const APPLICATION_STAGES = ['applied', 'shortlisted', 'assessment', 'interview', 'offered'];
export const STAGE_LABELS = { applied: 'Applied', shortlisted: 'Shortlisted', assessment: 'Assessment', interview: 'Interview', offered: 'Offered', rejected: 'Not selected' };
export const STAGE_COLORS = { applied: '#111111', shortlisted: '#f59e0b', assessment: '#06b6d4', interview: '#f43f5e', offered: '#10b981', rejected: '#9ca3af' };
