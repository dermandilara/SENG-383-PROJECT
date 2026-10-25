# SENG 383 – AI-Assisted Child Development Platform

Team: Hexagon (Samet Coşkun, Derman Dilara Arslan, Emre Güven).

## Week 5: walking skeleton v0.0

This is a small end-to-end demonstration using React/Vite, Express and SQLite. It shows that a browser can create a **synthetic demo task** through an API and store it in a database. It is **not** the completed M4 task module or a real child-data application.

### Requirements
- Node.js 20 or newer
- npm

### Run locally
Open two terminal windows from the project root.

**Terminal 1 – backend**

```bash
cd backend
npm install
npm run seed
npm start
```

Backend runs at http://localhost:3001. Visit http://localhost:3001/api/health for a JSON health check.

**Terminal 2 – frontend**

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173, add a demo task, and refresh to check that SQLite kept the data.

### Tests

```bash
cd backend && npm test
cd ../frontend && npm test && npm run build
```

GitHub Actions runs the same checks in `.github/workflows/week5-ci.yml`.

### Documents and planning
- `docs/PMP.md` — planning and status; Jira source of truth
- `docs/SRS.md` — Week 6 SRS starting outline
- `docs/SDD.md` — Week 6 design starting outline
- Jira: https://hexagon-seng383.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog

### Important
Use **synthetic data only**. Do not enter real children's personal or medical information. M1–M8 feature delivery, proper authorization, AI mock mode, and final testing belong to later releases.

### Team Git workflow
Use one Jira issue per branch and start commit messages with the Jira key. Request PR review before merging into main. After review and successful tests, tag the merged commit `v0.0`.
