# CodeTrack — Complete Backend Architecture Plan

> **Document Type:** Backend Implementation Blueprint (No Code)  
> **Purpose:** Every file, module, service, and responsibility mapped out before writing a single line of code  
> **Tech:** Node.js + Express + Socket.IO + SQLite

---

## 1. Top-Level Backend Structure

```
codetrack/
├── server/
│   ├── index.js
│   ├── config/
│   │   ├── env.js
│   │   └── constants.js
│   ├── db/
│   │   ├── connection.js
│   │   ├── schema.sql
│   │   └── migrations/
│   │       └── 001_initial.sql
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── requestLogger.js
│   │   ├── rateLimiter.js
│   │   └── validateSession.js
│   ├── modules/
│   │   ├── session/
│   │   │   ├── session.routes.js
│   │   │   ├── session.controller.js
│   │   │   ├── session.service.js
│   │   │   └── session.repository.js
│   │   ├── task/
│   │   │   ├── task.routes.js
│   │   │   ├── task.controller.js
│   │   │   ├── task.service.js
│   │   │   └── task.repository.js
│   │   ├── student/
│   │   │   ├── student.routes.js
│   │   │   ├── student.controller.js
│   │   │   ├── student.service.js
│   │   │   └── student.repository.js
│   │   └── teacher/
│   │       ├── teacher.routes.js
│   │       ├── teacher.controller.js
│   │       ├── teacher.service.js
│   │       └── teacher.repository.js
│   ├── socket/
│   │   ├── socketServer.js
│   │   ├── socketAuth.js
│   │   ├── handlers/
│   │   │   ├── sessionHandlers.js
│   │   │   ├── taskHandlers.js
│   │   │   ├── statusHandlers.js
│   │   │   └── messageHandlers.js
│   │   └── roomManager.js
│   ├── utils/
│   │   ├── codeGenerator.js
│   │   ├── idGenerator.js
│   │   ├── logger.js
│   │   └── responseHelper.js
│   ├── package.json
│   └── .env
│
├── public/                          # Frontend (served statically by Express)
│   ├── teacher/
│   ├── student/
│   └── shared/
│
└── README.md
```

---

## 2. Entry Point — `index.js`

### What It Does
The single starting point of the entire backend. Sets up everything and starts listening.

### Responsibilities
1. Load environment variables from `.env`
2. Create the Express app instance
3. Create the HTTP server wrapping Express
4. Attach Socket.IO to the HTTP server
5. Initialize the SQLite database connection (run schema if first launch)
6. Register all global middleware (in order)
7. Mount all REST route modules
8. Initialize Socket.IO event handlers
9. Serve the `public/` folder as static files
10. Start listening on the configured port
11. Handle graceful shutdown (close DB, close Socket.IO, close server)

### What It Talks To
- `config/env.js` — for port, environment settings
- `db/connection.js` — to initialize database
- `middleware/*` — to register middleware chain
- `modules/*/routes.js` — to mount REST routes
- `socket/socketServer.js` — to initialize WebSocket layer

### Startup Order
```
Load env → Init DB → Create Express → Add middleware → Mount routes
→ Create HTTP server → Attach Socket.IO → Register socket handlers
→ Serve static files → Listen on port → Log "Server ready"
```

---

## 3. Config Layer — `config/`

### `config/env.js`

**Purpose:** Single source of truth for all environment-dependent values.

**What It Manages:**
| Variable | Source | Default | Description |
|---|---|---|---|
| `PORT` | `.env` | `3000` | Server port |
| `NODE_ENV` | `.env` | `development` | Environment mode |
| `DB_PATH` | `.env` | `./db/codetrack.sqlite` | SQLite file location |
| `SESSION_CODE_LENGTH` | hardcoded | `6` | Length of session join codes |
| `SESSION_MAX_STUDENTS` | `.env` | `60` | Max students per session |
| `CORS_ORIGIN` | `.env` | `*` (dev) | Allowed origins |
| `RATE_LIMIT_WINDOW_MS` | `.env` | `60000` | Rate limit window |
| `RATE_LIMIT_MAX` | `.env` | `100` | Max requests per window |

**How It Works:** Reads `.env` file, applies defaults, validates that required values exist, exports a frozen config object.

---

### `config/constants.js`

**Purpose:** All hardcoded business constants that aren't environment-dependent.

**What It Contains:**

| Constant Group | Values | Description |
|---|---|---|
| `SESSION_STATUS` | `ACTIVE`, `ENDED` | Session lifecycle states |
| `TASK_STATUS` | `PENDING`, `IN_PROGRESS`, `DONE`, `STUCK` | Possible student-task statuses |
| `SESSION_CODE_CHARSET` | `ABCDEFGHJKMNPQRSTUVWXYZ23456789` | Characters for code generation (ambiguous chars excluded) |
| `SOCKET_EVENTS` | Object mapping all event names | Single reference for all Socket.IO event names |
| `MAX_TASK_TITLE_LENGTH` | `200` | Validation limit |
| `MAX_ISSUE_TEXT_LENGTH` | `500` | Validation limit |
| `MAX_HINT_LENGTH` | `500` | Validation limit |
| `HEARTBEAT_INTERVAL_MS` | `30000` | Socket.IO heartbeat frequency |
| `RECONNECT_WINDOW_MS` | `300000` | 5 min window to allow reconnect without losing session |

