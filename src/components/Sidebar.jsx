import {
  LayoutDashboard, Brain, Briefcase, BookOpen, UserCheck,
  Award, Users, GraduationCap, Building2,
  FlaskConical, Megaphone, ClipboardList, TrendingUp, Target,
  Star, Beaker
} from 'lucide-react';

const SIDEBAR_CONFIG = {
  student: [
    { label: 'Overview', items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'assessment', icon: Brain, label: 'Skill Assessment' },
      { id: 'skill-gap', icon: Target, label: 'Skill Gap Analysis' },
    ]},
    { label: 'Opportunities', items: [
      { id: 'internships', icon: Briefcase, label: 'Internships & Jobs' },
      { id: 'learning', icon: BookOpen, label: 'Learning Pathways' },
      { id: 'programs', icon: UserCheck, label: 'Programs & Mentorship' },
    ]},
    { label: 'Profile', items: [
      { id: 'portfolio', icon: Award, label: 'Digital Portfolio' },
      { id: 'applications', icon: ClipboardList, label: 'My Applications' },
    ]}
  ],
  faculty: [
    { label: 'Overview', items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'fdp', icon: GraduationCap, label: 'FDP Programs' },
      { id: 'industrial', icon: Building2, label: 'Industrial Training' },
    ]},
    { label: 'Collaboration', items: [
      { id: 'consultancy', icon: FlaskConical, label: 'Consultancy' },
      { id: 'research', icon: Beaker, label: 'Collaborative Research' },
      { id: 'guest-lectures', icon: Megaphone, label: 'Guest Lectures' },
      { id: 'workshops', icon: Star, label: 'Workshops & Live Projects' },
    ]}
  ],
  industry: [
    { label: 'Recruitment', items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'post-job', icon: Briefcase, label: 'Post Opportunities' },
      { id: 'talent', icon: Users, label: 'Talent Discovery' },
    ]},
    { label: 'Collaboration', items: [
      { id: 'programs', icon: BookOpen, label: 'Programs & Collaboration' },
    ]}
  ],
  institution: [
    { label: 'Overview', items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'pri', icon: TrendingUp, label: 'Placement Readiness' },
    ]},
    { label: 'Students', items: [
      { id: 'verification', icon: UserCheck, label: 'Credential Verification' },
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
                              </button>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
