import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Search, Filter, Download, FileText, Clock } from 'lucide-react';

const PENDING_DOCS = [
  {
    id: 1, student: 'Arjun Sharma', college: 'NITK Surathkal', dept: 'CSE',
    avatar: 'AS', type: 'Internship Completion', company: 'Flipkart',
    duration: 'Jun–Aug 2026', submitted: '2026-09-01', status: 'pending',
    doc: 'Flipkart_InternCompletion_ArjunSharma.pdf', cgpa: 8.7
  },
  {
    id: 2, student: 'Priya Menon', college: 'NITK Surathkal', dept: 'CSE',
    avatar: 'PM', type: 'Certification', company: 'Coursera (Google)',
    duration: 'Completed Aug 2026', submitted: '2026-09-02', status: 'pending',
    doc: 'GCC_DataAnalytics_PriyaMenon.pdf', cgpa: 9.1
  },
  {
    id: 3, student: 'Rohan Gupta', college: 'NITK Surathkal', dept: 'IT',
    avatar: 'RG', type: 'Project Report', company: 'Smart Campus App',
    duration: 'Jul–Sep 2026', submitted: '2026-09-03', status: 'pending',
    doc: 'SmartCampus_ProjectReport_RohanGupta.pdf', cgpa: 8.2
  },
  {
    id: 4, student: 'Aisha Khan', college: 'NITK Surathkal', dept: 'CSE',
    avatar: 'AK', type: 'Academic Record', company: 'CGPA Transcript',
    duration: 'Sem 1–5', submitted: '2026-09-04', status: 'pending',
    doc: 'Transcript_AishaKhan_Sem5.pdf', cgpa: 9.3
  },
  {
    id: 5, student: 'Varun Reddy', college: 'NITK Surathkal', dept: 'ECE',
    avatar: 'VR', type: 'Internship Completion', company: 'ISRO Bengaluru',
    duration: 'May–Jul 2026', submitted: '2026-09-05', status: 'approved',
    doc: 'ISRO_Internship_VarunReddy.pdf', cgpa: 7.9
  },
  {
    id: 6, student: 'Sneha Iyer', college: 'NITK Surathkal', dept: 'CSE',
    avatar: 'SI', type: 'Certification', company: 'AWS Skills Builder',
    duration: 'Aug 2026', submitted: '2026-09-06', status: 'rejected',
    doc: 'AWS_Cloud_Practitioner_SnehaIyer.pdf', cgpa: 8.5,
    rejectReason: 'Certificate QR code verification failed. Please re-upload.'
  },
];

const TYPE_ICONS = {
  'Internship Completion': '🏢',
  'Certification': '🏆',
  'Project Report': '📁',
  'Academic Record': '📊',
};

