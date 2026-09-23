// Bulk demo data on top of the hand-written scenarios in seed.js: a larger
// student cohort, more postings over the last few months, applications at every
// stage, assessment history, portfolio items and program registrations.
// A fixed-seed PRNG keeps every run identical.

import User from './models/User.js';
import Student from './models/Student.js';
import Job from './models/Job.js';
import Application from './models/Application.js';
import Assessment from './models/Assessment.js';
import Registration from './models/Registration.js';
import { QUIZ_SKILLS } from '../src/data/store.js';
import { canonicalProfile } from '../src/lib/skills.js';
import { explainMatch } from '../src/lib/matching.js';
import { PROGRAM_KINDS } from '../src/lib/programs.js';

function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(26044);
const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const pick = arr => arr[Math.floor(rand() * arr.length)];
const sample = (arr, n) => [...arr].sort(() => rand() - 0.5).slice(0, n);
const DAY = 86400000;
const daysAgo = n => new Date(Date.now() - n * DAY);

const FIRST = ['Aarav', 'Ishaan', 'Kabir', 'Vihaan', 'Reyansh', 'Aditya', 'Arnav', 'Dhruv', 'Karthik', 'Rahul', 'Siddharth', 'Varun', 'Yash', 'Nikhil', 'Pranav',
  'Ananya', 'Diya', 'Isha', 'Kavya', 'Meera', 'Nisha', 'Pooja', 'Riya', 'Saanvi', 'Shreya', 'Tanvi', 'Aditi', 'Neha', 'Sneha', 'Divya', 'Fatima', 'Zoya', 'Harpreet', 'Lakshmi', 'Deepa'];
const LAST = ['Sharma', 'Verma', 'Iyer', 'Nair', 'Reddy', 'Rao', 'Patel', 'Shah', 'Kulkarni', 'Joshi', 'Menon', 'Pillai', 'Gupta', 'Singh', 'Das', 'Banerjee', 'Hegde', 'Shetty', 'Khan', 'Fernandes'];
const COLLEGES = { 'NITK Surathkal': 25, 'VIT Vellore': 7, 'BITS Pilani': 5, 'IIT Madras': 4, 'SRM Chennai': 4, 'NIT Warangal': 4 };
const DEPTS = ['CSE', 'CSE', 'CSE', 'IT', 'IT', 'ECE', 'EEE', 'MECH'];

// skill tracks a student might be building towards
const TRACKS = {
  web:      ['React', 'JavaScript', 'HTML/CSS', 'Node.js', 'REST APIs', 'MongoDB', 'Git'],
  data:     ['Python', 'SQL', 'Data Analysis', 'Machine Learning', 'Spark', 'Communication'],
  ml:       ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'SQL', 'Data Analysis'],
  backend:  ['Java', 'Data Structures', 'SQL', 'Spring Boot', 'Microservices', 'System Design', 'Git'],
  cloud:    ['AWS', 'Docker', 'Kubernetes', 'Python', 'Git'],
  embedded: ['C++', 'Embedded Systems', 'Signal Processing', 'Python'],
};
const SOFT = ['Communication', 'Teamwork', 'Leadership', 'Problem Solving'];
const PROJECTS = {
  web: [['Campus Events Portal', ['React', 'Node.js', 'MongoDB']], ['Expense Tracker PWA', ['React', 'JavaScript']]],
  data: [['Sales Forecasting Dashboard', ['Python', 'SQL']], ['COVID Data Explorer', ['Python', 'Data Analysis']]],
  ml: [['Plant Disease Classifier', ['Python', 'TensorFlow']], ['Resume Screening Model', ['Python', 'Machine Learning']]],
  backend: [['Library Management API', ['Java', 'Spring Boot', 'SQL']], ['URL Shortener Service', ['Java', 'Redis']]],
  cloud: [['CI/CD Pipeline for Microservices', ['Docker', 'AWS']], ['Serverless Image Resizer', ['AWS', 'Python']]],
  embedded: [['Smart Irrigation Controller', ['C++', 'Embedded Systems']], ['ECG Signal Denoiser', ['Signal Processing', 'Python']]],
};
const ACHIEVEMENTS = ['Finalist, Smart India Hackathon 2025', 'Winner, college hackathon', 'Top 5%, LeetCode weekly contest', 'Published paper at IEEE student conference', 'Google Summer of Code contributor', 'Runner-up, inter-college coding contest'];

