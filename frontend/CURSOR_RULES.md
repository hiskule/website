# Frontend Architectural & UI Rules (`CURSOR_RULES.md`)

These rules define the strict frontend engineering standards and UI architecture for the HiSkule website (`https://hiskule.skule.ca/`). Every developer and AI assistant editing `frontend/` MUST adhere to these rules without exception.

---

## 1. Strict Separation of Concerns (`TSX + CSS`)
- **Structure & Logic (`.tsx`):** All React component structure, routing, and state/event handling must reside in `.tsx` files. Keep structure clean, readable, and semantic (`<nav>`, `<header>`, `<main>`, `<section>`, `<footer>`).
- **Styling (`.css`):** Keep styling structured and clean. Utilize `index.css` or dedicated component `.css` files for custom styles, grid layouts, and design system variables. Do not clutter `.tsx` components with ad-hoc inline `style={{ ... }}` objects unless dynamically calculating runtime variables.

---

## 2. Design System Adherence (`Academic Kinetic`)
All visual styling must strictly follow our design palette and rules defined in [`frontend/ui_guideline/palette/DESIGN.md`](file:///Users/david/Documents/PG/website/frontend/ui_guideline/palette/DESIGN.md):
- **Primary Color (`Deep Navy`):** `#0B0B3B` — Used for navigation bars, primary structural headers, hero backgrounds, and authoritative brand sections.
- **Secondary Color (`Electric Gold`):** `#F6CC13` — Used exclusively for high-impact calls-to-action (`CTAs`), interactive highlights, active links, and accent borders.
- **Neutral & Surface Colors:**
  - `Pure White` (`#FFFFFF`): Primary content background and card surface.
  - `Subtle Gray` (`#F4F4F9`): Secondary section backgrounds and flat container differentiation.
  - `Ink Black` (`#05051A`): Dark body text on light backgrounds.
- **Typography (`Inter` exclusively):**
  - Implement high-contrast scale: large, heavy-weight headlines (`font-extrabold`, `font-bold`) with tight letter spacing (`-0.01em` to `-0.02em`).
  - Technical labels (`label-bold`) must use all-caps, bold font (`700`), and generous letter spacing (`tracking-widest` / `0.05em`).
- **Elevation & Depth (`No Soft Fuzzy Shadows`):**
  - Use **Tonal Layers** (`White cards on Subtle Gray or Navy backgrounds`) and **Bold Solid Borders** (`2px to 4px solid borders`).
  - Interactive elements shift border colors or invert colors instead of elevating with drop shadows.
- **Shape Language:**
  - Standard cards and buttons use `0.25rem` (`4px`) soft corners (`rounded`).
  - Major architectural blocks or image frames can use `0px` (`sharp`) corners for an engineered, collegiate aesthetic.

---

## 3. Prototype Inspiration (`ui_guideline`)
When updating or building any page, you MUST inspect and draw structural inspiration from the HTML prototypes located in `frontend/ui_guideline/`:
- **Home / Hero Screen:** [`frontend/ui_guideline/home/code.html`](file:///Users/david/Documents/PG/website/frontend/ui_guideline/home/code.html)
- **Events Dashboard:** [`frontend/ui_guideline/events/code.html`](file:///Users/david/Documents/PG/website/frontend/ui_guideline/events/code.html)
- **About & Outreach:** [`frontend/ui_guideline/about_us/code.html`](file:///Users/david/Documents/PG/website/frontend/ui_guideline/about_us/code.html)
- **Meet the Team:** [`frontend/ui_guideline/our_team/code.html`](file:///Users/david/Documents/PG/website/frontend/ui_guideline/our_team/code.html)

---

## 4. ZERO New Features & ZERO Fake Buttons
- **Pure UI Updates ONLY:** Do not invent or add new backend features, unrequested routes, or speculative data models while updating UI.
- **NO Fake Buttons:** Never create dummy buttons that lead nowhere (`e.g., <button onClick={() => {}}>Dummy CTA</button>`). Every interactive button or link MUST route to a real existing page (`/`, `/events`, `/mentor`, `/team`, `/contact`, `/UTHSDC`) or execute a real existing handler. If a design prototype has a placeholder button that does not correspond to an existing route or action, either link it to the relevant existing route or omit/adapt it cleanly.

---

## 5. Responsive Engineering (`Mobile + Desktop in Single Pass`)
- Never split components into `Mobile*.tsx` and `Desktop*.tsx`.
- Use **Fluid Grids** (`grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`) and responsive utility classes (`md:flex`, `lg:grid-cols-2`) to ensure that every screen renders flawlessly on both mobile devices (`320px+`) and desktop screens (`1200px+`).
