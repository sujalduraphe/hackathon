# SkillBridge – Backend API

Node.js + Express REST API for the Academia–Industry Collaboration Portal.

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ (ESM) |
| Framework | Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt, role-based access control |

Matching, skill extraction and assessment grading live in `../src/lib` and are
shared with the frontend, so a score is computed identically in both places.

## Setup

```bash
# 1. MongoDB (local via Docker, or use a MongoDB Atlas connection string)
docker run -d --name aicp-mongo -p 27017:27017 -v aicp-mongo-data:/data/db mongo:7

# 2. Install and configure
cd server
npm install
cp .env.example .env        # set MONGODB_URI and a long random JWT_SECRET

# 3. Seed demo data (wipes the database)
npm run seed

# 4. Start
npm run dev                  # http://localhost:5050
```

Port 5050 is used because macOS reserves 5000 for AirPlay Receiver.

## Demo accounts

All use password `demo1234`.

| Role | Email |
|---|---|
| Student | arjun.sharma@nitk.edu.in |
| Industry (Microsoft) | rahul.mehta@microsoft.demo |
| Academician | priya.nair@nitk.edu.in |
| Institution (NITK TPO) | placement.nitk@edu.in |

Other seeded companies have recruiter logins `hr@<company>.demo` (e.g. `hr@google.demo`).

## Access rules

| Endpoint | Who | Scope |
|---|---|---|
| `POST /api/auth/register`, `POST /api/auth/login` | anyone | |
| `GET /api/auth/me` | any signed-in user | self |
| `GET /api/students/me`, `POST/DELETE /api/students/me/portfolio/:kind[/:id]` | student | own profile |
| `GET /api/students` | industry, institution | institution: own college only |
| `PATCH /api/students/:id/portfolio/:kind/:itemId` | institution | own college's students only |
| `GET /api/jobs` | any signed-in user | `?mine=1` for a recruiter's own |
| `POST /api/jobs`, `POST /api/jobs/extract-skills` | industry | posts under own company |
| `GET /api/jobs/:id/candidates` | industry | own postings only |
| `GET /api/applications` | student, industry, institution | own / own postings / own college |
| `POST /api/applications` | student | CGPA eligibility enforced |
| `PATCH /api/applications/:id` | industry | own postings; one stage at a time, or reject |
| `GET/POST /api/assessments` | student | graded on the server |
| `GET /api/analytics/institution` | institution | own college |