---

## 4. Database Layer — `db/`

### `db/connection.js`

**Purpose:** Creates and manages the single SQLite connection for the entire app.

**Responsibilities:**
1. Open (or create) the SQLite file at the configured path
2. Enable WAL mode for better concurrent read performance
3. Enable foreign keys enforcement
4. Run the schema file if tables don't exist yet
5. Export a `db` object that all repositories use
6. Provide a `close()` function for graceful shutdown

**What It Exports:**
- `db` — the `better-sqlite3` database instance
- `initializeDatabase()` — called once at startup
- `closeDatabase()` — called on shutdown

---

### `db/schema.sql`

**Purpose:** Complete table definitions, run on first launch.

**Tables (5 total):**

#### Table: `sessions`
| Column | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID for the session |
| `code` | TEXT | UNIQUE, NOT NULL | 6-char join code |
| `name` | TEXT | NOT NULL | Session display name |
| `teacher_name` | TEXT | NOT NULL | Teacher's display name |
| `teacher_password_hash` | TEXT | NOT NULL | Hashed password for session management |
| `created_at` | DATETIME | DEFAULT NOW | When session was created |
| `ended_at` | DATETIME | NULLABLE | When session was ended (NULL if active) |
| `is_active` | INTEGER | DEFAULT 1 | Quick lookup for active sessions |

**Indexes:** `idx_sessions_code` on `code`, `idx_sessions_active` on `is_active`

---

#### Table: `session_students`
| Column | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID for the student-in-session |
| `session_id` | TEXT | FK → sessions(id) | Which session |
| `name` | TEXT | NOT NULL | Student's display name |
| `roll_no` | TEXT | NOT NULL | Roll number / identifier |
| `joined_at` | DATETIME | DEFAULT NOW | When they joined |
| `is_connected` | INTEGER | DEFAULT 1 | Are they currently online |
| `socket_id` | TEXT | NULLABLE | Current Socket.IO socket ID (for reconnect mapping) |

**Indexes:** `idx_students_session` on `session_id`
**Unique constraint:** `(session_id, roll_no)` — no duplicate roll numbers in one session

---

#### Table: `tasks`
| Column | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID for the task |
| `session_id` | TEXT | FK → sessions(id) | Which session this task belongs to |
| `title` | TEXT | NOT NULL | Task title / instruction |
| `description` | TEXT | NULLABLE | Optional longer description |
| `created_at` | DATETIME | DEFAULT NOW | When teacher created it |
| `task_order` | INTEGER | NOT NULL | Display order (auto-incrementing per session) |

**Indexes:** `idx_tasks_session` on `session_id`

---

#### Table: `task_status`
| Column | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID |
| `task_id` | TEXT | FK → tasks(id) | Which task |
| `student_id` | TEXT | FK → session_students(id) | Which student |
| `status` | TEXT | NOT NULL, DEFAULT 'pending' | One of: `pending`, `in_progress`, `done`, `stuck` |
| `issue_text` | TEXT | NULLABLE | Problem description (only when status = `stuck`) |
| `resolved` | INTEGER | DEFAULT 0 | Has teacher resolved this issue? |
| `updated_at` | DATETIME | DEFAULT NOW | Last status change time |

**Indexes:** `idx_taskstatus_task` on `task_id`, `idx_taskstatus_student` on `student_id`
**Unique constraint:** `(task_id, student_id)` — one status per student per task

---

#### Table: `teacher_messages`
| Column | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID |
| `task_id` | TEXT | FK → tasks(id) | Which task this hint is about |
| `student_id` | TEXT | FK → session_students(id) | Which student receives it |
| `message` | TEXT | NOT NULL | The hint / help text |
| `sent_at` | DATETIME | DEFAULT NOW | When sent |

**Indexes:** `idx_messages_student` on `student_id`

---

### `db/migrations/001_initial.sql`

**Purpose:** Same as schema.sql for now. This folder exists so future schema changes are versioned. Each migration file is numbered sequentially and runs in order.

**Migration strategy:**
- On startup, `connection.js` checks a `_migrations` meta table
- Runs any migration files that haven't been applied yet
- Records each applied migration with timestamp

---

## 5. Middleware Layer — `middleware/`

Middleware runs in a **specific order** on every incoming HTTP request. Here's the chain:

```
Request arrives
    → requestLogger    (log method, URL, timestamp)
    → rateLimiter      (block if too many requests)
    → express.json()   (parse JSON body)
    → express.static() (serve frontend files)
    → route handlers   (module controllers)
    → errorHandler     (catch and format errors)
```

### `middleware/requestLogger.js`

**Purpose:** Logs every incoming HTTP request with method, URL, response time, and status code.

**What It Does:**
- Records request start time
- On response finish, logs: `[GET] /api/sessions/TR7X2K → 200 (23ms)`
- Uses the `logger.js` utility
- Does NOT log WebSocket events (those are logged separately in socket handlers)

---

