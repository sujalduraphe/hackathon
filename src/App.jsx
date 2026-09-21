import { useState } from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SkillAssessment from './pages/student/SkillAssessment';
import SkillGapAnalysis from './pages/student/SkillGapAnalysis';
import InternshipsJobs from './pages/student/InternshipsJobs';
import LearningPathways from './pages/student/LearningPathways';
import DigitalPortfolio from './pages/student/DigitalPortfolio';
import MentorshipPortal from './pages/student/MentorshipPortal';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyPrograms from './pages/faculty/FacultyPrograms';
import ConsultancyHub from './pages/faculty/ConsultancyHub';

// Industry Pages
import IndustryDashboard from './pages/industry/IndustryDashboard';
import TalentDiscovery from './pages/industry/TalentDiscovery';
import PostJob from './pages/industry/PostJob';
import RecruitmentAnalytics from './pages/industry/RecruitmentAnalytics';

// Institution Pages
import InstitutionDashboard from './pages/institution/InstitutionDashboard';
import CredentialVerification from './pages/institution/CredentialVerification';
import StudentTracker from './pages/institution/StudentTracker';

// Student Applications (simple placeholder component)
function StudentApplications() {
  const apps = [
    { company: 'Google', role: 'SWE Intern', status: 'Shortlisted', date: '2026-09-01', logo: '🔵', color: '#10b981' },
    { company: 'Flipkart', role: 'Data Science Intern', status: 'Applied', date: '2026-09-03', logo: '🛍️', color: '#6366f1' },
    { company: 'Razorpay', role: 'ML Engineer', status: 'Applied', date: '2026-09-05', logo: '💳', color: '#6366f1' },
  ];

  const statusColors = { 'Shortlisted': '#10b981', 'Applied': '#6366f1', 'Rejected': '#f43f5e', 'Offered': '#f59e0b' };

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">📋 My Applications</h1>
        <p className="page-hero-subtitle">Track the status of all your internship and job applications.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {apps.map((a, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${a.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{a.logo}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#111827' }}>{a.role}</div>
              <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{a.company} · Applied {a.date}</div>
            </div>

            <div style={{
              padding: '6px 16px', borderRadius: 20,
              background: `${statusColors[a.status]}22`, color: statusColors[a.status],
              border: `1px solid ${statusColors[a.status]}44`, fontWeight: 600, fontSize: 13
            }}>{a.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple "Coming Soon" placeholder for unbuilt pages
function ComingSoon({ title }) {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🚧</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>{title}</h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>This module is being built. More features coming soon!</p>
    </div>
  );
}

// Role Landing Page
function RoleLanding({ onSelectRole }) {
  const roles = [
    { key: 'student', icon: '🎓', title: 'Student', desc: 'Assess skills, find internships, build your digital portfolio and track your career journey.', color: '#10b981' },
    { key: 'faculty', icon: '👨‍🏫', title: 'Faculty / Academician', desc: 'Explore FDPs, industrial training, research collaborations, and mentor students effectively.', color: '#f59e0b' },
    { key: 'industry', icon: '🏢', title: 'Industry Recruiter', desc: 'Post jobs, discover top talent from colleges, manage your hiring pipeline with ATS.', color: '#f43f5e' },
    { key: 'institution', icon: '🏛️', title: 'Institution / TPO', desc: 'Monitor placement readiness, skill gaps, analytics, and drive data-driven curriculum decisions.', color: '#06b6d4' },
  ];

  return (
    <div className="landing-hero">
      <div>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, boxShadow: '0 4px 20px rgba(99,102,241,0.35)', color: 'white'
          }}>⚡</div>
        </div>

        <h1 className="landing-title">Skill<span>Bridge</span></h1>
        <p className="landing-subtitle">
          The unified Academia–Industry Collaboration Portal connecting Students, Faculty, Companies, and Institutions for smarter skill development, internships, and placements.
        </p>

        {/* Feature Pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
          {['🧠 AI Skill Assessment', '🎯 Smart Job Matching', '📊 Gap Analysis', '🗂️ ATS Pipeline', '🏆 Digital Portfolio', '📚 FDP & Training'].map(f => (
            <span key={f} style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280'
            }}>{f}</span>
          ))}
        </div>

        <div style={{ marginBottom: 16, fontSize: 15, color: '#9ca3af', fontWeight: 500 }}>
          Select your role to get started:
        </div>

        <div className="role-cards-grid">
          {roles.map(role => (
            <div
              key={role.key}
              className={`role-card ${role.key}`}
              onClick={() => onSelectRole(role.key)}
            >
              <div className="role-card-icon">{role.icon}</div>
              <div className="role-card-title" style={{ color: role.color }}>{role.title}</div>
              <div className="role-card-desc">{role.desc}</div>
              <div style={{ marginTop: 16 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 13, fontWeight: 600, color: role.color
                }}>Enter Portal →</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, fontSize: 13, color: '#9ca3af' }}>
          🎓 NITK Surathkal Demo · Built for Smart India Hackathon 2026 · Problem ID: 26044
        </div>
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
    if (page === 'internships') return <InternshipsJobs />;
    if (page === 'learning') return <LearningPathways />;
    if (page === 'portfolio') return <DigitalPortfolio />;
    if (page === 'applications') return <StudentApplications />;
    if (page === 'mentorship') return <MentorshipPortal role="student" />;
    return <StudentDashboard onNavigate={onNavigate} />;
  }

  // Faculty pages
  if (role === 'faculty') {
    if (page === 'dashboard') return <FacultyDashboard onNavigate={onNavigate} />;
    if (page === 'fdp') return <FacultyPrograms />;
    if (page === 'industrial') return <FacultyPrograms />;
    if (page === 'consultancy') return <ConsultancyHub />;
    if (page === 'guest-lectures') return <ComingSoon title="Guest Lectures & Knowledge Exchange" />;
    if (page === 'mentorship') return <MentorshipPortal role="faculty" />;
    if (page === 'publications') return <ComingSoon title="Publications & Patents" />;
    return <FacultyDashboard onNavigate={onNavigate} />;
  }

  // Industry pages
  if (role === 'industry') {
    if (page === 'dashboard') return <IndustryDashboard onNavigate={onNavigate} />;
    if (page === 'talent') return <TalentDiscovery />;
    if (page === 'pipeline') return <IndustryDashboard onNavigate={onNavigate} />;
    if (page === 'post-job') return <PostJob />;
    if (page === 'programs') return <ComingSoon title="Training Programs & Certifications" />;
    if (page === 'challenges') return <ComingSoon title="Hackathons & Industry Challenges" />;
    if (page === 'analytics') return <RecruitmentAnalytics />;
    return <IndustryDashboard onNavigate={onNavigate} />;
  }

  // Institution pages
  if (role === 'institution') {
    if (page === 'dashboard') return <InstitutionDashboard onNavigate={onNavigate} />;
    if (page === 'pri') return <StudentTracker />;
    if (page === 'skill-heatmap') return <InstitutionDashboard onNavigate={onNavigate} />;
    if (page === 'analytics') return <InstitutionDashboard onNavigate={onNavigate} />;
    if (page === 'students') return <StudentTracker />;
    if (page === 'verification') return <CredentialVerification />;
    if (page === 'companies') return <ComingSoon title="Company Relations" />;
    return <InstitutionDashboard onNavigate={onNavigate} />;
  }

  return null;
}

export default function App() {
  const [role, setRole] = useState(null);
  const [page, setPage] = useState('dashboard');

  function handleRoleChange(newRole) {
    setRole(newRole);
    setPage('dashboard');
  }

  function handlePageChange(newPage) {
    setPage(newPage);
  }

  return (
    <>
      {/* Animated background */}
      <div className="app-bg">
        <div className="orb3" />
      </div>

      {!role ? (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <RoleLanding onSelectRole={handleRoleChange} />
        </div>
      ) : (
        <div className="app-shell">
          <Topbar role={role} onRoleChange={handleRoleChange} />
          <div className="main-layout">
            <Sidebar role={role} activePage={page} onPageChange={handlePageChange} />
            <main className="main-content">
              <PageContent role={role} page={page} onNavigate={handlePageChange} />
            </main>
          </div>
        </div>
      )}
    </>
  );
}
