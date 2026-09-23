// Seeds a demo database: jobs, a talent pool, one login per role and some
// applications in different pipeline stages. Wipes existing data first.
//   npm run seed            (refuses when NODE_ENV=production unless --force)

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Student from './models/Student.js';
import Job from './models/Job.js';
import Application from './models/Application.js';
import Assessment from './models/Assessment.js';
import Program from './models/Program.js';
import Registration from './models/Registration.js';
import { CURRENT_USER, JOBS, CANDIDATES } from '../src/data/store.js';
import { canonicalProfile, canonicalSkill } from '../src/lib/skills.js';
import { explainMatch } from '../src/lib/matching.js';

export const DEMO_PASSWORD = 'demo1234';

// Extra NITK students so the institution dashboard has a cohort to analyse
const NITK_COHORT = [
  { name: 'Kavya Rao', dept: 'CSE', year: '4th', cgpa: 8.9, skills: { Python: 82, 'Machine Learning': 74, SQL: 78, 'Data Analysis': 80, Communication: 70 } },
  { name: 'Nikhil Joshi', dept: 'IT', year: '3rd', cgpa: 7.6, skills: { Java: 72, 'Data Structures': 68, SQL: 60, 'Spring Boot': 55 } },
  { name: 'Meera Pillai', dept: 'CSE', year: '4th', cgpa: 9.2, skills: { React: 84, JavaScript: 86, 'Node.js': 70, 'REST APIs': 75, Git: 80 } },
  { name: 'Aditya Kulkarni', dept: 'ECE', year: '3rd', cgpa: 8.1, skills: { 'C++': 76, 'Embedded Systems': 70, 'Signal Processing': 64, Python: 50 } },
  { name: 'Farhan Ali', dept: 'CSE', year: '2nd', cgpa: 7.2, skills: { Python: 45, 'Data Structures': 40, Communication: 65 } },
];

// [jobIndex, candidateIndex, status, daysAgo] — candidateIndex 0 is Arjun, the demo student
const SEED_APPLICATIONS = [
  [0, 0, 'shortlisted', 22], [2, 0, 'applied', 20], [4, 0, 'applied', 18],
  [4, 1, 'shortlisted', 15], [0, 1, 'applied', 14], [3, 2, 'assessment', 12],
  [1, 3, 'interview', 11], [5, 4, 'offered', 25], [2, 5, 'applied', 9], [0, 5, 'applied', 8],
];
const PIPELINE = ['applied', 'shortlisted', 'assessment', 'interview', 'offered'];