### `middleware/rateLimiter.js`

**Purpose:** Prevents abuse — limits how many HTTP requests a single IP can make.

**Configuration:**
- Window: 1 minute
- Max requests per window: 100
- Applied globally, but certain endpoints (like session join) have stricter limits (10/min)
- Returns `429 Too Many Requests` when exceeded

---

### `middleware/errorHandler.js`

**Purpose:** Global error catch — ensures no request ever crashes the server or returns raw stack traces.

**What It Does:**
1. Catches any error thrown by controllers/services
2. Classifies the error:
   - Validation error → `400 Bad Request`
   - Not found → `404 Not Found`
   - Auth error → `401 Unauthorized`
   - Rate limit → `429 Too Many Requests`
   - Everything else → `500 Internal Server Error`
3. Logs the full error (with stack trace) to the logger
4. Returns a clean JSON response to the client: `{ error: true, message: "..." }`
5. **Never** sends stack traces or internal details to the client in production

---

### `middleware/validateSession.js`

**Purpose:** A reusable middleware that validates whether a session code or session ID in the request is valid and active.

**Used by:** Routes that require an active session (task creation, student actions).

**What It Does:**
1. Extracts session code or ID from request params/query
2. Looks up the session in the database
3. If not found → `404`
4. If session is ended (not active) → `410 Gone`
5. If valid → attaches session data to `req.session` and calls `next()`

---

## 6. Module Layer — `modules/`

Each module follows a **4-file pattern**:

```
module/
├── module.routes.js        ← URL definitions + middleware wiring
├── module.controller.js    ← HTTP request/response handling
├── module.service.js       ← Business logic
└── module.repository.js    ← Database queries
```

### Why This Split?

| Layer | Responsibility | What It Knows About |
|---|---|---|
| **Routes** | "Which URL maps to which controller function, and which middleware runs first" | Express routing only |
| **Controller** | "Extract data from request, call service, format response" | HTTP request/response only |
| **Service** | "Business rules, validation, orchestration between repositories" | Business logic only |
| **Repository** | "Raw database queries — insert, select, update, delete" | SQL and database only |

**Rule:** Controllers never touch the database directly. Repositories never know about HTTP. Services are the bridge.

---

### 6.1 Session Module — `modules/session/`

**Handles:** Creating sessions, joining sessions, ending sessions, viewing session history.

#### `session.routes.js`

| Method | Endpoint | Middleware | Controller Function | Purpose |
|---|---|---|---|---|
| `POST` | `/api/sessions` | rateLimiter (strict) | `createSession` | Teacher creates a new session |
| `GET` | `/api/sessions/:code` | validateSession | `getSession` | Get session details by code (used by student join page) |
| `GET` | `/api/sessions/:code/dashboard` | validateSession | `getDashboard` | Full dashboard data (tasks + students + statuses) |
| `PATCH` | `/api/sessions/:id/end` | validateSession | `endSession` | Teacher ends the session |
| `GET` | `/api/sessions/history/all` | — | `getSessionHistory` | List all past sessions for the teacher |
| `GET` | `/api/sessions/:id/report` | — | `getSessionReport` | Detailed report of a past session |

#### `session.controller.js`

| Function | What It Receives | What It Does | What It Returns |
|---|---|---|---|
| `createSession` | `{ name, teacherName, password }` from body | Validates input → calls service → returns session data | `201` + `{ sessionId, code, name }` |
| `getSession` | `:code` from params | Calls service to find session → returns basic info | `200` + `{ name, teacherName, studentCount, isActive }` |
| `getDashboard` | `:code` from params | Calls service → assembles full dashboard payload | `200` + `{ session, tasks[], students[], statusGrid }` |
| `endSession` | `:id` from params, password from body | Verifies teacher password → calls service | `200` + `{ ended: true }` |
| `getSessionHistory` | Query params (teacherName) | Calls service → returns list | `200` + `[{ id, name, code, createdAt, studentCount }]` |
| `getSessionReport` | `:id` from params | Calls service → returns detailed report | `200` + `{ session, tasks, completionRates, stuckReports }` |

#### `session.service.js`

| Function | Business Logic |
|---|---|
| `createSession` | Generate unique 6-char code (retry if collision) → hash teacher password → create DB record → return session data |
| `findByCode` | Look up session by code → check if active → return or throw 404 |
| `assembleDashboard` | Fetch session + all tasks + all students + all statuses → compute per-task aggregate counts (done/inProgress/stuck) → sort stuck students to top → return assembled object |
| `endSession` | Verify teacher password hash → set `is_active = 0`, `ended_at = NOW` → disconnect all students (via Socket.IO room manager) |
| `getHistory` | Query all sessions (optionally filtered by teacher name), ordered by `created_at DESC` |
| `generateReport` | For an ended session: compute completion rates per task, list all stuck issues with timestamps, calculate average completion time |

#### `session.repository.js`

