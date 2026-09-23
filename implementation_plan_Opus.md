# CodeTrack — Enhanced Implementation Plan

## 1. Executive Summary

Your existing plan (Academia–Industry Collaboration Portal) is a **strong, well-structured vision** for the full product. However, it tries to solve everything at once. Your instinct to **"first completely focus on the software/system part"** is correct.

This plan introduces **CodeTrack** — a lightweight, real-time task-tracking system for live coding sessions between teachers and students. It becomes **Phase 0** of your larger portal, and is the foundation everything else builds on.

> [!IMPORTANT]
> **Core Principle:** The teacher should never have to explain "this is a new task" or "start working on this." They click **one button**, and every student in the session instantly receives the task. No scanning, no verbal instructions, no context-switching.

---

## 2. Issues Found in the Existing Plan

### A. Critical Gap — No Live Session System
The existing plan jumps to assessments, matching engines, and placements — but skips the **daily classroom interaction** entirely. There is no system for:
- A teacher creating a live coding session
- Distributing tasks to students in real-time
- Tracking which student is stuck, done, or needs help
- A student reporting "I have a problem" without raising their hand

This is the **most immediately useful feature** and the first thing to build.

### B. Overengineered for MVP
| Problem | Impact |
|---|---|
| React + FastAPI + PostgreSQL + Redis + Celery + S3 + Docker | Way too heavy for a "Phase 0" that should ship in days, not weeks |
| Tailwind + shadcn/ui + React Query + Zustand + Chart.js + React Hook Form + Zod | 8 frontend dependencies before a single feature is built |
| Microservice-ready modular monolith architecture | Solving a scaling problem that doesn't exist yet |
| Resume parsing, NLP, ML matching | Valuable later, but irrelevant for the first working build |

### C. Missing UX Consideration for Classroom Reality
| Problem | Reality |
|---|---|
| Full-page web app | Students need their **entire screen** for coding — a full web app steals their workspace |
| QR scanning for session joining | College PCs don't have cameras; laptops may not have permissions |
| No manual code entry | Students need to type a session code manually |
| No lightweight mode | Should be a **small popup/widget**, not a full application |
| No offline-friendly consideration | College WiFi can be unreliable |

### D. Communication Protocol Missing
The plan has no specification for **how teacher ↔ student communication works in real-time**:
- How does a task reach students instantly?
- How does a student's "I'm stuck" status reach the teacher?
- How does the teacher see the class-wide status dashboard?

---

## 3. The Enhanced System: CodeTrack

### 3.1 What Is It?

A **lightweight, always-on-top popup widget** (think: Slack notification panel or a mini Discord overlay) that sits in the corner of the screen during coding sessions. It:

1. **Teacher creates a session** → gets a short alphanumeric code (e.g., `TR7X2K`)
2. **Students join** by entering the code manually (no QR, no scanning, no camera)
3. **Teacher clicks "Add Task"** → task instantly appears on all students' widgets
4. **Students mark tasks** as: ✅ Done | 🔄 In Progress | ❌ Stuck (with optional problem description)
5. **Teacher sees a live dashboard** — every student's status per task, who is stuck, what issue they reported

### 3.2 Why Build This First?

```
CodeTrack (Phase 0)
    ↓ provides real data about student performance
Session History → Assessment Data (Phase 1)
    ↓ feeds into
Skill Profiles → Skill Gap Engine (Phase 2)
    ↓ connects to
Matching Engine → Jobs/Internships (Phase 3)
    ↓ closes the loop with
Industry Feedback → Verified Portfolio (Phase 4)
```

CodeTrack isn't a detour — it's the **data generation layer** the rest of the portal needs.

---

## 4. Revised Tech Stack (Lightweight First)

> [!WARNING]
> The original tech stack (React + FastAPI + PostgreSQL + Redis + Celery) is appropriate for the **full portal later**. For CodeTrack, we use a **radically simpler stack** that ships fast and stays lightweight.

