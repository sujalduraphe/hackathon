# Academia–Industry Collaboration Portal
## Technical Stack & System Architecture

This document is a standalone technical companion to the main implementation plan. It covers the **complete technology stack**, **system architecture (high-level + detailed + deployment)**, **data flow**, **security architecture**, and a **feature-to-technology mapping** so every feature in the product plan has a clear technical home — including the enhancements (admin approval, skill taxonomy, employer feedback loop, notifications, mentorship, curriculum feedback).

---

## Table of Contents

1. [Architecture Style Decision](#1-architecture-style-decision)
2. [Complete Technology Stack](#2-complete-technology-stack)
3. [High-Level System Architecture](#3-high-level-system-architecture)
4. [Detailed Component Architecture](#4-detailed-component-architecture)
5. [Data Flow Architecture](#5-data-flow-architecture)
6. [Database Architecture](#6-database-architecture)
7. [Matching Engine Architecture](#7-matching-engine-architecture)
8. [API Design](#8-api-design)
9. [Authentication & Security Architecture](#9-authentication--security-architecture)
10. [Notification Architecture](#10-notification-architecture)
11. [File Storage & Document Verification Architecture](#11-file-storage--document-verification-architecture)
12. [Deployment & DevOps Architecture](#12-deployment--devops-architecture)
13. [Scalability & Performance Considerations](#13-scalability--performance-considerations)
14. [Monitoring, Logging & Observability](#14-monitoring-logging--observability)
15. [Third-Party Integrations](#15-third-party-integrations)
16. [Feature-to-Technology Mapping (Complete Feature List)](#16-feature-to-technology-mapping-complete-feature-list)
17. [Folder/Repo Structure](#17-folderrepo-structure)
18. [Environment & Config Management](#18-environment--config-management)
19. [Testing Strategy](#19-testing-strategy)
20. [MVP vs Full-Scale Stack Comparison](#20-mvp-vs-full-scale-stack-comparison)

---

## 1. Architecture Style Decision

For a hackathon build **and** a realistically scalable product, recommendation is a **modular monolith** (not microservices) for MVP, structured so it can be split into services later without a rewrite.

| Option | Verdict |
|---|---|
| Monolith (everything in one FastAPI app, clean modules) | ✅ **Chosen for MVP** — fastest to build, easiest to demo, easiest to deploy on one server |
| Microservices (separate Auth, Matching, Notification services) | ❌ Too much DevOps overhead for hackathon timeline; mention as a **Phase 2 roadmap item** for judges |
| Serverless functions (per-endpoint) | ❌ Cold starts hurt live-demo responsiveness; not worth it at this scale |

**Reasoning to state to judges:** "We use a modular monolith with clearly separated service layers (Auth, Skills, Matching, Notifications, Analytics) so that any module — e.g., the Matching Engine — can be extracted into an independent microservice once usage justifies it, without redesigning the system."

---

## 2. Complete Technology Stack

### 2.1 Frontend
| Layer | Technology | Purpose |
|---|---|---|
| Framework | **React.js (Vite)** | Fast dev server, component-based UI |
| Language | **TypeScript** | Type safety across student/industry/academician dashboards |
| Styling | **Tailwind CSS** | Rapid, consistent UI without hand-written CSS |
| Component library | **shadcn/ui** or **Material UI (MUI)** | Pre-built accessible components (forms, tables, modals) |
| State management | **React Query (TanStack Query)** + **Zustand/Redux Toolkit** | Server-state caching (React Query) + client/UI state (Zustand) |
| Charts | **Chart.js** or **Recharts** | Skill-gap bars, placement-readiness donut, analytics dashboards |
| Forms | **React Hook Form + Zod** | Assessment forms, profile forms, job-post forms with validation |
| Routing | **React Router v6** | Role-based routes (student/industry/academician/admin) |
| PWA support *(enhancement)* | **Vite PWA plugin** | Offline-first access for low-connectivity rural colleges |

### 2.2 Backend
| Layer | Technology | Purpose |
|---|---|---|
| Framework | **Python + FastAPI** | Async, auto-generated OpenAPI docs, strong typing via Pydantic |
| Alternative | Node.js + Express/NestJS | Viable if team is stronger in JS; FastAPI preferred for the matching-engine math |
| ORM | **SQLAlchemy 2.0 + Alembic** | DB models + migrations |
| Validation | **Pydantic v2** | Request/response schema validation |
| Background jobs | **Celery + Redis** (or FastAPI `BackgroundTasks` for MVP) | Resume parsing, notification dispatch, score recalculation |
| Task scheduling | **Celery Beat / APScheduler** | Periodic re-assessment reminders, skill-decay checks |

### 2.3 Database & Caching
| Layer | Technology | Purpose |
|---|---|---|
| Primary DB | **PostgreSQL** | Relational data — users, skills, jobs, applications |
| Caching | **Redis** | Cache computed match scores, session/rate-limit store, Celery broker |
| Search *(enhancement)* | **PostgreSQL full-text search** (MVP) → **Elasticsearch/Meilisearch** (scale) | Searching jobs/students/skills quickly |
| File/object storage | **AWS S3 / Cloudflare R2 / Supabase Storage** | Resumes, certificates, profile photos |

### 2.4 AI / Matching / ML Layer
| Layer | Technology | Purpose |
|---|---|---|
| MVP matching | **Rule-based weighted scoring (pure Python)** | Transparent, explainable, no training data needed |
| Resume/skill parsing | **pdfplumber / PyPDF2** + keyword matching against skill taxonomy | Auto-extract skills from uploaded resumes |
| NLP enhancement *(Phase 2)* | **spaCy** or a lightweight embedding model (e.g., `sentence-transformers`) | Fuzzy-match skill synonyms ("JS" ≈ "JavaScript"), semantic job-description parsing |
| Recommendation engine *(Phase 2)* | **scikit-learn** (content-based filtering) → collaborative filtering once enough usage data exists | Personalized course/job recommendations beyond static rules |
| AI counselor chatbot *(nice-to-have)* | Anthropic Claude API / OpenAI API | Conversational career guidance |

### 2.5 Authentication & Security
| Layer | Technology | Purpose |
|---|---|---|
| Auth | **JWT (access + refresh tokens)** | Stateless auth across roles |
| Password hashing | **bcrypt / argon2** | Never store plaintext passwords |
| RBAC | Custom middleware / FastAPI dependencies | Student / Industry / Academician / Admin permission scoping |
| Rate limiting | **slowapi** (FastAPI) or Redis-based limiter | Prevent brute force + API abuse |
| Input validation | Pydantic schemas | Prevent injection at the API boundary |
| Secrets management | **.env + python-dotenv** (dev) → **AWS Secrets Manager / Doppler** (prod) | Keep credentials out of source control |

### 2.6 Notifications
| Layer | Technology | Purpose |
|---|---|---|
| In-app | WebSocket (**FastAPI + `websockets`**) or polling via React Query | Real-time application-status updates |
| Email | **SendGrid / Resend / AWS SES** | Shortlist alerts, new-match alerts, weekly digest |
| SMS *(optional, rural reach)* | **Twilio / MSG91** | Critical status updates for low-connectivity users |

### 2.7 DevOps / Deployment
| Layer | Technology | Purpose |
|---|---|---|
| Frontend hosting | **Vercel / Netlify** | Auto CI/CD from GitHub, instant preview links |
| Backend hosting | **Render / Railway / AWS ECS / Fly.io** | Managed container hosting for FastAPI |
| Database hosting | **Supabase / Neon / AWS RDS (PostgreSQL)** | Managed Postgres with backups |
| Containerization | **Docker + Docker Compose** | Reproducible local dev + deployment parity |
| CI/CD | **GitHub Actions** | Lint → test → build → deploy pipeline |
| Version control | **Git + GitHub** | Source control, PR review |

### 2.8 Monitoring & Analytics
| Layer | Technology | Purpose |
|---|---|---|
| Error tracking | **Sentry** | Catch and alert on frontend/backend exceptions |
| App analytics | **PostHog** (self-hostable) or Google Analytics | Feature usage tracking for the analytics dashboards |
| Logs | **Loguru (Python) → stored in Better Stack / Grafana Loki** | Centralized structured logging |
| Uptime | **UptimeRobot / Better Stack** | Demo-day uptime monitoring |

---

## 3. High-Level System Architecture

```text
┌────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                            │
│   Student Web App   │   Industry Web App   │  Academician Web App    │
│         (React + Vite + TypeScript + Tailwind, role-based routing)   │
└───────────────────────────────┬────────────────────────────────────┘
                                 │ HTTPS / REST (+ WebSocket for notifications)
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY / LOAD BALANCER                  │
│              (Nginx / Cloud LB — TLS termination, rate limiting)     │
└───────────────────────────────┬────────────────────────────────────┘
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER (FastAPI Monolith)             │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌────────┐ │
│  │   Auth    │ │  Profile  │ │Assessment │ │ Matching  │ │ Admin  │ │
│  │  Module   │ │  Module   │ │  Module   │ │  Engine   │ │Module  │ │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └────────┘ │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐            │
│  │Jobs/Intern│ │Notification│ │ Analytics │ │ Curriculum│            │
│  │  Module   │ │  Module   │ │  Module   │ │  Feedback │            │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘            │
└───────┬─────────────────┬────────────────────┬──────────────┬───────┘
        │                 │                    │              │
        ▼                 ▼                    ▼              ▼
┌───────────────┐ ┌───────────────┐  ┌──────────────────┐ ┌────────────┐
│  PostgreSQL   │ │     Redis      │  │  Object Storage   │ │  Celery    │
│ (primary data)│ │ (cache/queue)  │  │ (S3 — resumes,     │ │  Workers   │
│               │ │                │  │  certificates)     │ │(background)│
└───────────────┘ └───────────────┘  └──────────────────┘ └────────────┘
                                 │
                                 ▼
                    ┌───────────────────────┐
                    │   EXTERNAL SERVICES    │
                    │  Email (SendGrid) │ SMS │
                    │  (Twilio) │ AI/NLP API   │
                    └───────────────────────┘
```

---

## 4. Detailed Component Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                         AUTH MODULE                                │
│  Signup/Login → bcrypt hash → JWT issue (access+refresh) → RBAC   │
│  guard on every route (student/industry/academician/admin)         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       PROFILE MODULE                               │
│  Student profile CRUD │ Company profile CRUD │ Academician profile │
│  Resume upload → Celery task → pdfplumber parse → skill suggestions│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     ASSESSMENT MODULE                              │
│  Question bank (per skill) → randomized set → timed submission →   │
│  auto-grading → writes to STUDENT_SKILLS + ASSESSMENT_ATTEMPTS     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     MATCHING ENGINE MODULE                         │
│  Reads STUDENT_SKILLS + ROLE_SKILL_TEMPLATE/JOB_SKILLS             │
│  → weighted score calculation → cache in Redis → returns ranked    │
│  list with per-skill strong/gap breakdown                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    JOBS/INTERNSHIP MODULE                          │
│  Company posts job → status=pending_review → Admin approves →      │
│  status=approved → visible to Matching Engine                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION MODULE                              │
│  Student applies → status pipeline (Applied→Review→Shortlist→      │
│  Interview→Selected/Rejected) → triggers Notification Module       │
│  → on "Selected & Completed", Company submits feedback →            │
│  STUDENT_SKILLS.verification_status = industry_verified            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ANALYTICS/CURRICULUM MODULE                     │
│  Aggregates STUDENT_SKILLS by department (anonymized) →            │
│  compares to industry-demanded skills → generates                  │
│  CURRICULUM_FEEDBACK report visible to Academician dashboard       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Data Flow Architecture

**Student assessment-to-match flow:**
```text
Student submits assessment
        │
        ▼
FastAPI validates & grades (Pydantic + scoring logic)
        │
        ▼
Writes to STUDENT_SKILLS (Postgres) + ASSESSMENT_ATTEMPTS
        │
        ▼
Celery task: recalculate skill gap vs ROLE_SKILL_TEMPLATE
        │
        ▼
Match scores recalculated for open jobs → cached in Redis
        │
        ▼
React frontend polls/fetches via React Query → renders
skill-gap chart + updated recommended internships
        │
        ▼
Notification module fires "New match found" (if score jump crosses threshold)
```

**Industry job-posting flow:**
```text
Company submits job + required skills (tagged against SKILLS taxonomy)
        │
        ▼
Status = pending_review → appears in Admin queue
        │
        ▼
Admin approves → status = approved
        │
        ▼
Matching Engine indexes job against all eligible student profiles
        │
        ▼
Top-matched students notified; Company dashboard shows ranked shortlist
```

---

## 6. Database Architecture

- **Engine:** PostgreSQL (ACID compliance needed for applications/status transitions)
- **Schema approach:** Normalized relational schema (see main plan document, Section 28, for full ERD) — `SKILLS` table is the single source of truth referenced by both `STUDENT_SKILLS` and `JOB_SKILLS`/`ROLE_SKILL_TEMPLATE` to avoid taxonomy drift
- **Migrations:** Alembic, version-controlled, run automatically in CI/CD before deploy
- **Indexing:** Composite index on `(student_id, skill_id)` and `(job_id, skill_id)` for fast match computation; index on `applications.status` for dashboard queries
- **Backups:** Daily automated snapshot (managed by hosting provider — Supabase/Neon/RDS all support this out of the box)
- **Read/write split (scale roadmap):** Add a read replica once analytics queries start competing with transactional load

---

## 7. Matching Engine Architecture

```text
INPUT: student_id, job_id (or career_goal_id for course recommendations)

STEP 1 — Fetch student's STUDENT_SKILLS (skill_id → skill_level, verification_status)
STEP 2 — Fetch JOB_SKILLS / ROLE_SKILL_TEMPLATE (skill_id → required_level, weight)
STEP 3 — For each required skill:
              skill_match% = min(student_level / required_level, 1.0) × 100
STEP 4 — Weighted sum:
              match_score = Σ (skill_match% × weight) / Σ weights
STEP 5 — Classify each skill as "Strong" (student_level ≥ required_level)
              or "Gap" (student_level < required_level, with the delta shown)
STEP 6 — Cache result in Redis (key: student_id:job_id, TTL: until skill/job changes)
STEP 7 — Return { match_score, strong_skills[], gap_skills[] }
```

**Design principle:** the scoring must stay **explainable** — every match score ships with the per-skill breakdown, never just a number. This is a deliberate contrast to opaque ML ranking and should be stated explicitly in the pitch as a trust feature.

**Upgrade path (Phase 2):** replace step 3's exact-skill lookup with an embedding-similarity fallback (via `sentence-transformers`) so that skills not in the taxonomy yet (e.g., a newly-added framework) can still be fuzzy-matched to the closest known skill.

---

## 8. API Design

RESTful, versioned (`/api/v1/...`), auto-documented via FastAPI's built-in OpenAPI/Swagger.

```text
Auth
  POST   /api/v1/auth/signup
  POST   /api/v1/auth/login
  POST   /api/v1/auth/refresh
  POST   /api/v1/auth/logout

Student
  GET/PUT /api/v1/students/{id}/profile
  POST    /api/v1/students/{id}/resume        (upload + parse)
  GET     /api/v1/students/{id}/skill-gap
  GET     /api/v1/students/{id}/recommendations

Assessment
  GET  /api/v1/assessments/{skill_id}/questions
  POST /api/v1/assessments/{skill_id}/submit

Jobs
  POST /api/v1/companies/{id}/jobs
  GET  /api/v1/jobs?filters=...
  GET  /api/v1/jobs/{id}/matched-students

Applications
  POST /api/v1/applications
  GET  /api/v1/applications/{id}
  PATCH /api/v1/applications/{id}/status
  POST /api/v1/applications/{id}/feedback     (employer → skill verification)

Admin
  GET   /api/v1/admin/pending-jobs
  PATCH /api/v1/admin/jobs/{id}/approve

Analytics
  GET /api/v1/analytics/department/{id}
  GET /api/v1/analytics/curriculum-feedback/{department_id}

Notifications
  GET /api/v1/notifications
  WS  /ws/notifications/{user_id}
```

---

## 9. Authentication & Security Architecture

```text
Login → verify bcrypt hash → issue:
  - Access Token (JWT, short-lived, 15 min)
  - Refresh Token (JWT, long-lived, 7 days, stored httpOnly cookie)

Every protected request:
  Client sends Access Token → FastAPI dependency decodes + verifies
  → checks role claim → checks resource ownership (e.g., a student
  can only edit their own profile) → proceeds or 403

Refresh flow:
  Access token expires → client calls /auth/refresh with refresh
  token → new access token issued (rotation optional for extra safety)
```

**Additional layers:**
- **RBAC matrix:** Student / Industry / Academician / Admin, enforced via FastAPI dependency injection on every route
- **Rate limiting:** per-IP and per-user limits on login and assessment-submission endpoints (prevents brute force + assessment spamming)
- **Input sanitization:** Pydantic schema validation at every boundary; parameterized queries via SQLAlchemy (no raw SQL) to prevent injection
- **File upload safety:** MIME-type + size validation before resumes/certificates hit object storage; virus scan (ClamAV) as a Phase 2 hardening step
- **Data privacy:** CGPA and contact details visible to the student's own dashboard and Admin only by default; Industry sees eligibility pass/fail + skill match, not raw sensitive fields, unless the student opts to share full profile with a specific application

---

## 10. Notification Architecture

```text
Event occurs (status change, new match, feedback received)
        │
        ▼
Notification Module writes row to NOTIFICATIONS table
        │
        ├──► WebSocket push (if user online) → instant in-app toast
        │
        └──► Celery task → Email (SendGrid) / SMS (Twilio) if
             user preference enabled or event is high-priority
             (e.g., "Shortlisted for interview")
```

Notification types: new skill-gap detected, new matching internship, application status change, employer feedback received (skill verified), curriculum-feedback report generated (academician), job pending approval (admin).

---

## 11. File Storage & Document Verification Architecture

```text
Upload (resume/certificate)
        │
        ▼
FastAPI validates MIME type + size (max 5MB)
        │
        ▼
Stored in S3-compatible bucket (path: /{user_id}/{doc_type}/{uuid}.pdf)
        │
        ▼
Celery background task:
  - pdfplumber extracts text
  - keyword-match against SKILLS taxonomy → suggested skills
  - (Phase 2) OCR fallback (Tesseract) for scanned certificates
        │
        ▼
Suggested skills shown to student for confirmation
(never auto-applied — keeps "self-declared" vs "verified" distinction intact)
```

---

## 12. Deployment & DevOps Architecture

```text
┌──────────────┐    push     ┌───────────────────┐
│   GitHub      │ ──────────► │  GitHub Actions CI │
│  (main branch)│             │  lint → test → build│
└──────────────┘             └─────────┬──────────┘
                                        │ on success
                     ┌──────────────────┼──────────────────┐
                     ▼                                      ▼
          ┌─────────────────────┐               ┌─────────────────────┐
          │  Vercel (Frontend)   │               │ Render/Railway        │
          │  auto-deploy React   │               │ (Backend, Docker image)│
          └─────────────────────┘               └──────────┬──────────┘
                                                             ▼
                                                  ┌─────────────────────┐
                                                  │ Managed PostgreSQL   │
                                                  │ (Supabase/Neon)      │
                                                  └─────────────────────┘
```

- **Local dev parity:** `docker-compose.yml` spins up FastAPI + Postgres + Redis together so local environment matches production
- **Environment separation:** `dev`, `staging`, `prod` with separate `.env` files and separate databases
- **Zero-downtime deploys:** rolling restart on the backend host; frontend deploys are atomic via Vercel

---

## 13. Scalability & Performance Considerations

| Concern | MVP approach | Scale-up approach |
|---|---|---|
| Match score computation | Computed on-demand, cached in Redis | Precompute nightly for all active job-student pairs via batch job |
| Database load | Single Postgres instance | Read replica for analytics queries; connection pooling (PgBouncer) |
| Search across students/jobs | Postgres full-text search | Elasticsearch/Meilisearch index |
| File storage | Single S3 bucket | CDN (CloudFront) in front of static assets/resumes |
| Multi-college scale | Single-tenant schema with `college_id` foreign key | Evaluate schema-per-tenant if a college requires data isolation guarantees |
| Real-time notifications | WebSocket per user, single server | Redis pub/sub to fan out across multiple backend instances |

---

## 14. Monitoring, Logging & Observability

```text
Application errors  → Sentry (frontend + backend)
Structured logs      → Loguru → shipped to Better Stack / Grafana Loki
Uptime               → UptimeRobot ping on /health endpoint
Usage analytics       → PostHog events (assessment completed, job applied,
                        feedback submitted) → feeds back into product decisions
```

A `/health` endpoint should be built from day one — it's also what the deploy pipeline and uptime monitor both depend on.

---

## 15. Third-Party Integrations

| Integration | Purpose | Priority |
|---|---|---|
| SendGrid / Resend | Transactional email | Must-have |
| Twilio / MSG91 | SMS notifications | Should-have |
| Digilocker API | Certificate verification | Nice-to-have (roadmap) |
| NPTEL/SWAYAM course catalog | Auto-suggest real courses for skill gaps | Nice-to-have |
| LinkedIn/GitHub OAuth | Faster signup + portfolio import | Nice-to-have |
| AICTE/UGC/NAAC data feeds | Institutional legitimacy verification | Nice-to-have (roadmap) |
| Anthropic/OpenAI API | AI career-counselor chatbot | Nice-to-have |

---

## 16. Feature-to-Technology Mapping (Complete Feature List)

This table is the full checklist connecting **every feature mentioned across both plans** to the specific technology that implements it — nothing from the product plan is left technically unaccounted for.

| # | Feature | Technology Used |
|---|---|---|
| 1 | Student/Industry/Academician/Admin login | FastAPI Auth module + JWT + bcrypt |
| 2 | Role-based dashboards | React Router (role-guarded routes) + RBAC middleware |
| 3 | Student profile creation | React Hook Form + Zod → FastAPI → PostgreSQL |
| 4 | Skill assessment (MCQ/coding-concept quizzes) | Question bank in Postgres, timed submission, auto-grading logic in FastAPI |
| 5 | Skill gap visualization (bar charts) | Recharts/Chart.js on frontend, computed via Matching Engine |
| 6 | Career-goal → skill mapping | `ROLE_SKILL_TEMPLATE` table + Matching Engine |
| 7 | Personalized learning recommendations | Rule-based recommender (MVP) → scikit-learn content-based filtering (Phase 2) |
| 8 | Internship/job matching + % score | Matching Engine module, Redis-cached |
| 9 | Multi-factor matching (location, eligibility, interest) | Extended weighting logic in Matching Engine |
| 10 | Industry job posting | Jobs module + Admin approval workflow |
| 11 | Industry dashboard (shortlist view) | React dashboard + `/jobs/{id}/matched-students` API |
| 12 | Academician department dashboard | Analytics module, aggregated SQL queries |
| 13 | Industry-led training programs | `COURSES` table extended with `provided_by_company_id` |
| 14 | Digital student portfolio | Profile module + Object Storage (certificates/projects) |
| 15 | Skill verification badges | `verification_status` enum on `STUDENT_SKILLS` |
| 16 | Skill-gap detection automation | Celery background task triggered on assessment submit |
| 17 | Opportunity matching automation | Matching Engine, triggered on new job or skill update |
| 18 | Recruiter shortlisting automation | SQL filter + Matching Engine ranking |
| 19 | Analytics/demand dashboards | Aggregation queries + Chart.js visualizations |
| 20 | Placement Readiness Score | Weighted formula (same engine as job matching) applied against career-goal template |
| 21 | Application tracking pipeline | `APPLICATIONS.status` state machine + Notification module |
| 22 | **Admin approval queue** *(enhancement)* | Admin module, `status=pending_review` gate on Jobs |
| 23 | **Skill taxonomy/normalization** *(enhancement)* | Normalized `SKILLS` table with alias matching |
| 24 | **Resume parsing / auto skill extraction** *(enhancement)* | pdfplumber + Celery background task |
| 25 | **Notifications (in-app/email/SMS)** *(enhancement)* | WebSocket + SendGrid + Twilio |
| 26 | **Employer feedback → industry-verified skill** *(enhancement)* | `APPLICATION_FEEDBACK` table + status-upgrade logic |
| 27 | **Curriculum feedback loop for academicians** *(enhancement)* | `CURRICULUM_FEEDBACK` table + scheduled aggregation job |
| 28 | **Mentorship module** *(enhancement)* | `MENTORSHIPS` table + matching by skill_focus_id |
| 29 | **Anti-cheat on assessments** *(enhancement)* | Randomized question pool + timed sections + `ASSESSMENT_ATTEMPTS` logging |
| 30 | **Skill decay / re-assessment reminders** *(enhancement)* | Celery Beat scheduled task checking `taken_at` age |
| 31 | Regional language + offline PWA *(nice-to-have)* | i18next + Vite PWA plugin |
| 32 | Digilocker/AICTE integration *(nice-to-have)* | External API integration layer |
| 33 | AI career-counselor chatbot *(nice-to-have)* | Claude/OpenAI API wrapped as a chat endpoint |
| 34 | Gamification (badges/streaks) *(nice-to-have)* | New `ACHIEVEMENTS` table + frontend badge component |

---

## 17. Folder/Repo Structure

```text
academia-industry-portal/
├── frontend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── student/
│   │   │   ├── industry/
│   │   │   ├── academician/
│   │   │   └── admin/
│   │   ├── components/         (shared UI: charts, cards, forms)
│   │   ├── hooks/               (React Query hooks per API)
│   │   ├── lib/                 (axios client, auth utils)
│   │   └── routes/
│   ├── public/
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── students/
│   │   │   ├── companies/
│   │   │   ├── assessments/
│   │   │   ├── matching/
│   │   │   ├── jobs/
│   │   │   ├── applications/
│   │   │   ├── notifications/
│   │   │   ├── analytics/
│   │   │   └── admin/
│   │   ├── models/               (SQLAlchemy models)
│   │   ├── schemas/               (Pydantic schemas)
│   │   ├── core/                  (config, security, db session)
│   │   ├── tasks/                 (Celery tasks)
│   │   └── main.py
│   ├── alembic/                   (migrations)
│   ├── tests/
│   └── requirements.txt
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```

---

## 18. Environment & Config Management

```text
.env.dev        → local Docker Compose values
.env.staging     → staging deploy secrets (GitHub Actions secrets)
.env.production   → production secrets (Render/Railway env vars)

Never committed: DATABASE_URL, JWT_SECRET, S3 keys, SendGrid/Twilio keys
```

---

## 19. Testing Strategy

| Layer | Tool | What's tested |
|---|---|---|
| Backend unit tests | **pytest** | Matching engine scoring logic, auth token flow, skill-gap calculation |
| API integration tests | **pytest + httpx TestClient** | Full request/response cycles per endpoint |
| Frontend unit tests | **Vitest + React Testing Library** | Form validation, chart rendering with mock data |
| E2E tests | **Playwright** | Full demo-critical journey: signup → assessment → view match → apply |
| Load testing *(optional, for scale slide)* | **Locust** | Matching engine under concurrent load |

---

## 20. MVP vs Full-Scale Stack Comparison

| Component | MVP (Hackathon) | Full-Scale (Production Roadmap) |
|---|---|---|
| Matching | Rule-based weighted scoring | ML-based embeddings + collaborative filtering |
| Search | Postgres full-text | Elasticsearch/Meilisearch |
| Notifications | In-app only | In-app + Email + SMS |
| Hosting | Render/Vercel free tiers | AWS ECS/EKS with autoscaling |
| Database | Single Postgres instance | Postgres primary + read replica + PgBouncer |
| File parsing | Regex/keyword extraction | NLP-based entity extraction |
| Monitoring | Basic Sentry + health endpoint | Full observability stack (Grafana + Loki + Prometheus) |
| Multi-tenancy | Single schema, `college_id` FK | Evaluated per-scale, possible schema-per-tenant |
