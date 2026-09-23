# SkillBridge — Academia–Industry Collaboration Portal

Smart India Hackathon 2026 · Problem Statement **26044** · Portal for Academia–Industry collaboration for Skill Mapping, Internships and Placement.

One portal for **students**, **industry**, **academicians** and **institutions**, built around a skill profile that every match can explain.

## What it does

| Role | Features |
|---|---|
| Student | Skill assessment (technical, soft skills, aptitude) graded on the server · skill profile and gap analysis against live postings · learning pathways and industry programs for each gap · internships and jobs ranked by an explainable match score · apply and track applications · digital portfolio (resume, verified skills, projects, internships, achievements) · register for training, workshops, mentorship, innovation challenges and live projects |
| Industry | Post internships and jobs (skills can be extracted from a pasted job description) · candidates ranked for each posting with per-skill reasons · move applicants through the pipeline · view resumes · publish programs (training, workshops, mentorship, challenges, live projects, FDPs, industrial training, faculty internships, consultancy, research, guest lectures) and accept registrations |
| Academician | Browse and register for FDPs, industrial training, faculty internships, consultancy, collaborative research, guest lectures, workshops and live projects |
| Institution | Cohort skill gaps vs industry demand · placement funnel · per-student placement readiness · verify students' portfolio items · view resumes (own college only) · **Market Insights**: import real job-description datasets (CSV) |

**Explainable matching:** for each required skill, readiness = student level ÷ level the employer asks for (capped at 100%); the match score is the average. Every score is shown with its per-skill breakdown. CGPA is an eligibility gate, reported separately.

## Real job-description data

Skill requirements come from two places: postings made on the portal, and **real-world job descriptions imported as CSV** (e.g. a Glassdoor export or a public job-postings dataset you are allowed to use). Each description is run through the same skill extractor, grouped into roles, and blended into students' gap analysis and the institution's skill-gap chart, with the source shown.

- Import from the institution's **Market Insights** page, or `npm --prefix server run import-jds -- file.csv "Source name"`.
- Recognised columns: `Job Description` (required), `Job Title`, `Company Name`, `Location`, the Glassdoor export layout plus common variants.
- `server/data/sample-job-descriptions.csv` is a **synthetic** sample in that layout, loaded by `npm run seed`. Glassdoor itself is not scraped: its terms forbid automated collection.

## Stack

React 19 + Vite · Node.js + Express · MongoDB (Mongoose) · JWT auth with role-based access control, enforced on the server.
Matching, skill extraction and assessment grading (`src/lib`) are shared by the frontend and the API.

## Run locally

```bash
# MongoDB
docker run -d --name aicp-mongo -p 27017:27017 -v aicp-mongo-data:/data/db mongo:7

# API (http://localhost:5050)
cd server && npm install && cp .env.example .env && npm run seed && npm run dev

# Frontend (http://localhost:5173), in another terminal from the repo root
npm install && npm run dev
```

## Demo accounts

Password for all: `demo1234`

| Role | Email |
|---|---|
| Student | arjun.sharma@nitk.edu.in |
| Industry (Microsoft) | rahul.mehta@microsoft.demo |
| Academician | priya.nair@nitk.edu.in |
| Institution (NITK) | placement.nitk@edu.in |
| Institution (VIT) | placement.vit@edu.in |

The top bar has **Student / Industry / Academician / Institution** tabs that log in as the demo account for that role, handy for demos. It's a real login, so the server's permission checks still apply. Set `VITE_DEMO_SWITCH=false` when building to hide it.

## Deploy

- **Database:** MongoDB Atlas (free M0 cluster). Allow network access from anywhere (`0.0.0.0/0`), since Render's free tier has no fixed IP.
- **API:** Render, using `render.yaml` (New → Blueprint). Set `MONGODB_URI` and `FRONTEND_URL`; `JWT_SECRET` is generated. With `SEED_DEMO=true`, an empty database is filled with demo data on first start.
- **Frontend:** Vercel, framework preset Vite, with `VITE_API_URL=https://<render-service>.onrender.com/api`.

Render's free tier sleeps after 15 minutes idle; the first request after that takes about a minute. Open the site once before a demo.

See `server/README.md` for the API and access rules.
