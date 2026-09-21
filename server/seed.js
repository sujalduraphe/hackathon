/**
 * SkillBridge – Database Seed Script
 * Populates Supabase with realistic demo data from store.js
 *
 * Usage: node server/seed.js
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

console.log('🌱 SkillBridge Seed Script Starting...\n');

// ─── Demo Users ───────────────────────────────────────────────────────────────
const USERS = [
  { name: 'Arjun Sharma', email: 'arjun@nitk.edu.in', password: 'Password123', role: 'student' },
  { name: 'Priya Menon', email: 'priya.menon@iitm.edu', password: 'Password123', role: 'student' },
  { name: 'Rohan Gupta', email: 'rohan@vit.edu', password: 'Password123', role: 'student' },
  { name: 'Aisha Khan', email: 'aisha@bits.edu', password: 'Password123', role: 'student' },
  { name: 'Varun Reddy', email: 'varun@nitw.edu', password: 'Password123', role: 'student' },
  { name: 'Sneha Iyer', email: 'sneha@srm.edu', password: 'Password123', role: 'student' },
  { name: 'Dr. Priya Nair', email: 'priya.nair@nitk.edu.in', password: 'Password123', role: 'faculty' },
  { name: 'Prof. Ramesh Kumar', email: 'ramesh@nitk.edu.in', password: 'Password123', role: 'faculty' },
  { name: 'Rahul Mehta', email: 'rahul@techcorp.io', password: 'Password123', role: 'industry' },
  { name: 'Anjali Singh', email: 'anjali@google.com', password: 'Password123', role: 'industry' },
  { name: 'Prof. Suresh Kumar', email: 'placement@nitk.edu.in', password: 'Password123', role: 'institution' },
];

const STUDENT_PROFILES = [
  { email: 'arjun@nitk.edu.in', college: 'NITK Surathkal', dept: 'CSE', year: '3rd', cgpa: 8.7, skills: { 'Python': 78, 'Machine Learning': 62, 'React.js': 55, 'SQL': 70, 'Node.js': 45, 'Data Structures': 85, 'System Design': 40, 'Cloud (AWS/GCP)': 38, 'Communication': 72, 'Leadership': 60 } },
  { email: 'priya.menon@iitm.edu', college: 'IIT Madras', dept: 'CSE', year: '4th', cgpa: 9.1, skills: { 'Python': 90, 'Machine Learning': 88, 'TensorFlow': 80, 'SQL': 75, 'Data Structures': 92 } },
  { email: 'rohan@vit.edu', college: 'VIT Vellore', dept: 'IT', year: '4th', cgpa: 8.2, skills: { 'Java': 82, 'Node.js': 75, 'Cloud (AWS/GCP)': 68, 'SQL': 88 } },
  { email: 'aisha@bits.edu', college: 'BITS Pilani', dept: 'CS', year: '3rd', cgpa: 9.3, skills: { 'React.js': 88, 'Node.js': 82, 'Python': 75, 'System Design': 70 } },
  { email: 'varun@nitw.edu', college: 'NITW', dept: 'ECE', year: '4th', cgpa: 7.9, skills: { 'Python': 65, 'Communication': 78, 'Leadership': 72, 'Data Structures': 60 } },
  { email: 'sneha@srm.edu', college: 'SRM Chennai', dept: 'CSE', year: '3rd', cgpa: 8.5, skills: { 'Python': 84, 'Machine Learning': 76, 'Node.js': 70, 'Docker & Kubernetes': 65 } },
];

const FACULTY_PROFILES = [
  { email: 'priya.nair@nitk.edu.in', college: 'NITK Surathkal', dept: 'IT', designation: 'Associate Professor', experience: '12 years', specialization: ['AI/ML', 'NLP', 'Computer Vision'], publications: 28 },
  { email: 'ramesh@nitk.edu.in', college: 'NITK Surathkal', dept: 'CSE', designation: 'Professor', experience: '20 years', specialization: ['Distributed Systems', 'Cloud Computing'], publications: 45 },
];

const INDUSTRY_PROFILES_DATA = [
  { email: 'rahul@techcorp.io', company: 'TechCorp Solutions', designation: 'Head of Talent Acquisition', website: 'https://techcorp.io', industry_type: 'IT Services' },
  { email: 'anjali@google.com', company: 'Google India', designation: 'University Recruiter', website: 'https://google.com', industry_type: 'Technology' },
];

const JOBS_DATA = [
  { company: 'Google', logo: '🔵', color: '#4285f4', title: 'Software Engineering Intern', type: 'Internship', location: 'Bengaluru', mode: 'Hybrid', stipend: '₹80,000/month', duration: '6 months', skills: ['Python', 'Data Structures', 'System Design', 'Machine Learning'], min_cgpa: 8.0, openings: 15, description: "Join Google's Core ML team to build next-generation recommendation systems. Work with petabyte-scale data.", deadline: '2026-10-15', category: 'internship' },
  { company: 'Microsoft', logo: '🟦', color: '#00a4ef', title: 'Full Stack Developer Intern', type: 'Internship', location: 'Hyderabad', mode: 'Hybrid', stipend: '₹70,000/month', duration: '4 months', skills: ['React.js', 'Node.js', 'SQL', 'Cloud (AWS/GCP)'], min_cgpa: 7.5, openings: 20, description: 'Work on Azure DevOps platform features used by millions of developers worldwide. Ship production code from day one.', deadline: '2026-10-20', category: 'internship' },
  { company: 'Flipkart', logo: '🛍️', color: '#f7931a', title: 'Data Science Intern', type: 'Internship', location: 'Bengaluru', mode: 'On-site', stipend: '₹60,000/month', duration: '3 months', skills: ['Python', 'Machine Learning', 'SQL'], min_cgpa: 7.8, openings: 10, description: 'Build demand forecasting models that directly impact supply chain operations for 500M+ SKUs.', deadline: '2026-10-10', category: 'internship' },
  { company: 'Zomato', logo: '🍴', color: '#e23744', title: 'Backend Engineer (SDE-I)', type: 'Full-Time', location: 'Gurugram', mode: 'Hybrid', stipend: '₹18 LPA', duration: 'Permanent', skills: ['Java', 'Node.js', 'Cloud (AWS/GCP)'], min_cgpa: 7.0, openings: 8, description: 'Build and scale backend services serving 80M+ monthly active users.', deadline: '2026-10-30', category: 'fulltime' },
  { company: 'Razorpay', logo: '💳', color: '#3395ff', title: 'ML Engineer', type: 'Full-Time', location: 'Bengaluru', mode: 'Remote', stipend: '₹22 LPA', duration: 'Permanent', skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'], min_cgpa: 8.0, openings: 5, description: "Build fraud detection models and risk scoring systems for India's fastest-growing fintech.", deadline: '2026-11-01', category: 'fulltime' },
  { company: 'ISRO', logo: '🚀', color: '#ff6b35', title: 'Software Research Intern', type: 'Research Internship', location: 'Bengaluru', mode: 'On-site', stipend: '₹25,000/month', duration: '6 months', skills: ['Python', 'Data Structures'], min_cgpa: 8.5, openings: 4, description: 'Contribute to satellite telemetry processing and real-time ground station software.', deadline: '2026-09-30', category: 'research' },
];

const FACULTY_PROGRAMS_DATA = [
  { type: 'FDP', icon: '📚', title: 'Advanced AI & Deep Learning', organizer: 'Google Developer Academy', duration: '5 Days', mode: 'Online', date: '2026-10-15', seats: 50, stipend: '₹5,000', skills: ['TensorFlow', 'PyTorch', 'Transformers', 'Machine Learning'], color: '#4285f4', description: 'Intensive program on state-of-the-art deep learning including LLMs and multimodal AI systems.', certificate: true },
  { type: 'Industrial Internship', icon: '🏭', title: 'Industry Immersion Program - Manufacturing 4.0', organizer: 'Tata Steel', duration: '4 Weeks', mode: 'On-site (Jamshedpur)', date: '2026-12-01', seats: 20, stipend: '₹40,000', skills: ['IoT', 'Data Analysis', 'Python'], color: '#00447c', description: 'Hands-on exposure to smart manufacturing and AI-driven quality control.', certificate: true },
  { type: 'FDP', icon: '☁️', title: 'Cloud Architecture & DevOps Certification', organizer: 'Amazon Web Services', duration: '3 Days', mode: 'Hybrid', date: '2026-11-20', seats: 80, stipend: '₹3,000 + AWS Credits', skills: ['Cloud (AWS/GCP)', 'Docker & Kubernetes', 'System Design'], color: '#ff9900', description: 'AWS Solutions Architect certification training with DevOps practices.', certificate: true },
  { type: 'Guest Lecture', icon: '🎤', title: 'Future of Generative AI in Enterprise', organizer: 'NVIDIA India', duration: '2 Hours', mode: 'Virtual', date: '2026-09-25', seats: 200, stipend: 'Honorarium: ₹10,000', skills: ['Machine Learning', 'Python'], color: '#76b900', description: 'Expert session on deploying LLMs in enterprise workflows.', certificate: false },
  { type: 'R&D Project', icon: '🧪', title: 'Collaborative Research: NLP for Indian Languages', organizer: 'Infosys Labs & IIT Bombay', duration: '1 Year', mode: 'Collaborative', date: '2026-10-15', seats: 5, stipend: '₹3,00,000 (Annual)', skills: ['Python', 'Machine Learning'], color: '#0d47a1', description: 'Research partnership to build multilingual NLP models for 22 Indian languages.', certificate: true },
];

// ─── Main seed function ───────────────────────────────────────────────────────
async function seed() {
  try {
    // 1. Create Users
    console.log('👤 Creating users...');
    const userIdMap = {};

    for (const u of USERS) {
      const hash = await bcrypt.hash(u.password, 12);
      const avatar = u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

      const { data, error } = await supabase
        .from('users')
        .upsert({ name: u.name, email: u.email, password_hash: hash, role: u.role, avatar }, { onConflict: 'email' })
        .select('id, email')
        .single();

      if (error) { console.error(`  ❌ User ${u.email}:`, error.message); continue; }
      userIdMap[u.email] = data.id;
      console.log(`  ✅ ${u.role}: ${u.name}`);
    }

    // 2. Create Student Profiles
    console.log('\n🎓 Creating student profiles...');
    const studentIdMap = {};
    for (const sp of STUDENT_PROFILES) {
      const userId = userIdMap[sp.email];
      if (!userId) continue;

      const { data, error } = await supabase
        .from('students')
        .upsert({ user_id: userId, college: sp.college, dept: sp.dept, year: sp.year, cgpa: sp.cgpa, skills: sp.skills }, { onConflict: 'user_id' })
        .select('id')
        .single();

      if (error) { console.error(`  ❌ Student ${sp.email}:`, error.message); continue; }
      studentIdMap[sp.email] = data.id;

      // Create portfolio
      await supabase.from('portfolios').upsert({
        student_id: data.id,
        certifications: [
          { id: 1, title: 'Python for Data Science', issuer: 'Coursera', date: '2026-06-15', verified: true },
          { id: 2, title: 'React Basics', issuer: 'Udemy', date: '2026-04-20', verified: false },
        ],
        projects: [
          { id: 1, title: 'Smart Campus App', tech: ['React', 'Node.js', 'MongoDB'], verified: true, github: 'https://github.com' },
          { id: 2, title: 'Crop Disease Detection', tech: ['Python', 'TensorFlow'], verified: true, github: 'https://github.com' },
        ],
        achievements: [
          { id: 1, title: 'Smart India Hackathon 2025 Finalist', date: '2025-08-20' },
        ],
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      }, { onConflict: 'student_id' });

      console.log(`  ✅ ${sp.email} (CGPA: ${sp.cgpa})`);
    }

    // 3. Create Faculty Profiles
    console.log('\n👨‍🏫 Creating faculty profiles...');
    for (const fp of FACULTY_PROFILES) {
      const userId = userIdMap[fp.email];
      if (!userId) continue;

      const { error } = await supabase
        .from('faculty')
        .upsert({ user_id: userId, ...fp }, { onConflict: 'user_id' });

      if (error) console.error(`  ❌ Faculty ${fp.email}:`, error.message);
      else console.log(`  ✅ ${fp.email}`);
    }

    // 4. Create Industry Profiles
    console.log('\n🏢 Creating industry profiles...');
    for (const ip of INDUSTRY_PROFILES_DATA) {
      const userId = userIdMap[ip.email];
      if (!userId) continue;

      const { error } = await supabase
        .from('industry_profiles')
        .upsert({ user_id: userId, ...ip }, { onConflict: 'user_id' });

      if (error) console.error(`  ❌ Industry ${ip.email}:`, error.message);
      else console.log(`  ✅ ${ip.company}`);
    }

    // 5. Create Jobs
    console.log('\n💼 Creating jobs...');
    const jobIds = [];
    const industryUserId = userIdMap['anjali@google.com'] || userIdMap['rahul@techcorp.io'];

    for (const job of JOBS_DATA) {
      const { data, error } = await supabase
        .from('jobs')
        .insert({ ...job, posted_by: industryUserId })
        .select('id')
        .single();

      if (error) { console.error(`  ❌ Job "${job.title}":`, error.message); continue; }
      jobIds.push(data.id);
      console.log(`  ✅ ${job.company}: ${job.title}`);
    }

    // 6. Create Applications (Arjun applies to first 3 jobs)
    console.log('\n📋 Creating sample applications...');
    const arjunStudentId = studentIdMap['arjun@nitk.edu.in'];
    if (arjunStudentId && jobIds.length >= 3) {
      const statuses = ['shortlisted', 'applied', 'applied'];
      for (let i = 0; i < 3; i++) {
        const { error } = await supabase
          .from('applications')
          .upsert({ student_id: arjunStudentId, job_id: jobIds[i], status: statuses[i] }, { onConflict: 'student_id,job_id' });
        if (!error) console.log(`  ✅ Application ${i + 1} created`);
      }
    }

    // 7. Create Faculty Programs
    console.log('\n📚 Creating faculty programs...');
    for (const program of FACULTY_PROGRAMS_DATA) {
      const { error } = await supabase
        .from('faculty_programs')
        .insert({ ...program, posted_by: industryUserId });

      if (error) console.error(`  ❌ Program "${program.title}":`, error.message);
      else console.log(`  ✅ ${program.type}: ${program.title}`);
    }

    // 8. Create Notifications
    console.log('\n🔔 Creating notifications...');
    const arjunUserId = userIdMap['arjun@nitk.edu.in'];
    if (arjunUserId) {
      await supabase.from('notifications').insert([
        { user_id: arjunUserId, type: 'application_shortlisted', message: '🎉 You have been shortlisted for "Software Engineering Intern" at Google!', read: false },
        { user_id: arjunUserId, type: 'assessment_reminder', message: '📝 Complete your System Design assessment to boost your profile match score', read: false },
        { user_id: arjunUserId, type: 'new_job', message: '🆕 New job matching your profile: ML Engineer at Razorpay (75% match)', read: true },
      ]);
      console.log('  ✅ Sample notifications created');
    }

    console.log('\n🎉 Seed completed successfully!\n');
    console.log('📌 Demo login credentials:');
    console.log('   Student:     arjun@nitk.edu.in / Password123');
    console.log('   Faculty:     priya.nair@nitk.edu.in / Password123');
    console.log('   Industry:    rahul@techcorp.io / Password123');
    console.log('   Institution: placement@nitk.edu.in / Password123');
    console.log('\n🚀 Run the server: cd server && npm run dev\n');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