| Function | SQL Operation |
|---|---|
| `insert(session)` | `INSERT INTO sessions ...` |
| `findByCode(code)` | `SELECT * FROM sessions WHERE code = ?` |
| `findById(id)` | `SELECT * FROM sessions WHERE id = ?` |
| `findActive()` | `SELECT * FROM sessions WHERE is_active = 1` |
| `endSession(id)` | `UPDATE sessions SET is_active = 0, ended_at = ? WHERE id = ?` |
| `codeExists(code)` | `SELECT 1 FROM sessions WHERE code = ?` — for collision check |
| `findAll(filters)` | `SELECT * FROM sessions ORDER BY created_at DESC` with optional filters |

---

### 6.2 Task Module — `modules/task/`

**Handles:** Creating tasks, listing tasks, getting task status aggregates.

#### `task.routes.js`

| Method | Endpoint | Middleware | Controller Function | Purpose |
|---|---|---|---|---|
| `POST` | `/api/sessions/:code/tasks` | validateSession | `createTask` | Teacher adds a new task |
| `GET` | `/api/sessions/:code/tasks` | validateSession | `getTasksBySession` | List all tasks in a session |
| `GET` | `/api/tasks/:taskId/statuses` | — | `getTaskStatuses` | Get all student statuses for one task |

#### `task.controller.js`

| Function | What It Receives | What It Does | What It Returns |
|---|---|---|---|
| `createTask` | `{ title, description? }` from body, `:code` from params | Validates title length → calls service → returns task | `201` + `{ taskId, title, taskOrder }` |
| `getTasksBySession` | `:code` from params | Calls service → returns task list with aggregate counts | `200` + `[{ taskId, title, doneCount, inProgressCount, stuckCount }]` |
| `getTaskStatuses` | `:taskId` from params | Calls service → returns per-student status list | `200` + `[{ studentName, rollNo, status, issueText?, updatedAt }]` |

#### `task.service.js`

| Function | Business Logic |
|---|---|
| `createTask` | Validate title is not empty and within length limit → determine next `task_order` for this session → create DB record → create `pending` status entries for ALL currently joined students → trigger Socket.IO broadcast (calls roomManager) → return task data |
| `getTasksWithCounts` | Fetch all tasks for session → for each task, count statuses grouped by type → attach counts → return |
| `getStudentStatuses` | Fetch all `task_status` rows for a given task → join with `session_students` for name/rollNo → sort stuck students first, then in_progress, then done, then pending |

#### `task.repository.js`

| Function | SQL Operation |
|---|---|
| `insert(task)` | `INSERT INTO tasks ...` |
| `findBySession(sessionId)` | `SELECT * FROM tasks WHERE session_id = ? ORDER BY task_order` |
| `findById(taskId)` | `SELECT * FROM tasks WHERE id = ?` |
| `getNextOrder(sessionId)` | `SELECT MAX(task_order) + 1 FROM tasks WHERE session_id = ?` |
| `getStatusCounts(taskId)` | `SELECT status, COUNT(*) FROM task_status WHERE task_id = ? GROUP BY status` |
| `getStatusesByTask(taskId)` | `SELECT ts.*, ss.name, ss.roll_no FROM task_status ts JOIN session_students ss ...` |

---

### 6.3 Student Module — `modules/student/`

**Handles:** Student joining a session, updating task status, reporting issues.

#### `student.routes.js`

| Method | Endpoint | Middleware | Controller Function | Purpose |
|---|---|---|---|---|
| `POST` | `/api/sessions/:code/join` | validateSession, rateLimiter (strict) | `joinSession` | Student joins with name + roll number |
| `PATCH` | `/api/tasks/:taskId/status` | — | `updateStatus` | Student updates their status on a task |
| `GET` | `/api/students/:studentId/tasks` | — | `getMyTasks` | Student fetches all their tasks with statuses |

#### `student.controller.js`

| Function | What It Receives | What It Does | What It Returns |
|---|---|---|---|
| `joinSession` | `{ name, rollNo }` from body, `:code` from params | Validates name/rollNo → calls service → returns student data + existing tasks | `200` + `{ studentId, tasks[] }` |
| `updateStatus` | `{ studentId, status, issueText? }` from body, `:taskId` from params | Validates status value → calls service → returns updated status | `200` + `{ updated: true }` |
| `getMyTasks` | `:studentId` from params | Calls service → returns all tasks with this student's status | `200` + `[{ taskId, title, myStatus, issueText? }]` |

#### `student.service.js`

| Function | Business Logic |
|---|---|
| `joinSession` | Check if roll number already exists in this session → if yes and disconnected, reconnect (update `is_connected = 1`) → if yes and connected, reject as duplicate → if new, create DB record → create `pending` status for all existing tasks in this session → notify teacher via Socket.IO → return student data + task list |
| `updateTaskStatus` | Validate status is one of the allowed values → if status is `stuck`, require `issueText` → upsert the `task_status` record → notify teacher via Socket.IO → return |
| `getStudentTasks` | Fetch all tasks for the student's session → left join with this student's statuses → return combined list |
| `markDisconnected` | Set `is_connected = 0` → notify teacher (called by Socket.IO disconnect handler) |
| `reconnect` | Find student by session + rollNo → set `is_connected = 1` → update `socket_id` → return existing data |

#### `student.repository.js`

