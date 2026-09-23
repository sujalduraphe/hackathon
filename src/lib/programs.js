// Kinds of industry–academia programs, and who each one is open to.
// Shared by the API (validation) and the UI (labels, filters).

export const PROGRAM_KINDS = {
  training:              { label: 'Training Program',            audience: ['student'] },
  workshop:              { label: 'Workshop',                    audience: ['student', 'faculty'] },
  mentorship:            { label: 'Mentorship Program',          audience: ['student'] },
  challenge:             { label: 'Innovation Challenge',        audience: ['student'] },
  'live-project':        { label: 'Live Industry Project',       audience: ['student', 'faculty'] },
  fdp:                   { label: 'Faculty Development Program', audience: ['faculty'] },
  'industrial-training': { label: 'Industrial Training',         audience: ['faculty'] },
  'faculty-internship':  { label: 'Faculty Internship',          audience: ['faculty'] },
  consultancy:           { label: 'Consultancy Project',         audience: ['faculty'] },
  research:              { label: 'Collaborative Research',      audience: ['faculty'] },
  'guest-lecture':       { label: 'Guest Lecture',               audience: ['faculty'] },
};

export const kindsFor = role => Object.entries(PROGRAM_KINDS).filter(([, k]) => k.audience.includes(role)).map(([id]) => id);
