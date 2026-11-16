# 🎓 EduPulse : Next-Gen Student Intelligence & Placement Engine

> **Product Inspiration:** Hybrid of **EAB Navigate360** (Early Warning & Intervention CRM) + **Superset** (Placement Readiness & Talent Discovery Engine), crafted with the aesthetic precision of **Linear / Raycast** (Dark Zinc, 1px subtle borders, micro-interactions, keyboard navigation).

---

## 🎯 Executive Summary & Pitch to Judges

University administrative teams (Deans, HODs, T&P Placement Officers) currently operate in silos:
- Attendance is in ERP systems
- Assignment scores are inside LMS (Moodle/Canvas)
- Placement preparation is on Google Sheets / Coding portals

**EduPulse unifies all campus telemetry into a single real-time intelligence cockpit with 5,000 live student profiles.**

---

## 🎭 Role-Based Access & Dynamic Views

### 1. 🎓 Student Experience
* **Personalized Dashboard**: "My Academic Health", Attendance Tracker with target calculator (*"Attend 3 more classes to hit 75%"*).
* **AI Career & Skill Navigator**: Personalized placement roadmap based on their aptitude/coding weak spots.
* **🧠 AI Mental Health & Wellness Companion ("Aura")**: 
  * Empathetic, private chat assistant to discuss burnout, exam anxiety, and time management.
  * Sentiment analysis & positive habit tracker (stress level check-in).

### 2. 👨‍🏫 Teacher / Faculty Mentor Experience
* **My Mentee Class Cockpit**: Real-time list of assigned students with live attendance/academic alerts.
* **1-Click Intervention Logging**: Log student meeting notes, assign study buddies, send encouraging check-ins.
* **AI Remedial Plan Generator**: 1-click generation of personalized study schedules for struggling students.

### 3. 🏛️ Dean / Placement Officer (Executive Cockpit)
* Campus-wide analytics across all 5,000 students, department leaderboards, and recruiter drive shortlists.

---

## 📐 Product Architecture & Layout Blueprint

```
+----------------------------------------------------------------------------------------------------+
|  [Logo] EduPulse  | 🔍 Quick Search (Cmd+K) | 🏢 Dept: Computer Science ▾ | 🎓 Sem: All ▾ | 🔔 (3) |
+------------------+---------------------------------------------------------------------------------+
|  SIDEBAR         |  MAIN CONTENT AREA                                                               |
|                  |                                                                                  |
|  📊 Cockpit      |  [ Metric Cards Row: 5,000 Students | Avg CGPA | At-Risk (12%) | Placed Ready ]    |
|  🚨 Early Alert  |  ------------------------------------------------------------------------------- |
|  💼 Placement T&P|  [ Active View Switcher: Tabs / Segmented Controls ]                             |
|  👥 Student 360  |                                                                                  |
|  ⚙️ Settings     |  +-------------------------------------+  +--------------------------------------+  |
|                  |  |  Interactive Visual Canvas          |  |  Actionable Data Feed / Matrix       |  |
|                  |  |  (Risk Scatter / Quadrant Map /     |  |  (Intervention Triage / Talent Pool  |  |
|                  |  |   Placement Bell Curve)             |  |   with Quick Action Buttons)         |  |
|                  |  +-------------------------------------+  +--------------------------------------+  |
|                  |                                                                                  |
|                  |  +----------------------------------------------------------------------------+  |
|                  |  |  Full Data Grid with instant column sorting, multi-badge filters & exports  |  |
|                  |  +----------------------------------------------------------------------------+  |
+------------------+---------------------------------------------------------------------------------+
|  SLIDE-OVER DRAWER (Opens when clicking any student row):                                          |
|  - Student 360 Card (Name, Avatar, Dept, Semester, Email)                                          |
|  - Academic Health Gauge (CGPA, Backlogs, Exam scores)                                             |
|  - Engagement Pulse (LMS login frequency, assignment % vs peers)                                   |
|  - Placement Readiness Radar (Aptitude, Coding, Interview score)                                   |
|  - Action Trigger: "Schedule Mentor Session" or "Mark as Eligible for Google Drive"                |
+----------------------------------------------------------------------------------------------------+
```

---

## 🧩 4 Core Views & Feature Breakdown

