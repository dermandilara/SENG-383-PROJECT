# SENG 383 – AI-Assisted Child Development Platform

Team Hexagon: Samet Coşkun, Derman Dilara Arslan, Emre Güven.

## Status and releases

- **v0.0:** React/Vite → Express → SQLite walking skeleton using only synthetic demo tasks. Git tag: `v0.0`.
- **In progress for v0.1:** M1 login/JWT/role-aware UI; M2–M4 to follow. This branch is not a finished v0.1 release.
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

Open http://localhost:5173. Try the login page or add a synthetic demo task and refresh to verify SQLite persistence.

### Synthetic M1 accounts (local learning only)

After `npm run seed`, all these fictional accounts use password `DemoPass123!`:

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

The real task module (M4), specialist link UI (M2), weekly calendar (M3), observations, documents, statistics and AI summaries are **not implemented yet**.

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

GitHub Actions workflows are in `.github/workflows/`. All test and PR changes should be reviewed before merge.

## Documents and Jira

- `docs/SRS.md`: M1–M8 requirements and three critical acceptance flows
- `docs/SDD.md`: architecture, ER/data model and matching sequence diagrams
- `docs/PMP.md`: Jira sprint plan and progress reviews
- Jira: https://hexagon-seng383.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog

## Team Git workflow

Branch names and commit messages begin with a Jira issue key. Changes are proposed via Pull Request and reviewed by another developer before merge into `main`. Only completed, merged work is marked Done in Jira.
