# 🛠️ Implementation Plan: UTHSDC 2026 Rubric, Penalties & Zero-Scroll Evaluation Modal

> **Objective:**
> Overhaul the competition judging rubric for **UTHSDC 2026** (25 Points Total) with an interactive **Judging Penalties Checklist** and a **Zero-Scroll Widescreen Cockpit**, while preserving completely independent, dynamic rubrics for other events like **Designapalooza**.
>
> **Architectural Principle:**
> Rubrics belong in the competition data (`competition.categories` in MariaDB and seed JSONs), **not hardcoded in JS files**. The evaluation interface dynamically renders the appropriate layout and scoring controls based on whatever categories are configured for the active event.

---

## 📐 1. Official Rubric & Penalty Specifications

### 1.1 Scoring Breakdown (25 Points Max)

| # | Section | Criteria | Max Pts | Levels / Scoring Scale |
| :--- | :--- | :--- | :---: | :--- |
| **1** | **Engineering Design Process** | **1.1 Service Environment & Stakeholder Identification** | **2** | • **0 pts:** Does not identify environment/stakeholders<br>• **1 pt:** Identifies some with limited explanation<br>• **2 pts:** Clearly describes environment & key stakeholders |
| | *(10 Points Total)* | **1.2 Functions, Objectives & Constraints** | **4** | • **0 pts:** Does not identify any FOCs<br>• **1 pt:** Few FOCs with significant errors<br>• **2 pts:** All 3 categories with some errors<br>• **3 pts:** Mostly relevant FOCs with minor errors<br>• **4 pts:** Clearly & accurately identifies all well-defined FOCs |
| | | **1.3 Idea Generation Process** | **3** | • **0 pts:** No potential solutions explained<br>• **1 pt:** Proposed solutions but no brainstorm process<br>• **2 pts:** Multiple solutions with basic process explanation<br>• **3 pts:** Clearly explains idea generation methods |
| | | **1.4 Idea Selection Process** | **1** | • **0 pts:** Does not explain final selection<br>• **1 pt:** Structured selection comparing FOCs |
| **2** | **Feasibility & Functionality** | **2.1 Technical Feasibility** | **4** | • **0 pts:** Not explained sufficiently<br>• **1 pt:** Major technical issues preventing function<br>• **2 pts:** Generally feasible but major challenges unaddressed<br>• **3 pts:** Technically feasible with minor limitations<br>• **4 pts:** Technically feasible, clearly explained |
| | *(6 Points Total)* | **2.2 Implementation & Real-World Impact** | **2** | • **0 pts:** Does not consider implementation or impacts<br>• **1 pt:** Basic discussion (cost, accessibility, sustainability)<br>• **2 pts:** Clearly explains implementation & trade-offs |
| **3** | **Creativity & Innovation** | **3.1 Originality of Solution** | **3** | • **0 pts:** No original or creative elements<br>• **1 pt:** Conventional with minimal modifications<br>• **2 pts:** Demonstrates creativity via meaningful combinations<br>• **3 pts:** Strong creativity via unique approach |
| | *(3 Points Total)* | | | |
| **4** | **Presentation & Communication** | **4.1 Presentation Clarity & Organization** | **2** | • **0 pts:** Difficult to follow, lacks clarity<br>• **1 pt:** Communicates main idea but noticeable issues<br>• **2 pts:** Clear, logically organized, effective |
| | *(6 Points Total)* | **4.2 Understanding & Q&A** | **2** | • **0 pts:** Cannot explain design or answer questions<br>• **1 pt:** Answers basic questions, struggles on decisions<br>• **2 pts:** Accurate answers, demonstrates strong mastery |
| | | **4.3 Visual Aids** | **2** | • **0 pts:** No visual aids provided<br>• **1 pt:** Visual aid lacks detail or clarity<br>• **2 pts:** Clear, detailed visual aid illustrating key features |

---

### 1.2 Official Judging Penalties Checklist

Penalties are enforced as negative deductions from the team's raw rubric score:

| Penalty Identifier | Offense Description | Deduction |
| :--- | :--- | :---: |
| `plagiarism` | **Plagiarism** | **-25 pts** |
| `school_mention` | **Mention School/District During Presentation** | **-10 pts** |
| `disruptive` | **Disruptive Behaviour During Other Presentations** | **-10 pts** |
| `late_docs` | **Documents Received After Deadline** | **-5 pts** |

$$\text{Final Score} = \max\Big(0, \sum \text{Criteria Scores} - \sum \text{Enforced Penalties}\Big)$$

---

### 1.3 3-Part Judge Feedback Structure
In alignment with Page 3 of the Marking Sheet, feedback is split into 3 clear prompts:
1. **Strengths:** Positive highlights, strong engineering or presentation elements.
2. **Areas for Improvement:** Constructive guidance on technical feasibility, methodology, or delivery.
3. **Additional Comments:** General observations or judge remarks.