### 4.1 CodeTrack Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | **Vanilla HTML + CSS + JavaScript** (single-page widget) | Ultra-lightweight, no build step, instant load, works on any college PC browser |
| **Styling** | **Vanilla CSS** (minimal, dark glassmorphism theme) | No Tailwind dependency, tiny CSS footprint, premium look |
| **Backend** | **Node.js + Express** | Simplest real-time server, native WebSocket support via Socket.IO, JS everywhere |
| **Real-time** | **Socket.IO** | Bi-directional events: task broadcast, status updates, problem reports — with auto-reconnect and fallback to polling |
| **Database** | **SQLite** (via `better-sqlite3`) | Zero-config, file-based, no PostgreSQL setup needed, perfect for lightweight deployment |
| **Auth** | **Session codes + simple JWT** | No complex auth — teacher creates session, students join with code + their name/roll number |
| **Deployment** | **Single server** (Render/Railway free tier) OR **run locally on teacher's laptop** | One `npm start` and it works |

### 4.2 Why Not the Original Stack?

| Original | CodeTrack | Reason |
|---|---|---|
| React + Vite + TypeScript | Vanilla HTML/CSS/JS | Widget must be < 50KB; React alone is 130KB+ |
| FastAPI (Python) | Express (Node.js) | Socket.IO is native to Node; FastAPI WebSocket support is more manual |
| PostgreSQL | SQLite | No database server to install; file-based, portable |
| Redis | In-memory Map in Node.js | Session state doesn't need a separate cache server for < 100 concurrent users |
| Celery | Not needed | No background job queues needed for a real-time task tracker |

### 4.3 When to Migrate to Original Stack

Once CodeTrack is stable and we start building Phase 1+ (assessments, matching), we **wrap CodeTrack as a module** inside the full React + FastAPI architecture. The SQLite data migrates to PostgreSQL. Socket.IO can be kept or replaced with native WebSocket.

---

## 5. System Architecture — CodeTrack

```
┌──────────────────────────────────────────────────────────┐
│                    TEACHER'S BROWSER                      │
│  ┌────────────────────────────────────────────────────┐  │
│  │         CodeTrack Dashboard (Full Page)             │  │
│  │                                                     │  │
│  │  Session: TR7X2K    Students: 34/40 joined          │  │
│  │                                                     │  │
│  │  [+ Add New Task]                                   │  │
│  │                                                     │  │
│  │  Task 1: "Create a linked list"     ✅ 28  🔄 4  ❌ 2│  │
│  │  Task 2: "Implement push/pop"       ✅ 12  🔄 18 ❌ 4│  │
│  │                                                     │  │
│  │  ❌ STUCK Students:                                  │  │
│  │  • Roll 23 - Ayush: "Segfault on line 14"          │  │
│  │  • Roll 17 - Priya: "Confused about pointers"      │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────┘
                       │ Socket.IO (WebSocket)
                       ▼
         ┌─────────────────────────────┐
         │      Express + Socket.IO     │
         │         (Node.js Server)     │
         │                             │
         │  In-memory: active sessions │
         │  SQLite: session history     │
         └─────────────┬───────────────┘
                       │ Socket.IO (WebSocket)
                       ▼
┌──────────────────────────────────────────────────────────┐
│                   STUDENT'S BROWSER                       │
│  ┌─────────────────────────────────────┐                 │
│  │  ┌─────────────────────────────┐    │                 │
│  │  │  CodeTrack Widget (Popup)    │    │                 │
│  │  │                              │    │                 │
│  │  │  Session: TR7X2K             │    │                 │
│  │  │  Task 2: Implement push/pop  │    │                 │
│  │  │                              │    │                 │
│  │  │  [✅ Done] [🔄 Working] [❌ Stuck]│    │                 │
│  │  │                              │    │                 │
│  │  │  Issue: ____________         │    │                 │
│  │  │         [Send Issue]         │    │                 │
│  │  └─────────────────────────────┘    │                 │
│  │                                      │                 │
│  │        Student's main code editor    │                 │
│  │        (VS Code / IDE / browser)     │                 │
│  └─────────────────────────────────────┘                 │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Core Features — Detailed Specification

### 6.1 Session Management

#### Teacher Creates Session
1. Teacher opens CodeTrack dashboard (full-page web view)
2. Enters session name (e.g., "DSA Lab - Section A")
3. System generates a **6-character alphanumeric code** (e.g., `TR7X2K`)
4. Teacher shares the code verbally or writes it on the board
5. Session stays alive until teacher explicitly ends it

#### Student Joins Session
1. Student opens CodeTrack widget (a small popup window or overlay)
2. Enters the **session code manually** (keyboard input — no scanning)
3. Enters their **Name** and **Roll Number**
4. Clicks "Join" → connected to the live session instantly
5. Widget minimizes to a **small floating pill** in the corner of their screen

> [!TIP]
> The widget is delivered as a simple **web page** that students open in a new, small browser window (e.g., 320×480px) and position to the side of their IDE. This avoids needing to install anything.

### 6.2 Task Distribution (Automatic, Zero-Friction)

#### Teacher Adds a Task
1. Teacher clicks **"+ Add New Task"** on their dashboard
2. Types the task title (e.g., "Implement a stack using arrays")
3. Optionally adds a description or instructions
4. Clicks **"Send to All"**
5. **Instantly**, every connected student's widget shows the new task with a notification ping

```
Socket.IO event flow:
  Teacher → server: "task:create" { title, description, sessionId }
  Server → all students in room: "task:new" { taskId, title, description, createdAt }
