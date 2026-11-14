# Week 8 — v0.1 Instructor Demo Checklist

**Project:** AI-Assisted Child Development Platform (Hexagon)  
**Demo scope:** M1–M4 ONLY (M5–M8 belong to v0.2).  
**Course assignment:** Week 8 requires the v0.1 GitHub release, the first E2E test running in CI and the live checkpoint for **Group 1**. Group 2's checkpoint is Week 9. Confirm which group your instructor assigned; do not assume Group 1.  
**Submission:** push source, documents, tests and the v0.1 Git tag/release to the team GitHub repository by the relevant Sunday 23:59.

This is a **repeatable rehearsal plan**, not a claim that the instructor has seen the demo. Do not use any real child data.

## 1. Prepare the demonstration laptop

Install Node.js 20+ and Git, and clone the team repository:

```bash
git clone https://github.com/dermandilara/SENG-383-PROJECT.git
cd SENG-383-PROJECT
git switch main
git pull origin main
```

Use two terminals.

**Terminal A:**

```bash
cd backend
npm install
npm run seed
npm start
```

**Terminal B:**

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. The API health page is `http://localhost:3001/api/health`. If running the demo on a new computer, check that both start without errors **before** the presentation.

**Synthetic accounts:** `parent@example.test`, `specialist@example.test`, `child@example.test`, `unlinked@example.test`. Password for each is `DemoPass123!`. Never demonstrate with real family or health records.

Seed creates a fictional parent and child, one linked specialist, one unlinked specialist, a scheduled event titled **Demo: Speech and reading session** on 18 November 2026, and two practice tasks. Choose the calendar week **2026-11-16** to see the event. The script does not duplicate the same named sample records when run twice.

## 2. Live demo — suggested 6–8 minute order

| Step | Show live | Requirement / expected result |
|---|---|---|
| 1 | Open app and log in as `parent@example.test` | **M1**: correct email/password gives parent view; no role is chosen by user |
| 2 | Choose **Week beginning 2026-11-16** | **M3**: a 7-day Monday–Sunday calendar; the fictional reading session is on Wednesday |
| 3 | Show linked specialist list. Link `unlinked@example.test` with type `coach`, then use **Unlink** and confirm | **M2**: registered specialist link/unlink; backend checks an active link on every protected request |
| 4 | Assign a new task with title, description, development area and due date, e.g. `Demo: Match shapes` / `Use toy blocks` / `Motor Skills` / `2026-11-20` | **M4**: task is stored in SQLite and visible with To do status |
| 5 | Log out; log in as `child@example.test` | **M1**: child has only their own calendar and tasks, no specialist management or assignment form |
| 6 | Locate your newly created task and press **Mark done** | **M4**: task changes to Done |
| 7 | Log out; log in as the parent again | **M4**: parent sees the same task's Done status after reload; real persistence |
| 8 | Log in as `specialist@example.test`; add a fictional event for 19 November | **M3**: linked specialist can add events, and the child can see them in the weekly view |
| 9 | Show the GitHub Actions runs and v0.1 release page if they are actually published | **CI + release**: real proof, not a screenshot of invented success |

If time is short, prioritize Steps 1, 3, 4, 5, 6 and 9. The teacher may ask you to refresh the browser or repeat a flow; persisted data must survive.

## 3. Demonstrate authorization, not only buttons

- Invalid password on login returns HTTP 401 and no JWT.
- A specialist with no active link receives HTTP 403 (or a masked 404) when accessing that child's protected resources.
- After unlinking a specialist, that user's existing token does **not** grant continued child access.
- The child cannot upload or assign tasks, and cannot see other children's records.
- The API uses JWT, server-side role checks and SQLite queries; hiding buttons alone is not considered authorization.

The backend tests in `backend/tests/auth.test.js` and `backend/tests/modules.test.js` provide evidence. The Playwright tests in `e2e/` demonstrate the browser-to-Express-to-SQLite flow.

## 4. Acceptance checklist (mark from actual evidence)

- [ ] All M1–M4 flows work on the laptop used for the live demo
- [ ] `npm run seed` populates only synthetic records and is safe to run repeatedly
- [ ] `npm test` passes in `backend` and `frontend`; `npm run build` passes
- [ ] GitHub Actions **backend**, **frontend**, **browser E2E** are green on the final candidate commit
- [ ] A teammate reviews and approves the final PR and it is merged to `main`
- [ ] GitHub tag **v0.1** points to the approved `main` merge commit and a `v0.1` release is published
- [ ] README commands were followed successfully on a clean environment
- [ ] Jira sprint tasks and M1–M4 work packages reflect the actual merged release
- [ ] PMP-3 contains actual progress and the real mid-term Jira board screenshot when the scheduled review occurs
- [ ] Every developer can explain their actual contribution and the team discloses use of coding assistants in the final report

**Do not mark a box complete without proof.** Release publication and the live instructor checkpoint are separate from merely writing this checklist.

## 5. Recovery and fallback

If demo records are already changed, use a **fresh local-only demo database**. In the `backend` terminal, stop the server and use a different `DB_PATH` for a clean SQLite file; then run `npm run seed` and `npm start` using the same `DB_PATH` setting in both commands. Avoid deleting an existing database if it contains work you want to keep.

If login fails, check the seed command, API server on port 3001 and that the password is `DemoPass123!`.

If the calendar appears empty, select **Week beginning 2026-11-16** and verify the seed script was run in the **same backend database file** as the server.

If GitHub is unavailable during the presentation, demo the local working application and later show the real Actions/release links. Do not fabricate green checks.

## 6. What each person can explain

- **Frontend:** Why child/parent/specialist screens differ, the seven-day UI and React state.
- **Backend:** JWT login, seeded user accounts, parent ownership, specialist link check, SQLite `events`/`tasks` tables.
- **Testing:** Jest + Supertest role-boundary tests, Vitest week utilities, Playwright real Chromium flow, GitHub Actions.
- **Process:** Jira epics and issues, Jira-key-prefixed commits, PR peer review, the difference between `v0.0` and `v0.1`.

This is guidance to rehearse; contributors should present the code they actually worked on, not claim other teammates' commit ownership.