// [kind, organisation, title, duration, mode, startDate, seats, compensation, skills, description]
const PROGRAMS = [
  ['training', 'Google', 'Google Cloud Professional Track', '8 Weeks', 'Online', '2026-10-15', 500, 'Free (sponsored)', ['AWS', 'Kubernetes', 'SQL'], 'Cloud fundamentals, compute, networking, data and security with hands-on labs.'],
  ['training', 'Microsoft', 'Full Stack Web Development Bootcamp', '12 Weeks', 'Hybrid', '2026-11-01', 300, '₹2,999', ['React', 'Node.js', 'Azure', 'TypeScript'], 'Build five real-world projects with industry mentors. Top performers get interview opportunities.'],
  ['training', 'Flipkart', 'Data Engineering with Spark & Kafka', '6 Weeks', 'Online', '2026-10-20', 150, 'Free', ['Spark', 'Kafka', 'Python', 'SQL'], 'Batch and streaming pipelines on real e-commerce datasets.'],
  ['training', 'Amazon Web Services', 'AI/ML Engineer Career Track', '16 Weeks', 'Online', '2026-11-10', 200, '₹4,999', ['Python', 'Machine Learning', 'Deep Learning', 'AWS'], 'From ML fundamentals to deploying models in production.'],
  ['workshop', 'Cisco', 'Cybersecurity Fundamentals Workshop', '2 Days', 'On-site', '2026-10-05', 60, 'Free', ['Networking', 'Security'], 'Hands-on network security, threat analysis and incident response.'],
  ['mentorship', 'Google', 'SWE Interview Mentorship', '6 Weeks', 'Online', '2026-10-10', 25, 'Free', ['Data Structures', 'System Design'], 'Weekly 1:1 sessions with Google engineers: problem solving, system design and mock interviews.'],
  ['mentorship', 'Microsoft', 'ML Career Mentorship', '8 Weeks', 'Online', '2026-10-12', 20, 'Free', ['Machine Learning', 'Python'], 'Fortnightly mentoring with Microsoft data scientists on ML projects and career planning.'],
  ['challenge', 'Flipkart', 'Flipkart GRiD 6.0 — E-Commerce Innovation', '6 Weeks', 'Hybrid', '2026-10-25', null, '₹5,00,000 + PPIs', ['Machine Learning', 'System Design'], 'Solve real e-commerce problem statements; winners get pre-placement interviews.'],
  ['challenge', 'Microsoft', 'Microsoft Imagine Cup — India Finals', '3 Months', 'Online', '2026-11-15', null, 'USD 100,000 (global)', ['Azure', 'Machine Learning'], 'Build a tech solution to a real-world problem using Azure.'],
  ['live-project', 'Bosch India', 'Live Industry Project — Smart Campus IoT', '10 Weeks', 'Hybrid', '2026-11-01', 12, '₹15,000 stipend', ['Embedded Systems', 'Python', 'MongoDB'], 'Build an IoT energy-monitoring system for a campus with Bosch engineers.'],
  ['fdp', 'Google', 'Advanced AI & Deep Learning', '5 Days', 'Online', '2026-10-15', 50, '₹5,000 stipend', ['TensorFlow', 'PyTorch', 'Deep Learning'], 'State-of-the-art deep learning architectures including LLMs and multimodal AI.'],
  ['fdp', 'Amazon Web Services', 'Cloud Architecture & DevOps', '3 Days', 'Hybrid', '2026-11-20', 80, '₹3,000 + AWS credits', ['AWS', 'Kubernetes', 'Docker'], 'AWS solutions architecture and production-grade DevOps practices.'],
  ['industrial-training', 'Tata Steel', 'Industry Immersion — Manufacturing 4.0', '4 Weeks', 'On-site', '2026-12-01', 20, '₹40,000 stipend', ['Embedded Systems', 'Data Analysis'], 'Smart manufacturing, IoT sensor integration and AI-driven quality control on the shop floor.'],
  ['faculty-internship', 'Flipkart', 'Faculty Summer Internship — Data Platforms', '6 Weeks', 'On-site', '2027-05-15', 5, '₹60,000 stipend', ['Spark', 'SQL', 'Python'], 'Work with Flipkart data platform teams to bring current practice into teaching.'],
  ['consultancy', 'NTPC Limited', 'Smart Grid Load Optimisation', '3 Months', 'Hybrid', '2026-10-01', 3, '₹1,50,000 (project)', ['Machine Learning', 'Python'], 'AI-based optimisation for renewable energy load balancing.'],
  ['research', 'Infosys', 'NLP for Indian Languages', '1 Year', 'Hybrid', '2026-10-15', 5, '₹3,00,000 / year', ['Deep Learning', 'Python'], 'Joint research on multilingual NLP models for the 22 scheduled Indian languages.'],
  ['guest-lecture', 'NVIDIA India', 'Future of Generative AI in Enterprise', '2 Hours', 'Online', '2026-10-08', 10, 'No fee', ['Deep Learning'], 'An NVIDIA expert can deliver this session at your institution. Register to request a date.'],
  ['guest-lecture', 'Google', 'Building Scalable Systems at Google', '2 Hours', 'Hybrid', '2026-10-22', 10, 'No fee', ['System Design'], 'A Google engineer can deliver this session at your institution. Register to request a date.'],
];

