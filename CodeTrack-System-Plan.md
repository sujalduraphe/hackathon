# CodeTrack — Live Session Task Tracking System
## Phase 0 of the Academia–Industry Collaboration Portal

> **Status:** Planning → Awaiting Approval  
> **Priority:** Build FIRST, before all other portal features  
> **Est. Build Time:** 5–7 days  
> **Integrates with:** [Main Plan](./Academia-Industry-Collaboration-Portal-Plan.md) | [Tech Stack](./Technical-Stack-and-System-Architecture.md)

---

## Why CodeTrack Comes First

The main portal plan (assessments, matching, placements) needs **real student skill data** to function. CodeTrack generates that data naturally from daily classroom sessions:

```
Daily classroom sessions (CodeTrack)
    → task completion rates per student per topic
    → common problem areas (from "stuck" reports)
    → attendance + participation data
        → feeds into Skill Profiles (Phase 1)
            → feeds into Skill Gap Engine (Phase 2)
                → feeds into Matching Engine (Phase 3)
```

Without CodeTrack, the portal starts with zero data and requires students to manually take assessments — friction that kills adoption.

---

## System Overview

### For Teachers
- **Full-page dashboard** in their browser
- Create sessions with one click → get a 6-char code
- Add tasks with one click → instantly broadcast to all students
- See live status: who's done, who's working, who's stuck and why
- Send hints to specific stuck students
- View past session history and reports

### For Students
- **Tiny popup widget** (320×480px) in a separate browser window
- Join by typing a session code (no QR, no camera, no install)
- See tasks as teacher creates them (real-time)
- Mark tasks: ✅ Done | 🔄 In Progress | ❌ Stuck
- When stuck, type what the problem is → teacher sees it instantly
- Widget sits alongside their IDE, minimal screen usage

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | **Vanilla HTML + CSS + JS** | < 50KB total, no build step, works everywhere |
| Backend | **Node.js + Express** | JS everywhere, native Socket.IO support |
| Real-time | **Socket.IO** | Auto-reconnect, fallback to polling, room-based broadcasting |
| Database | **SQLite** (`better-sqlite3`) | Zero config, file-based, portable, no server needed |
| Auth | **Session codes + simple password** | No complex auth for Phase 0 |
| Deploy | **Render / Railway** (free tier) | One-click deploy, HTTPS included |

### Why Not React + FastAPI + PostgreSQL?
Those are for the **full portal** (Phase 1+). For CodeTrack:
- React adds 130KB+ before any feature code → too heavy for a widget
- FastAPI WebSocket support is more manual than Socket.IO
- PostgreSQL needs a database server → unnecessary for session data
- We migrate to the full stack when building Phase 1

---

## Core Workflow

### 1. Teacher Creates Session
```
Teacher opens dashboard → Clicks "New Session"
    → Enters session name (e.g., "DSA Lab - Section A")
    → System generates code: TR7-X2K
    → Teacher writes code on whiteboard / tells students
```

### 2. Students Join
```
Student opens widget URL in browser → Enters code: TR7X2K
    → Enters Name + Roll Number
    → Clicks "Join" → Connected
    → Widget minimizes to a small floating pill
```

### 3. Teacher Adds Task
```
Teacher clicks "+ Add Task" → Types: "Implement a stack using arrays"
    → Clicks "Send to All"
    → All students' widgets instantly show the new task
    → No verbal announcement needed
```

### 4. Students Track Status
```
Student works on task → Clicks [🔄 Working]
Student finishes → Clicks [✅ Done]
Student has problem → Clicks [❌ Stuck]
    → Text field appears → Types: "Segfault on line 14"
    → Teacher sees this immediately on their dashboard
```

### 5. Teacher Helps Stuck Students
```
Teacher sees on dashboard:
    ❌ Roll 23 - Ayush (Task 2): "Segfault on line 14"

Teacher can:
    → Send a hint message: "Check if you're handling NULL"
    → Physically walk to student's desk
    → Mark as "Resolved" after helping
```

---

## Session Code Design

**6 characters, uppercase alphanumeric** — easy to read, say aloud, and type:

- Charset: `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (29 chars)
- Excluded: `0/O`, `1/I/L` (ambiguous when handwritten or spoken)
- Displayed: `TR7-X2K` (grouped in 3s for readability)
- Combinations: 29^6 ≈ 594 million (no collision risk)

---

## Socket.IO Communication Protocol

### Events Table

| Event | Direction | Payload | Purpose |
|---|---|---|---|
| `session:create` | Teacher → Server | `{ name, teacherName }` | Create session |
| `session:created` | Server → Teacher | `{ sessionId, code }` | Return code |
| `session:join` | Student → Server | `{ code, name, rollNo }` | Join session |
| `session:joined` | Server → Student | `{ sessionId, tasks[], studentId }` | Confirm + sync tasks |
| `session:student-joined` | Server → Teacher | `{ name, rollNo, studentId }` | New student notification |
| `session:end` | Teacher → Server | `{ sessionId }` | End session |
| `task:create` | Teacher → Server | `{ sessionId, title, description? }` | Add task |
| `task:new` | Server → All Students | `{ taskId, title, description?, createdAt }` | Broadcast task |
| `task:status` | Student → Server | `{ taskId, status, issueText? }` | Update status |
| `task:student-update` | Server → Teacher | `{ taskId, studentId, name, rollNo, status, issueText? }` | Live update |
| `task:hint` | Teacher → Server → Student | `{ taskId, studentId, message }` | Send hint |
| `task:resolved` | Teacher → Server → Student | `{ taskId, studentId }` | Mark resolved |

### Reconnection
- Socket.IO auto-reconnects with exponential backoff
- On reconnect: client sends `session:rejoin` → server re-syncs all tasks + statuses
- No data loss, no re-entering the session code

---

## Database Schema (SQLite)

```sql
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    is_active INTEGER DEFAULT 1
);

CREATE TABLE session_students (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    name TEXT NOT NULL,
    roll_no TEXT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_connected INTEGER DEFAULT 1,
    UNIQUE(session_id, roll_no)
);

CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    title TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    task_order INTEGER NOT NULL
);

CREATE TABLE task_status (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL REFERENCES tasks(id),
    student_id TEXT NOT NULL REFERENCES session_students(id),
    status TEXT NOT NULL DEFAULT 'pending',
    issue_text TEXT,
    resolved INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(task_id, student_id)
);

CREATE TABLE teacher_messages (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL REFERENCES tasks(id),
    student_id TEXT NOT NULL REFERENCES session_students(id),
    message TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Project Structure

```
Ayush_Academia/
├── docs/
│   ├── Academia-Industry-Collaboration-Portal-Plan.md
│   ├── Technical-Stack-and-System-Architecture.md
│   └── CodeTrack-System-Plan.md              ← this file
│
├── codetrack/
│   ├── server/
│   │   ├── index.js                          # Express + Socket.IO entry
│   │   ├── routes/api.js                     # REST endpoints
│   │   ├── socket/handlers.js                # Socket.IO event handlers
│   │   ├── socket/rooms.js                   # Room management
│   │   ├── db/schema.sql                     # SQLite schema
│   │   ├── db/db.js                          # DB connection
│   │   ├── utils/codeGenerator.js            # Session code generator
│   │   └── package.json
│   │
│   ├── public/
│   │   ├── teacher/                          # Teacher dashboard (HTML/CSS/JS)
│   │   ├── student/                          # Student widget (HTML/CSS/JS)
│   │   └── shared/                           # Shared utilities
│   │
│   └── README.md
│
└── README.md
```

---

## Build Timeline

| Day | Deliverable |
|---|---|
| **1** | Express server, SQLite schema, Socket.IO setup, session code generator |
| **2** | Teacher dashboard: create session, add task, basic layout |
| **3** | Student widget: join session, receive tasks, status buttons |
| **4** | Real-time sync: live dashboard, stuck students panel, aggregate counts |
| **5** | UI polish: glassmorphism, draggable widget, minimize/expand, notification sounds |
| **6** | Teacher hints, session history, past session reports |
| **7** | Testing, deploy to cloud, documentation |

---

## Future Integration (Phase 0.5+)

### Hardware Flag (IoT)
After CodeTrack software is stable:
- ESP32 + RGB LED on each desk
- WebSocket from server → ESP device
- Student marks "Stuck" → LED turns red
- Teacher resolves → LED turns green
- Visual scan of entire lab at a glance

### Data Pipeline to Full Portal
```
CodeTrack task_status → aggregated by skill tags → STUDENT_SKILLS scores
CodeTrack issue_text → NLP categorized → common problem areas
CodeTrack session history → Digital Student Portfolio (verified participation)
CodeTrack class-wide struggles → Curriculum Feedback reports
```

---

## Relation to Full Portal Phases

| Phase | System | Tech Stack | Timeline |
|---|---|---|---|
| **0 (NOW)** | CodeTrack | Vanilla JS + Express + SQLite + Socket.IO | Week 1 |
| **0.5** | Hardware flag (IoT) | ESP32 + WebSocket | Week 2 |
| **1** | Student profiles + assessments | React + FastAPI + PostgreSQL (migration) | Week 3-4 |
| **2** | Skill gap engine + recommendations | + Matching Engine module | Week 4-5 |
| **3** | Industry module + job matching | + Jobs/Applications modules | Week 5-6 |
| **4** | Feedback loop + portfolio | + Verification + Analytics | Week 7-8 |