| Function | SQL Operation |
|---|---|
| `insert(student)` | `INSERT INTO session_students ...` |
| `findBySessionAndRoll(sessionId, rollNo)` | `SELECT * FROM session_students WHERE session_id = ? AND roll_no = ?` |
| `findById(studentId)` | `SELECT * FROM session_students WHERE id = ?` |
| `findBySession(sessionId)` | `SELECT * FROM session_students WHERE session_id = ?` |
| `updateConnectionStatus(id, isConnected, socketId)` | `UPDATE session_students SET is_connected = ?, socket_id = ? WHERE id = ?` |
| `upsertTaskStatus(taskId, studentId, status, issueText)` | `INSERT OR REPLACE INTO task_status ...` |
| `getTasksWithStatus(studentId, sessionId)` | `SELECT t.*, ts.status, ts.issue_text FROM tasks t LEFT JOIN task_status ts ...` |
| `countBySession(sessionId)` | `SELECT COUNT(*) FROM session_students WHERE session_id = ?` |
| `createPendingStatuses(studentId, taskIds[])` | Batch `INSERT INTO task_status` for all existing tasks with `status = 'pending'` |

---

### 6.4 Teacher Module — `modules/teacher/`

**Handles:** Teacher-specific actions — sending hints, resolving issues, managing students.

#### `teacher.routes.js`

| Method | Endpoint | Middleware | Controller Function | Purpose |
|---|---|---|---|---|
| `POST` | `/api/tasks/:taskId/hint` | — | `sendHint` | Teacher sends a hint to a specific stuck student |
| `PATCH` | `/api/tasks/:taskId/resolve` | — | `resolveIssue` | Teacher marks a student's issue as resolved |
| `GET` | `/api/sessions/:code/stuck` | validateSession | `getStuckStudents` | Get all currently stuck students in a session |
| `DELETE` | `/api/sessions/:code/students/:studentId` | validateSession | `removeStudent` | Remove a student from session (kick) |

#### `teacher.controller.js`

| Function | What It Receives | What It Does | What It Returns |
|---|---|---|---|
| `sendHint` | `{ studentId, message }` from body, `:taskId` from params | Validates message length → calls service → returns confirmation | `200` + `{ sent: true }` |
| `resolveIssue` | `{ studentId }` from body, `:taskId` from params | Calls service → returns confirmation | `200` + `{ resolved: true }` |
| `getStuckStudents` | `:code` from params | Calls service → returns stuck student list | `200` + `[{ studentName, rollNo, taskTitle, issueText, stuckSince }]` |
| `removeStudent` | `:code` and `:studentId` from params | Calls service → disconnects student → returns confirmation | `200` + `{ removed: true }` |

#### `teacher.service.js`

| Function | Business Logic |
|---|---|
| `sendHint` | Validate the student exists and is in this task's session → save message to `teacher_messages` table → push hint to student via Socket.IO (direct to their socket) → return |
| `resolveIssue` | Find the task_status record → set `resolved = 1` → change status from `stuck` to `in_progress` → notify student via Socket.IO → return |
| `getStuckStudents` | Query all `task_status` WHERE `status = 'stuck' AND resolved = 0` across all tasks in session → join with student names and task titles → sort by `updated_at` (most recent first) → return |
| `removeStudent` | Delete student from session_students → delete their task_status entries → disconnect their socket → notify teacher dashboard |

#### `teacher.repository.js`

| Function | SQL Operation |
|---|---|
| `insertMessage(message)` | `INSERT INTO teacher_messages ...` |
| `resolveStatus(taskId, studentId)` | `UPDATE task_status SET resolved = 1, status = 'in_progress' WHERE ...` |
| `getStuckBySession(sessionId)` | `SELECT ts.*, ss.name, ss.roll_no, t.title FROM task_status ts JOIN ...` |
| `getMessages(taskId, studentId)` | `SELECT * FROM teacher_messages WHERE task_id = ? AND student_id = ?` |
| `removeStudent(studentId)` | `DELETE FROM session_students WHERE id = ?` + cascade deletes |

---

## 7. Socket Layer — `socket/`

This is the **real-time engine** of CodeTrack. It runs parallel to the REST API layer.

### `socket/socketServer.js`

**Purpose:** The main Socket.IO setup and orchestration file.

**Responsibilities:**
1. Accept the HTTP server instance from `index.js`
2. Create the Socket.IO server with CORS configuration
3. Apply socket-level middleware (auth check from `socketAuth.js`)
4. On new connection:
   - Determine if the connecting client is a teacher or student (from handshake query params)
   - Register the appropriate event handlers from `handlers/`
   - Store the socket reference in `roomManager`
5. On disconnect:
   - Update student's `is_connected` status
   - Notify the teacher dashboard
   - Start the reconnection grace timer (5 minutes)
6. Export the `io` instance so services can emit events

**What It Exports:**
- `initializeSocket(httpServer)` — called once from `index.js`
- `getIO()` — getter for other modules to access the Socket.IO instance for emitting

---

### `socket/socketAuth.js`

**Purpose:** Middleware that runs on every Socket.IO connection to validate the client.

**What It Checks:**
- For teachers: Session ID must exist and be active, teacher password must match
- For students: Session code must be valid, student must be registered (or registering)
- Rejects unknown/malformed handshakes with error