async function seed() {
  if (process.env.NODE_ENV === 'production' && !process.argv.includes('--force')) {
    throw new Error('Refusing to wipe a production database. Re-run with --force if you really mean it.');
  }
  await connectDB();
  await Promise.all([User, Student, Job, Application, Assessment, Program, Registration].map(m => m.deleteMany({})));
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  // Talent pool
  const me = CURRENT_USER.student;
  const students = [];
  for (const [i, c] of CANDIDATES.entries()) {
    const skills = canonicalProfile(i === 0 ? me.skills : c.skills);
    const portfolio = i === 0 ? {
      projects: me.projects.map(p => ({ title: p.title, tech: p.tech, verified: p.verified })),
    } : {};
    students.push(await Student.create({
      name: c.name, avatar: c.avatar, college: c.college, dept: c.dept, year: c.year, cgpa: c.cgpa,
      skills, skillSource: Object.fromEntries(Object.keys(skills).map(s => [s, 'self'])),
      ...portfolio,
    }));
  }
  for (const c of NITK_COHORT) {
    const skills = canonicalProfile(c.skills);
    await Student.create({
      ...c, avatar: c.name.split(' ').map(w => w[0]).join(''), college: 'NITK Surathkal',
      skills, skillSource: Object.fromEntries(Object.keys(skills).map(s => [s, 'self'])),
    });
  }

  // One recruiter account per company; Microsoft's is the headline demo login
  const recruiters = {};
  for (const company of [...new Set([...JOBS.map(j => j.company), ...PROGRAMS.map(p => p[1])])]) {
    const slug = company.toLowerCase().replace(/[^a-z]/g, '');
    const name = company === 'Microsoft' ? CURRENT_USER.industry.name : `${company} Talent Team`;
    recruiters[company] = await User.create({
      name, email: company === 'Microsoft' ? 'rahul.mehta@microsoft.demo' : `hr@${slug}.demo`,
      role: 'industry', organization: company, designation: 'Talent Acquisition',
      avatar: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(), passwordHash,
    });
  }

  const jobs = [];
  for (const { id: _id, match: _match, posted: _posted, applicants: _a, ...j } of JOBS) {
    jobs.push(await Job.create({ ...j, skills: j.skills.map(canonicalSkill), minSkillLevel: 60, postedBy: recruiters[j.company]._id }));
  }

  // Applications with a plausible stage history
  for (const [ji, ci, status, daysAgo] of SEED_APPLICATIONS) {
    const job = jobs[ji], student = students[ci];
    const start = Date.now() - daysAgo * 86400000;
    const stages = status === 'rejected' ? ['applied', 'rejected'] : PIPELINE.slice(0, PIPELINE.indexOf(status) + 1);
    const history = stages.map((st, k) => ({ status: st, at: new Date(start + k * 2 * 86400000) }));
    const app = await Application.create({
      job: job._id, student: student._id, status,
      matchAtApply: explainMatch(student.skills, job.toJSON(), student.cgpa).score,
      history,
    });
    await Application.updateOne({ _id: app._id }, { $set: { createdAt: new Date(start) } }, { timestamps: false });
    await Job.updateOne({ _id: job._id }, { $inc: { applicants: 1 } });
  }

  // Logins
  const arjun = await User.create({ name: me.name, email: me.email, role: 'student', organization: me.college, dept: me.dept, avatar: me.avatar, passwordHash, student: students[0]._id });
  const f = CURRENT_USER.faculty;
  const priya = await User.create({ name: f.name, email: f.email, role: 'faculty', organization: f.college, dept: f.dept, designation: f.designation, avatar: f.avatar, passwordHash });

  // Programs, plus a couple of registrations
  const programs = [];
  for (const [kind, org, title, duration, mode, startDate, seats, compensation, skills, description] of PROGRAMS) {
    programs.push(await Program.create({
      kind, title, duration, mode, startDate, seats: seats ?? undefined, compensation, description,
      skills: skills.map(canonicalSkill), organization: org, postedBy: recruiters[org]._id,
    }));
  }
  const byTitle = t => programs.find(p => p.title === t)._id;
  await Registration.create({ program: byTitle('Google Cloud Professional Track'), user: arjun._id, status: 'accepted' });
  await Registration.create({ program: byTitle('Full Stack Web Development Bootcamp'), user: arjun._id, message: 'Keen to strengthen my Node.js.' });
  await Registration.create({ program: byTitle('Advanced AI & Deep Learning'), user: priya._id, message: 'Would like to update our DL elective.' });
  const t = CURRENT_USER.institution;
  await User.create({ name: t.name, email: t.email, role: 'institution', organization: t.college, designation: t.role, avatar: t.avatar, passwordHash });

  console.log(`Seeded ${await Student.countDocuments()} students, ${jobs.length} jobs, ${SEED_APPLICATIONS.length} applications, ${programs.length} programs.`);
  console.log(`Demo logins (password: ${DEMO_PASSWORD}):`);
  console.log(`  student      ${me.email}`);
  console.log(`  industry     rahul.mehta@microsoft.demo`);
  console.log(`  faculty      ${f.email}`);
  console.log(`  institution  ${t.email}`);
}

seed()
  .catch(err => { console.error(err.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
