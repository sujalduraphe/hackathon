
import { TrendingUp, Briefcase, Brain, Award, ArrowRight, Clock } from 'lucide-react';
import { useAppState, STAGE_LABELS } from '../../state/AppState';
import { explainMatch, closestRole, TIER_COLOR, matchTier } from '../../lib/matching';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function StudentDashboard({ onNavigate }) {
  const { profile, jobs, applications, assessments } = useAppState();
  const user = profile;
  const hasSkills = Object.keys(profile.skills || {}).length > 0;

  const skillRadarData = Object.entries(profile.skills).slice(0, 8).map(([name, value]) => ({
    skill: name.length > 12 ? name.slice(0, 12) + '..' : name, value
  }));

  const matches = jobs
    .map(j => ({ ...j, match: explainMatch(profile.skills, j, profile.cgpa).score }))
    .sort((a, b) => b.match - a.match);
  const strongMatches = matches.filter(j => j.match >= 80).length;
  const myApps = applications;
  const activeApps = myApps.filter(a => a.status !== 'rejected' && a.status !== 'offered').length;
  const verified = Object.values(profile.skillSource || {}).filter(v => v === 'assessment').length;
  const skillValues = Object.values(profile.skills || {});
  const avgSkill = skillValues.length ? Math.round(skillValues.reduce((a, b) => a + b, 0) / skillValues.length) : 0;
  const bestRole = closestRole(profile.skills, jobs);

  const jobById = Object.fromEntries(jobs.map(j => [j.id, j]));
  const activity = [
    ...assessments.map(a => ({ icon: '📊', text: `Completed ${a.category} assessment (${a.score}%)`, at: a.at })),
    ...myApps.flatMap(a => a.history.map(h => ({
      icon: h.status === 'offered' ? '🎉' : h.status === 'applied' ? '📨' : '📌',
      text: `${jobById[a.jobId]?.company || 'Job'} – ${jobById[a.jobId]?.title || ''}: ${STAGE_LABELS[h.status]}`,
      at: h.at,
    }))),
  ].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6);

  const statCards = [
    { label: 'Avg Skill Level', value: `${avgSkill}%`, icon: Brain, color: '#6366f1', change: `${verified} verified skills`, up: true, bg: 'rgba(99,102,241,0.1)' },
    { label: 'Applications', value: String(myApps.length), icon: Briefcase, color: '#10b981', change: `${activeApps} active`, up: true, bg: 'rgba(16,185,129,0.1)' },
    { label: 'Assessments', value: String(assessments.length), icon: Award, color: '#f59e0b', change: 'taken on portal', up: true, bg: 'rgba(245,158,11,0.1)' },
    { label: 'Strong Matches', value: String(strongMatches), icon: TrendingUp, color: '#f43f5e', change: `of ${jobs.length} openings`, up: true, bg: 'rgba(244,63,94,0.1)' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Greeting */}
      <div className="page-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: 'white', boxShadow: '0 4px 16px rgba(16,185,129,0.3)'
          }}>
            {user.avatar}
          </div>
          <div>
            <h1 className="page-hero-title" style={{ fontSize: 28 }}>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
            <p className="page-hero-subtitle">{[user.year && `${user.year} Year`, user.dept, user.college, user.cgpa != null && `CGPA: ${user.cgpa}`].filter(Boolean).join(' · ')}</p>
          </div>
        </div>

        {/* Progress Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #eef2ff, #f0fdf4)',
          border: '1px solid #c7d2fe',
          borderRadius: 16, padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
        }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4, color: '#111827' }}>
              {hasSkills
                ? <>🎯 Readiness for {bestRole.role}: <span style={{ color: '#6366f1' }}>{bestRole.readiness}%</span></>
                : <>🎯 Build your skill profile</>}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              {!hasSkills
                ? 'Take a skill assessment to create your profile. Matches and gap analysis are based on it.'
                : verified === 0
                ? 'Your levels are self-declared. Take an assessment to verify them and sharpen your matches.'
                : `${verified} skill${verified > 1 ? 's' : ''} verified by assessment. Close your top gap to raise this further.`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('assessment')}>
              Take Assessment <ArrowRight size={12} />
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('skill-gap')}>View Gaps</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="stat-icon" style={{ background: s.bg }}>
                  <Icon size={20} color={s.color} />
                </div>
                <span className="stat-change up">{s.change}</span>
              </div>
              <div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Radar Chart */}
        <div className="chart-container">
          <div className="section-header">
            <div>
              <div className="section-title">Skill Profile</div>
              <div className="section-subtitle">Your current competency overview</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('skill-gap')}>
              View Gap Analysis
            </button>
          </div>
          {!hasSkills && (
            <div style={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#9ca3af', fontSize: 13 }}>
              No skills yet.
              <button className="btn btn-primary btn-sm" onClick={() => onNavigate('assessment')}>Take your first assessment</button>
            </div>
          )}
          {hasSkills && <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={skillRadarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Radar name="Skills" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, color: '#111827' }}
                formatter={(v) => [`${v}%`, 'Proficiency']}
              />
            </RadarChart>
          </ResponsiveContainer>}
        </div>

        {/* Skill Levels */}
        <div className="card" style={{ padding: 24 }}>
          <div className="section-header">
            <div>
              <div className="section-title">Top Skills</div>
              <div className="section-subtitle">Proficiency levels</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(user.skills).slice(0, 6).map(([skill, val]) => {
              const color = val >= 75 ? '#10b981' : val >= 55 ? '#f59e0b' : '#f43f5e';
              return (
                <div key={skill} className="progress-container">
                  <div className="progress-label">
                    <span>{skill}</span>
                    <span style={{ color, fontWeight: 600 }}>{val}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${val}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-header">
          <div>
            <div className="section-title">🎯 Top Matches for You</div>
            <div className="section-subtitle">Based on your skill profile and assessment scores</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('internships')}>View All →</button>
        </div>
        <div className="grid-auto">
          {!hasSkills && <div style={{ fontSize: 13, color: '#9ca3af' }}>Matches appear after your first assessment.</div>}
          {hasSkills && matches.slice(0, 3).map(job => (
            <div key={job.id} className="job-card" onClick={() => onNavigate('internships')}>
              <div className="job-card-header">
                <div className="company-logo" style={{ background: `${job.color}22`, fontSize: 24 }}>{job.logo}</div>
                <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2, color: '#111827' }}>{job.title}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af' }}>{job.company}</div>
                  <div className="job-card-meta">
                    <span className="job-meta-item"><span>📍</span>{job.location}</span>
                    <span className="job-meta-item"><span>💰</span>{job.stipend}</span>
                    <span className="job-meta-item"><span>⏱️</span>{job.duration}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="skill-tags">
                  {job.skills.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
                </div>
                <div className="match-score" style={{ color: TIER_COLOR[matchTier(job.match)] }}>
                  <div className="match-score-bar"><div className="match-score-fill" style={{ width: `${job.match}%` }} /></div>
                  {job.match}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gaps & Activity */}
      <div className="grid-2">
        <div className="card">
          <div className="section-title" style={{ marginBottom: 4 }}>Top skill gaps for {bestRole.role}</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>Closing these raises your match score the most.</div>
          {bestRole.gaps.filter(g => g.gap > 0).slice(0, 4).map(g => (
            <div key={g.name} className="progress-container" style={{ marginBottom: 12 }}>
              <div className="progress-label">
                <span>{g.name}</span>
                <span style={{ color: '#6b7280' }}>{g.current}% / {g.target}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill progress-primary" style={{ width: `${Math.min(100, (g.current / g.target) * 100)}%` }} />
              </div>
            </div>
          ))}
          {bestRole.gaps.every(g => g.gap === 0) && (
            <div style={{ fontSize: 13, color: '#10b981' }}>You meet every requirement for this role.</div>
          )}
          <button className="btn btn-primary btn-sm w-full" style={{ marginTop: 8 }} onClick={() => onNavigate('learning')}>
            See learning recommendations <ArrowRight size={12} />
          </button>
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>Recent activity</div>
          {activity.length === 0 && <div style={{ fontSize: 13, color: '#9ca3af' }}>No activity yet.</div>}
          {activity.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < activity.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: '#374151' }}>{item.text}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                  <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />{new Date(item.at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