---

## 🖥️ 2. Zero-Scroll Modal Architecture (Cockpit Design)

### Why the Previous Modal Required Scrolling:
* **Narrow 600px width:** Stacked all inputs in a single long vertical column.
* **Continuous Sliders & Long Descriptions:** Consumed excessive vertical height (~150px per item).
* **`overflow-y: auto`:** Forced judges to scroll up and down repeatedly to verify numbers, write comments, and submit.

### New Zero-Scroll Layout Architecture:
* **Modal Dimensions:** Widescreen viewport modal:
  * `width: min(1380px, 96vw)`
  * `height: min(840px, 90vh)`
  * `overflow: hidden` (No outer modal scrollbars).
* **3-Column Synchronized Dashboard:**
  ```
  +---------------------------------------------------------------------------------------------------------+
  | MODAL HEADER: Evaluating Team 42 | Room 5 | Time: 10:45 AM - 11:00 AM                  [X Close]        |
  +----------------------------------------------------+----------------------------------+-----------------+
  | COLUMN 1: DESIGN & FEASIBILITY (16 pts)           | COLUMN 2: CREATIVITY & COMM (9)  | COLUMN 3: PANEL |
  |                                                    |                                  |                 |
  | 1. ENGINEERING DESIGN PROCESS (/10)                | 3. CREATIVITY & INNOVATION (/3)  | SCORE SUMMARY   |
  |  1.1 Service & Stakeholders (/2)                   |  3.1 Originality (/3)            | Raw:    25 / 25 |
  |      [ 0 ] [ 1 ] [ 2 ]           [ 2 ]/2           |      [ 0 ] [ 1 ] [ 2 ] [ 3 ] [3]/3| Pen:   -10 pts  |
  |  1.2 Functions, Obj & Constraints (/4)             |                                  | Total:  15 / 25 |
  |      [ 0 ] [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 4 ]/4         | 4. PRESENTATION & COMM (/6)      |                 |
  |  1.3 Idea Generation (/3)                          |  4.1 Clarity & Org (/2)          | PENALTIES CHECK |
  |      [ 0 ] [ 1 ] [ 2 ] [ 3 ]       [ 3 ]/3         |      [ 0 ] [ 1 ] [ 2 ]     [2]/2 | [ ] Plagiarism  |
  |  1.4 Idea Selection (/1)                           |  4.2 Understanding & Q&A (/2)    | [x] School Name |
  |      [ 0 ] [ 1 ]                 [ 1 ]/1           |      [ 0 ] [ 1 ] [ 2 ]     [2]/2 | [ ] Disruptive  |
  |                                                    |  4.3 Visual Aids (/2)            | [ ] Late Docs   |
  | 2. FEASIBILITY & FUNCTIONALITY (/6)                |      [ 0 ] [ 1 ] [ 2 ]     [2]/2 |                 |
  |  2.1 Technical Feasibility (/4)                    |                                  | FEEDBACK        |
  |      [ 0 ] [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 4 ]/4         |                                  | [Strengths    ] |
  |  2.2 Implementation & Impact (/2)                  |                                  | [Improvement  ] |
  |      [ 0 ] [ 1 ] [ 2 ]           [ 2 ]/2           |                                  | [Comments     ] |
  |                                                    |                                  |                 |
  |                                                    |                                  | [SAVE EVAL CTA] |
  +----------------------------------------------------+----------------------------------+-----------------+
  ```

### Key UI/UX Innovations for Zero-Scroll:
1. **1-Click Radio Segment Pills (`[0] [1] [2] [3] [4]`):**
   * Instant click selection (replaces imprecise drag sliders).
   * Selected pill highlights in **Electric Gold (`#F6CC13`)** with Deep Navy bold text.
   * Total row height reduced to **~38px** per criterion (6 items in Col 1 = 230px; easily fits in 650px available height).
2. **Two-Way Synchronized Numeric Input Box (Type or Click):**
   * For judges who prefer typing their score, each criterion includes a companion mini input box (e.g. `[ 2 ] / 4`).
   * **Auto-Rounding:** Automatically rounds fractional inputs to whole numbers (`Math.round(...)`).
   * **Range Clamping:** Clamps strictly between `0` and `max_score` (`Math.min(max_score, Math.max(0, Math.round(Number(val))))`).
   * **Bidirectional Sync:** Typing in the box immediately selects and highlights the corresponding pill button; clicking a pill immediately populates the input box.
3. **Contextual Level Helper Tooltips:**
   * Hovering or focusing on any number pill displays a floating tooltip with the exact description from the marking sheet (e.g., hovering `3` on `1.3 Idea Generation` displays: *"Clearly explains idea generation methods used, including how they were applied..."*).
   * Keeps the primary screen clean, compact, and scannable without walls of static text.
