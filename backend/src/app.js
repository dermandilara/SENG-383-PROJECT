const express = require('express');
const cors = require('cors');
const { openDatabase } = require('./db');
function createApp(db = openDatabase()) {
  const app = express();
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json());
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', version: 'v0.0' }));
  // Demo only: real task assignment and authorization belong to M4.
  app.get('/api/demo-tasks', (_req, res) => res.json(db.prepare('SELECT id, title, done FROM demo_tasks ORDER BY id').all().map(t => ({ ...t, done: !!t.done }))));
  app.post('/api/demo-tasks', (req, res) => {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    if (!title || title.length > 120) return res.status(400).json({ error: 'Title must be 1-120 characters.' });
    const result = db.prepare('INSERT INTO demo_tasks (title) VALUES (?)').run(title);
    return res.status(201).json({ id: Number(result.lastInsertRowid), title, done: false });
  });
  return app;
}
module.exports = { createApp };