```

#### No "Announcing" Needed
- The teacher does NOT need to say "okay class, I've posted a new task"
- The widget handles it: a subtle notification sound + the task appears at the top of the student's task list
- The student sees it whenever they glance at their widget

### 6.3 Student Task Status Tracking

Each student sees their task list and can mark each task with **one of three statuses**:

| Status | Meaning | Icon | Color |
|---|---|---|---|
| **Done** | Task completed successfully | ✅ | Green |
| **In Progress** | Currently working on it | 🔄 | Amber/Yellow |
| **Stuck** | Has a problem, needs help | ❌ | Red |

When a student marks "Stuck", a **text input** appears:
- Student types: "Getting segfault on line 14 when I try to push NULL"
- This message is sent to the teacher's dashboard in real-time

```
Socket.IO event flow:
  Student → server: "task:status" { taskId, studentId, status, issueText? }
  Server → teacher: "task:student-update" { taskId, studentName, rollNo, status, issueText? }
```

### 6.4 Teacher's Live Dashboard

The teacher sees a **full-page dashboard** with:

1. **Session Header**: Session name, code, connected student count
2. **Task List** with aggregate counts:
   ```
   Task 1: "Create linked list"     ✅ 28  🔄 4  ❌ 2
   Task 2: "Implement push/pop"     ✅ 12  🔄 18 ❌ 4
   ```
3. **Stuck Students Panel** (highlighted in red):
   ```
   ❌ Roll 23 - Ayush (Task 2): "Segfault on line 14"
   ❌ Roll 17 - Priya (Task 2): "Confused about pointers"
   ```
4. **Student Grid View** (expandable): Click on any task to see every student's status
5. **Action**: Teacher can click on a stuck student to:
   - Mark as "Resolved" (after physically going to help them)
   - Send a text hint/message back to that specific student

### 6.5 Manual Session Code Entry (No QR/Camera)

> [!IMPORTANT]
> This is a hard requirement. College lab PCs typically do not have cameras, and even laptops may have camera permissions locked down. The system **must** support manual code entry as the primary join method.

**Session code design:**
- 6 characters, uppercase alphanumeric (A-Z, 0-9), excluding ambiguous chars (0/O, 1/I/L)
- Valid charset: `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (29 chars → 29^6 ≈ 594M combinations)
- Displayed in groups of 3 for readability: `TR7-X2K`
- Teacher writes it on the board or says it aloud — that's it