const EXTRA_JOBS = [
  ['Infosys', '🟦', 'Systems Engineer Trainee', 'Full-Time', 'fulltime', 'Mysuru', 'On-site', '₹3.6 LPA', 'Permanent', ['Java', 'SQL', 'Communication', 'Problem Solving'], 6.5, 60, 85],
  ['TCS', '🔷', 'Digital Associate', 'Full-Time', 'fulltime', 'Pune', 'Hybrid', '₹7 LPA', 'Permanent', ['Python', 'SQL', 'Communication'], 6.0, 45, 78],
  ['Swiggy', '🧡', 'Frontend Engineer Intern', 'Internship', 'internship', 'Bengaluru', 'Hybrid', '₹50,000/month', '6 months', ['React', 'JavaScript', 'HTML/CSS', 'REST APIs'], 7.0, 6, 60],
  ['Amazon Web Services', '🟧', 'Cloud Support Associate', 'Full-Time', 'fulltime', 'Hyderabad', 'On-site', '₹12 LPA', 'Permanent', ['AWS', 'Docker', 'Communication', 'Problem Solving'], 7.0, 10, 52],
  ['Bosch India', '🔴', 'Embedded Software Intern', 'Internship', 'internship', 'Bengaluru', 'On-site', '₹30,000/month', '6 months', ['C++', 'Embedded Systems', 'Problem Solving'], 7.0, 5, 44],
  ['Freshworks', '🟩', 'Data Analyst Intern', 'Internship', 'internship', 'Chennai', 'Hybrid', '₹40,000/month', '4 months', ['SQL', 'Python', 'Data Analysis', 'Communication'], 7.0, 8, 37],
  ['Paytm', '💙', 'Backend Developer Intern', 'Internship', 'internship', 'Noida', 'Hybrid', '₹45,000/month', '6 months', ['Node.js', 'MongoDB', 'REST APIs', 'Git'], 7.0, 6, 30],
  ['Deloitte', '⚫', 'Analyst — Technology Consulting', 'Full-Time', 'fulltime', 'Bengaluru', 'Hybrid', '₹8 LPA', 'Permanent', ['SQL', 'Communication', 'Problem Solving', 'Teamwork'], 7.0, 20, 22],
  ['Cisco', '🌐', 'Software Engineer Intern — Networking', 'Internship', 'internship', 'Bengaluru', 'Hybrid', '₹60,000/month', '6 months', ['Python', 'Data Structures', 'Problem Solving'], 7.5, 8, 12],
];

function profileFor(track) {
  const skills = {};
  for (const s of sample(TRACKS[track], int(3, TRACKS[track].length))) skills[s] = int(30, 90);
  for (const s of sample(SOFT, int(1, 3))) skills[s] = int(45, 85);
  return canonicalProfile(skills);
}

// Later stages are reached more often by better-matched candidates
function outcome(score) {
  const r = rand();
  if (score >= 80) return r < 0.2 ? 'offered' : r < 0.4 ? 'interview' : r < 0.6 ? 'assessment' : r < 0.8 ? 'shortlisted' : 'applied';
  if (score >= 60) return r < 0.08 ? 'offered' : r < 0.2 ? 'interview' : r < 0.35 ? 'assessment' : r < 0.55 ? 'shortlisted' : r < 0.8 ? 'applied' : 'rejected';
  return r < 0.1 ? 'shortlisted' : r < 0.55 ? 'applied' : 'rejected';
}
const PIPELINE = ['applied', 'shortlisted', 'assessment', 'interview', 'offered'];

