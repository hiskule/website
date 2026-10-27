# 🛠️ Implementation Plan: Scoring Workflow, Admin Override & CSV Export

> **Context & Architectural Shift:**
> Student submissions have moved to **Google Classroom**. The HiSkule platform remains the **single authoritative source of truth** for all judging rubrics, evaluations, and score calculations. Judges score directly on the web app; Admins have full override authority and 1-click CSV export capabilities for publishing back to Google Classroom.

---

## 🎨 Design System Compliance (`DESIGN.md` & `CURSOR_RULES.md`)

All UI updates in this implementation strictly adhere to the **Academic Kinetic** design system:
* **Palette Tokens:**
  * **Primary (Deep Navy):** `#0B0B3B` — Headers, structural containers, and authoritative badges.
  * **Secondary (Electric Gold):** `#F6CC13` — Primary action buttons (`SAVE EVALUATION`, `EXPORT SCORES (CSV)`), active states, and focus rings.
  * **Backgrounds & Surfaces:** `Pure White` (`#FFFFFF`) for content cards and `Subtle Gray` (`#F4F4F9`) for secondary containers.
* **Component Styling:**
  * **Buttons:** High-contrast `Electric Gold` backgrounds with `Deep Navy` bold all-caps labels (`label-bold`, `0.25rem` / `4px` radius, no fuzzy shadows).
  * **Input Fields:** `2px solid` borders shifting to `Electric Gold` on `:focus`.
  * **Separation of Concerns:** Component structures in `.tsx` with dedicated `.css` rules; zero unneeded inline styles.
  * **Non-Destructive:** Existing database columns (`presentation_link`, `team_comments`) are preserved in models and schemas so no historical data is lost.

---

## 📋 Comprehensive Implementation Checklist

### Phase 1: Backend API & Data Layer (`backend/`)
- [x] **1.1 Reuse `POST /judge` for Admin Overrides (No New Endpoint Needed)**
  - Path: `POST /judge`
  - Access Control: Middleware `verifyJudge` already allows `admin` role super-user bypass (`req.user.role === 'judge' || req.user.role === 'admin'`).
  - Accepts: `{ competitionId, judgeId, teamId, scores, feedback }`
  - Logic:
    - Finds existing record by `{ judgeId, teamId }`.
    - If found, executes `existing.update({ scores, feedback })`.
    - If not found, creates new `Score` entry with `{ judgeId, teamId, scores, feedback }`.
  - **MariaDB Compatibility Hardening:**
    - MariaDB stores `DataTypes.JSON` as `LONGTEXT` and returns it as a raw string over the wire.
    - Defensive JSON parsing on `scores` in `POST /judge` response: ensure `s.scores` is parsed into an object before sending response (`typeof s.scores === 'string' ? JSON.parse(s.scores) : s.scores`) so MariaDB never returns raw stringified JSON to the client.