### 6.6 Lightweight Widget Design

The student widget is designed to **occupy minimal screen real estate**:

**Minimized state** (floating pill, always visible):
```
┌──────────────────────────────┐
│ 📋 CodeTrack  Task 2  🔄     │
└──────────────────────────────┘
```
- Shows current task name and your status
- Click to expand

**Expanded state** (small popup, ~320×480px):
```
┌──────────────────────────────┐
│ CodeTrack        [−] [×]     │
│ Session: TR7-X2K             │
│──────────────────────────────│
│ ▸ Task 2: Implement push/pop│
│   [✅ Done] [🔄 Working] [❌]│
│                              │
│ ▸ Task 1: Create linked list│
│   ✅ Done                    │
│──────────────────────────────│
│ Issue: _____________________ │
│ [Send to Teacher]            │
└──────────────────────────────┘
```

- **Dark glassmorphism** theme so it doesn't clash with light IDEs
- **Draggable** — student can position it anywhere on screen
- **Resizable** — can shrink it further
- Click `[−]` to minimize back to pill

---

## 7. Communication Protocol

### 7.1 Socket.IO Events (Complete List)

| Event | Direction | Payload | Purpose |
|---|---|---|---|
| `session:create` | Teacher → Server | `{ name, teacherName }` | Create new session |
| `session:created` | Server → Teacher | `{ sessionId, code }` | Return session code |
| `session:join` | Student → Server | `{ code, name, rollNo }` | Join session |
| `session:joined` | Server → Student | `{ sessionId, tasks[], studentId }` | Confirm join + sync existing tasks |
| `session:student-joined` | Server → Teacher | `{ name, rollNo, studentId }` | Notify teacher of new student |
| `session:end` | Teacher → Server | `{ sessionId }` | End the session |
| `task:create` | Teacher → Server | `{ sessionId, title, description? }` | Add new task |
| `task:new` | Server → All Students | `{ taskId, title, description?, createdAt }` | Broadcast new task |
| `task:status` | Student → Server | `{ taskId, status, issueText? }` | Update task status |
| `task:student-update` | Server → Teacher | `{ taskId, studentId, name, rollNo, status, issueText? }` | Live status update |
| `task:hint` | Teacher → Server → Specific Student | `{ taskId, studentId, message }` | Send hint to stuck student |
| `task:resolved` | Teacher → Server → Specific Student | `{ taskId, studentId }` | Mark student's issue as resolved |
| `session:stats` | Server → Teacher | `{ taskId, done, inProgress, stuck }` | Periodic aggregate refresh |
| `connection:ping` | Bidirectional | `{ timestamp }` | Heartbeat / keep-alive |

### 7.2 Reconnection Handling

College WiFi is unreliable. Socket.IO handles this natively:
- Auto-reconnect with exponential backoff
- On reconnect, client sends `session:rejoin` with stored `sessionId` + `studentId`
- Server re-syncs all current tasks and statuses
- Student doesn't lose their progress or need to re-enter the code

---

## 8. Database Schema — CodeTrack (SQLite)