export async function seedExtra({ recruiters, jobs, programs, passwordHash }) {
  // More postings, spread over the last three months
  for (const [company, logo, title, type, category, location, mode, stipend, duration, skills, minCGPA, openings, postedDaysAgo] of EXTRA_JOBS) {
    if (!recruiters[company]) {
      recruiters[company] = await User.create({
        name: `${company} Talent Team`, email: `hr@${company.toLowerCase().replace(/[^a-z]/g, '')}.demo`,
        role: 'industry', organization: company, designation: 'Talent Acquisition',
        avatar: company.slice(0, 2).toUpperCase(), passwordHash,
      });
    }
    const job = await Job.create({
      company, logo, color: '#6366f1', title, type, category, location, mode, stipend, duration, skills, minCGPA, openings,
      minSkillLevel: 60, description: `${title} at ${company}. Work with an experienced team on production systems.`,
      deadline: new Date(Date.now() + int(10, 45) * DAY).toISOString().slice(0, 10), postedBy: recruiters[company]._id,
    });
    await Job.updateOne({ _id: job._id }, { $set: { createdAt: daysAgo(postedDaysAgo) } }, { timestamps: false });
    jobs.push(job);
  }

  // Generated students
  const tracks = Object.keys(TRACKS);
  const used = new Set((await Student.find({}, 'name')).map(s => s.name));
  const students = [];
  for (const [college, n] of Object.entries(COLLEGES)) {
    for (let i = 0; i < n; i++) {
      let name;
      do { name = `${pick(FIRST)} ${pick(LAST)}`; } while (used.has(name));
      used.add(name);
      const track = pick(tracks);
      const skills = profileFor(track);
      const skillSource = Object.fromEntries(Object.keys(skills).map(s => [s, 'self']));
      const s = await Student.create({
        name, avatar: name.split(' ').map(w => w[0]).join(''), college, dept: pick(DEPTS), year: pick(['2nd', '3rd', '3rd', '4th', '4th']),
        cgpa: Math.round((6 + rand() * 3.8) * 10) / 10, skills, skillSource,
        projects: sample(PROJECTS[track], int(0, 2)).map(([title, tech]) => ({ title, tech, verified: rand() < 0.5 })),
        achievements: rand() < 0.35 ? [{ title: pick(ACHIEVEMENTS), year: pick(['2025', '2026']), verified: rand() < 0.5 }] : [],
      });
      s._track = track;
      students.push(s);
    }
  }

  // Assessment history: about 60% of students took one test in a category that fits their skills
  let assessments = 0;
  for (const s of students) {
    if (rand() > 0.6) continue;
    const skills = { ...s.skills }, source = { ...s.skillSource };
    const category = Object.keys(QUIZ_SKILLS).find(c => QUIZ_SKILLS[c].some(k => k in skills)) || 'Soft Skills & Aptitude';
    const skillResults = {};
    for (const k of new Set(QUIZ_SKILLS[category])) {
      skillResults[k] = pick([20, 40, 50, 60, 67, 75, 80, 100]);
      skills[k] = skillResults[k];
      source[k] = 'assessment';
    }
    const score = Math.round(Object.values(skillResults).reduce((a, b) => a + b, 0) / Object.keys(skillResults).length);
    s.skills = skills; s.skillSource = source;
    await s.save();
    const a = await Assessment.create({ student: s._id, category, answers: [], score, skillResults });
    await Assessment.updateOne({ _id: a._id }, { $set: { createdAt: daysAgo(int(5, 60)) } }, { timestamps: false });
    assessments++;
  }

  // Applications at every stage
  let applications = 0;
  for (const s of students) {
    const eligible = jobs.filter(j => !j.minCGPA || s.cgpa >= j.minCGPA);
    for (const job of sample(eligible, int(0, 4))) {
      const match = explainMatch(s.skills, job.toJSON(), s.cgpa).score;
      const status = outcome(match);
      const start = Date.now() - int(3, 75) * DAY;
      const stages = status === 'rejected' ? ['applied', 'rejected'] : PIPELINE.slice(0, PIPELINE.indexOf(status) + 1);
      const history = stages.map((st, k) => ({ status: st, at: new Date(Math.min(Date.now(), start + k * int(2, 6) * DAY)) }));
      const app = await Application.create({ job: job._id, student: s._id, status, matchAtApply: match, history });
      await Application.updateOne({ _id: app._id }, { $set: { createdAt: new Date(start) } }, { timestamps: false });
      await Job.updateOne({ _id: job._id }, { $inc: { applicants: 1 } });
      applications++;
    }
  }

  // Student logins for a handful of generated students (so recruiters see registered users)
  const studentUsers = [];
  for (const s of students.slice(0, 12)) {
    const email = `${s.name.toLowerCase().replace(/[^a-z]+/g, '.')}@${s.college.toLowerCase().split(' ')[0]}.demo`;
    studentUsers.push(await User.create({ name: s.name, email, role: 'student', organization: s.college, dept: s.dept, avatar: s.avatar, passwordHash, student: s._id }));
  }

  // More academicians and a second institution, to show per-college scoping
  const faculty = [];
  for (const [name, dept, designation] of [['Dr. Ravi Kulkarni', 'CSE', 'Professor'], ['Dr. Meenakshi Iyer', 'ECE', 'Assistant Professor'], ['Dr. Sameer Khan', 'IT', 'Associate Professor']]) {
    faculty.push(await User.create({
      name, email: `${name.split(' ')[1].toLowerCase()}.${name.split(' ')[2].toLowerCase()}@nitk.edu.in`,
      role: 'faculty', organization: 'NITK Surathkal', dept, designation, avatar: name.split(' ').slice(1).map(w => w[0]).join(''), passwordHash,
    }));
  }
  await User.create({ name: 'Dr. Lakshmi Narayan', email: 'placement.vit@edu.in', role: 'institution', organization: 'VIT Vellore', designation: 'Director, Placements', avatar: 'LN', passwordHash });

  // Program registrations
  let registrations = 0;
  for (const u of [...studentUsers, ...faculty]) {
    const open = programs.filter(p => PROGRAM_KINDS[p.kind].audience.includes(u.role));
    for (const p of sample(open, int(1, 3))) {
      const exists = await Registration.exists({ program: p._id, user: u._id });
      if (exists) continue;
      await Registration.create({ program: p._id, user: u._id, status: pick(['pending', 'pending', 'accepted', 'declined']), message: rand() < 0.5 ? 'Interested in joining.' : '' });
      registrations++;
    }
  }

  return { students: students.length, jobs: EXTRA_JOBS.length, assessments, applications, registrations };
}
