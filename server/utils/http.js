export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// Wrap async route handlers so rejected promises reach the error middleware.
export const ah = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const initials = name => name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);

// Plain skill map from a Mongoose Map
export const plain = m => (m instanceof Map ? Object.fromEntries(m) : { ...(m || {}) });

export function toClientApplication(a) {
  return {
    id: String(a._id),
    jobId: String(a.job?._id ?? a.job),
    candidateId: String(a.student?._id ?? a.student),
    status: a.status,
    matchAtApply: a.matchAtApply,
    appliedAt: a.createdAt.toISOString(),
    history: a.history.map(h => ({ status: h.status, at: new Date(h.at).toISOString() })),
  };
}

const item = i => {
  const { _id, verifiedBy: _v, ...rest } = i.toObject ? i.toObject() : i;
  return { ...rest, id: String(_id) };
};

export function toClientStudent(s) {
  const { certifications: _dropped, ...j } = s.toJSON();
  return {
    ...j,
    skills: plain(s.skills),
    skillSource: plain(s.skillSource),
    resume: s.resume?.filename ? { filename: s.resume.filename, size: s.resume.size, uploadedAt: s.resume.uploadedAt } : null,
    projects: (s.projects || []).map(item),
    achievements: (s.achievements || []).map(item),
  };
}
