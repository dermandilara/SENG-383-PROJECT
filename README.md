# SENG 383 – AI-Assisted Child Development Platform

Team Hexagon: Samet Coşkun, Derman Dilara Arslan, Emre Güven.

## Status and releases

- **v0.0:** React/Vite → Express → SQLite walking skeleton using only synthetic demo tasks. Git tag: `v0.0`.
- **Week 7 implementation merged to main:** M1 login/JWT/role-aware UI and initial M2–M4 authorized API/screens. These are a **v0.1 candidate**, not a published `v0.1` release; the Week 8 checkpoint/acceptance review is still pending.
- **Planned v0.2:** M5–M8.

## Requirements

Node.js 20+ and npm. No Docker or cloud deployment.

## Run locally

Open two terminal windows from this project root.

**Terminal 1 — backend**

```bash
cd backend
npm install
npm run seed
npm start
```

The API runs at http://localhost:3001. Open http://localhost:3001/api/health for a JSON health response.

**Terminal 2 — frontend**

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Use the synthetic accounts below. To show the Week 8 calendar choose **Week beginning: 2026-11-16** (the app shows a 7-day Monday–Sunday view). Example events and tasks appear after `npm run seed`. The separate v0.0 demo task area is only displayed before login.

### Synthetic M1 accounts (local learning only)

After `npm run seed`, all these fictional accounts use password `DemoPass123!` (local coursework only):

| Email | Role | Purpose |
|---|---|---|
| parent@example.test | parent | Owns Example Child |
| specialist@example.test | specialist | Linked to Example Child |
| child@example.test | child | Example Child's account |
| unlinked@example.test | specialist | Deliberately not linked; used for authorization tests |

**Do not enter real children's personal information.** These demo credentials are not for public deployment. For non-local environments, configure a strong `JWT_SECRET`; the fallback is for local study only.

## API endpoints

- `GET /api/health`: health response
- `GET /api/demo-tasks`, `POST /api/demo-tasks`: public v0.0 synthetic demo only
- `POST /api/auth/login`: JWT on valid seeded email/password
- `GET /api/auth/me`: authenticated account
- `GET /api/children/:childId`: child access authorization example; 403 if not owned/linked/own account
- `GET /api/children`: list only children available to the logged-in role
- `GET/POST/DELETE /api/children/:childId/specialists`: M2 parent link management
- `GET/POST /api/children/:childId/events`: M3 weekly events
- `GET/POST /api/children/:childId/tasks`, `PATCH /api/tasks/:taskId/done`: M4 tasks

M2 specialist link/unlink, M3 weekly events and M4 task assignment/completion have initial working endpoints and basic role-aware screens and were reviewed and merged in the Week 7 implementation PR. They still require Week 8 release acceptance. M5–M8 remain unimplemented.

## Tests

```bash
cd backend && npm test
cd ../frontend && npm test && npm run build
```

```bash
# From the project root, use the installed Playwright test runner
npm install --no-save @playwright/test@1.58.2
npx playwright install chromium
npx playwright test
```

GitHub Actions workflows are in `.github/workflows/`. The Playwright E2E workflow seeds synthetic accounts automatically. All test and PR changes should be reviewed before merge.

### Instructor Week 8 walkthrough

See [docs/WEEK8_DEMO.md](docs/WEEK8_DEMO.md) for the exact demo order, expected outcomes, reset steps, common questions, acceptance checklist and fallback if the demo machine cannot connect. The fixed fictional example event is on 18 November 2026; the seed script is idempotent. A tag/release named `v0.1` must only be published **after** the instructor-demo candidate passes CI and teammate review.

## Documents and Jira

- `docs/SRS.md`: M1–M8 requirements and three critical acceptance flows
- `docs/SDD.md`: architecture, ER/data model and matching sequence diagrams
- `docs/PMP.md`: Jira sprint plan and progress reviews
- Jira: https://hexagon-seng383.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog

## Team Git workflow

Branch names and commit messages begin with a Jira issue key. Changes are proposed via Pull Request and reviewed by another developer before merge into `main`. Only completed, merged work is marked Done in Jira.