```sql
-- Sessions
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,           -- UUID
    code TEXT UNIQUE NOT NULL,     -- 6-char session code
    name TEXT NOT NULL,            -- "DSA Lab - Section A"
    teacher_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    is_active INTEGER DEFAULT 1
);

-- Students in a session
CREATE TABLE session_students (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    name TEXT NOT NULL,
    roll_no TEXT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_connected INTEGER DEFAULT 1,
    UNIQUE(session_id, roll_no)
);

-- Tasks created by teacher
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    title TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    task_order INTEGER NOT NULL    -- display order
);

-- Student status per task
CREATE TABLE task_status (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL REFERENCES tasks(id),
    student_id TEXT NOT NULL REFERENCES session_students(id),
    status TEXT NOT NULL DEFAULT 'pending',  -- pending | in_progress | done | stuck
    issue_text TEXT,
    resolved INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(task_id, student_id)
);

-- Teacher hints/messages to students
CREATE TABLE teacher_messages (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL REFERENCES tasks(id),
    student_id TEXT NOT NULL REFERENCES session_students(id),
    message TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 9. Folder Structure

```
Ayush_Academia/
├── docs/                                    # Existing docs
│   ├── Academia-Industry-Collaboration-Portal-Plan.md
│   └── Technical-Stack-and-System-Architecture.md
│
├── codetrack/                               # [NEW] Phase 0 — CodeTrack
│   ├── server/
│   │   ├── index.js                         # Express + Socket.IO server entry
│   │   ├── routes/
│   │   │   └── api.js                       # REST endpoints (session create, history)
│   │   ├── socket/
│   │   │   ├── handlers.js                  # Socket.IO event handlers
│   │   │   └── rooms.js                     # Session room management
│   │   ├── db/
│   │   │   ├── schema.sql                   # SQLite schema
│   │   │   ├── db.js                        # Database connection + helpers
│   │   │   └── codetrack.sqlite             # SQLite database file (gitignored)
│   │   ├── utils/
│   │   │   └── codeGenerator.js             # Session code generator
│   │   └── package.json
│   │
│   ├── public/                              # Static files served by Express
│   │   ├── teacher/
│   │   │   ├── index.html                   # Teacher dashboard
│   │   │   ├── style.css                    # Teacher dashboard styles
│   │   │   └── app.js                       # Teacher dashboard logic
│   │   ├── student/
│   │   │   ├── index.html                   # Student widget
│   │   │   ├── style.css                    # Widget styles (glassmorphism)
│   │   │   └── app.js                       # Widget logic
│   │   └── shared/
│   │       └── socket-client.js             # Shared Socket.IO client wrapper
│   │
│   └── README.md                            # Setup & usage instructions
│
└── README.md                                # Root project readme
```

---

## 10. Phased Build Plan (CodeTrack → Full Portal)

### Phase 0: CodeTrack Core (Current Focus — ~5-7 days)

| Day | Tasks |
|---|---|
| **Day 1** | Project setup: Express server, SQLite schema, Socket.IO wiring, session code generator |
| **Day 2** | Teacher dashboard: create session, add task UI, basic layout |
| **Day 3** | Student widget: join session, receive tasks, status buttons |
| **Day 4** | Real-time sync: live status updates on teacher dashboard, stuck students panel |
| **Day 5** | Polish: glassmorphism UI, draggable/minimizable widget, reconnection handling |
| **Day 6** | Teacher hints/messaging, session history (past sessions viewable) |
| **Day 7** | Testing, bug fixes, deploy to Render/Railway |

### Phase 0.5: Hardware Flag System (After CodeTrack is stable)

> [!NOTE]
> This is the IoT part you mentioned — a **physical visual indicator** (e.g., an LED flag on each desk) that lights up when a student marks "Stuck". The teacher can see at a glance across the room who needs help.

- **Hardware:** ESP8266/ESP32 microcontroller + RGB LED per desk
- **Protocol:** WebSocket from CodeTrack server → ESP device
- **Trigger:** When student status = "stuck", server sends signal → LED turns red
- **When resolved:** LED turns green
- **Decision:** This is planned but deferred until Phase 0 software is stable

### Phase 1: Assessment Integration (~Week 2-3)

- Session task completion data feeds into student skill profiles
- Teacher can tag tasks with skill categories (e.g., "DSA", "SQL")
- Auto-generate assessment scores from session history
- This connects CodeTrack data → the existing plan's Skill Assessment module

### Phase 2: Student Profiles + Skill Gap (~Week 3-4)

- Build the student profile system from the original plan
- Skill gap engine uses CodeTrack + assessment data
- Academician dashboard shows class-level skill gaps

### Phase 3: Industry Module + Matching (~Week 5-6)

- Industry portal for job postings
- Matching engine (original plan's weighted scoring)
- Application tracking

### Phase 4: Feedback Loop + Portfolio (~Week 7-8)

- Employer feedback → industry-verified skills
- Digital student portfolio
- Curriculum feedback for academicians

---

## 11. Integration Points — CodeTrack ↔ Full Portal

When the full portal is built later, CodeTrack integrates as follows:

```
CodeTrack Session Data
    │
    ├─► task_status records → map to STUDENT_SKILLS scores
    │   (e.g., 90% tasks done in "DSA" sessions → DSA proficiency = high)
    │
    ├─► issue_text records → feed into "areas where student struggled"
    │   (NLP analysis in Phase 2 to categorize common issues)
    │
    ├─► session history → becomes part of Digital Student Portfolio
    │   (verified attendance + task completion data)
    │
    └─► teacher observations → inform Curriculum Feedback reports
        (if 60% of class gets stuck on "pointers", flag for curriculum review)
