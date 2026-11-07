# Project Management Plan (PMP)

## PMP-1. Project and Team

**Project in one sentence:** A web platform where parents, specialists and children coordinate developmental schedules, activities and reports with role-based access.

**Jira project key:** SCRUM

**Jira board link:** https://hexagon-seng383.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog

### Team and Roles

| Name | Jira / GitHub username | Role |
|---|---|---|
| Samet Coşkun | Jira: sametcoskun / GitHub: sametcoskun | Developer (backend, frontend, design) |
| Derman Dilara Arslan | Jira: Derman Dilara Arslan / GitHub: dermandilara | Developer (frontend, documentation) |
| Emre Güven | Jira: Emre Güven / GitHub: to be verified with Emre | Developer (backend, testing, CI) |

The three developer roles summarize current Jira task assignments. **Course update:** the originally planned SENG 440 external test-team collaboration has been cancelled, as confirmed by the student team. Regular code review and automated testing remain in scope.

## PMP-2. Plan

### Work Packages (Epics)

All eight module epics already exist in Jira. Each has three implementation/test tasks. The **module epic owners** listed below were assigned in Jira on 2026-11-07, matching the agreed task distribution.

| Epic | Jira epic owner | Number of tasks | Planned sprint(s) |
|---|---|---:|---|
| M1 – Login and Roles | Samet | 3 | Sprint 1 (Week 6) |
| M2 – Specialist Links | Emre | 3 | Sprints 2–3 (Weeks 7–8) |
| M3 – Weekly Schedule | Dilara | 3 | Sprints 2–3 (Weeks 7–8) |
| M4 – Assigned Tasks | Samet | 3 | Sprints 2–3 (Weeks 7–8) |
| M5 – Specialist Observations | Emre | 3 | Sprints 4–5 (Weeks 9–10) |
| M6 – Documents | Dilara | 3 | Sprints 4–5 (Weeks 9–10) |
| M7 – Weekly Statistics | Samet | 3 | Sprints 4–5 (Weeks 9–10) |
| M8 – AI Weekly Summaries | Emre | 3 | Sprints 4–5 (Weeks 9–10) |

### Sprint Plan

The Jira board has one sprint per academic week, which is more detailed than the PMP template's four illustrative release stages.

| Sprint | Weeks (2026) | Sprint goal | Ends with |
|---|---|---|---|
| Sprint 0 | Week 5, Oct 26–Nov 1 | Setup, planning, walking skeleton | v0.0 |
| Sprint 1 | Week 6, Nov 2–8 | SRS, SDD, M1 login foundation | SRS/SDD |
| Sprint 2 | Week 7, Nov 9–15 | Develop M2–M4; PMP-3 | PMP-3 |
| Sprint 3 | Week 8, Nov 16–22 | Verify M1–M4 | v0.1 |
| Sprint 4 | Week 9, Nov 23–29 | Build M5–M8; PMP-4 | PMP-4 and peer review |
| Sprint 5 | Week 10, Nov 30–Dec 6 | Verify M1–M8; branch coverage >=40% | v0.2 |
| Sprint 6 | Week 11, Dec 7–13 | Final preparation; PMP-5 | PMP-5 |
| Sprint 7 | Week 12, Dec 14–20 | Final testing; retrospective | v1.0 and PMP-6 |
| Sprint 8 | Week 13, Dec 21–27 | Final demo | Presentation |

**Scheduling note:** The course assignment and newer PMP/SRS/SDD templates show different intermediate week labels. This plan follows the main assignment's release calendar, assuming Week 5 is Oct 26–Nov 1, 2026. Confirm any updated deadline with the instructor.

## PMP-3. Progress Review: Mid-term (v0.1)

**Week 7 progress reviewed:** 2026-11-07. **Final v0.1 checkpoint:** Week 8 / Week 9.

**Jira board screenshot:** A genuine authenticated Jira board screenshot must be saved to `docs/img/jira-midterm.png` during the Week 8/9 review. The board is at https://hexagon-seng383.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog. No screenshot is claimed or fabricated yet.

### Actual progress (updated 2026-11-07)

| Epic | Planned for this point | Status (as checked on 2026-11-07) |
|---|---|---|
| PMP-1 | Project/team/Jira setup and v0.0 skeleton | SCRUM-20, 21, 22 and parent epic SCRUM-5 Done |
| PMP-2 | Sprint plan, SRS/SDD and CI | Sprint plan, SRS/SDD and basic CI merged; epic owner assignments updated in Jira |
| M1 | Login, JWT and role-aware UI by v0.1 | Initial implementation and automated tests merged into main; Week 8 acceptance pending |
| M2 | Parent links/unlinks specialist; API enforces revocation | Initial API/UI and revocation tests merged into main; Week 8 acceptance pending |
| M3 | Create/list selected-week events | Initial API/UI merged into main; week-filter tests and Week 8 acceptance pending |
| M4 | Assign tasks, child completes, assigner sees status | Initial API/UI and workflow tests merged into main; Week 8 acceptance pending |

### Evidence

- v0.0 walking skeleton released: https://github.com/dermandilara/SENG-383-PROJECT/releases/tag/v0.0
- PR #1: React/Express/SQLite and initial docs, reviewed and merged.
- PR #2: Playwright browser-to-database test, reviewed and merged.
- PR #3: Complete SRS, SDD and Week 7 PMP-3 draft, reviewed and merged.
- PR #4: M1 login and role checks, merged with backend/frontend and browser CI passing.
- PR #5: M2–M4 API, UI and integration/E2E tests, reviewed and merged.
- PR #6: Final Week 7 week-filter regression test and document corrections, reviewed and merged. Three CI jobs passed.
- Jira holds the 14 required epics and assigned sprint tasks.
- The v0.0 `demo_tasks` is **not** the required authenticated M4 module. Current `main` now also includes distinct protected M1–M4 functionality, but has **not** been released as `v0.1`.

**Changes to the plan:** Detailed SRS and SDD were added before the first full M1–M4 implementation. The original plan was accelerated to get an initial M1–M4 candidate into `main` before Week 8. Next, the developers must verify the critical flows through automated tests and review, then tag `v0.1` only after acceptance.

**Updated course instruction:** The originally planned external SENG 440 collaboration and its meeting-note requirement were cancelled. No external test-team meeting evidence is expected. The team's normal sprint reviews, GitHub code reviews, Jira updates and automated test evidence are still required.

**Week 7 hand-in status:** PMP-3 initial progress review is complete in writing; GitHub PR #3 merged. The detailed **mid-term evidence screenshot** remains explicitly scheduled for the Week 8/9 checkpoint in the workflow guide, so it is not represented as already captured. Update the table and attach the real screenshot then. The team should follow the newer course cancellation of external test meetings.

## PMP-4. Progress Review: v0.2

**Jira board screenshot:** To be added in `docs/img/`.

| Epic | Planned for this point | Status |
|---|---|---|
| M5–M8 | v0.2 release | Not started / update during review |

**Changes to the plan (if any):** To be updated.

## PMP-5. Progress Review: Final (v1.0)

**Jira board screenshot:** To be added in `docs/img/`.

| Epic | Planned for this point | Status |
|---|---|---|
| M1–M8 | v1.0 release | Not started / update during review |

**Changes to the plan (if any):** To be updated.

## PMP-6. Retrospective

- **What worked well in using Jira:** To be recorded at final evaluation.
- **What we would do differently:** To be recorded at final evaluation.