### 1. 📊 Executive Cockpit (Overview)
* **High-Level Pulse**: Total student body count (5,000), Average CGPA, Campus-wide Attendance %, Total At-Risk flags.
* **Campus Health Quadrant**: 4-box scatter plot mapping Academic Performance (CGPA) vs Engagement (Attendance/LMS).
  * *High Performer / High Engagement* (Stars)
  * *High Performer / Low Engagement* (Burnout risk)
  * *Low Performer / High Engagement* (Struggling hard-workers who need tutoring)
  * *Low Performer / Low Engagement* (Critical drop-out risk)
* **Department Leaderboard**: Bar comparison across CS, IT, Electronics, Mechanical, Civil.

### 2. 🚨 Early Warning & Intervention CRM (EAB Navigate360 Style)
* **Risk Score Algorithm (0–100)**: Evaluates weighted attendance drop ($<75\%$), active backlogs, and LMS login drop-off.
* **Intervention Triage Pipeline**:
  * Triage cards with severity badges: `CRITICAL RISK` (>40 risk score), `MODERATE`, `SAFE`.
  * **1-Click Intervention Triggers**: "Notify Faculty Mentor", "Draft Academic Warning Email", "Assign Peer Tutor".

### 3. 💼 Placement & Recruiter Engine (Superset Style)
* **Employability Index (0–100)**: Normalized composite score: Coding Skill (30%) + Aptitude (25%) + CGPA (25%) + Mock Interview (20%).
* **Company Drive Criteria Filter**: Instantly match students against hiring criteria (e.g. *Min CGPA: 7.5, Max Backlogs: 0, Min Coding Score: 70%*).
* **Skill Radar Charts**: Visualizing strengths across problem solving, aptitude, and verbal rating.

### 4. 👥 Student 360 & Slide-over Profile Drawer
* Instant search (Student ID e.g. `STU0142` or Full Name).
* Clicking any student row triggers an animated right-side drawer containing the student's complete unified profile across all 5 Supabase tables.

---

## 🗄️ Database Mapping (Direct to your 5 Supabase Tables)

| Supabase Table | Columns Utilized | Frontend Presentation |
|---|---|---|
| `students` | `student_id`, `full_name`, `department`, `semester`, `email` | Profile Header, Filters, Student Badges |
| `academics` | `cgpa`, `backlogs`, `exam_score_avg` | Academic Health Card, Backlog Alert Chips |
| `attendance` | `overall_attendance_pct`, `classes_attended`, `classes_total` | Circular Progress Gauge, Risk Trigger |
| `lms_activity` | `login_frequency_weekly`, `assignment_completion_pct`, `video_watch_rate_pct` | Engagement Velocity Bar, Activity Pulse |
| `placement_metrics` | `aptitude_score`, `coding_score`, `mock_interview_rating` | Employability Score, Skill Radar Graph |

---

## 🛠️ Proposed Tech Stack

| Layer | Technology | Why We Chose It |
|---|---|---|
| **Framework** | **Next.js 14+ (App Router)** or **Vite + React 18** | Blazing fast, industry standard, zero-config deployment to Vercel |
| **Styling** | **Tailwind CSS + Tailwind Animate** | Custom bespoke typography, dark zinc palette (`#09090b`), no template look |
| **Icons** | **Lucide React** | Modern, clean vector iconography matching Linear/Vercel |
| **Charts & Graphs** | **Recharts / Chart.js** | Interactive tooltips, smooth curve transitions, dark-mode native |
| **Data Layer** | **`@supabase/supabase-js`** | Direct client/server queries to your live 5,000 Supabase records |
| **Component Kit** | **Custom Radix UI / Headless primitives** | Accessible dialogs, drawers, dropdowns, tooltips |

---

## 🚀 Step-by-Step Execution Plan

1. **Phase 1: Project Scaffolding**
   - Initialize the modern frontend workspace with Tailwind, Lucide, and Recharts.
   - Configure Supabase client connection using your project credentials.

2. **Phase 2: Core Layout & Navigation**
   - Build the sleek dark-mode layout (collapsible sidebar, global search bar, department/semester filter pills).

3. **Phase 3: Views Implementation**
   - **View 1: Cockpit Overview** (KPI metrics + Quadrant scatter chart).
   - **View 2: Early Warning CRM** (Triage table + 1-click action triggers).
   - **View 3: Placement Talent Engine** (Recruiter filter + Top candidate rankings).

4. **Phase 4: Slide-over Student 360 Drawer**
   - Deep-dive panel displaying individual student telemetry with radial charts.

5. **Phase 5: Polish & Interactions**
   - Add micro-animations, toast notifications on button clicks, instant CSV export, and Vercel readiness.
