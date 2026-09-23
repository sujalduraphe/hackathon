import { useState } from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import { AppStateProvider, useAppState, APPLICATION_STAGES, STAGE_LABELS, STAGE_COLORS } from './state/AppState';
import AuthPage from './pages/auth/AuthPage';
import { explainMatch } from './lib/matching';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SkillAssessment from './pages/student/SkillAssessment';
import SkillGapAnalysis from './pages/student/SkillGapAnalysis';
import InternshipsJobs from './pages/student/InternshipsJobs';
import LearningPathways from './pages/student/LearningPathways';
import DigitalPortfolio from './pages/student/DigitalPortfolio';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyPrograms from './pages/faculty/FacultyPrograms';
import ConsultancyHub from './pages/faculty/ConsultancyHub';
import GuestLectures from './pages/faculty/GuestLectures';
import ResearchCollaboration from './pages/faculty/ResearchCollaboration';

// Industry Pages
import IndustryDashboard from './pages/industry/IndustryDashboard';
import TalentDiscovery from './pages/industry/TalentDiscovery';
import PostJob from './pages/industry/PostJob';
import TrainingPrograms from './pages/industry/TrainingPrograms';
import IndustryChallenges from './pages/industry/IndustryChallenges';

// Institution Pages
import InstitutionDashboard from './pages/institution/InstitutionDashboard';
import CredentialVerification from './pages/institution/CredentialVerification';
import StudentTracker from './pages/institution/StudentTracker';


// Student Applications — live statuses from the shared store, so a recruiter's
// shortlist/interview/offer decision shows up here immediately.
function StudentApplications({ onNavigate }) {
  const { applications, jobs, profile } = useAppState();
  const mine = applications
    .filter(a => a.candidateId === profile.id)
    .map(a => ({ ...a, job: jobs.find(j => j.id === a.jobId) }))
    .filter(a => a.job)
    .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">📋 My Applications</h1>
        <p className="page-hero-subtitle">Track the status of all your internship and job applications.</p>
      </div>
      {mine.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          No applications yet. <button className="btn btn-primary btn-sm" onClick={() => onNavigate('internships')}>Browse matches</button>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mine.map(a => {
          const color = STAGE_COLORS[a.status];
          const m = explainMatch(profile.skills, a.job, profile.cgpa);
          const stageIdx = APPLICATION_STAGES.indexOf(a.status);
          return (
            <div key={a.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${a.job.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{a.job.logo}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#111827' }}>{a.job.title}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>
                    {a.job.company} · Applied {a.appliedAt.slice(0, 10)} · Current match {m.score}%
                  </div>
                </div>
                <div style={{
                  padding: '6px 16px', borderRadius: 20,
                  background: `${color}22`, color, border: `1px solid ${color}44`, fontWeight: 600, fontSize: 13
                }}>{STAGE_LABELS[a.status]}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {APPLICATION_STAGES.map((st, i) => (
                  <div key={st} style={{
                    flex: 1, height: 6, borderRadius: 3,
                    background: a.status !== 'rejected' && i <= stageIdx ? STAGE_COLORS[st] : '#e5e7eb'
                  }} title={STAGE_LABELS[st]} />
                ))}
              </div>
              {a.history.length > 1 && (
                <div style={{ fontSize: 12, color: '#9ca3af' }}>
                  {a.history.map(h => `${STAGE_LABELS[h.status]} (${h.at.slice(0, 10)})`).join(' → ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Page Router
function PageContent({ role, page, onNavigate }) {
  // Student pages
  if (role === 'student') {
    if (page === 'dashboard') return <StudentDashboard onNavigate={onNavigate} />;
    if (page === 'assessment') return <SkillAssessment onNavigate={onNavigate} />;
    if (page === 'skill-gap') return <SkillGapAnalysis onNavigate={onNavigate} />;
    if (page === 'internships') return <InternshipsJobs onNavigate={onNavigate} />;
    if (page === 'learning') return <LearningPathways onNavigate={onNavigate} />;
    if (page === 'portfolio') return <DigitalPortfolio />;
    if (page === 'applications') return <StudentApplications onNavigate={onNavigate} />;
    return <StudentDashboard onNavigate={onNavigate} />;
  }

  // Faculty pages
  if (role === 'faculty') {
    if (page === 'dashboard') return <FacultyDashboard onNavigate={onNavigate} />;
    if (page === 'fdp') return <FacultyPrograms />;
    if (page === 'industrial') return <FacultyPrograms />;
    if (page === 'consultancy') return <ConsultancyHub />;
    if (page === 'guest-lectures') return <GuestLectures />;
    if (page === 'research') return <ResearchCollaboration />;
    return <FacultyDashboard onNavigate={onNavigate} />;
  }

  // Industry pages
  if (role === 'industry') {
    if (page === 'dashboard') return <IndustryDashboard onNavigate={onNavigate} />;
    if (page === 'talent') return <TalentDiscovery />;
    if (page === 'post-job') return <PostJob onNavigate={onNavigate} />;
    if (page === 'programs') return <TrainingPrograms />;
    if (page === 'challenges') return <IndustryChallenges />;
    return <IndustryDashboard onNavigate={onNavigate} />;
  }

  // Institution pages
  if (role === 'institution') {
    if (page === 'dashboard') return <InstitutionDashboard onNavigate={onNavigate} />;
    if (page === 'pri') return <StudentTracker />;
    if (page === 'verification') return <CredentialVerification />;
    return <InstitutionDashboard onNavigate={onNavigate} />;
  }

  return null;
}

function Portal() {
  const { user, status, logout } = useAppState();
  const [page, setPage] = useState('dashboard');

  if (status === 'loading') return <div className="auth-loading">Loading…</div>;
  if (!user) return <AuthPage />;

  // the role comes from the authenticated account, never from the UI
  const role = user.role;
  return (
    <div className="app-shell">
      <Topbar user={user} onLogout={() => { setPage('dashboard'); logout(); }} />
      <div className="main-layout">
        <Sidebar role={role} activePage={page} onPageChange={setPage} />
        <main className="main-content">
          <PageContent role={role} page={page} onNavigate={setPage} />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <div className="app-bg"><div className="orb3" /></div>
      <Portal />
    </AppStateProvider>
  );
}