**Handshake Query Params Expected:**
| Param | From | Purpose |
|---|---|---|
| `role` | Both | `"teacher"` or `"student"` |
| `sessionId` | Teacher | Which session they own |
| `sessionCode` | Student | Which session to join |
| `studentId` | Student (reconnect) | For reconnecting to existing student record |

---

### `socket/roomManager.js`

**Purpose:** Manages Socket.IO rooms — which sockets are in which session.

**Room naming convention:**
- Session room: `session:{sessionId}` — all participants (teacher + students)
- Teacher room: `teacher:{sessionId}` — teacher's socket only (for teacher-only events)
- Student-specific: direct socket emission using stored `socket_id`

**Functions:**

| Function | What It Does |
|---|---|
| `joinSessionRoom(socket, sessionId, role)` | Add socket to the session room; if teacher, also add to teacher room |
| `leaveSessionRoom(socket, sessionId)` | Remove socket from all rooms for this session |
| `emitToSession(sessionId, event, data)` | Broadcast to everyone in `session:{sessionId}` |
| `emitToTeacher(sessionId, event, data)` | Send only to `teacher:{sessionId}` room |
| `emitToStudent(socketId, event, data)` | Send directly to a specific student's socket |
| `getConnectedCount(sessionId)` | Count of active sockets in the session room |
| `disconnectAllInSession(sessionId)` | Force-disconnect all sockets (when session ends) |

---

### `socket/handlers/sessionHandlers.js`

**Purpose:** Handle all session lifecycle events over WebSocket.

**Events Handled:**

| Event | Direction | Handler Logic |
|---|---|---|
| `session:create` | Teacher → Server | Call `session.service.createSession()` → join teacher to room → emit `session:created` back |
| `session:join` | Student → Server | Call `student.service.joinSession()` → join student to room → emit `session:joined` to student → emit `session:student-joined` to teacher |
| `session:rejoin` | Student → Server | Call `student.service.reconnect()` → re-join room → re-sync all tasks/statuses → emit `session:rejoined` |
| `session:end` | Teacher → Server | Call `session.service.endSession()` → emit `session:ended` to all → disconnect all sockets |

---

### `socket/handlers/taskHandlers.js`

**Purpose:** Handle task creation and broadcasting.

**Events Handled:**

| Event | Direction | Handler Logic |
|---|---|---|
| `task:create` | Teacher → Server | Validate title → call `task.service.createTask()` → emit `task:new` to all students in session room → emit `task:created-ack` to teacher (confirmation) |

**Important:** When a task is created, the service also creates `pending` status entries for every currently joined student. This ensures the teacher's dashboard immediately shows the correct counts.

---

### `socket/handlers/statusHandlers.js`

**Purpose:** Handle student status updates (the core interaction loop).

**Events Handled:**

| Event | Direction | Handler Logic |
|---|---|---|
| `task:status` | Student → Server | Validate status value → call `student.service.updateTaskStatus()` → emit `task:student-update` to teacher room (with student name, roll, status, issueText) → emit refreshed `session:stats` to teacher (updated aggregate counts) |

**Aggregate Stats Refresh:**
After every status update, the handler also:
1. Recalculates per-task counts (done / in_progress / stuck / pending)
2. Sends `session:stats` event to the teacher with updated numbers
3. This ensures the teacher's dashboard always shows real-time aggregate counts without needing to poll

---

### `socket/handlers/messageHandlers.js`

**Purpose:** Handle teacher → student messaging (hints and resolution).

**Events Handled:**

| Event | Direction | Handler Logic |
|---|---|---|
| `task:hint` | Teacher → Server → Student | Validate → call `teacher.service.sendHint()` → emit `task:hint-received` to the specific student's socket |
| `task:resolved` | Teacher → Server → Student | Call `teacher.service.resolveIssue()` → emit `task:issue-resolved` to student → emit refreshed `session:stats` to teacher |

---

## 8. Utilities Layer — `utils/`

### `utils/codeGenerator.js`

**Purpose:** Generate unique, human-friendly session codes.

**Logic:**
1. Pick 6 random characters from the safe charset (`ABCDEFGHJKMNPQRSTUVWXYZ23456789`)
2. Check if code already exists in database (call `session.repository.codeExists()`)
3. If collision (extremely unlikely), regenerate
4. Return the code formatted with a dash for display: `TR7-X2K` (storage: `TR7X2K`)
5. Max 5 retry attempts, then throw error (should never happen with 594M combinations)

---

### `utils/idGenerator.js`

**Purpose:** Generate UUIDs for all database records.

**Logic:** Uses Node.js built-in `crypto.randomUUID()` — no external dependency needed.

---

### `utils/logger.js`

**Purpose:** Centralized logging utility.

**Log Levels:** `DEBUG`, `INFO`, `WARN`, `ERROR`

**What It Logs:**
- HTTP requests (from requestLogger middleware)
- Socket.IO events (from socket handlers)
- Database operations (from repositories, errors only)
- Startup/shutdown events

**Format:** `[2026-09-22 18:55:03] [INFO] [session] Created session TR7X2K "DSA Lab - Section A"`

