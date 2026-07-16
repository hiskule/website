# Hi-Skule Frontend

The public website for Hi-Skule, the University of Toronto Engineering Society's engineering outreach and mentorship club.

The frontend is a React and TypeScript single-page application built with Vite. It contains the public club website and the UTHSDC judging interface.

## Getting started

### Requirements

- Node.js 20.19 or newer
- npm (included with Node.js)
- Git

### Clone and run the project

```bash
git clone <repository-url>
cd website/frontend
npm ci
npm run dev
```

Vite will print a local address, normally `http://localhost:5173`.

The `package.json` file is inside `frontend`, so npm commands must be run from that directory. If you want to remain at the repository root, use:

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
```

Use `npm ci` after cloning because it installs the exact dependency versions recorded in `package-lock.json`. Use `npm install <package>` only when intentionally adding or updating a dependency.

### Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reloading. |
| `npm run build` | Type-check the project and create a production build in `dist`. |
| `npm run lint` | Run ESLint across the frontend. |
| `npm run preview` | Serve the production build locally for a final check. |

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

## Application architecture

The project uses a layered, feature-first structure. Dependencies should generally flow downward: `app` composes pages, pages compose feature and shared code, and shared code does not import from pages or features.

```text
src/
├── app/                    # Application composition
│   ├── App.tsx             # Browser router setup
│   ├── layout/             # Shared navigation/footer shell
│   └── routes/             # Route definitions and lazy loading
├── assets/                 # Images and asset export files
├── components/             # Reusable and existing visual components
├── data/                   # Static site copy and display data
├── features/               # Business features with their own API/model code
│   └── judging/
│       ├── api/            # Judging HTTP operations
│       └── model/          # Judging types and default state
├── pages/                  # Route-level page composition
├── shared/                 # App-independent infrastructure and configuration
│   ├── api/                # Generic HTTP client
│   └── config/             # Routes and navigation configuration
├── App.tsx                 # Compatibility entry that exports app/App
├── index.css               # Global reset and document-level styles
└── main.tsx                # React DOM entry point
```

### Layer responsibilities

#### `app`

This layer wires the application together. `AppRoutes.tsx` is the source of truth for which page handles each URL. Pages are lazy-loaded so visitors do not download every page on their first visit. `AppLayout.tsx` renders the navigation, page outlet, footer, and scroll restoration behavior.

#### `pages`

A page corresponds to a route. It should primarily compose sections and features, not contain generic infrastructure. Page-specific styled-components can live beside the page in a `*.style.ts` file.

#### `features`

A feature contains domain behavior that is more substantial than a visual component. For example, judging owns its API operations and domain types. New domain logic should go into an appropriately named feature instead of being embedded in a page component.

#### `components`

This directory contains visual building blocks such as the carousel, navigation, footer, cards, and page sections. A component should own its markup and its adjacent style file. Components that only belong to one feature should eventually live inside that feature rather than becoming globally reusable by default.

#### `shared`

Shared code must be independent of a specific page. Routes, navigation definitions, and the generic HTTP request helper live here. Do not put feature-specific API calls or business rules in `shared`.

#### `data` and `assets`

Static copy, team profiles, events, and mentor section definitions live in `data`. Imported photos and logos live in `assets`. Keeping content outside components makes routine updates possible without rewriting UI logic.

## Pages and routes

| Route | Page | Responsibility |
| --- | --- | --- |
| `/` | Home | Landing hero, organization overview, mission, and highlighted upcoming event. |
| `/event` | Events | Event timeline, descriptions, registration states, and event photo carousels. |
| `/team` | Team | Club mission, executive profiles, contact links, and profile detail modal. |
| `/mentor` | Mentor | Mentor overview, volunteer opportunities, mailing list, and community links. |
| `/contact` | Contact | Social media, Discord, Linktree, and email contact options. |
| `/UTHSDC` | Judge Scoring | Loads judges, rooms, teams, existing scores, and submits UTHSDC judging scores. |

Public navigation routes are defined once in `src/shared/config/routes.ts`. Add or rename a route there first, then update `AppRoutes.tsx`. This prevents the navbar, footer, and router from drifting apart.

## Judging API

The judging page communicates with `https://api.hiskule.skule.ca`.

- `src/shared/api/http.ts` owns the API base URL, JSON parsing, and HTTP error handling.
- `src/features/judging/api/judgingApi.ts` defines judging endpoints.
- `src/features/judging/model/types.ts` defines the data passed through the judging feature.
- `src/pages/Judging/JudgeScoring.tsx` owns page state and renders the form.

Keep raw `fetch` calls out of page components. Add new judging operations to `judgingApi` and expose typed inputs and outputs.

No local environment variables are currently required for the frontend. If environment-specific API URLs are introduced, use a Vite variable such as `VITE_API_BASE_URL`, document it here, and provide a committed `.env.example`. Never commit credentials or private keys.

## Development conventions

- Use TypeScript for all application code and define types at feature boundaries.
- Use PascalCase for React component names and files; use camelCase for functions and values.
- Keep route-level composition in `pages` and domain behavior in `features`.
- Keep reusable infrastructure in `shared`; avoid turning it into a miscellaneous utilities folder.
- Keep styles adjacent to the component or page that owns them.
- Use the centralized `ROUTES` object instead of repeating URL strings.
- Give mapped content stable keys derived from its data rather than array indexes when possible.
- Add meaningful `alt` text to content images and accessible labels to icon-only controls.
- Handle loading and failure states for every network request.
- Do not edit files in `dist` manually; Vite generates that directory during `npm run build`.

## Adding a page

1. Create a route-level component under `src/pages`.
2. Add its path to `src/shared/config/routes.ts`.
3. Lazy-load it and add its route in `src/app/routes/AppRoutes.tsx`.
4. Add it to `PRIMARY_NAVIGATION` only if it belongs in the public navbar and footer.
5. Put substantial domain logic under `src/features/<feature-name>`.
6. Run lint and build before committing.

## Production build

```bash
npm run build
npm run preview
```

The deployable static output is written to `frontend/dist`. Because React Router handles routes in the browser, the production web server must fall back to `index.html` for unknown paths such as `/team` and `/mentor`.

## Troubleshooting

### npm cannot find `package.json`

You are probably in the repository root. Change into the frontend directory:

```bash
cd frontend
npm run dev
```

### `npm run develop` does not work

The development script is named `dev`:

```bash
npm run dev
```

### Dependencies or lockfile are out of sync

From `frontend`, reinstall the locked dependency tree:

```bash
npm ci
```

### A production route returns 404 after refreshing

Configure the host to rewrite unmatched requests to `/index.html`. This is required for client-side routing and is separate from the Vite build itself.