4. **Compact Feedback Textareas:**
   * 3 neatly stacked fields (`Strengths`, `Areas for Improvement`, `Additional Comments`) with `rows={2}` and expandable focus.
5. **Live Reactive Header/Footer Summary:**
   * Dynamic score calculation updates in real-time as pills, input boxes, and penalty checkboxes are modified.

---

## 🗄️ 3. Data Architecture & Storage Strategy

### 3.1 Competition Schema (`Competition.categories`)
The `categories` JSON field will store the complete rubric definition, including sections, criteria, max points, level descriptions, and penalty rules:
```json
{
  "total_max_score": 25,
  "sections": [
    {
      "id": "design_process",
      "name": "Engineering Design Process",
      "max_score": 10,
      "criteria": [
        {
          "id": "1.1",
          "name": "Service Environment & Stakeholder Identification",
          "max_score": 2,
          "levels": {
            "0": "Does not identify the service environment or relevant stakeholders.",
            "1": "Identifies the service environment and some relevant stakeholders...",
            "2": "Clearly describes the service environment, identifies key stakeholders..."
          }
        },
        {
          "id": "1.2",
          "name": "Functions, Objectives & Constraints",
          "max_score": 4,
          "levels": {
            "0": "Does not identify any relevant functions, objectives, or constraints.",
            "1": "Identifies a few functions, objectives, or constraints with significant inaccuracies...",
            "2": "Identifies all three categories, but with some inaccuracies...",
            "3": "Correctly identifies mostly relevant functions, objectives, and constraints...",
            "4": "Clearly and accurately identifies well-defined functions, objectives, and constraints..."
          }
        },
        {
          "id": "1.3",
          "name": "Idea Generation Process",
          "max_score": 3,
          "levels": {
            "0": "Does not explain potential solutions and goes straight to proposed solution.",
            "1": "Presents a few proposed solutions but provides no explanation...",
            "2": "Presents multiple potential solutions with basic explanation...",
            "3": "Clearly explains the idea generation methods used..."
          }
        },
        {
          "id": "1.4",
          "name": "Idea Selection Process",
          "max_score": 1,
          "levels": {
            "0": "Does not explain how the final solution was selected.",
            "1": "Explains a structured selection process and compares alternatives using FOCs."
          }
        }
      ]
    },
    {
      "id": "feasibility",
      "name": "Feasibility & Functionality",
      "max_score": 6,
      "criteria": [
        {
          "id": "2.1",
          "name": "Technical Feasibility",
          "max_score": 4,
          "levels": {
            "0": "The proposed solution is not explained sufficiently...",
            "1": "Major technical or practical issues preventing intended function...",
            "2": "Generally feasible but significant technical challenges not considered...",
            "3": "Technically feasible with minor limitations...",
            "4": "Technically feasible, clear explanation, no unresolved challenges."
          }
        },
        {
          "id": "2.2",
          "name": "Implementation & Real-World Impact",
          "max_score": 2,
          "levels": {
            "0": "Does not consider implementation or potential impacts.",
            "1": "Basic discussion of implementation considerations/impacts...",
            "2": "Clearly explains implementation considerations and evaluates real-world trade-offs."
          }
        }
      ]
    },
    {
      "id": "creativity",
      "name": "Creativity & Innovation",
      "max_score": 3,
      "criteria": [
        {
          "id": "3.1",
          "name": "Originality of Solution",
          "max_score": 3,
          "levels": {
            "0": "Demonstrates no original or creative elements.",
            "1": "Conventional, with minimal modifications to existing approaches.",
            "2": "Demonstrates creativity through meaningful modifications/combinations.",
            "3": "Strong creativity through unique approach or innovative application."
          }
        }
      ]
    },
    {
      "id": "presentation",
      "name": "Presentation & Communication",
      "max_score": 6,
      "criteria": [
        {
          "id": "4.1",
          "name": "Presentation Clarity & Organization",
          "max_score": 2,
          "levels": {
            "0": "Difficult to follow and does not clearly communicate.",
            "1": "Communicates main idea but noticeable organization/clarity issues.",
            "2": "Clear, logically organized, effectively communicates solution."
          }
        },
        {
          "id": "4.2",
          "name": "Understanding & Q&A",
          "max_score": 2,
          "levels": {
            "0": "Cannot adequately explain design or respond to questions.",
            "1": "Answers basic questions but struggles to explain/justify major decisions.",
            "2": "Accurate answers, demonstrates strong understanding, justifies decisions."
          }
        },
        {
          "id": "4.3",
          "name": "Visual Aids",
          "max_score": 2,
          "levels": {
            "0": "Does not provide visual aids.",
            "1": "At least one visual aid, but lacks sufficient detail or clarity.",
            "2": "Clear, detailed visual aid effectively illustrating key features."
          }
        }
      ]
    }
  ],
  "penalties": [
    { "id": "plagiarism", "name": "Plagiarism", "deduction": 25 },
    { "id": "school_mention", "name": "Mention School/District During Presentation", "deduction": 10 },
    { "id": "disruptive", "name": "Disruptive Behaviour During Other Presentations", "deduction": 10 },
    { "id": "late_docs", "name": "Documents Received After Deadline", "deduction": 5 }
  ]
}
```

