// Kinds of industry–academia programs, and who each one is open to.
// Shared by the API (validation) and the UI (labels, filters).

export const PROGRAM_KINDS = {
  training:              { label: 'Training Program',            audience: ['student'],            icon: '📚' },
  workshop:              { label: 'Workshop',                    audience: ['student', 'faculty'], icon: '🛠️' },
  mentorship:            { label: 'Mentorship Program',          audience: ['student'],            icon: '🧭' },
  challenge:             { label: 'Innovation Challenge',        audience: ['student'],            icon: '🏆' },
  'live-project':        { label: 'Live Industry Project',       audience: ['student', 'faculty'], icon: '🧪' },
  fdp:                   { label: 'Faculty Development Program', audience: ['faculty'],            icon: '🎓' },
  'industrial-training': { label: 'Industrial Training',         audience: ['faculty'],            icon: '🏭' },
  'faculty-internship':  { label: 'Faculty Internship',          audience: ['faculty'],            icon: '💼' },
  consultancy:           { label: 'Consultancy Project',         audience: ['faculty'],            icon: '🤝' },
  research:              { label: 'Collaborative Research',      audience: ['faculty'],            icon: '🔬' },
  'guest-lecture':       { label: 'Guest Lecture',               audience: ['faculty'],            icon: '🎤' },
};

export const kindsFor = role => Object.entries(PROGRAM_KINDS).filter(([, k]) => k.audience.includes(role)).map(([id]) => id);