export default function CredentialVerification() {
  const [docs, setDocs] = useState(PENDING_DOCS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [action, setAction] = useState(null);

  function approve(id) {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
    setSelected(null);
    setAction(null);
  }

  function reject(id) {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected', rejectReason: rejectNote || 'Document could not be verified.' } : d));
    setSelected(null);
    setAction(null);
    setRejectNote('');
  }

  const filtered = docs.filter(d => {
    const matchSearch = d.student.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase()) ||
      d.company.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || d.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = { pending: docs.filter(d => d.status === 'pending').length, approved: docs.filter(d => d.status === 'approved').length, rejected: docs.filter(d => d.status === 'rejected').length };

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <h1 className="page-hero-title">✅ Credential Verification</h1>
        <p className="page-hero-subtitle">Review and verify student certifications, internship letters, project reports, and academic records.</p>
      </div>

      {/* Summary cards */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Pending Review', value: counts.pending, color: '#f59e0b', icon: '⏳', bg: '#fffbeb' },
          { label: 'Approved', value: counts.approved, color: '#10b981', icon: '✅', bg: '#ecfdf5' },
          { label: 'Rejected', value: counts.rejected, color: '#f43f5e', icon: '❌', bg: '#fff1f2' },
          { label: 'Total Submitted', value: docs.length, color: '#6366f1', icon: '📄', bg: '#eef2ff' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilter(s.label === 'Total Submitted' ? 'all' : s.label.toLowerCase().split(' ')[0])}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
          <Search size={14} className="search-icon" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student, type, or company..." />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Document table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #f1f3f8' }}>
                {['Student', 'Document Type', 'Organisation', 'Submitted', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 18px', color: '#9ca3af', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #f9fafb' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {/* Student */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 12, color: 'white'
                      }}>{doc.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{doc.student}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{doc.dept} · CGPA {doc.cgpa}</div>
                      </div>
                    </div>
                  </td>
                  {/* Type */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{TYPE_ICONS[doc.type]}</span>
                      <span style={{ color: '#374151', fontWeight: 500 }}>{doc.type}</span>
                    </div>
                  </td>
                  {/* Org */}
                  <td style={{ padding: '14px 18px', color: '#6b7280' }}>
                    <div>{doc.company}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{doc.duration}</div>
                  </td>
                  {/* Date */}
                  <td style={{ padding: '14px 18px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{doc.submitted}</td>
                  {/* Status */}
                  <td style={{ padding: '14px 18px' }}>
                    <span className={`badge ${doc.status === 'approved' ? 'badge-emerald' : doc.status === 'rejected' ? 'badge-rose' : 'badge-amber'}`}>
                      {doc.status === 'approved' ? '✅ Approved' : doc.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                    </span>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelected(doc)}><Eye size={12} /> View</button>
                      {doc.status === 'pending' && (
                        <>
                          <button className="btn btn-sm btn-emerald" onClick={() => approve(doc.id)}><CheckCircle size={12} /></button>
                          <button className="btn btn-sm btn-rose" onClick={() => { setSelected(doc); setAction('reject'); }}><XCircle size={12} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state"><div className="empty-state-icon">📭</div><div className="empty-state-title">No documents found</div></div>
          )}
        </div>
      </div>

      {/* Detail / Reject Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => { setSelected(null); setAction(null); setRejectNote(''); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontWeight: 700, fontSize: 20, color: '#111827' }}>
                {action === 'reject' ? '❌ Reject Document' : `${TYPE_ICONS[selected.type]} ${selected.type}`}
              </div>
              <button className="modal-close" onClick={() => { setSelected(null); setAction(null); }}><XCircle size={14} /></button>
            </div>

            {action !== 'reject' ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                  {[['Student', selected.student], ['Department', selected.dept], ['CGPA', selected.cgpa], ['Company / Issuer', selected.company], ['Period', selected.duration], ['Submitted', selected.submitted]].map(([k, v]) => (
                    <div key={k} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px', border: '1px solid #e8eaf0' }}>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{k}</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{v}</div>
                    </div>
                  ))}
                </div>
                {/* Document preview placeholder */}
                <div style={{ background: '#f3f4f6', borderRadius: 12, padding: '28px', textAlign: 'center', marginBottom: 20, border: '1px dashed #d1d5db' }}>
                  <FileText size={36} color="#9ca3af" style={{ marginBottom: 10 }} />
                  <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>{selected.doc}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>PDF Document · Click below to view</div>
                  <button className="btn btn-ghost btn-sm"><Download size={12} /> Download Document</button>
                </div>
                {selected.rejectReason && (
                  <div style={{ padding: '10px 14px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#be123c' }}>
                    ❌ Rejection reason: {selected.rejectReason}
                  </div>
                )}
                {selected.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-emerald" style={{ flex: 1 }} onClick={() => approve(selected.id)}><CheckCircle size={14} /> Approve & Verify</button>
                    <button className="btn btn-rose" style={{ flex: 1 }} onClick={() => setAction('reject')}><XCircle size={14} /> Reject</button>
                  </div>
                )}
              </>
            ) : (
              <>
                <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
                  Rejecting document for <strong style={{ color: '#111827' }}>{selected.student}</strong>: {selected.type}
                </p>
                <div className="form-group">
                  <label className="form-label">Reason for Rejection (shown to student)</label>
                  <textarea className="form-textarea" rows={3} placeholder="e.g. Certificate QR code could not be verified. Please resubmit with original document."
                    value={rejectNote} onChange={e => setRejectNote(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAction(null)}>Cancel</button>
                  <button className="btn btn-rose" style={{ flex: 1 }} onClick={() => reject(selected.id)}><XCircle size={14} /> Confirm Rejection</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
