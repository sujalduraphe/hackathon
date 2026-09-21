-- ============================================================
-- SkillBridge - Complete Database Schema (Supabase/PostgreSQL)
-- Run this in the Supabase SQL Editor to create all tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'industry', 'institution')),
  avatar        TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── STUDENTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college      TEXT,
  dept         TEXT,
  year         TEXT,
  cgpa         NUMERIC(3,1) DEFAULT 0,
  skills       JSONB DEFAULT '{}'::JSONB,
  bio          TEXT,
  resume_url   TEXT,
  linkedin     TEXT,
  github       TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ─── FACULTY ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faculty (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college         TEXT,
  dept            TEXT,
  designation     TEXT,
  experience      TEXT,
  specialization  JSONB DEFAULT '[]'::JSONB,
  publications    INTEGER DEFAULT 0,
  bio             TEXT,
  linkedin        TEXT,
  google_scholar  TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ─── INDUSTRY PROFILES ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS industry_profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company       TEXT,
  designation   TEXT,
  website       TEXT,
  industry_type TEXT,
  about         TEXT,
  logo_url      TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ─── INSTITUTION PROFILES ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS institution_profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college         TEXT,
  total_students  INTEGER DEFAULT 0,
  departments     JSONB DEFAULT '[]'::JSONB,
  accreditation   TEXT,
  website         TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ─── JOBS ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  posted_by    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company      TEXT NOT NULL,
  logo         TEXT,
  color        TEXT DEFAULT '#6366f1',
  title        TEXT NOT NULL,
  type         TEXT NOT NULL,          -- 'Internship', 'Full-Time', 'Research Internship'
  location     TEXT,
  mode         TEXT DEFAULT 'Hybrid',  -- 'Remote', 'On-site', 'Hybrid'
  stipend      TEXT,
  duration     TEXT,
  skills       JSONB DEFAULT '[]'::JSONB,
  min_cgpa     NUMERIC(3,1) DEFAULT 0,
  openings     INTEGER DEFAULT 1,
  description  TEXT,
  deadline     DATE,
  category     TEXT DEFAULT 'internship', -- 'internship', 'fulltime', 'research'
  status       TEXT DEFAULT 'active',  -- 'active', 'closed', 'draft'
  applicants   INTEGER DEFAULT 0,
  posted_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── APPLICATIONS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  job_id        UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'applied'
                  CHECK (status IN ('applied', 'assessment', 'shortlisted', 'interview', 'offered', 'rejected')),
  cover_letter  TEXT,
  notes         TEXT,          -- Recruiter notes
  applied_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, job_id)
);

-- ─── ASSESSMENTS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  category        TEXT NOT NULL,
  score           INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  correct_count   INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 5,
  answers         JSONB DEFAULT '[]'::JSONB,
  taken_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SKILL PROFILES (historical tracking) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS skill_profiles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  skill        TEXT NOT NULL,
  proficiency  INTEGER CHECK (proficiency BETWEEN 0 AND 100),
  verified     BOOLEAN DEFAULT FALSE,
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, skill)
);

-- ─── PORTFOLIOS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolios (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  summary         TEXT,
  certifications  JSONB DEFAULT '[]'::JSONB,
  projects        JSONB DEFAULT '[]'::JSONB,
  achievements    JSONB DEFAULT '[]'::JSONB,
  github          TEXT,
  linkedin        TEXT,
  portfolio_url   TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id)
);

-- ─── FACULTY PROGRAMS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faculty_programs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  posted_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  type         TEXT NOT NULL,  -- 'FDP', 'Industrial Internship', 'Consultancy', 'Guest Lecture', 'R&D Project'
  icon         TEXT DEFAULT '📚',
  title        TEXT NOT NULL,
  organizer    TEXT NOT NULL,
  duration     TEXT,
  mode         TEXT DEFAULT 'Online',
  date         DATE,
  seats        INTEGER DEFAULT 50,
  registered   INTEGER DEFAULT 0,
  stipend      TEXT,
  skills       JSONB DEFAULT '[]'::JSONB,
  description  TEXT,
  certificate  BOOLEAN DEFAULT FALSE,
  color        TEXT DEFAULT '#6366f1',
  status       TEXT DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed'
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FACULTY REGISTRATIONS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faculty_registrations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id    UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
  program_id    UUID NOT NULL REFERENCES faculty_programs(id) ON DELETE CASCADE,
  status        TEXT DEFAULT 'registered',
  notes         TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(faculty_id, program_id)
);

-- ─── MENTORSHIPS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mentorships (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentee_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status      TEXT DEFAULT 'pending'
                CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  message     TEXT,
  goals       TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  message    TEXT NOT NULL,
  metadata   JSONB DEFAULT '{}'::JSONB,
  read       BOOLEAN DEFAULT FALSE,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_faculty_user_id ON faculty(user_id);
CREATE INDEX IF NOT EXISTS idx_industry_user_id ON industry_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_assessments_student ON assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_mentorships_mentor ON mentorships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_mentee ON mentorships(mentee_id);

-- ─── HELPER FUNCTION: increment applicant count ───────────────────────────────
CREATE OR REPLACE FUNCTION increment_applicants(job_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE jobs SET applicants = applicants + 1 WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

-- Done!
SELECT 'SkillBridge schema created successfully' AS status;
