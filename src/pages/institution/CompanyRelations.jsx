import { useState } from 'react';
import { Building2, Users, Calendar, ChevronRight, X, Star, TrendingUp, Briefcase, Phone, Mail, Globe } from 'lucide-react';

const COMPANIES = [
  {
    id: 1, name: 'Google India', logo: '🔵', color: '#4285f4',
    industry: 'Technology', relationship: 'Platinum Partner',
    since: '2018', visits: 12, placements: 48, avgPackage: '₹42 LPA',
    lastVisit: '2026-09-10', nextVisit: '2026-10-15',
    contact: { name: 'Anjali Verma', email: 'anjali@google.com', phone: '+91-9876543210' },
    programs: ['Internships', 'Full-time hiring', 'Guest Lectures', 'Hackathon Sponsor'],
    mouStatus: 'Active', mouExpiry: '2027-12-31',
    description: 'Google has been a premier recruiting partner for NITK since 2018. Regular engagement through coding challenges, guest lectures, and an exclusive campus ambassador program.'
  },
  {
    id: 2, name: 'Microsoft', logo: '🟦', color: '#00a4ef',
    industry: 'Technology', relationship: 'Platinum Partner',
    since: '2019', visits: 10, placements: 38, avgPackage: '₹38 LPA',
    lastVisit: '2026-08-25', nextVisit: '2026-11-01',
    contact: { name: 'Rajesh Kumar', email: 'rajesh@microsoft.com', phone: '+91-9876543211' },
    programs: ['Internships', 'Full-time hiring', 'Azure University', 'Imagine Cup'],
    mouStatus: 'Active', mouExpiry: '2027-06-30',
    description: 'Microsoft partners with NITK for their Azure University program and annual Imagine Cup. Provides cloud credits and technical mentorship to student projects.'
  },
  {
    id: 3, name: 'Flipkart', logo: '🛍️', color: '#f7931a',
    industry: 'E-Commerce', relationship: 'Gold Partner',
    since: '2020', visits: 8, placements: 28, avgPackage: '₹28 LPA',
    lastVisit: '2026-09-05', nextVisit: '2026-10-20',
    contact: { name: 'Sneha Iyer', email: 'sneha@flipkart.com', phone: '+91-9876543212' },
    programs: ['Internships', 'Full-time hiring', 'GRiD Hackathon', 'Mentorship'],
    mouStatus: 'Active', mouExpiry: '2028-03-31',
    description: 'Flipkart GRiD is a major annual hackathon. They actively hire from ECE and CSE departments for backend and data engineering roles.'
  },
  {
    id: 4, name: 'TCS', logo: '🔷', color: '#0073b7',
    industry: 'IT Services', relationship: 'Silver Partner',
    since: '2015', visits: 18, placements: 120, avgPackage: '₹7 LPA',
    lastVisit: '2026-09-15', nextVisit: '2026-11-10',
    contact: { name: 'Amit Shah', email: 'amit.shah@tcs.com', phone: '+91-9876543213' },
    programs: ['Mass Hiring', 'CodeVita', 'TCS NQT', 'Faculty FDP'],
    mouStatus: 'Active', mouExpiry: '2027-09-30',
    description: 'TCS is the largest recruiter by volume. Annual CodeVita competition and NQT-based hiring across all engineering branches.'
  },
  {
    id: 5, name: 'Razorpay', logo: '💳', color: '#3395ff',
    industry: 'FinTech', relationship: 'Gold Partner',
    since: '2022', visits: 4, placements: 12, avgPackage: '₹22 LPA',
    lastVisit: '2026-08-10', nextVisit: null,
    contact: { name: 'Neha Kapoor', email: 'neha@razorpay.com', phone: '+91-9876543214' },
    programs: ['Internships', 'Full-time hiring', 'FinTech Talks'],
    mouStatus: 'Pending Renewal', mouExpiry: '2026-12-31',
    description: 'Growing partnership with a focus on hiring ML engineers and backend developers. They have shown interest in expanding to campus ambassador and mentorship programs.'
  },
  {
    id: 6, name: 'ISRO', logo: '🚀', color: '#ff6b35',
    industry: 'Space & Research', relationship: 'Research Partner',
    since: '2017', visits: 6, placements: 8, avgPackage: '₹12 LPA',
    lastVisit: '2026-07-20', nextVisit: '2027-01-15',
    contact: { name: 'Dr. K. Sivan', email: 'careers@isro.gov.in', phone: '+91-080-22172260' },
    programs: ['Research Internships', 'Project Sponsorship', 'Guest Lectures'],
    mouStatus: 'Active', mouExpiry: '2028-12-31',
    description: 'ISRO offers research internships and sponsors final-year projects related to satellite communications, signal processing, and embedded systems.'
  },
  {
    id: 7, name: 'Bosch India', logo: '🔧', color: '#e3000b',
    industry: 'Manufacturing & IoT', relationship: 'Silver Partner',
    since: '2019', visits: 7, placements: 18, avgPackage: '₹14 LPA',
    lastVisit: '2026-09-01', nextVisit: '2026-12-01',
    contact: { name: 'Thomas Mueller', email: 'thomas.mueller@bosch.com', phone: '+91-9876543216' },
    programs: ['Internships', 'Full-time hiring', 'IoT Lab Sponsorship', 'Live Projects'],
    mouStatus: 'Active', mouExpiry: '2027-08-31',
    description: 'Bosch sponsors the IoT Lab on campus and provides live industry projects. Focus areas include manufacturing 4.0, automotive software, and edge computing.'
  }
];

