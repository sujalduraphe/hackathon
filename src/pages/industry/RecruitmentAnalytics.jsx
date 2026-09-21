import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6'];

const pipelineData = [
  { stage: 'Applied', count: 248, pct: 100 },
  { stage: 'Shortlisted', count: 62, pct: 25 },
  { stage: 'Assessment', count: 38, pct: 15 },
  { stage: 'Interview', count: 21, pct: 8.5 },
  { stage: 'Offered', count: 12, pct: 4.8 },
  { stage: 'Joined', count: 9, pct: 3.6 },
];

const weeklyData = [
  { week: 'W1 Aug', applications: 22, shortlisted: 5 },
  { week: 'W2 Aug', applications: 38, shortlisted: 9 },
  { week: 'W3 Aug', applications: 55, shortlisted: 14 },
  { week: 'W4 Aug', applications: 42, shortlisted: 11 },
  { week: 'W1 Sep', applications: 60, shortlisted: 15 },
  { week: 'W2 Sep', applications: 31, shortlisted: 8 },
];

const skillDemandData = [
  { skill: 'Python', applied: 180, shortlisted: 42 },
  { skill: 'ML', applied: 120, shortlisted: 38 },
  { skill: 'React', applied: 95, shortlisted: 22 },
  { skill: 'SQL', applied: 160, shortlisted: 35 },
  { skill: 'AWS', applied: 60, shortlisted: 18 },
  { skill: 'Java', applied: 88, shortlisted: 14 },
];

const collegeBreakdown = [
  { name: 'NITK', value: 48 },
  { name: 'IIT Madras', value: 22 },
  { name: 'BITS Pilani', value: 18 },
  { name: 'VIT', value: 35 },
  { name: 'NITW', value: 28 },
  { name: 'Others', value: 97 },
];

const jobPerformance = [
  { role: 'SWE Intern', applicants: 124, shortlisted: 32, match: 82, deadline: '2026-10-15', status: 'Active' },
  { role: 'ML Engineer', applicants: 89, shortlisted: 18, match: 75, deadline: '2026-11-01', status: 'Active' },
  { role: 'Full Stack Intern', applicants: 35, shortlisted: 12, match: 68, deadline: '2026-10-20', status: 'Active' },
];

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13 }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: '#111827' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', gap: 8 }}>
          <span>{p.name}:</span><strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function RecruitmentAnalytics() {
  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">📊 Recruitment Analytics</h1>
        <p className="page-hero-subtitle">Deep insights into your hiring pipeline, candidate quality, and application trends.</p>
      </div>

      {/* KPI row */}
      <div className="stat-grid" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total Applications', value: '248', change: '+12 this week', color: '#6366f1', icon: '📥' },
          { label: 'Offer Conversion Rate', value: '4.8%', change: 'Industry avg: 3.2%', color: '#10b981', icon: '✅' },
          { label: 'Avg Time to Hire', value: '18 days', change: '-3 days vs last cycle', color: '#f59e0b', icon: '⏱️' },
          { label: 'Avg Candidate Match', value: '74%', change: 'High quality pool', color: '#f43f5e', icon: '🎯' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color, fontSize: 22 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Funnel + Weekly trend */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Conversion Funnel */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">🔽 Hiring Funnel</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pipelineData.map((stage, i) => (
              <div key={stage.stage} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 90, fontSize: 12, color: '#6b7280', fontWeight: 500, flexShrink: 0 }}>{stage.stage}</div>
                <div style={{ flex: 1, height: 32, background: '#f3f4f6', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <div style={{
                    width: `${stage.pct}%`, height: '100%',
                    background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}cc)`,
                    borderRadius: 6, transition: 'width 1s ease',
                    display: 'flex', alignItems: 'center', paddingLeft: 10
                  }}>
                    <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{stage.count}</span>
                  </div>
                </div>
                <div style={{ width: 40, fontSize: 11, color: '#9ca3af', textAlign: 'right', flexShrink: 0 }}>{stage.pct}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Applications Trend */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">📈 Weekly Application Trend</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f8" />
              <XAxis dataKey="week" tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <Tooltip content={<CUSTOM_TOOLTIP />} />
              <Legend wrapperStyle={{ color: '#6b7280', fontSize: 12 }} />
              <Line type="monotone" dataKey="applications" name="Applications" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} />
              <Line type="monotone" dataKey="shortlisted" name="Shortlisted" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill demand + College breakdown */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Skill Demand */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">🔧 Applications by Required Skill</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={skillDemandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f8" />
              <XAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <Tooltip content={<CUSTOM_TOOLTIP />} />
              <Legend wrapperStyle={{ color: '#6b7280', fontSize: 12 }} />
              <Bar dataKey="applied" name="Applied" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shortlisted" name="Shortlisted" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* College pie */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">🎓 Applicants by College</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={collegeBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={10}>
                {collegeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e8eaf0', borderRadius: 10, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Jobs Performance Table */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 18 }}>📋 Job Posting Performance</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f3f8' }}>
                {['Role', 'Total Applicants', 'Shortlisted', 'Avg Match', 'Deadline', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#9ca3af', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobPerformance.map((j, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#111827' }}>{j.role}</td>
                  <td style={{ padding: '12px 14px', color: '#374151' }}>{j.applicants}</td>
                  <td style={{ padding: '12px 14px', color: '#10b981', fontWeight: 600 }}>{j.shortlisted}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: '#f1f3f8', borderRadius: 3, overflow: 'hidden', maxWidth: 80 }}>
                        <div style={{ width: `${j.match}%`, height: '100%', background: '#6366f1', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontWeight: 600, color: '#6366f1' }}>{j.match}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#6b7280' }}>{j.deadline}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="badge badge-emerald">{j.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
