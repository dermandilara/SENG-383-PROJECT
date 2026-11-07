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

The three developer roles summarize current Jira task assignments. SENG 440 testing-team members will be documented after they are confirmed; names are not invented here.

## PMP-2. Plan

### Work Packages (Epics)

All eight module epics already exist in Jira. Each has three implementation/test tasks. The **proposed owners** below are planning suggestions based on assigned tasks, not verified Jira epic assignees. The team should confirm them before finalizing the PMP.

| Epic | Proposed owner | Number of tasks | Planned sprint(s) |
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

**Initial Week 7 review prepared:** 2026-11-07. **Target review after v0.1:** Week 8 / Week 9.

**Jira board screenshot:** A genuine authenticated Jira board screenshot must be saved to `docs/img/jira-midterm.png` during the Week 8/9 review. The board is at https://hexagon-seng383.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog. No screenshot is claimed or fabricated yet.

### Actual progress at the start of Week 7

| Epic | Planned for this point | Status (as checked on 2026-11-07) |
|---|---|---|
| PMP-1 | Project/team/Jira setup and v0.0 skeleton | Subtasks SCRUM-20, 21, 22 Done; epic status to reconcile |
| PMP-2 | Sprint plan, draft SRS/SDD and CI | SCRUM-23 and 26 Done; SRS/SDD full documents under review |
| M1 | Login, JWT and role-aware UI by v0.1 | Not started in main |
| M2 | Parent links/unlinks specialist; API enforces revocation | Not started in main |
| M3 | Create and list weekly events | Not started in main |
| M4 | Assign tasks, child completes, assigner sees status | Not started in main |

### Evidence

- v0.0 walking skeleton released: https://github.com/dermandilara/SENG-383-PROJECT/releases/tag/v0.0
- PR #1: React/Express/SQLite and initial docs, reviewed and merged.
- PR #2: Playwright browser-to-database test, reviewed and merged.
- Jira holds the 14 required epics and assigned sprint tasks.
- The v0.0 `demo_tasks` is **not** the required authenticated M4 module; implementation of M1–M4 is still needed by Week 8.

**Changes to the plan:** Complete the detailed SRS and SDD before beginning feature work, then implement and test M1 before the three dependent M2–M4 modules. Revisit estimates if Week 8 scope is too large. Use PRs and track actual status in Jira.

**SENG 440 test-team meetings:** Actual dated notes have not been provided/committed. Use `docs/meeting-notes-template.md` after each real meeting. Do not claim a meeting that did not happen.

**Week 8/9 completion reminder:** Update this table with the true M1–M4 status and include the actual Jira screenshot. Keep PMP-3 epic open until the mid-term review is genuinely complete.

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
