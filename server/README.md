# SkillBridge – Backend API

Node.js + Express REST API for the Academia–Industry Collaboration Portal.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 (ESM) |
| Framework | Express.js |
| Database | Supabase (PostgreSQL) |
| Auth | JWT + bcryptjs |
| Validation | express-validator |

## Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in your Supabase URL, ANON_KEY, and SERVICE_ROLE_KEY
```

Get your Supabase keys from:  
**Supabase Dashboard → Project → Settings → API**

### 3. Create Database Tables
Copy the contents of `schema.sql` and run it in the **Supabase SQL Editor**.

### 4. Seed Demo Data (optional)
```bash
npm run seed
```

### 5. Start Server
```bash
npm run dev        # Development (with nodemon)
npm start          # Production
```

Server runs on `http://localhost:5000`

---

## API Reference

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, get JWT |
| GET | `/api/auth/me` | Auth | Get own profile |
| PUT | `/api/auth/me` | Auth | Update profile |

### Jobs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/jobs` | Public | List jobs (with optional match scoring) |
| POST | `/api/jobs` | Industry | Post a job |
| GET | `/api/jobs/:id` | Public | Job details |
| PUT | `/api/jobs/:id` | Industry | Update job |
| DELETE | `/api/jobs/:id` | Industry | Close job |
| GET | `/api/jobs/my` | Industry | My posted jobs |
| GET | `/api/jobs/:id/candidates` | Industry | Applicants with match scores |

### Applications
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/applications` | Auth | Role-filtered list |
| POST | `/api/applications` | Student | Apply to a job |
| PUT | `/api/applications/:id/status` | Industry | Update status |
| DELETE | `/api/applications/:id` | Student | Withdraw |

### Assessments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/assessments/questions` | Public | Get quiz categories |
| GET | `/api/assessments/questions?category=Core CS` | Public | Get questions |
| POST | `/api/assessments/submit` | Student | Submit & score |
| GET | `/api/assessments/my` | Student | My history |

### Skill Gap
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/skill-gap` | Auth | Compute my gap |
| GET | `/api/skill-gap/recommendations` | Auth | Learning path |
| GET | `/api/skill-gap/industry-demand` | Public | Market demand data |

### Faculty Programs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/faculty-programs` | Public | List programs |
| POST | `/api/faculty-programs` | Industry | Post a program |
| POST | `/api/faculty-programs/:id/register` | Faculty | Register |
| DELETE | `/api/faculty-programs/:id/register` | Faculty | Cancel |
| GET | `/api/faculty-programs/my` | Faculty | My programs |
| GET | `/api/faculty-programs/dashboard` | Faculty | Dashboard |

### Analytics
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/analytics/institution` | Institution | Placement dashboard |
| GET | `/api/analytics/industry` | Industry | Recruitment pipeline |
| GET | `/api/analytics/skill-demand` | Public | Skill demand heatmap |

### Portfolio
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/portfolio/:studentId` | Public | View portfolio |
| PUT | `/api/portfolio/:studentId` | Student | Update portfolio |
| POST | `/api/portfolio/:studentId/certifications` | Student | Add certification |
| POST | `/api/portfolio/:studentId/projects` | Student | Add project |

### Students
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/students` | Industry/Institution | List with filters |
| GET | `/api/students/me/dashboard` | Student | Dashboard stats |
| GET | `/api/students/:id` | Auth | Full profile |
| PUT | `/api/students/:id/skills` | Student | Update skills |

### Mentorships
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/mentorships` | Auth | List mentorships |
| GET | `/api/mentorships/mentors` | Student | Available mentors |
| POST | `/api/mentorships` | Student | Request mentorship |
| PUT | `/api/mentorships/:id/status` | Faculty/Industry | Accept/reject |

### Notifications
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/notifications` | Auth | My notifications |
| PUT | `/api/notifications/read-all` | Auth | Mark all read |
| PUT | `/api/notifications/:id/read` | Auth | Mark one read |
| DELETE | `/api/notifications/:id` | Auth | Delete |

---

## Authentication

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

---

## Demo Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Student | arjun@nitk.edu.in | Password123 |
| Faculty | priya.nair@nitk.edu.in | Password123 |
| Industry | rahul@techcorp.io | Password123 |
| Institution | placement@nitk.edu.in | Password123 |
