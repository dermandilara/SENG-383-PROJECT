const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { openDatabase } = require('./db');
const { authenticate, canAccessChild, secret } = require('./auth');
const { registerModuleRoutes } = require('./modules');

function createApp(db = openDatabase()) {
  const app = express();
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json({ limit: '32kb' }));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', version: 'v0.0' }));

  // Public v0.0 synthetic demo only, not the M4 protected task module.
  app.get('/api/demo-tasks', (_req, res) =>
    res.json(db.prepare('SELECT id, title, done FROM demo_tasks ORDER BY id').all().map(t => ({ ...t, done: !!t.done }))));
  app.post('/api/demo-tasks', (req, res) => {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    if (!title || title.length > 120) return res.status(400).json({ error: 'Title must be 1-120 characters.' });
    const result = db.prepare('INSERT INTO demo_tasks (title) VALUES (?)').run(title);
    return res.status(201).json({ id: Number(result.lastInsertRowid), title, done: false });
  });

  // FR-M1-01, 02, 03: account role comes from SQLite and passwords are checked against salted hashes.
  app.post('/api/auth/login', (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    const user = db.prepare('SELECT id, name, email, role, password_hash FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password_hash))
      return res.status(401).json({ error: 'Invalid email or password.' });
    const token = jwt.sign({ role: user.role }, secret(), { subject: String(user.id), expiresIn: '2h', algorithm: 'HS256' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.get('/api/auth/me', authenticate, (req, res) => {
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
    if (!user || user.role !== req.user.role) return res.status(401).json({ error: 'Account is not active.' });
    return res.json(user);
  });

  // Child access guard shared by upcoming M2–M8 modules.
  app.get('/api/children/:childId', authenticate, (req, res) => {
    const id = Number(req.params.childId);
    if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: 'Invalid child ID.' });
    const access = canAccessChild(db, id, req.user);
    if (!access.allowed) return res.status(403).json({ error: 'Not allowed for this child.' });
    return res.json({ id: access.child.id, displayName: access.child.display_name });
  });

  registerModuleRoutes(app, db);
  return app;
}
module.exports = { createApp };