const relationshipColors = {
  'Platinum Partner': '#f59e0b', 'Gold Partner': '#6366f1',
  'Silver Partner': '#9ca3af', 'Research Partner': '#10b981'
};

export default function CompanyRelations() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);

  const filters = ['all', 'Platinum Partner', 'Gold Partner', 'Silver Partner', 'Research Partner'];
  const filtered = COMPANIES.filter(c => filter === 'all' || c.relationship === filter);

  const totalPlacements = COMPANIES.reduce((s, c) => s + c.placements, 0);
  const totalVisits = COMPANIES.reduce((s, c) => s + c.visits, 0);

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">🏢 Company Relations & Partnerships</h1>
        <p className="page-hero-subtitle">
          Manage industry partnerships, track MOU status, placement history, and upcoming company visits.
        </p>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 28 }}>
        {[
          { label: 'Partner Companies', value: COMPANIES.length, icon: '🤝', color: '#6366f1' },
          { label: 'Total Placements', value: totalPlacements, icon: '👥', color: '#10b981' },
          { label: 'Campus Visits', value: totalVisits, icon: '🏫', color: '#f59e0b' },
          { label: 'Active MOUs', value: COMPANIES.filter(c => c.mouStatus === 'Active').length, icon: '📋', color: '#06b6d4' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 32 }}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {filters.map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-cyan' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Partners' : f}
          </button>
        ))}
        <button className="btn btn-sm btn-cyan" style={{ marginLeft: 'auto' }} onClick={() => setShowAdd(true)}>
          + Add Company
        </button>
      </div>

      {/* Company List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(company => (
          <div key={company.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer' }}
            onClick={() => setSelected(company)}>
            <div style={{
              width: 56, height: 56, background: `${company.color}18`, borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0
            }}>{company.logo}</div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{company.name}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                  background: `${relationshipColors[company.relationship]}22`,
                  color: relationshipColors[company.relationship],
                  border: `1px solid ${relationshipColors[company.relationship]}44`
                }}>{company.relationship}</span>
                {company.mouStatus === 'Pending Renewal' && (
                  <span className="badge badge-amber" style={{ fontSize: 10 }}>⚠️ MOU Renewal</span>
                )}
              </div>
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                {company.industry} · Partner since {company.since} · {company.placements} placed · Avg: {company.avgPackage}
              </div>
              <div className="skill-tags" style={{ marginTop: 6 }}>
                {company.programs.slice(0, 3).map(p => <span key={p} className="tag" style={{ fontSize: 10 }}>{p}</span>)}
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              {company.nextVisit ? (
                <div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>Next Visit</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>{company.nextVisit}</div>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: '#9ca3af' }}>No visit scheduled</div>
              )}
            </div>

            <ChevronRight size={16} color="#9ca3af" />
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ fontSize: 36 }}>{selected.logo}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{selected.name}</div>
                  <div style={{ color: '#9ca3af', fontSize: 14 }}>{selected.industry} · {selected.relationship}</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={16} /></button>
            </div>

            <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, marginBottom: 20 }}>{selected.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                ['🤝 Partner Since', selected.since],
                ['🏫 Campus Visits', `${selected.visits} total`],
                ['👥 Total Placements', selected.placements],
                ['💰 Avg Package', selected.avgPackage],
                ['📋 MOU Status', `${selected.mouStatus} (expires ${selected.mouExpiry})`],
                ['📅 Last Visit', selected.lastVisit],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Engagement Programs</div>
              <div className="skill-tags">
                {selected.programs.map(p => <span key={p} className="tag">{p}</span>)}
              </div>
            </div>

            <div style={{
              background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
              borderRadius: 12, padding: 16, marginBottom: 20
            }}>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>📞 Primary Contact</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
                  <Users size={14} color="#6366f1" /> <span>{selected.contact.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
                  <Mail size={14} color="#6366f1" /> <span>{selected.contact.email}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
                  <Phone size={14} color="#6366f1" /> <span>{selected.contact.phone}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-cyan btn-lg" style={{ flex: 1 }}>Schedule Visit</button>
              <button className="btn btn-ghost btn-lg" style={{ flex: 1 }}>Renew MOU</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontWeight: 700, fontSize: 20 }}>➕ Add New Company Partner</div>
              <button className="modal-close" onClick={() => setShowAdd(false)}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Company Name', placeholder: 'e.g., Tesla India' },
                { label: 'Industry', placeholder: 'e.g., EV Manufacturing' },
                { label: 'Contact Person', placeholder: 'e.g., John Doe' },
                { label: 'Contact Email', placeholder: 'e.g., john@tesla.com' },
                { label: 'Relationship Type', placeholder: 'e.g., Platinum / Gold / Silver' },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>{f.label}</div>
                  <input placeholder={f.placeholder} style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    border: '1px solid #e5e7eb', fontSize: 14, background: '#fafafa'
                  }} />
                </div>
              ))}
              <button className="btn btn-cyan btn-lg w-full" onClick={() => setShowAdd(false)}>
                Add Company <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