**Behavior by environment:**
- `development`: All levels, colorized console output
- `production`: INFO and above, structured JSON format (ready for log aggregation later)

---

### `utils/responseHelper.js`

**Purpose:** Consistent HTTP response formatting.

**Functions:**

| Function | Returns |
|---|---|
| `success(res, data, statusCode?)` | `{ success: true, data: {...} }` |
| `error(res, message, statusCode)` | `{ success: false, error: message }` |
| `paginated(res, data, total, page, limit)` | `{ success: true, data: [...], pagination: { total, page, limit } }` |

---

## 9. Data Flow Diagrams

### Flow 1: Teacher Creates Session + Adds Task

```
Teacher opens dashboard
    → [REST] POST /api/sessions { name, teacherName, password }
        → session.controller.createSession()
            → session.service.createSession()
                → codeGenerator.generate() → "TR7X2K"
                → hash password
                → session.repository.insert()
            → return { sessionId, code }
    → [Socket] Teacher connects with sessionId
        → socketAuth validates
        → roomManager.joinSessionRoom() → room: "session:abc123"
    
Teacher clicks "Add Task"
    → [Socket] emit "task:create" { sessionId, title: "Implement stack" }
        → taskHandlers
            → task.service.createTask()
                → task.repository.insert()
                → task.repository.createPendingStatuses() for all students
            → roomManager.emitToSession() → "task:new" to all students
            → roomManager.emitToTeacher() → "task:created-ack"
```

### Flow 2: Student Joins + Updates Status

```
Student opens widget
    → [REST] GET /api/sessions/TR7X2K (validate code exists)
    → Enters name + roll number
    → [REST] POST /api/sessions/TR7X2K/join { name, rollNo }
        → student.service.joinSession()
            → Check duplicate roll → Create record
            → Create pending statuses for existing tasks
        → return { studentId, tasks[] }
    → [Socket] Student connects with sessionCode + studentId
        → socketAuth validates
        → roomManager.joinSessionRoom()
        → emit "session:student-joined" to teacher

Student clicks "Stuck"
    → [Socket] emit "task:status" { taskId, status: "stuck", issueText: "Segfault on line 14" }
        → statusHandlers
            → student.service.updateTaskStatus()
                → student.repository.upsertTaskStatus()
            → roomManager.emitToTeacher() → "task:student-update"
                { taskId, studentName: "Ayush", rollNo: "23", status: "stuck", issueText: "..." }
            → recalculate aggregates → emit "session:stats" to teacher
```

### Flow 3: Teacher Helps Stuck Student

```
Teacher sees stuck student on dashboard
    → Clicks "Send Hint"
    → [Socket] emit "task:hint" { taskId, studentId, message: "Check for NULL before push" }
        → messageHandlers
            → teacher.service.sendHint()
                → teacher.repository.insertMessage()
            → roomManager.emitToStudent(studentSocketId) → "task:hint-received"
                { taskId, message: "Check for NULL before push" }

Student sees hint notification in widget

Teacher physically helps student, then clicks "Mark Resolved"
    → [Socket] emit "task:resolved" { taskId, studentId }
        → messageHandlers
            → teacher.service.resolveIssue()
                → teacher.repository.resolveStatus() → status becomes "in_progress"
            → roomManager.emitToStudent() → "task:issue-resolved"
            → recalculate aggregates → emit "session:stats" to teacher
```

### Flow 4: Student Disconnects and Reconnects

```
Student's WiFi drops
    → Socket.IO detects disconnect
        → socketServer disconnect handler
            → student.service.markDisconnected(studentId)
            → roomManager.emitToTeacher() → "session:student-disconnected"
            → Start 5-min reconnect timer

Student's WiFi returns (within 5 minutes)
    → Socket.IO auto-reconnects
        → [Socket] emit "session:rejoin" { sessionCode, studentId }
            → sessionHandlers
                → student.service.reconnect()
                    → Find student by ID → set is_connected = 1
                    → Update socket_id
                → roomManager.joinSessionRoom()
                → Fetch all tasks + this student's statuses
                → emit "session:rejoined" { tasks[], statuses[] }
                → emit "session:student-reconnected" to teacher

Student's WiFi does NOT return (after 5 minutes)
    → Timer expires → student stays marked as disconnected
    → Teacher dashboard shows student as "offline" (grayed out)
    → Student's data is preserved — they can rejoin later with same roll number
```

---

## 10. Error Handling Strategy

### Error Categories

| Category | HTTP Code | Socket Response | When |
|---|---|---|---|
| **Validation** | `400` | `error` event with message | Missing fields, invalid status value, title too long |
| **Not Found** | `404` | `error` event | Invalid session code, unknown taskId/studentId |
| **Conflict** | `409` | `error` event | Duplicate roll number in same session |
| **Gone** | `410` | `error` event | Session has already ended |
| **Rate Limited** | `429` | Connection rejected | Too many requests from same IP |
| **Server Error** | `500` | `error` event (generic message) | Unexpected DB errors, unhandled exceptions |

### Socket Error Events

