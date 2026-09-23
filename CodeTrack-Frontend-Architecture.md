# CodeTrack — Complete Frontend Architecture Plan

> **Document Type:** Frontend Implementation Blueprint (No Code)  
> **Purpose:** Every page, component, design token, animation, icon, navigation flow, and visual detail mapped out  
> **Tech:** Vanilla HTML + CSS + JavaScript (no frameworks, no build step)  
> **Design Language:** Dark Glassmorphism — Professional, Minimal, Distraction-Free

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography System](#3-typography-system)
4. [Iconography](#4-iconography)
5. [Spacing & Layout System](#5-spacing--layout-system)
6. [Animation & Transition System](#6-animation--transition-system)
7. [Complete Page Map](#7-complete-page-map)
8. [Navigation Architecture](#8-navigation-architecture)
9. [Page-by-Page Specification — Teacher](#9-page-by-page-specification--teacher)
10. [Page-by-Page Specification — Student](#10-page-by-page-specification--student)
11. [Shared Components](#11-shared-components)
12. [Responsive Behavior](#12-responsive-behavior)
13. [Notification & Toast System](#13-notification--toast-system)
14. [Loading & Empty States](#14-loading--empty-states)
15. [Micro-Interactions Catalog](#15-micro-interactions-catalog)
16. [Accessibility](#16-accessibility)
17. [File Structure](#17-file-structure)
18. [Component Dependency Map](#18-component-dependency-map)
19. [File Count Summary](#19-file-count-summary)

---

## 1. Design Philosophy

### Core Principles

| Principle | What It Means |
|---|---|
| **Distraction-Free** | The student widget must NEVER compete with the IDE for attention. It's a tool, not an app. |
| **Dark-First** | Dark background reduces eye strain during long coding sessions. Light mode is secondary. |
| **Glassmorphism** | Frosted-glass panels with subtle blur, transparency, and soft borders — premium feel without heaviness. |
| **Information Density** | Teacher dashboard shows everything at a glance. No clicking through 5 pages to see who's stuck. |
| **Motion with Purpose** | Every animation communicates something — a new task arrived, a status changed, a student needs help. No gratuitous animation. |
| **Zero Install** | Everything runs in the browser. No npm, no build step, no extensions. Open URL → it works. |

### Design Inspiration Reference

```
Visual DNA:
├── Discord's dark sidebar (compact, scannable)
├── GitHub's notification panel (minimal, functional)
├── Linear's glassmorphism cards (premium, modern)
├── VS Code's color language (familiar to developers)
└── Notion's clean typography (readable, professional)
```

---

## 2. Color System

### 2.1 Primary Palette — Dark Theme (Default)

| Token Name | Hex | HSL | Usage |
|---|---|---|---|
| `--bg-primary` | `#0A0E17` | `220° 30% 6%` | Main background (deepest layer) |
| `--bg-secondary` | `#111827` | `220° 30% 11%` | Card/panel backgrounds |
| `--bg-tertiary` | `#1F2937` | `215° 28% 17%` | Elevated surfaces, hover states |
| `--bg-glass` | `rgba(17, 24, 39, 0.75)` | — | Glassmorphism panels (with backdrop-blur) |
| `--bg-glass-hover` | `rgba(31, 41, 55, 0.85)` | — | Glassmorphism hover state |

### 2.2 Text Colors

| Token Name | Hex | Usage |
|---|---|---|
| `--text-primary` | `#F9FAFB` | Headings, important labels |
| `--text-secondary` | `#D1D5DB` | Body text, descriptions |
| `--text-tertiary` | `#9CA3AF` | Placeholder text, timestamps, metadata |
| `--text-muted` | `#6B7280` | Disabled text, subtle hints |

### 2.3 Accent Colors (Functional)

| Token Name | Hex | HSL | Usage |
|---|---|---|---|
| `--accent-primary` | `#6366F1` | `239° 84% 67%` | Primary actions (buttons, links, active states) — Indigo |
| `--accent-primary-hover` | `#818CF8` | `239° 92% 75%` | Primary button hover |
| `--accent-primary-glow` | `rgba(99, 102, 241, 0.25)` | — | Glow effect behind primary buttons |

### 2.4 Status Colors (Critical for Task Tracking)

| Token Name | Hex | HSL | Meaning | Usage |
|---|---|---|---|---|
| `--status-done` | `#10B981` | `160° 84% 39%` | ✅ Completed | Done badges, success indicators |
| `--status-done-bg` | `rgba(16, 185, 129, 0.15)` | — | — | Background tint for done items |
| `--status-progress` | `#F59E0B` | `38° 92% 50%` | 🔄 In Progress | Working badges, amber indicators |
| `--status-progress-bg` | `rgba(245, 158, 11, 0.15)` | — | — | Background tint for in-progress items |
| `--status-stuck` | `#EF4444` | `0° 84% 60%` | ❌ Stuck / Needs Help | Stuck badges, alert indicators |
| `--status-stuck-bg` | `rgba(239, 68, 68, 0.15)` | — | — | Background tint for stuck items |
| `--status-pending` | `#6B7280` | `220° 9% 46%` | ⏳ Pending / Not Started | Default state, gray |
| `--status-pending-bg` | `rgba(107, 114, 128, 0.15)` | — | — | Background tint for pending items |
| `--status-offline` | `#374151` | `218° 20% 26%` | 🔌 Disconnected | Offline student indicators |

### 2.5 Border & Surface Colors

| Token Name | Hex | Usage |
|---|---|---|
| `--border-subtle` | `rgba(255, 255, 255, 0.06)` | Card borders, dividers |
| `--border-default` | `rgba(255, 255, 255, 0.10)` | Input borders, section separators |
| `--border-focus` | `rgba(99, 102, 241, 0.50)` | Input focus rings |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle card shadow |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.4)` | Elevated panel shadow |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.5)` | Modal/popup shadow |
| `--shadow-glow` | `0 0 20px var(--accent-primary-glow)` | Button glow effect |

### 2.6 Color Usage Rules

```
NEVER use raw colors in components — always reference tokens.
NEVER use pure black (#000000) — always use --bg-primary (dark navy).
NEVER use pure white (#FFFFFF) for backgrounds — only for text.
Status colors are ONLY for status indicators — never for decorative elements.
Accent indigo is for interactive elements ONLY — buttons, links, focus rings.
```

---

## 3. Typography System

### 3.1 Font Stack

| Usage | Font | Fallback | Source |
|---|---|---|---|
| **Primary (UI)** | `Inter` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Google Fonts CDN |
| **Monospace (codes, roll numbers)** | `JetBrains Mono` | `'Fira Code', 'Cascadia Code', monospace` | Google Fonts CDN |

**Why Inter:** Designed for screens, excellent readability at small sizes, professional appearance, variable font (single file covers all weights).

**Why JetBrains Mono:** Familiar to developers/coding students, ligature support, clear distinction between similar characters (0/O, 1/l).

### 3.2 Type Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `--text-xs` | `11px` | 400 | 1.4 | Timestamps, metadata, fine print |
| `--text-sm` | `13px` | 400 | 1.5 | Secondary labels, descriptions |
| `--text-base` | `15px` | 400 | 1.6 | Body text, task descriptions |
| `--text-md` | `16px` | 500 | 1.5 | Button labels, input text |
| `--text-lg` | `18px` | 600 | 1.4 | Section headings, task titles |
| `--text-xl` | `22px` | 700 | 1.3 | Page titles, dashboard heading |
| `--text-2xl` | `28px` | 700 | 1.2 | Hero text (landing page only) |
| `--text-mono` | `13px` | 400 | 1.4 | Session codes, roll numbers (JetBrains Mono) |
| `--text-code-lg` | `20px` | 600 | 1.2 | Session code display (large, monospace) |

### 3.3 Typography Rules

```
Headings: Inter, semi-bold (600) or bold (700)
Body: Inter, regular (400)
Session codes: JetBrains Mono, always uppercase, letter-spacing: 0.15em
Numbers/counts: JetBrains Mono (for tabular alignment)
Maximum line width: 65 characters (for readability in descriptions)
```

---

## 4. Iconography

### 4.1 Icon Library

**Source:** [Lucide Icons](https://lucide.dev) — open source, consistent stroke width, MIT licensed, works without any framework.

**Delivery method:** Inline SVG pasted directly into HTML (no icon font dependency, no network request per icon).

### 4.2 Icon Catalog — Every Icon Used in CodeTrack

#### Session Icons
| Icon Name | Lucide ID | Where Used |
|---|---|---|
| Session/Class | `school` | Session header, create session |
| Create Session | `plus-circle` | "New Session" button |
| Session Code | `key-round` | Code display area |
| Copy Code | `copy` | Copy code to clipboard button |
| End Session | `log-out` | End session button |
| Clock/Duration | `clock` | Session duration display |
| Calendar | `calendar` | Session history dates |

#### Task Icons
| Icon Name | Lucide ID | Where Used |
|---|---|---|
| Add Task | `plus` | "Add Task" button |
| Task Item | `file-text` | Task list items |
| Task Order | `grip-vertical` | Task reorder handle (if implemented) |

#### Status Icons
| Icon Name | Lucide ID | Where Used |
|---|---|---|
| Done/Complete | `check-circle-2` | Done status badge |
| In Progress | `loader` | In-progress status badge (animated spin) |
| Stuck/Help | `alert-triangle` | Stuck status badge |
| Pending | `circle-dashed` | Pending/not-started badge |
| Offline | `wifi-off` | Disconnected student indicator |
| Online | `wifi` | Connected student indicator |

#### Teacher Action Icons
| Icon Name | Lucide ID | Where Used |
|---|---|---|
| Send Hint | `message-circle` | Hint input send button |
| Resolve | `check-check` | Mark issue as resolved |
| View Students | `users` | Student list/grid toggle |
| Expand | `chevron-down` | Expandable sections |
| Collapse | `chevron-up` | Collapsible sections |
| Remove Student | `user-minus` | Kick student from session |
| Refresh | `refresh-cw` | Manual data refresh |

#### Student Widget Icons
| Icon Name | Lucide ID | Where Used |
|---|---|---|
| Minimize | `minus` | Minimize widget to pill |
| Maximize | `maximize-2` | Expand widget |
| Close | `x` | Close/leave session |
| Send Issue | `send` | Submit issue text |
| Notification | `bell` | New task notification |
| Hint Received | `lightbulb` | Teacher hint notification |

#### Navigation Icons
| Icon Name | Lucide ID | Where Used |
|---|---|---|
| Dashboard | `layout-dashboard` | Teacher dashboard nav |
| History | `history` | Session history nav |
| Settings | `settings` | Settings (if needed) |
| Back | `arrow-left` | Back navigation |
| External Link | `external-link` | Open in new tab |

### 4.3 Icon Styling Rules

```
Size: 16px (inline with text), 20px (buttons), 24px (headers)
Stroke width: 1.75px (consistent with Lucide defaults)
Color: inherits from parent text color (currentColor)
Status icons use their respective status colors
Interactive icons: opacity 0.7 → 1.0 on hover (with transition)
```

---

## 5. Spacing & Layout System

### 5.1 Spacing Scale (8px base grid)

| Token | Value | Usage |
|---|---|---|
| `--space-1` | `4px` | Tight gaps (icon-to-text, badge padding) |
| `--space-2` | `8px` | Small padding (list item vertical padding) |
| `--space-3` | `12px` | Default gap between elements |
| `--space-4` | `16px` | Card internal padding, input padding |
| `--space-5` | `20px` | Section gaps |
| `--space-6` | `24px` | Panel padding, major section spacing |
| `--space-8` | `32px` | Page-level vertical rhythm |
| `--space-10` | `40px` | Hero spacing, large gaps |
| `--space-12` | `48px` | Page top/bottom padding |

### 5.2 Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `6px` | Buttons, badges, inputs |
| `--radius-md` | `10px` | Cards, panels |
| `--radius-lg` | `16px` | Modals, floating widget |
| `--radius-xl` | `24px` | Pill-shaped elements (minimized widget) |
| `--radius-full` | `9999px` | Circular elements (status dots, avatars) |

### 5.3 Glassmorphism Effect Specification

```
Panel glass effect:
    background: var(--bg-glass)
    backdrop-filter: blur(16px) saturate(1.2)
    -webkit-backdrop-filter: blur(16px) saturate(1.2)
    border: 1px solid var(--border-subtle)
    border-radius: var(--radius-md)
    box-shadow: var(--shadow-md)

Elevated glass (modals, popups):
    background: var(--bg-glass-hover)
    backdrop-filter: blur(24px) saturate(1.3)
    border: 1px solid var(--border-default)
    border-radius: var(--radius-lg)
    box-shadow: var(--shadow-lg)
```

---

## 6. Animation & Transition System

### 6.1 Transition Defaults

| Token | Value | Usage |
|---|---|---|
| `--transition-fast` | `120ms ease-out` | Hover color changes, opacity toggles |
| `--transition-normal` | `200ms ease-out` | Button interactions, card hover lift |
| `--transition-smooth` | `300ms cubic-bezier(0.4, 0, 0.2, 1)` | Panel open/close, slide-in effects |
| `--transition-spring` | `400ms cubic-bezier(0.34, 1.56, 0.64, 1)` | Bounce-in effects (new task arrival, notification pop) |

### 6.2 Animation Catalog — Every Animation in CodeTrack

#### Entry Animations
| Animation Name | Trigger | Effect | Duration |
|---|---|---|---|
| `fadeIn` | Page load, component mount | Opacity 0 → 1 | 300ms |
| `slideInUp` | New task appears in student widget | Translate Y +20px → 0, opacity 0 → 1 | 300ms spring |
| `slideInRight` | Stuck student card appears on teacher dashboard | Translate X +30px → 0, opacity 0 → 1 | 250ms smooth |
| `scaleIn` | Toast notification appears | Scale 0.9 → 1, opacity 0 → 1 | 200ms spring |
| `expandDown` | Accordion/section expands | Max-height 0 → auto, opacity 0 → 1 | 300ms smooth |

#### Exit Animations
| Animation Name | Trigger | Effect | Duration |
|---|---|---|---|
| `fadeOut` | Component unmount, dismiss | Opacity 1 → 0 | 200ms |
| `slideOutRight` | Stuck student resolved (card dismissed) | Translate X 0 → +30px, opacity 1 → 0 | 250ms |
| `scaleOut` | Toast dismissed | Scale 1 → 0.9, opacity 1 → 0 | 150ms |
| `collapseUp` | Accordion/section collapses | Max-height auto → 0, opacity 1 → 0 | 250ms smooth |

#### Status Change Animations
| Animation Name | Trigger | Effect | Duration |
|---|---|---|---|
| `statusPulse` | Student changes task status | Brief scale 1 → 1.15 → 1 with status color glow | 400ms spring |
| `countTick` | Aggregate count changes on teacher dashboard | Number briefly highlights (color flash) + subtle scale bump | 300ms |
| `progressRing` | Completion percentage updates | Animated SVG circle stroke fill | 600ms smooth |

#### Notification Animations
| Animation Name | Trigger | Effect | Duration |
|---|---|---|---|
| `notificationBounce` | New task arrives in student widget | Widget border briefly glows indigo + icon bounce | 500ms spring |
| `hintGlow` | Teacher hint received by student | Widget border glows amber + lightbulb icon pulses | 600ms |
| `stuckFlash` | New stuck student appears on teacher dashboard | Red border flash on the stuck card | 400ms |

#### Continuous Animations
| Animation Name | Element | Effect | Duration |
|---|---|---|---|
| `spinLoader` | In-progress status icon (loader) | Continuous 360° rotation | 1500ms linear infinite |
| `breathePulse` | "Live" session indicator dot | Scale 1 → 1.3 → 1 with opacity | 2000ms ease-in-out infinite |
| `cursorBlink` | Session code input cursor | Opacity 1 → 0 → 1 | 1000ms step-end infinite |

#### Widget-Specific Animations
| Animation Name | Trigger | Effect | Duration |
|---|---|---|---|
| `minimizeToPill` | Student clicks minimize | Widget shrinks from 320×480 → pill shape (220×40), content fades out | 350ms smooth |
| `expandFromPill` | Student clicks pill to expand | Pill expands to 320×480, content fades in (staggered) | 400ms spring |
| `dragSnap` | Student stops dragging widget | Widget snaps to nearest screen edge with subtle bounce | 200ms spring |

### 6.3 Animation Rules

```
NEVER animate without user trigger or meaningful data change.
NEVER use animations longer than 600ms (users perceive delay).
ALWAYS use `will-change` on animated elements for GPU acceleration.
ALWAYS respect `prefers-reduced-motion` — disable all animations if set.
Status change animations are SHORT (200-400ms) — they happen frequently.
Entry animations are ONCE per component mount — no repeated triggers.
Continuous animations are SUBTLE — low intensity, never distracting.
```

---

## 7. Complete Page Map

### 7.1 Teacher Pages (Full-Page Web App)

```
TEACHER FLOW
│
├── / (Landing Page)
│   └── "I'm a Teacher" → /teacher/create
│   └── "I'm a Student" → /student/join
│
├── /teacher/create (Create Session Page)
│   └── Form → session created → redirect to /teacher/dashboard/:code
│
├── /teacher/dashboard/:code (Live Dashboard — MAIN PAGE)
│   ├── Session header (code, name, connected count, duration)
│   ├── Task list panel (with aggregate status counts)
│   │   └── Click task → expands to student-by-student status grid
│   ├── "Add Task" floating action area
│   ├── Stuck students alert panel (red-highlighted, real-time)
│   │   └── Click student → hint/resolve actions
│   └── Student roster sidebar (all students, online/offline status)
│
├── /teacher/history (Session History Page)
│   └── List of past sessions → click → /teacher/report/:id
│
└── /teacher/report/:id (Session Report Page)
    └── Task completion rates, stuck issues log, student performance summary
```

### 7.2 Student Pages (Popup Widget — Small Window)

```
STUDENT FLOW
│
├── / (Landing Page — same as teacher)
│   └── "I'm a Student" → /student/join
│
├── /student/join (Join Session Page)
│   └── Enter code + name + roll → join → redirect to /student/widget/:code
│
└── /student/widget/:code (Live Widget — MAIN PAGE)
    ├── Minimized pill state (floating, draggable)
    └── Expanded state:
        ├── Session header (session name, connection status)
        ├── Task list (latest task first)
        │   └── Each task: title + status buttons [Done] [Working] [Stuck]
        ├── Issue text input (appears when "Stuck" is clicked)
        ├── Hints panel (teacher messages appear here)
        └── Minimize / Leave buttons
```

### 7.3 Page Count Summary

| Page | View Type | Primary User |
|---|---|---|
| Landing Page | Full page | Both |
| Create Session | Full page | Teacher |
| Live Dashboard | Full page | Teacher |
| Session History | Full page | Teacher |
| Session Report | Full page | Teacher |
| Join Session | Small window | Student |
| Live Widget | Small window (320×480) | Student |
| **Total: 7 pages** | | |

---

## 8. Navigation Architecture

### 8.1 Teacher Navigation

**Top navigation bar** (fixed, always visible on teacher pages):

```
┌─────────────────────────────────────────────────────────────────┐
│ ⬡ CodeTrack        [Dashboard]  [History]        Teacher Name ▾ │
└─────────────────────────────────────────────────────────────────┘
```

| Element | Behavior |
|---|---|
| Logo (`⬡ CodeTrack`) | Clicking returns to dashboard if in session, or to landing page |
| Dashboard | Active when on `/teacher/dashboard/:code` — only visible when session is active |
| History | Links to `/teacher/history` — always visible |
| Teacher Name | Displays the teacher's name (no dropdown needed for Phase 0) |

**Navigation transitions:**
- Page-to-page: fade out current content (200ms) → fade in new content (300ms)
- Within dashboard: no page navigation — all panels update in-place via Socket.IO

### 8.2 Student Navigation

**No navigation bar.** The student widget is a single-page experience. Navigation is implicit:

```
Join Page → (join successful) → Widget Page → (session ends) → Join Page
```

| Action | Behavior |
|---|---|
| Join → Widget | Smooth transition: join form slides up, widget slides in from bottom |
| Leave Session | Confirmation prompt → widget fades out → back to join page |
| Session Ended by Teacher | Toast notification → 3 second countdown → back to join page |
| Minimize Widget | Widget animates to pill shape (stays on screen) |
| Expand Widget | Pill animates back to full widget |

### 8.3 URL Routing Strategy

Since there is no framework (Vanilla JS), routing is handled via a simple **hash-based router**:

```
#/                          → Landing page
#/teacher/create            → Create session form
#/teacher/dashboard/:code   → Live dashboard
#/teacher/history           → Past sessions
#/teacher/report/:id        → Session report
#/student/join              → Join session form
#/student/widget/:code      → Live widget
```

**Router responsibilities:**
- Listen for `hashchange` events
- Match the hash to a page renderer function
- Call the renderer → it replaces the content of a `<main id="app">` container
- Preserve state across navigation (teacher's active session, student's joined session)

---

## 9. Page-by-Page Specification — Teacher

### 9.1 Landing Page (`#/`)

**Purpose:** Entry point — user chooses their role.

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│                                                       │
│              ⬡ CodeTrack                              │
│              Live Session Task Tracker                │
│                                                       │
│    ┌──────────────────┐  ┌──────────────────┐        │
│    │                  │  │                  │        │
│    │  🎓 I'm a        │  │  📖 I'm a        │        │
│    │  Teacher         │  │  Student         │        │
│    │                  │  │                  │        │
│    │  Create and      │  │  Join a session  │        │
│    │  manage sessions │  │  and track tasks │        │
│    │                  │  │                  │        │
│    │  [Get Started →] │  │  [Join Now →]    │        │
│    └──────────────────┘  └──────────────────┘        │
│                                                       │
│              Powered by Ayush Academia                │
└──────────────────────────────────────────────────────┘
```

**Visual Details:**
- Full viewport height, centered content
- Subtle gradient background: `--bg-primary` → slightly lighter at center
- Two glass cards side by side (responsive: stack vertically on mobile)
- Cards have hover effect: slight lift (translateY -4px) + border glow
- Logo at top with subtle breathing animation
- Footer text in `--text-muted`

**Entry animation:**
- Logo fades in first (0ms delay)
- Cards slide in from bottom with stagger (card 1 at 150ms, card 2 at 300ms)

---

### 9.2 Create Session Page (`#/teacher/create`)

**Purpose:** Teacher creates a new session.

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│ ⬡ CodeTrack                                [History] │
├──────────────────────────────────────────────────────┤
│                                                       │
│           Create New Session                          │
│                                                       │
│    ┌──────────────────────────────────────────┐       │
│    │ Session Name                              │       │
│    │ ┌──────────────────────────────────────┐  │       │
│    │ │ DSA Lab - Section A                  │  │       │
│    │ └──────────────────────────────────────┘  │       │
│    │                                           │       │
│    │ Your Name                                 │       │
│    │ ┌──────────────────────────────────────┐  │       │
│    │ │ Prof. Sharma                         │  │       │
│    │ └──────────────────────────────────────┘  │       │
│    │                                           │       │
│    │ Session Password                          │       │
│    │ ┌──────────────────────────────────────┐  │       │
│    │ │ ••••••••                    [👁]     │  │       │
│    │ └──────────────────────────────────────┘  │       │
│    │ (Used to end session and manage tasks)     │       │
│    │                                           │       │
│    │ ┌──────────────────────────────────────┐  │       │
│    │ │      ✨ Create Session                │  │       │
│    │ └──────────────────────────────────────┘  │       │
│    └──────────────────────────────────────────┘       │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Visual Details:**
- Centered glass card (max-width: 480px)
- Input fields: dark background (`--bg-tertiary`), subtle border, indigo glow on focus
- Password field: toggle visibility eye icon
- Create button: filled indigo (`--accent-primary`), glow shadow on hover
- Button loading state: text replaced with spinner + "Creating..."

**Form Behavior:**
- All fields required — inline validation on blur
- Session name: min 3 chars, max 100 chars
- Teacher name: min 2 chars, max 50 chars
- Password: min 4 chars (simple for Phase 0)
- On submit: button shows loading → on success, redirect to dashboard with code display

**Transition to dashboard:**
- Form card slides up and fades out
- Session code appears center-screen in large monospace text with celebration animation
- After 2 seconds, transitions to full dashboard

---

### 9.3 Live Dashboard (`#/teacher/dashboard/:code`) — THE MAIN PAGE

**Purpose:** Teacher's command center during a live session.

**Layout — Full Structure:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ ⬡ CodeTrack     [Dashboard]  [History]              Prof. Sharma   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ ┌────────────────────────────────────────────────────────────────┐   │
│ │  SESSION HEADER                                                 │   │
│ │  📋 DSA Lab - Section A                                         │   │
│ │  Code: TR7-X2K [📋 Copy]    👥 34/40 joined    ⏱ 45m    🟢 Live │   │
│ │                                                    [End Session] │   │
│ └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
│ ┌──────────────────────────────────┐ ┌───────────────────────────┐  │
│ │  TASK LIST                        │ │  STUCK STUDENTS ALERT     │  │
│ │                                   │ │                           │  │
│ │  [+ Add New Task]                 │ │  ❌ 2 students need help  │  │
│ │                                   │ │                           │  │
│ │  ▼ Task 2: Implement push/pop    │ │  ┌───────────────────┐   │  │
│ │    ✅ 12  🔄 18  ❌ 4  ⏳ 6      │ │  │ Roll 23 - Ayush    │   │  │
│ │    ┌──────────────────────────┐  │ │  │ Task 2             │   │  │
│ │    │ STUDENT STATUS GRID      │  │ │  │ "Segfault on       │   │  │
│ │    │                          │  │ │  │  line 14"          │   │  │
│ │    │ ✅ Roll 01 - Aditya      │  │ │  │ ⏱ 3 min ago        │   │  │
│ │    │ ✅ Roll 03 - Sneha       │  │ │  │ [💬 Hint] [✅ Done]│   │  │
│ │    │ 🔄 Roll 05 - Rahul       │  │ │  └───────────────────┘   │  │
│ │    │ 🔄 Roll 07 - Priya       │  │ │                           │  │
│ │    │ ❌ Roll 23 - Ayush       │  │ │  ┌───────────────────┐   │  │
│ │    │    "Segfault on line 14" │  │ │  │ Roll 17 - Priya    │   │  │
│ │    │    [💬 Hint] [✅ Resolve]│  │ │  │ Task 2             │   │  │
│ │    │ ⏳ Roll 31 - Varun       │  │ │  │ "Confused about    │   │  │
│ │    └──────────────────────────┘  │ │  │  pointers"         │   │  │
│ │                                   │ │  │ ⏱ 1 min ago        │   │  │
│ │  ▸ Task 1: Create linked list    │ │  │ [💬 Hint] [✅ Done]│   │  │
│ │    ✅ 28  🔄 4  ❌ 2  ⏳ 6       │ │  └───────────────────┘   │  │
│ │                                   │ │                           │  │
│ └──────────────────────────────────┘ └───────────────────────────┘  │
│                                                                      │
│ ┌────────────────────────────────────────────────────────────────┐   │
│ │  STUDENT ROSTER (collapsible)                           [▼]    │   │
│ │  🟢 Roll 01 - Aditya  │  🟢 Roll 03 - Sneha  │  🟢 Roll 05  │   │
│ │  🟢 Roll 07 - Priya   │  🔴 Roll 09 - Offline │  🟢 Roll 11  │   │
│ │  ... (grid of student pills showing online/offline status)     │   │
│ └────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

**Panel Breakdown:**

#### A. Session Header Bar
| Element | Details |
|---|---|
| Session name | Large text (`--text-xl`), bold |
| Session code | Monospace (`JetBrains Mono`, `--text-code-lg`), dashed format `TR7-X2K` |
| Copy button | Click → copies code to clipboard → brief "Copied!" tooltip with checkmark |
| Student count | `👥 34/40 joined` — count updates in real-time via Socket.IO |
| Duration | `⏱ 45m` — ticking timer showing session duration |
| Live indicator | Green pulsing dot (`breathePulse` animation) + "Live" text |
| End Session | Red-tinted button at far right, requires password confirmation modal |

#### B. Task List Panel (Left, ~60% width)
| Element | Details |
|---|---|
| "Add New Task" button | Indigo outlined button at top, opens inline task creation form |
| Task items | Accordion-style — collapsed shows title + aggregate counts, expanded shows student grid |
| Aggregate badges | `✅ 12  🔄 18  ❌ 4  ⏳ 6` — colored count badges with status colors |
| Task ordering | Latest task at top (reverse chronological) |
| Expanded student grid | Shows every student's status for that task, sorted: stuck → in_progress → done → pending |
| Student status row | Status icon + Roll No + Name + issue text (if stuck) + action buttons |
| Hint button | Opens inline text input → sends hint to that specific student |
| Resolve button | Marks stuck issue as resolved → card animates out (slideOutRight) |

**Add Task Inline Form (appears when button clicked):**
```
┌──────────────────────────────────────┐
│ Task Title                            │
│ ┌──────────────────────────────────┐ │
│ │ Implement a stack using arrays   │ │
│ └──────────────────────────────────┘ │
│ Description (optional)                │
│ ┌──────────────────────────────────┐ │
│ │                                  │ │
│ └──────────────────────────────────┘ │
│ [Cancel]             [Send to All ✨] │
└──────────────────────────────────────┘
```
- Slides down with `expandDown` animation
- "Send to All" button has indigo glow
- On submit: form collapses, new task appears at top of task list with `slideInUp` animation

#### C. Stuck Students Alert Panel (Right, ~40% width)
| Element | Details |
|---|---|
| Header | Red-tinted: `❌ 2 students need help` — count updates in real-time |
| Stuck cards | Glass cards with red-tinted left border |
| Card content | Student name, roll number, which task, issue text, time since stuck |
| Hint action | Opens text input inline within the card |
| Resolve action | Green checkmark button → card animates out when resolved |
| Empty state | When no students are stuck: `✨ All students progressing well!` with green tint |
| New stuck entry | Card slides in from right (`slideInRight`) with brief red border flash (`stuckFlash`) |

#### D. Student Roster Bar (Bottom, collapsible)
| Element | Details |
|---|---|
| Toggle | Click header to expand/collapse — shows `▼` or `▲` chevron |
| Student pills | Small rounded pills in a flowing grid: `🟢 Roll 01 - Aditya` |
| Online indicator | Green dot = connected, gray dot = disconnected |
| Disconnected students | Grayed out, shown at end of list |
| Click student | No action in Phase 0 (future: opens student detail panel) |

#### E. Real-Time Update Behavior
| Event | Dashboard Reaction |
|---|---|
| Student joins | Student count increments (with `countTick` animation), student pill appears in roster |
| Student status changes | Aggregate count badges update with `countTick`, student's row in expanded grid updates with `statusPulse` |
| New stuck student | Stuck panel count increments, new stuck card slides in from right with red flash |
| Student disconnects | Roster pill turns gray, student count decrements |
| Student reconnects | Roster pill turns green, student count increments |
| Issue resolved | Stuck card slides out to right, stuck count decrements |

---

### 9.4 Session History Page (`#/teacher/history`)

**Purpose:** View all past sessions.

**Layout:**
```
┌──────────────────────────────────────────────────────────────────┐
│ ⬡ CodeTrack     [Dashboard]  [History]              Prof. Sharma │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Session History                                                   │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ 📋 DSA Lab - Section A              Sep 22, 2026   45 min   │ │
│  │    Code: TR7-X2K   👥 34 students   ✅ 78% completion       │ │
│  │                                              [View Report →] │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ 📋 DBMS Lab - Section B              Sep 21, 2026   60 min  │ │
│  │    Code: PK4-M8N   👥 28 students   ✅ 85% completion       │ │
│  │                                              [View Report →] │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  (More sessions...)                                                │
│                                                                    │
│  Empty state: "No sessions yet. Create your first session!"       │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

**Visual Details:**
- Cards in a vertical list, glass background
- Hover: slight lift + border brightens
- Completion percentage shown as colored text (green if > 70%, amber if 40-70%, red if < 40%)
- Click "View Report" → navigates to report page

---

### 9.5 Session Report Page (`#/teacher/report/:id`)

**Purpose:** Detailed post-session analysis.

**Layout:**
```
┌──────────────────────────────────────────────────────────────────┐
│ ⬡ CodeTrack     [← Back to History]                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Session Report: DSA Lab - Section A                               │
│  Sep 22, 2026 • 45 minutes • 34 students                          │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  OVERVIEW STATS                                              │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │  │
│  │  │ 3       │ │ 34      │ │ 78%     │ │ 6       │          │  │
│  │  │ Tasks   │ │ Students│ │ Done    │ │ Issues  │          │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  TASK-BY-TASK BREAKDOWN                                      │  │
│  │                                                               │  │
│  │  Task 1: Create linked list                                   │  │
│  │  ████████████████████████░░░░░ 82% completion                │  │
│  │  ✅ 28 done  │  🔄 4 partial  │  ❌ 2 stuck                  │  │
│  │                                                               │  │
│  │  Task 2: Implement push/pop                                   │  │
│  │  ██████████████████░░░░░░░░░░ 65% completion                 │  │
│  │  ✅ 22 done  │  🔄 8 partial  │  ❌ 4 stuck                  │  │
│  │                                                               │  │
│  │  Task 3: Test with edge cases                                 │  │
│  │  ████████████████████████████░ 91% completion                │  │
│  │  ✅ 31 done  │  🔄 2 partial  │  ❌ 1 stuck                  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  ISSUES LOG                                                   │  │
│  │                                                               │  │
│  │  Roll 23 - Ayush  │ Task 2  │ "Segfault on line 14"          │  │
│  │  Roll 17 - Priya  │ Task 2  │ "Confused about pointers"      │  │
│  │  Roll 09 - Varun  │ Task 1  │ "Linked list cycle in output"  │  │
│  │  ... (full log)                                               │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

**Visual Details:**
- Overview stats: 4 metric cards in a row (glass background, large number + label)
- Progress bars: horizontal bars using status colors, animated fill on load
- Issues log: table-style layout with alternating subtle row backgrounds
- Back button at top left

---

## 10. Page-by-Page Specification — Student

### 10.1 Join Session Page (`#/student/join`)

**Purpose:** Student enters session code and identifies themselves.

**Window size:** Opens as a small popup window: `window.open(url, 'CodeTrack', 'width=360,height=520')`

**Layout:**
```
┌──────────────────────────────┐
│                               │
│       ⬡ CodeTrack             │
│       Join Session            │
│                               │
│  Session Code                 │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐
│  │ T│ │ R│ │ 7│ │ X│ │ 2│ │ K│
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘
│                               │
│  Your Name                    │
│  ┌────────────────────────┐  │
│  │ Ayush Sharma            │  │
│  └────────────────────────┘  │
│                               │
│  Roll Number                  │
│  ┌────────────────────────┐  │
│  │ 23                      │  │
│  └────────────────────────┘  │
│                               │
│  ┌────────────────────────┐  │
│  │     Join Session →      │  │
│  └────────────────────────┘  │
│                               │
│  Error: "Invalid code"   ← (if applicable)
│                               │
└──────────────────────────────┘
```

**Visual Details:**
- **Session code input:** 6 individual character boxes (like OTP input), auto-advance on type, auto-uppercase
- Each box: monospace font, centered single character, border glow when active
- Auto-focus on first box on page load
- Name and roll number: standard text inputs
- Join button: indigo filled, disabled until all fields filled
- Error message: red text below form, slides in with `slideInUp`

**Validation:**
- Code: exactly 6 characters from valid charset
- Name: 2-50 characters
- Roll number: 1-20 characters (alphanumeric, to support formats like "MCA-23-01")
- On submit: button loading state → validates code via REST API → if invalid, shake animation on code input → if valid, transition to widget

**Transition to widget:**
- Join form fades up and out
- Widget fades in from bottom

---

### 10.2 Live Widget Page (`#/student/widget/:code`) — THE CORE EXPERIENCE

**Purpose:** Student's real-time task tracker that sits alongside their IDE.

#### Minimized Pill State (Default after 10 seconds of inactivity)

```
┌────────────────────────────────────┐
│ ⬡ 📋 Task 2: push/pop    🔄      │
└────────────────────────────────────┘
   ↑ draggable, clicks to expand
```

- **Size:** ~240px wide × 36px tall
- **Position:** Fixed to bottom-right of screen (draggable to any edge)
- **Content:** Logo icon + current task name (truncated) + current status icon
- **Behavior:** Click anywhere → expands to full widget
- **Notification:** When new task arrives, pill briefly bounces + border glows indigo

#### Expanded Widget State

```
┌──────────────────────────────────────┐
│ ⬡ CodeTrack              [−] [×]    │
│ TR7-X2K • DSA Lab          🟢 Live  │
├──────────────────────────────────────┤
│                                       │
│ ★ Task 2: Implement push/pop   NEW  │
│ ─────────────────────────────────     │
│ Push elements onto a stack and       │
│ implement pop with underflow check   │
│                                       │
│ ┌────────┐ ┌────────┐ ┌────────┐    │
│ │ ✅ Done │ │ 🔄 Work│ │ ❌ Stuck│    │
│ └────────┘ └────────┘ └────────┘    │
│                                       │
│ ┌────────────────────────────────┐   │
│ │ Describe your issue...          │   │
│ │                                 │   │
│ │                        [Send →]│   │
│ └────────────────────────────────┘   │
│                                       │
│ 💡 Hint from teacher:                 │
│ ┌────────────────────────────────┐   │
│ │ "Check for NULL before push"    │   │
│ └────────────────────────────────┘   │
│                                       │
├──────────────────────────────────────┤
│ ▸ Task 1: Create linked list   ✅    │
├──────────────────────────────────────┤
│                                       │
│ ⬡ Connected as Roll 23 - Ayush       │
└──────────────────────────────────────┘
```

**Panel Breakdown:**

#### A. Widget Header
| Element | Details |
|---|---|
| Logo + name | `⬡ CodeTrack` — small, non-intrusive |
| Session info | Code (monospace) + session name |
| Live indicator | Small green dot + "Live" text |
| Minimize button `[−]` | Animates widget to pill state (`minimizeToPill`) |
| Close button `[×]` | Confirmation prompt → leaves session |

#### B. Current Task Section (Prominently displayed)
| Element | Details |
|---|---|
| Task title | Bold (`--text-lg`), with `★` marker for the latest task |
| "NEW" badge | Indigo pill badge, fades out after 30 seconds |
| Description | If provided, shown in `--text-secondary` below title |
| Entry animation | New task slides in from top (`slideInUp`) with a notification sound |

#### C. Status Buttons
| Button | Color | Behavior |
|---|---|---|
| `✅ Done` | Green bg when active | Click → marks task as done, sends to server |
| `🔄 Working` | Amber bg when active | Click → marks as in-progress |
| `❌ Stuck` | Red bg when active | Click → marks as stuck, expands issue text input |

- Only ONE status active at a time (radio-button behavior)
- Active button: filled background with status color + white text
- Inactive buttons: outline style with subtle border
- Transition between states: `statusPulse` animation (brief scale bump + color change)

#### D. Issue Text Area (Only visible when "Stuck" is selected)
| Element | Details |
|---|---|
| Text area | 2-3 lines, dark background, placeholder: "Describe your issue..." |
| Send button | Small indigo `[Send →]` button |
| Max length | 500 characters, character count shown |
| Behavior | Slides down with `expandDown` when "Stuck" clicked, collapses when other status selected |
| After sending | Brief "Sent!" confirmation, text area stays visible (student can update) |

#### E. Teacher Hints Section (Only visible when hint received)
| Element | Details |
|---|---|
| Header | `💡 Hint from teacher:` with lightbulb icon |
| Hint card | Amber-tinted glass card with the hint text |
| Entry animation | Slides in from top with amber glow (`hintGlow`) |
| Multiple hints | Stacked vertically, newest at top |

#### F. Previous Tasks (Collapsed accordion)
| Element | Details |
|---|---|
| Task rows | Collapsed by default — show title + status icon |
| Click to expand | Shows full task details + status buttons (can change status retroactively) |
| Completed tasks | Green tint on the row, checkmark icon |

#### G. Footer
| Element | Details |
|---|---|
| Connection info | `⬡ Connected as Roll 23 - Ayush` |
| Offline state | `🔴 Reconnecting...` with animated dots |

---

## 11. Shared Components

Components used across both teacher and student interfaces:

### 11.1 Component List

| Component | Used By | Description |
|---|---|---|
| **StatusBadge** | Teacher + Student | Colored pill showing status (Done/Working/Stuck/Pending) with icon |
| **SessionCodeDisplay** | Teacher + Student | Monospace code display with copy button |
| **GlassCard** | Teacher + Student | Reusable glass-morphism card container |
| **Toast** | Teacher + Student | Notification popup (top-right, auto-dismiss) |
| **Modal** | Teacher | Confirmation dialogs (end session, remove student) |
| **TextInput** | Teacher + Student | Styled text input with label, validation, focus ring |
| **Button** | Teacher + Student | Primary (filled), secondary (outlined), danger (red) variants |
| **IconButton** | Teacher | Small icon-only buttons (hint, resolve, refresh) |
| **CountBadge** | Teacher | Animated number badge for aggregate counts |
| **ProgressBar** | Teacher (report) | Horizontal progress bar with status color fill |
| **EmptyState** | Teacher + Student | Illustrated empty state with message |
| **LoadingSpinner** | Teacher + Student | Centered spinner for loading states |
| **ConnectionDot** | Teacher + Student | Green/red/gray dot indicating connection status |
| **Tooltip** | Teacher | Small hover tooltips for icon buttons |
| **Accordion** | Teacher + Student | Expandable/collapsible section with smooth animation |
| **CharacterInput** | Student (join) | Individual character box input for session code |

### 11.2 Component Variants

#### Button Variants
| Variant | Background | Border | Text | Usage |
|---|---|---|---|---|
| `primary` | `--accent-primary` | none | white | Main actions (Create Session, Send to All) |
| `secondary` | transparent | `--border-default` | `--text-secondary` | Secondary actions (Cancel, Back) |
| `danger` | `--status-stuck` at 15% opacity | `--status-stuck` | `--status-stuck` | Destructive actions (End Session, Remove) |
| `ghost` | transparent | none | `--text-secondary` | Tertiary actions (minimize, close) |
| `status-done` | `--status-done` at 15% opacity | `--status-done` | `--status-done` | Done status button |
| `status-progress` | `--status-progress` at 15% opacity | `--status-progress` | `--status-progress` | Working status button |
| `status-stuck` | `--status-stuck` at 15% opacity | `--status-stuck` | `--status-stuck` | Stuck status button |

**Active state for status buttons:** Full background color + white text

#### Toast Variants
| Variant | Left Border Color | Icon | Duration |
|---|---|---|---|
| `info` | `--accent-primary` | `info` (Lucide) | 4 seconds |
| `success` | `--status-done` | `check-circle-2` | 3 seconds |
| `warning` | `--status-progress` | `alert-triangle` | 5 seconds |
| `error` | `--status-stuck` | `x-circle` | 6 seconds |
| `task` | `--accent-primary` | `file-text` | 5 seconds (for new task notifications) |

---

## 12. Responsive Behavior

### 12.1 Teacher Dashboard Breakpoints

| Breakpoint | Width | Layout Change |
|---|---|---|
| **Desktop** | ≥ 1024px | Two-column: Task List (60%) + Stuck Panel (40%) side by side |
| **Tablet** | 768px – 1023px | Single column: Task List full width, Stuck Panel below |
| **Mobile** | < 768px | Single column, collapsible sections, student roster hidden by default |

### 12.2 Student Widget

The student widget is inherently responsive — it's designed for a 320×480px window. On different screens:

| Screen | Behavior |
|---|---|
| **Desktop (popup window)** | Opens as separate 360×520 window via `window.open()` |
| **Desktop (same tab)** | Full page layout with max-width 400px, centered |
| **Tablet** | Full page layout, centered, slightly wider (max-width 440px) |
| **Mobile** | Full-width, no minimize/pill feature (stays expanded) |

---

## 13. Notification & Toast System

### 13.1 Teacher Notifications

| Event | Toast Type | Message | Additional |
|---|---|---|---|
| Student joins | `info` | "Ayush (Roll 23) joined the session" | Student count updates |
| Student stuck | `warning` | "Ayush (Roll 23) is stuck on Task 2" | Stuck panel updates |
| Student done | `success` | (No toast — too frequent. Only aggregate count updates) | — |
| Student disconnected | `info` | "Ayush (Roll 23) disconnected" | Roster updates |
| Student reconnected | `info` | "Ayush (Roll 23) reconnected" | Roster updates |
| Task created | `success` | "Task sent to all students" | Task list updates |
| Session ending | `warning` | "Session will end in 5 seconds" | — |

### 13.2 Student Notifications

| Event | Toast Type | Message | Additional |
|---|---|---|---|
| New task | `task` | "New task: Implement push/pop" + sound | Task slides into widget |
| Hint received | `info` | "💡 Teacher sent you a hint" | Hint card appears in widget |
| Issue resolved | `success` | "Teacher resolved your issue" | Status changes to in_progress |
| Session ending | `warning` | "Session ended by teacher" | Widget closes, back to join page |
| Disconnected | `error` | "Connection lost. Reconnecting..." | Persistent until reconnected |
| Reconnected | `success` | "Reconnected!" | Auto-dismiss after 2 seconds |

### 13.3 Notification Sound

- **One sound file:** A short, subtle notification "ding" (< 50KB, WAV or MP3)
- **When played:** New task arrival only (not on every status update)
- **Volume:** Low (0.3 of max) — non-intrusive
- **Mutable:** Small speaker icon in widget header to mute/unmute

---

## 14. Loading & Empty States

### 14.1 Loading States

| Where | Loading Indicator | Description |
|---|---|---|
| Page load | Full-screen centered spinner | Logo + spinner + "Loading CodeTrack..." |
| Creating session | Button inline spinner | Button text changes to "Creating..." with spinner |
| Joining session | Button inline spinner | Button text changes to "Joining..." with spinner |
| Dashboard initial load | Skeleton cards | Task list and stuck panel show gray animated pulse skeletons |
| Sending hint | Inline spinner | Send button shows spinner, then checkmark |

**Skeleton animation:** Subtle left-to-right shimmer effect on gray placeholder blocks (200ms cycle).

### 14.2 Empty States

| Where | Content | Visual |
|---|---|---|
| No tasks yet (teacher) | "No tasks yet. Add your first task to get started!" | Clipboard icon + text |
| No students joined (teacher) | "Waiting for students to join... Share the code: TR7-X2K" | Users icon + code display |
| No stuck students (teacher) | "✨ All students progressing well!" | Sparkle icon, green-tinted card |
| No tasks yet (student) | "Waiting for teacher to add a task..." | Clock icon + subtle animation |
| No session history (teacher) | "No sessions yet. Create your first session!" | Calendar icon + create button |
| No hints (student) | (Section not shown at all until first hint) | — |

---

## 15. Micro-Interactions Catalog

Every small interaction detail that makes the app feel polished:

| Interaction | Element | Effect |
|---|---|---|
| Button hover | All buttons | Background lightens + subtle translateY(-1px) lift |
| Button click | All buttons | Brief scale(0.97) → back to 1 (tactile feel) |
| Input focus | All text inputs | Border color transitions to `--border-focus`, glow appears |
| Code character typed | Join page code input | Character box briefly scales up + border glows, auto-advances to next box |
| Copy to clipboard | Session code copy button | Icon changes from "copy" to "check" for 2 seconds |
| Status button toggle | Student widget | Active button fills with color (200ms), previously active button unfills |
| Aggregate count change | Teacher dashboard count badges | Number briefly highlights with a scale bump + color flash |
| Student pill online → offline | Teacher roster | Smooth color transition green → gray (300ms) |
| Task expanded/collapsed | Teacher dashboard accordion | Smooth height animation with content fade |
| Card hover | History page session cards | Subtle translateY(-2px) + shadow deepens |
| Drag widget | Student pill | Widget follows cursor with slight lag (smooth movement), opacity drops to 0.8 during drag |
| Drop widget (snap to edge) | Student pill | Brief bounce animation on snap |
| Scroll | Task list (if overflows) | Custom thin scrollbar matching theme colors |
| Error shake | Join page (invalid code) | Horizontal shake animation (3 cycles, 50ms each) on the code inputs |
| Success check | After successful action | Green checkmark icon scales in with spring animation |

---

## 16. Accessibility

| Requirement | Implementation |
|---|---|
| **Keyboard navigation** | All interactive elements reachable via Tab, activated via Enter/Space |
| **Focus indicators** | Visible focus rings on all focusable elements (indigo outline, 2px offset) |
| **ARIA labels** | All icon-only buttons have `aria-label` descriptions |
| **Status announcements** | New tasks and status changes announced via `aria-live="polite"` regions |
| **Color contrast** | All text meets WCAG AA (4.5:1 for body text, 3:1 for large text) |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)` disables all animations, keeps instant transitions |
| **Screen reader text** | Status icons have visually hidden text equivalents ("Done", "In Progress", "Stuck") |

---

## 17. File Structure

```
codetrack/
├── public/
│   ├── index.html                     # Single HTML file — both teacher and student entry
│   │
│   ├── teacher/
│   │   ├── index.html                 # Teacher standalone HTML
│   │   ├── styles/
│   │   │   ├── teacher-layout.css     # Dashboard grid, panel layouts
│   │   │   ├── teacher-components.css # Task cards, stuck panel, roster
│   │   │   └── teacher-report.css    # Report page specific styles
│   │   └── scripts/
│   │       ├── teacher-app.js         # Teacher app initialization + router
│   │       ├── teacher-dashboard.js   # Dashboard page renderer + logic
│   │       ├── teacher-create.js      # Create session page
│   │       ├── teacher-history.js     # Session history page
│   │       ├── teacher-report.js      # Session report page
│   │       └── teacher-socket.js      # Teacher Socket.IO event handlers
│   │
│   ├── student/
│   │   ├── index.html                 # Student standalone HTML (popup window)
│   │   ├── styles/
│   │   │   ├── student-widget.css     # Widget layout, pill, expanded states
│   │   │   ├── student-join.css       # Join page form styles
│   │   │   └── student-drag.css       # Draggable/snap behavior styles
│   │   └── scripts/
│   │       ├── student-app.js         # Student app initialization + router
│   │       ├── student-join.js        # Join page logic (code input, validation)
│   │       ├── student-widget.js      # Widget page renderer + logic
│   │       ├── student-minimize.js    # Minimize/expand/drag logic
│   │       └── student-socket.js      # Student Socket.IO event handlers
│   │
│   └── shared/
│       ├── styles/
│       │   ├── design-tokens.css      # ALL CSS variables (colors, spacing, typography, animations)
│       │   ├── reset.css              # CSS reset / normalize
│       │   ├── base.css               # Base element styles (body, html, scrollbar)
│       │   ├── components.css         # Shared component styles (buttons, inputs, cards, badges)
│       │   ├── animations.css         # All @keyframes definitions
│       │   └── toast.css              # Toast notification styles
│       ├── scripts/
│       │   ├── router.js              # Hash-based page router
│       │   ├── socket-client.js       # Socket.IO client wrapper (connect, reconnect, event bus)
│       │   ├── api-client.js          # REST API helper (fetch wrapper with error handling)
│       │   ├── toast.js               # Toast notification system
│       │   ├── components.js          # Shared component render functions (buttons, inputs, cards)
│       │   ├── utils.js               # Utility functions (format time, truncate text, escape HTML)
│       │   ├── sound.js               # Notification sound manager
│       │   └── storage.js             # LocalStorage helpers (remember last session, last name/roll)
│       └── assets/
│           ├── notification.mp3       # Notification sound (< 50KB)
│           └── favicon.svg            # CodeTrack logo favicon
```

---

## 18. Component Dependency Map

### What Renders What

```
TEACHER SIDE:

teacher-app.js (entry point)
    ├── router.js (page routing)
    ├── teacher-socket.js (WebSocket connection)
    │
    ├── teacher-create.js (Create Session Page)
    │   ├── components.js → TextInput, Button, GlassCard
    │   └── api-client.js → POST /api/sessions
    │
    ├── teacher-dashboard.js (Live Dashboard Page)
    │   ├── components.js → GlassCard, StatusBadge, CountBadge, Button, IconButton
    │   ├── components.js → Accordion, Tooltip, Modal
    │   ├── toast.js → Toast notifications
    │   └── teacher-socket.js → all real-time events
    │
    ├── teacher-history.js (History Page)
    │   ├── components.js → GlassCard, Button
    │   └── api-client.js → GET /api/sessions/history/all
    │
    └── teacher-report.js (Report Page)
        ├── components.js → GlassCard, ProgressBar, StatusBadge
        └── api-client.js → GET /api/sessions/:id/report


STUDENT SIDE:

student-app.js (entry point)
    ├── router.js (page routing)
    ├── student-socket.js (WebSocket connection)
    │
    ├── student-join.js (Join Session Page)
    │   ├── components.js → CharacterInput, TextInput, Button, GlassCard
    │   ├── api-client.js → GET /api/sessions/:code, POST /api/sessions/:code/join
    │   └── storage.js → remember last name/roll number
    │
    ├── student-widget.js (Live Widget Page)
    │   ├── components.js → StatusBadge, Button, GlassCard, Accordion
    │   ├── toast.js → Toast notifications
    │   ├── sound.js → Notification sound on new task
    │   └── student-socket.js → all real-time events
    │
    └── student-minimize.js (Widget Minimize/Expand/Drag)
        └── student-widget.js → reads current state
```

### CSS Loading Order

```
1. reset.css          → normalize browser defaults
2. design-tokens.css  → all CSS variables
3. base.css           → html, body, scrollbar, typography base
4. animations.css     → @keyframes definitions
5. components.css     → shared component styles
6. toast.css          → toast-specific styles
7. [page-specific].css → teacher-layout.css OR student-widget.css etc.
```

---

## 19. File Count Summary

| Category | Count | Files |
|---|---|---|
| **HTML files** | 3 | Landing, teacher, student |
| **Shared CSS** | 6 | tokens, reset, base, components, animations, toast |
| **Teacher CSS** | 3 | layout, components, report |
| **Student CSS** | 3 | widget, join, drag |
| **Shared JS** | 8 | router, socket-client, api-client, toast, components, utils, sound, storage |
| **Teacher JS** | 6 | app, dashboard, create, history, report, socket |
| **Student JS** | 5 | app, join, widget, minimize, socket |
| **Assets** | 2 | notification.mp3, favicon.svg |
| **Total** | **36** | |

**Combined with backend (39 files):** Total project = **75 files** — manageable, organized, every file with a single purpose.

---

## Quick Reference: Visual Language Summary

```
DARK GLASSMORPHISM THEME
─────────────────────────
Background:     Deep navy (#0A0E17)
Surfaces:       Frosted glass (blur + transparency)
Text:           Near-white (#F9FAFB) on dark
Accent:         Indigo (#6366F1) for interactive elements
Status Green:   #10B981 (Done)
Status Amber:   #F59E0B (In Progress)
Status Red:     #EF4444 (Stuck)
Borders:        Subtle white at 6-10% opacity
Radius:         6-16px (small to large)
Shadows:        Deep, dark, layered
Font:           Inter (UI) + JetBrains Mono (code)
Icons:          Lucide (inline SVG, 1.75px stroke)
Motion:         Purposeful, 120-400ms, spring easing
Sound:          One subtle notification ding
```
