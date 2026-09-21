import {
  LayoutDashboard, Brain, Map, Briefcase, BookOpen, UserCheck,
  Award, Users, BarChart3, GraduationCap, Building2,
  FlaskConical, Megaphone, ClipboardList, TrendingUp, Target,
  FileText, Star, Network, Layers
} from 'lucide-react';

const SIDEBAR_CONFIG = {
  student: [
    { label: 'Overview', items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
      { id: 'assessment', icon: Brain, label: 'Skill Assessment', badge: 'NEW' },
      { id: 'skill-gap', icon: Target, label: 'Skill Gap Analysis', badge: null },
    ]},
    { label: 'Opportunities', items: [
      { id: 'internships', icon: Briefcase, label: 'Internships & Jobs', badge: '25' },
      { id: 'learning', icon: BookOpen, label: 'Learning Pathways', badge: null },
      { id: 'mentorship', icon: UserCheck, label: 'Mentorship', badge: '3' },
    ]},
    { label: 'Profile', items: [
      { id: 'portfolio', icon: Award, label: 'Digital Portfolio', badge: null },
      { id: 'applications', icon: ClipboardList, label: 'My Applications', badge: '2' },
    ]}
  ],
  faculty: [
    { label: 'Overview', items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
      { id: 'fdp', icon: GraduationCap, label: 'FDP Programs', badge: '6' },
      { id: 'industrial', icon: Building2, label: 'Industrial Training', badge: null },
    ]},
    { label: 'Collaboration', items: [
      { id: 'consultancy', icon: FlaskConical, label: 'Consultancy & R&D', badge: '2' },
      { id: 'guest-lectures', icon: Megaphone, label: 'Guest Lectures', badge: null },
      { id: 'mentorship', icon: Users, label: 'Student Mentorship', badge: '12' },
    ]},
    { label: 'Profile', items: [
      { id: 'publications', icon: FileText, label: 'Publications & Patents', badge: null },
    ]}
  ],
  industry: [
    { label: 'Recruitment', items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
      { id: 'post-job', icon: Briefcase, label: 'Post Opportunities', badge: null },
      { id: 'talent', icon: Users, label: 'Talent Discovery', badge: '128' },
      { id: 'pipeline', icon: Layers, label: 'ATS Pipeline', badge: '6' },
    ]},
    { label: 'Programs', items: [
      { id: 'programs', icon: BookOpen, label: 'Training Programs', badge: null },
      { id: 'challenges', icon: Star, label: 'Challenges & Hackathons', badge: null },
    ]},
    { label: 'Analytics', items: [
      { id: 'analytics', icon: BarChart3, label: 'Recruitment Analytics', badge: null },
    ]}
  ],
  institution: [
    { label: 'Overview', items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
      { id: 'pri', icon: TrendingUp, label: 'Placement Readiness', badge: null },
      { id: 'skill-heatmap', icon: Map, label: 'Skill Gap Heatmap', badge: null },
    ]},
    { label: 'Analytics', items: [
      { id: 'analytics', icon: BarChart3, label: 'Recruitment Analytics', badge: null },
      { id: 'students', icon: Users, label: 'Student Tracker', badge: null },
    ]},
    { label: 'Management', items: [
      { id: 'verification', icon: UserCheck, label: 'Credential Verification', badge: '14' },
      { id: 'companies', icon: Building2, label: 'Company Relations', badge: null },
    ]}
  ]
};

export default function Sidebar({ role, activePage, onPageChange }) {
  const config = SIDEBAR_CONFIG[role] || [];

  return (
    <aside className="sidebar">
      {config.map((section, si) => (
        <div key={si} className="sidebar-section">
          <div className="sidebar-label">{section.label}</div>
          {section.items.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar-link ${activePage === item.id ? 'active' : ''}`}
                onClick={() => onPageChange(item.id)}
              >
                <Icon size={16} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
              </button>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