Every socket handler wraps its logic in try-catch. On error:
1. Log the full error with stack trace (server-side only)
2. Emit an `error` event back to the specific client: `{ event: "task:create", message: "Task title is required" }`
3. Never crash the server or disconnect other clients

---

## 11. Security Considerations

| Concern | How It's Handled |
|---|---|
| **Session code guessing** | Rate limiting on join endpoint (10/min per IP) + 594M possible codes |
| **Teacher impersonation** | Teacher operations require the session password (hashed with bcrypt) |
| **Student impersonation** | Student ID is UUID (unguessable), tied to session + roll number |
| **Message injection** | All user input (task titles, issue text, hints) is sanitized — HTML stripped, length-limited |
| **DoS via many connections** | Socket.IO connection limit per IP + rate limiting middleware |
| **Data leakage** | Students only receive data for their own session; no cross-session queries |
| **SQL injection** | All queries use parameterized statements via `better-sqlite3` prepared statements |

---

## 12. Deployment Configuration

### `package.json` — Key Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP server framework |
| `socket.io` | Real-time WebSocket server |
| `better-sqlite3` | SQLite database driver (synchronous, fast) |
| `bcrypt` | Password hashing for teacher sessions |
| `dotenv` | Environment variable loading |
| `cors` | Cross-origin resource sharing |
| `helmet` | HTTP security headers |
| `express-rate-limit` | Rate limiting middleware |

**Dev dependencies:**
| Package | Purpose |
|---|---|
| `nodemon` | Auto-restart on file change during development |

**Total dependency count:** ~8 production packages. Intentionally minimal.

### NPM Scripts

| Script | Command | Purpose |
|---|---|---|
| `start` | `node server/index.js` | Production start |
| `dev` | `nodemon server/index.js` | Development with auto-restart |

### `.env` Template

```
PORT=3000
NODE_ENV=development
DB_PATH=./server/db/codetrack.sqlite
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

---

## 13. Request-Response Lifecycle Summary

### Every HTTP Request Follows This Path:
```
Client HTTP Request
    → Express receives
    → requestLogger (log it)
    → rateLimiter (check limits)
    → express.json() (parse body)
    → Route matching (routes.js)
    → Middleware (validateSession if needed)
    → Controller (extract input, call service)
    → Service (business logic, call repository)
    → Repository (SQL query, return data)
    → Service (transform, validate result)
    → Controller (format response)
    → responseHelper (wrap in standard format)
    → Client receives JSON response
    
    If error at any step:
    → errorHandler catches
    → Log error
    → Send clean error response to client
```

### Every Socket Event Follows This Path:
```
Client Socket Event
    → Socket.IO receives
    → socketAuth (validate on connect only)
    → Matching handler (sessionHandlers / taskHandlers / statusHandlers / messageHandlers)
    → Service (business logic)
    → Repository (database operation)
    → roomManager (determine who to notify)
    → Socket.IO emits to target(s)
    
    If error:
    → Handler catch block
    → Log error
    → Emit "error" event back to the specific client
```

---

## 14. What Each File "Talks To" — Dependency Map

```
index.js
    ├── config/env.js
    ├── db/connection.js
    ├── middleware/* (all)
    ├── modules/*/routes.js (all)
    └── socket/socketServer.js

socketServer.js
    ├── socket/socketAuth.js
    ├── socket/roomManager.js
    └── socket/handlers/* (all)

handlers/*
    ├── modules/*/service.js (respective)
    └── socket/roomManager.js

modules/*/routes.js → modules/*/controller.js
modules/*/controller.js → modules/*/service.js
modules/*/service.js → modules/*/repository.js + utils/* + socket/roomManager.js
modules/*/repository.js → db/connection.js

utils/codeGenerator.js → modules/session/repository.js (collision check)
utils/logger.js ← used by everyone
utils/responseHelper.js ← used by all controllers
utils/idGenerator.js ← used by all services
```

---

## 15. File Count Summary

| Category | Count | Files |
|---|---|---|
| Entry point | 1 | `index.js` |
| Config | 2 | `env.js`, `constants.js` |
| Database | 3 | `connection.js`, `schema.sql`, `001_initial.sql` |
| Middleware | 4 | `errorHandler.js`, `requestLogger.js`, `rateLimiter.js`, `validateSession.js` |
| Session module | 4 | `routes.js`, `controller.js`, `service.js`, `repository.js` |
| Task module | 4 | `routes.js`, `controller.js`, `service.js`, `repository.js` |
| Student module | 4 | `routes.js`, `controller.js`, `service.js`, `repository.js` |
| Teacher module | 4 | `routes.js`, `controller.js`, `service.js`, `repository.js` |
| Socket | 7 | `socketServer.js`, `socketAuth.js`, `roomManager.js`, `sessionHandlers.js`, `taskHandlers.js`, `statusHandlers.js`, `messageHandlers.js` |
| Utilities | 4 | `codeGenerator.js`, `idGenerator.js`, `logger.js`, `responseHelper.js` |
| Config files | 2 | `package.json`, `.env` |
| **Total** | **39** | — |

Every file has a single, clear responsibility. No file is a "dump everything here" file. Any developer can look at the file name and know exactly what it does.
