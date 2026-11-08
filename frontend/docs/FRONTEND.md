# UniCompute frontend

This Next.js 16 / React / TypeScript application implements the normal-user UNICOM-35 workspace. It uses the existing Lucide icons and CSS; no new runtime packages were added.

## Run locally

From `E:\Unicompute\UniCompute-Team\frontend`:

```powershell
npm run dev
```

Use the exact Local URL printed by Next.js, normally `http://localhost:3000`. For production, run `npm run build`, then `npm start`. Dependencies are already installed; on a fresh checkout use `npm ci` first.

## Pages

| Route | Purpose |
| --- | --- |
| `/landing` | Public introduction with the animated circuit hero |
| `/login` | Login form with accessible validation and password visibility; separate demo access |
| `/register` | Registration form with name, email, institution, password, and confirmation |
| `/` | Dashboard: CPU/GPU/RAM/credit cards, quick actions, recent jobs, cluster status; no charts |
| `/jobs/new` | Validated submission with live resource cost estimate |
| `/jobs` | Searchable, filterable history with cancellation |
| `/jobs/[id]` | Requested resources, simulated execution timeline, progress and credit accounting |
| `/resources` | Cluster availability and per-job limits |
| `/credits` | Starter credits, reservations, consumption, demo top-ups and ledger |
| `/analytics` | Separate lightweight usage breakdown |
| `/notifications` | Activity derived from the local job history |
| `/profile` | Fictional account information and integration status |
| `/docs` | Quick-start guide and pricing explanation |
| `/support` | Working FAQ disclosures and documentation links |
| `/files` | Clearly labelled future storage integration |

The dashboard remains at its existing `/` route. The public landing page is at `/landing`; Get Started opens `/register`, and Login opens `/login`. Both account pages link to one another and offer the existing demo dashboard. No admin system or subscription billing model is implemented.

The account pages are frontend previews. They validate required fields, email format, registration password length, and matching passwords, and support password visibility and keyboard navigation. No authentication API exists in this repository: valid submissions explicitly report that account registration/sign-in is unavailable. They do not create sessions, persist credentials, or claim that a user has authenticated. Connect these forms to the intended server authentication service before enabling real account access; server-side validation and session management are required. The existing demo workspace remains accessible.

## Design and hero

The Figma dashboard, submission and history frames were inspected in the browser. The implementation retains their sidebar/header/card/form/table structure while applying the requested dark-navy, electric-blue and cyan palette. The main workspace uses white cards and a light background.

The existing image is preserved at `public/images/circuit-hero.png`, referenced as `/images/circuit-hero.png`. Next Image serves optimized variants. Conflicting background-image definitions were removed. Dashboard imagery remains static.

The landing hero preserves the added `public/images/unicompute-landing-background.jpeg` artwork with slow SVG circuit signals, gently pulsing lights and rising light beams inspired by the supplied Pinterest processor preview. It has a dark gradient overlay and a pause/play control. Animation pauses when offscreen or when the tab is hidden. Reduced-motion, data-saving and known slow connections use the static image. Login and registration use static artwork only.

No video asset was present. For video, add an original or licensed seamless loop as `public/videos/unicompute-hero.webm` and/or `public/videos/unicompute-hero.mp4`, then restart/rebuild. See `public/videos/README.md` for encoding and composition guidance. Video is detected on the server and mounted only on the landing page when motion is permitted. Playback uses autoplay, loop, muted and playsInline; unsupported playback, rejected autoplay or delayed readiness falls back to the image. The Pinterest media was not downloaded or hotlinked.

## How the mock scheduler works

- Data lives in localStorage under `unicompute.demo.v1`, scoped to this browser and origin. Server rendering starts with an empty snapshot to avoid hydration mismatch. Invalid or blocked storage produces a visible notice and a usable fallback.
- Each workspace starts with 250 credits and four clearly simulated example jobs. Their previous consumption means the initial available balance is 178.40 credits.
- Each submission receives a UUID-based ID and reserves its full estimated cost. Validation checks required fields, integer resource limits, runtime and available credits.
- Jobs wait at least eight seconds. The scheduler allocates all requested resources in first-in, first-out order. A run completes in 45 seconds; requested wall time is used for the estimate rather than real elapsed time.
- Timestamps allow the queue to catch up after refresh or time away. Active jobs occupy the simulated cluster's 128 CPU cores, 8 GPUs and 512 GB RAM.
- Completed jobs consume the estimate. Pending cancellation costs zero. Running cancellation consumes the elapsed simulated fraction. The explicit failure option stops at 50% and consumes half. Unused reservations return to the available balance.
- Rates are 0.50 credits per CPU-core-hour, 8.00 per GPU-hour and 0.05 per GB-RAM-hour. These are demo rates, not currency prices.
- Local demo top-ups add 100, 250 or 500 credits without taking payment. Web Locks serializes storage mutations across tabs where supported. Real authorization, concurrency and ledger guarantees belong on the backend.

## Code map

- `src/types/hpc.ts`: User, HPCJob, JobSubmission, ResourceAvailability, DashboardData, CreditBalance and asynchronous HPCService contracts.
- `src/lib/scheduler.ts`: pricing, validation, queue transitions, capacity and cancellation accounting.
- `src/data/mock-data.ts`: isolated seed data and fictional profile.
- `src/services/mock-hpc-service.ts`: browser storage and replaceable async service adapter.
- `src/components/HPCProvider.tsx`: polling and hydration-safe UI data.
- `src/components/AppShell.tsx`, `Sidebar.tsx`, `SiteLayout.tsx`: shared workspace and public-page routing.
- `src/components/Hero.tsx`: static dashboard hero.
- `src/components/LandingBackdrop.tsx`, `src/lib/hero-media.ts`, `src/styles/landing.module.css`: landing-only motion and optional video.
- `src/components/AuthPage.tsx`, `AuthForm.tsx`, `src/styles/auth.module.css`: shared account-page layout, form validation, and static artwork.
- `src/components/SubmitJob.tsx`, `JobHistory.tsx`, `JobDetails.tsx`, `JobsTable.tsx`: job workflows.
- `src/styles/workspace.css`, `src/app/globals.css`: consolidated workspace styles and shared tokens.
- `tests/scheduler.test.cjs`: 16 regression tests using Node's built-in test runner; no extra test dependency.

## Verification commands

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

The 16 scheduler tests cover pricing, validation, balance rejection, duplicate IDs, chronological queue replay, capacity, equal-timestamp ordering, cancellation races/refunds, failure charging, clock rollback, storage validation, persistence, unique IDs and storage fallback. TypeScript, ESLint and the production build were run during implementation. Browser verification additionally covers rendered images, form validation, unaffordable submissions, successful job IDs and automatic completion. No actual HPC or payment integration is tested or claimed.

## Backend work remaining

Implement the same `HPCService` interface with authenticated NestJS REST calls. Move all authorization, validation, pricing, reservations, settlement and job ownership checks to the server. Add durable PostgreSQL records through NestJS, payment-provider checkout/webhooks, real file storage and authorized downloads, and server-side Slurm adapters. The frontend must never connect directly to PostgreSQL, Python or Slurm. Treat localStorage credits and job data as untrusted demonstration data.

The new landing-page changes are intentionally left uncommitted; no push was performed.