```

---

## 12. Open Questions

> [!IMPORTANT]
> These decisions will affect the implementation. Please review:

1. **Delivery format:** Should the student widget be:
   - **Option A (Recommended):** A standalone small web page opened in a separate browser window alongside the IDE
   - **Option B:** A Chrome extension that injects a popup overlay on any page
   - **Option C:** Both — web page first, extension later

2. **Teacher authentication:** For CodeTrack Phase 0, should teachers:
   - **Option A (Recommended):** Just enter their name + a simple password to create sessions (no full auth system yet)
   - **Option B:** Full signup/login from day 1

3. **Session persistence:** When a session ends:
   - **Option A (Recommended):** Data saved to SQLite, teacher can view past session history/reports
   - **Option B:** Data is ephemeral, discarded after session ends

4. **Deployment target:** Where should CodeTrack run?
   - **Option A:** Cloud-hosted (Render/Railway) — accessible from any network
   - **Option B:** Teacher's laptop (localhost) — faster, but students must be on same network
   - **Option C (Recommended):** Cloud-hosted by default, with option to run locally

5. **Scale expectation:** What's the expected class size?
   - This affects whether in-memory state (Map) is sufficient or if Redis is needed
   - For ≤ 60 students per session, in-memory is perfectly fine

---

## 13. Verification Plan

### Automated Tests
- Socket.IO event tests (session create/join/task broadcast)
- Session code generation uniqueness test
- SQLite CRUD tests for all tables
- Reconnection handling test

### Manual Verification
- **Test 1:** Teacher creates session → 3 students join with manual code → teacher adds task → all 3 students see it instantly
- **Test 2:** Student marks "Stuck" with issue text → teacher sees it on dashboard within 1 second
- **Test 3:** Student disconnects WiFi → reconnects → session state preserved
- **Test 4:** Widget is < 50KB total, loads in < 1 second on slow connection
- **Test 5:** Widget is draggable, minimizable, doesn't interfere with IDE usage

---

## 14. Summary of Changes vs. Original Plan

| Aspect | Original Plan | Enhanced Plan |
|---|---|---|
| **Starting point** | Full portal with assessments + matching | CodeTrack (live session tracker) first |
| **Tech stack (Phase 0)** | React + FastAPI + PostgreSQL + Redis | Vanilla JS + Express + SQLite + Socket.IO |
| **User interaction** | Full-page web app | Minimal popup widget (320×480px) |
| **Session joining** | Not specified (implied QR?) | **Manual 6-char code entry** (primary method) |
| **Task distribution** | Teacher manually tells students | **One-click broadcast** via Socket.IO |
| **Student status** | Not specified | ✅ Done / 🔄 In Progress / ❌ Stuck with issue text |
| **Real-time comms** | Not specified | Socket.IO bidirectional events |
| **Hardware flag (IoT)** | Not mentioned | Planned for Phase 0.5 (ESP32 + LED) |
| **Build time** | 21+ days for MVP | **5-7 days** for working CodeTrack |
| **Path to full portal** | Build everything at once | CodeTrack data → feeds into assessments → feeds into matching |