- [x] **1.2 Dynamic CSV Export Endpoint (`GET /competitions/:id/export-csv`)**
  - Path: `GET /competitions/:id/export-csv` (protected by `verifyAdmin`)
  - **MariaDB Compatibility:**
    - Safely parses `competition.categories` (`typeof categories === 'string' ? JSON.parse(categories) : categories`).
    - Safely parses each score record (`typeof s.scores === 'string' ? JSON.parse(s.scores) : s.scores`).
  - Logic:
    1. Fetches the active competition, its rubric categories, rooms, teams, and all associated judge scores.
    2. Builds formatted CSV rows dynamically using category names (e.g., *Team #, Room, Judge, Design Process (10), Aesthetics (5), ..., Total Score, Feedback*).
    3. Proper RFC 4180 escaping for multi-line feedback strings containing commas or quotes (`"..."` with quotes doubled).
    4. Sets headers `Content-Type: text/csv` and `Content-Disposition: attachment; filename="[Competition]_Scores_[Date].csv"`.
- [x] **1.3 Preserve Existing Schemas**
  - Confirm `models/Score.js`, `models/Team.js`, and `models/Competition.js` retain all existing fields without destructive migrations.

---

### Phase 2: Judge Experience Refinement (`frontend/src/pages/PortalDashboard/components/JudgeView.*`)
- [x] **2.1 Remove File Submission Badges**
  - Remove `File Submitted` and `No File Submitted` status pills from the team schedule cards in `JudgeView.tsx`.
  - Cards cleanly display:
    - Time slot (`10:00 AM - 10:15 AM`)
    - `Team {team_number}`
    - Evaluation status badge: `Pending Evaluation` or `Evaluated`
- [x] **2.2 Streamline the Scoring Modal**
  - Remove the entire `<div className="team-materials">` section (`View Presentation` link and `Team Notes`).
  - Keep the focus exclusively on:
    - Modal Title: `Evaluating Team {team_number}`
    - Category score sliders and score numerical indicators (`X / max`)
    - Constructive Feedback textarea
    - Primary CTA: `SAVE EVALUATION` (with loading indicator and auto-close timer)

---

### Phase 3: Admin Score Override System (`frontend/src/pages/MasterDashboard/components/TeamOverviewModal.*`)
- [x] **3.1 Clean Up Submission Placeholders**
  - Remove `handleForceUpload` prompt and presentation link preview block.
- [x] **3.2 Interactive Override Controls**
  - In `TeamOverviewModal.tsx`, convert read-only score cards into editable controls:
    - Allow admin to adjust category numerical scores directly via clean numeric inputs / sliders.
    - Allow admin to edit the feedback text directly.
- [x] **3.3 Explicit Save Mechanism**
  - Add a primary **`SAVE OVERRIDE`** button for each judge evaluation card.
  - Directly dispatches `POST /judge` with `{ competitionId, judgeId, teamId, scores, feedback }`.
  - Refreshes the leaderboard and room scorecards immediately upon resolution.
  - Visual feedback toast: *"Score successfully updated in database."*

---

### Phase 4: 1-Click CSV Export (`frontend/src/pages/MasterDashboard/`)
- [x] **4.1 Export Button Integration**
  - Add an **`📥 EXPORT SCORES (CSV)`** button in `ActiveEventOverview.tsx` (in the header row beside the feedback toggle).
  - Button styling strictly follows `DESIGN.md`:
    - Background: `var(--color-electric-gold)`
    - Text: `var(--color-deep-navy)`
    - Font: `Inter`, `font-weight: 700`, all-caps, `4px` radius.
- [x] **4.2 Download Trigger Handler**
  - Dispatches authorized request to `GET /competitions/:id/export-csv` (or generates client-side CSV download using the fetched event data).
  - Triggers automatic browser file save with name format: `${competition.name}_Scores.csv`.

---

### Phase 5: Testing, Build & Deployment Verification
- [x] **5.1 Local Build Verification**
  - Execute `npm run build` in `frontend/` to confirm zero TypeScript, lint, or bundling errors.
- [ ] **5.2 Database Source of Truth Check**
  - Submit score as a Judge -> Verify persisted in MySQL/MariaDB.
  - Override score as an Admin via `POST /judge` -> Verify updated in MySQL/MariaDB and reflected on Judge & Admin view.
- [ ] **5.3 CSV Validation**
  - Download generated CSV and open in Google Sheets / Excel to verify columns, character encodings, and multi-line comments.
- [ ] **5.4 Git Commit & Deploy**
  - Stage changes, commit with clear descriptive message, push to GitHub, and pull on Plesk server.

*(Note: Student Portal `TeamView.*` remains completely untouched and preserved for potential future use).*

---

## 📊 CSV Export Format Specification

The generated CSV file follows this streamlined schema:

| Column Header | Example Value | Description |
| :--- | :--- | :--- |
| `Team Number` | `Team 1` | Competing team identifier |
| `[Category 1 Name]` | `9 / 10` | Category 1 score out of its category max value |
| `[Category 2 Name]` | `4 / 5` | Category 2 score out of its category max value |
| `...` | `...` | Dynamic columns for all competition categories |
| `Total Score` | `23 / 25` | Total score out of total possible points at the end |
| `Feedback` | `"Great prototype demo, focus more on user testing."` | Quoted feedback string |