### 3.2 Evaluation Score Schema (`Score.scores` & `Score.feedback`)
To preserve MariaDB JSON compatibility and ensure clean calculations:
```json
{
  "criteria": {
    "1.1": 2,
    "1.2": 4,
    "1.3": 3,
    "1.4": 1,
    "2.1": 4,
    "2.2": 2,
    "3.1": 3,
    "4.1": 2,
    "4.2": 2,
    "4.3": 2
  },
  "penalties": ["school_mention"],
  "raw_score": 25,
  "penalty_deduction": 10,
  "final_score": 15
}
```
* **Feedback Storage:**
  Can store a structured JSON object or standardized Markdown in `feedback`:
  ```
  ### Strengths
  Great functional prototype and strong understanding of the user problem.

  ### Areas for Improvement
  Provide clearer mitigation strategies for technical hurdles in 2.1.

  ### Additional Comments
  Well-coordinated presentation.
  ```

---

## 🔄 4. Implementation Steps & File Modifications

### Step 1: Update Seed Data & Generator Scripts
* **`backend/data/uthsdc-2026.json`:** Update with the new 25-point rubric schema and penalties list.
* **`backend/scripts/generate-mock-event.js`:** Update rubric generation so `backend/data/uthsdc-test-15j.json` matches the new structure.

### Step 2: Backend Calculation & Export Hardening
* **`backend/utils/leaderboardLogic.js`:**
  * Update score aggregation to support the structured `scores` payload.
  * Compute each team's score as:
    `final_score = Math.max(0, raw_score - penalty_deduction)`.
  * Support backward compatibility if legacy flat score objects exist.
* **`backend/server.js` (`GET /competitions/:id/export-csv`):**
  * Update CSV generation to include:
    * `Team Number`
    * Section 1 Sub-scores (`1.1`, `1.2`, `1.3`, `1.4`)
    * Section 2 Sub-scores (`2.1`, `2.2`)
    * Section 3 Sub-score (`3.1`)
    * Section 4 Sub-scores (`4.1`, `4.2`, `4.3`)
    * `Raw Score (out of 25)`
    * `Penalties Enforced` (names and total deduction)
    * `Final Score (out of 25)`
    * `Strengths`
    * `Areas for Improvement`
    * `Additional Comments`

### Step 3: Judge Scoring Modal Overhaul (`JudgeView.tsx` & `JudgeView.css`)
* Redesign `scoring-modal` into a **widescreen 3-column cockpit**:
  * Set `width: min(1380px, 96vw)`, `height: min(840px, 90vh)`, and `overflow: hidden`.
  * **Dual Input Controls:** 1-click pill buttons (`[0] [1] [2] [3] [4]`) paired with a companion numeric text box (`[ 2 ] / 4`) that auto-rounds decimals (`Math.round`) and strictly clamps inputs to `[0, max_score]`. Bidirectionally synced so typing updates the pills and clicking updates the box.
  * Add hover/focus tooltips for rubric descriptions.
  * Add the **Penalties Checklist** with instant score reduction.
  * Replace single feedback textarea with **3 dedicated fields** (`Strengths`, `Areas for Improvement`, `Additional Comments`).
  * Add real-time score calculation bar (`Raw Score: 25` | `Penalties: -10` | `Final Score: 15 / 25`).

### Step 4: Admin Override Modal Alignment (`TeamOverviewModal.tsx` & `.css`)
* Mirror the new layout in `TeamOverviewModal.tsx` so administrators can inspect and override sub-criteria scores, toggle penalties, and refine the 3-part feedback with matching zero-scroll cockpit ergonomics.

### Step 5: Verification & Testing Checklist
1. **Zero-Scroll Validation:** Open evaluation popup on 13" laptop (1280x800) and desktop (1920x1080) to ensure zero scrolling is required to view, score, and submit.
2. **Penalty Enforcement:** Check penalties and verify live total reflects deductions and never drops below 0.
3. **Leaderboard Live Sync:** Save evaluation and verify the Live Leaderboard updates immediately with the adjusted final score.
4. **CSV Export Check:** Export CSV and verify all 10 sub-criteria, penalty deductions, final scores, and 3 feedback sections export cleanly.
5. **Plesk Deployment Readiness:** Build frontend bundle (`npm run build`) and verify syntax.
