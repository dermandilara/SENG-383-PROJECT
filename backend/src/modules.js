const { authenticate, canAccessChild } = require('./auth');

const TYPES = new Set(['teacher', 'psychologist', 'doctor', 'special education teacher', 'coach']);
function readChild(req, res, db, allowedRoles) {
  const id = Number(req.params.childId);
  if (!Number.isSafeInteger(id) || id < 1) { res.status(400).json({ error: 'Invalid child ID.' }); return null; }
  const access = canAccessChild(db, id, req.user);
  if (!access.allowed) { res.status(403).json({ error: 'Not allowed for this child.' }); return null; }
  if (!allowedRoles.includes(req.user.role)) { res.status(403).json({ error: 'Role not permitted.' }); return null; }
  return access.child;
}
function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value + 'T00:00:00Z')) &&
    new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
}
function validTime(value) {
  return typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(value) &&
    !Number.isNaN(Date.parse(value));
}
function registerModuleRoutes(app, db) {
  // List only children belonging to the current account or active specialist links.
  app.get('/api/children', authenticate, (req, res) => {
    let rows;
    if (req.user.role === 'parent')
      rows = db.prepare('SELECT id, display_name AS displayName FROM children WHERE parent_id = ?').all(req.user.id);
    else if (req.user.role === 'child')
      rows = db.prepare('SELECT id, display_name AS displayName FROM children WHERE user_id = ?').all(req.user.id);
    else
      rows = db.prepare('SELECT c.id, c.display_name AS displayName FROM children c JOIN specialist_links s ON s.child_id=c.id WHERE s.specialist_id=?').all(req.user.id);
    return res.json(rows);
  });

  // M2: links are created/deleted by the owning parent only.
  app.get('/api/children/:childId/specialists', authenticate, (req, res) => {
    const child = readChild(req, res, db, ['parent']);
    if (!child) return;
    const rows = db.prepare('SELECT u.id, u.name, u.email, s.specialist_type AS type FROM specialist_links s JOIN users u ON u.id=s.specialist_id WHERE s.child_id=? ORDER BY u.name').all(child.id);
    return res.json(rows);
  });
  app.post('/api/children/:childId/specialists', authenticate, (req, res) => {
    const child = readChild(req, res, db, ['parent']);
    if (!child) return;
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const type = typeof req.body?.type === 'string' ? req.body.type.toLowerCase().trim() : '';
    if (!email || !TYPES.has(type)) return res.status(400).json({ error: 'Valid specialist email and type required.' });
    const specialist = db.prepare("SELECT id,name,email FROM users WHERE email=? AND role='specialist'").get(email);
    if (!specialist) return res.status(404).json({ error: 'Registered specialist not found.' });
    const exists = db.prepare('SELECT 1 FROM specialist_links WHERE child_id=? AND specialist_id=?').get(child.id, specialist.id);
    if (exists) return res.status(409).json({ error: 'Specialist already linked.' });
    db.prepare('INSERT INTO specialist_links(child_id,specialist_id,specialist_type) VALUES(?,?,?)').run(child.id, specialist.id, type);
    return res.status(201).json({ id: specialist.id, name: specialist.name, email: specialist.email, type });
  });
  app.delete('/api/children/:childId/specialists/:specialistId', authenticate, (req, res) => {
    const child = readChild(req, res, db, ['parent']);
    if (!child) return;
    const specialistId = Number(req.params.specialistId);
    if (!Number.isSafeInteger(specialistId) || specialistId < 1) return res.status(400).json({ error: 'Invalid specialist ID.' });
    const result = db.prepare('DELETE FROM specialist_links WHERE child_id=? AND specialist_id=?').run(child.id, specialistId);
    if (!result.changes) return res.status(404).json({ error: 'Specialist link not found.' });
    return res.status(204).send();
  });

  // M3: week is a YYYY-MM-DD start date (Monday selected by frontend).
  app.get('/api/children/:childId/events', authenticate, (req, res) => {
    const child = readChild(req, res, db, ['parent','specialist','child']);
    if (!child) return;
    const week = req.query.week;
    if (!validDate(week)) return res.status(400).json({ error: 'week must be YYYY-MM-DD.' });
    const after = new Date(week + 'T00:00:00.000Z');
    after.setUTCDate(after.getUTCDate()+7);
    const rows = db.prepare('SELECT id,title,starts_at AS startsAt,ends_at AS endsAt FROM events WHERE child_id=? AND starts_at>=? AND starts_at<? ORDER BY starts_at').all(child.id, week+'T00:00:00.000Z', after.toISOString());
    return res.json(rows);
  });
  app.post('/api/children/:childId/events', authenticate, (req, res) => {
    const child = readChild(req, res, db, ['parent','specialist']);
    if (!child) return;
    const { title, startsAt, endsAt } = req.body || {};
    if (typeof title !== 'string' || !title.trim() || title.length > 120 || !validTime(startsAt) || !validTime(endsAt) || Date.parse(startsAt) >= Date.parse(endsAt))
      return res.status(400).json({ error: 'Valid title, start and end are required.' });
    const start = new Date(startsAt).toISOString(), end = new Date(endsAt).toISOString();
    const result = db.prepare('INSERT INTO events(child_id,created_by,title,starts_at,ends_at) VALUES(?,?,?,?,?)').run(child.id, req.user.id, title.trim(), start, end);
    return res.status(201).json({ id: Number(result.lastInsertRowid), title: title.trim(), startsAt:start, endsAt:end });
  });

  // M4: the child completes tasks; authorized assigners can check status.
  app.get('/api/children/:childId/tasks', authenticate, (req, res) => {
    const child = readChild(req, res, db, ['parent','specialist','child']);
    if (!child) return;
    const rows = db.prepare('SELECT id,title,description,area,due_date AS dueDate,assigned_by AS assignedBy,done,completed_at AS completedAt FROM tasks WHERE child_id=? ORDER BY due_date,id').all(child.id);
    return res.json(rows.map(row => ({ ...row, done: !!row.done })));
  });
  app.post('/api/children/:childId/tasks', authenticate, (req, res) => {
    const child = readChild(req, res, db, ['parent','specialist']);
    if (!child) return;
    const { title, description, area, dueDate } = req.body || {};
    if (typeof title !== 'string' || !title.trim() || title.length > 120 ||
        typeof description !== 'string' || description.length > 1000 ||
        typeof area !== 'string' || !area.trim() || area.length > 80 || !validDate(dueDate))
      return res.status(400).json({ error: 'Title, description, area and valid due date are required.' });
    const result = db.prepare('INSERT INTO tasks(child_id,assigned_by,title,description,area,due_date) VALUES(?,?,?,?,?,?)').run(child.id,req.user.id,title.trim(),description,area.trim(),dueDate);
    return res.status(201).json({ id:Number(result.lastInsertRowid),title:title.trim(), description,area:area.trim(),dueDate,done:false,assignedBy:req.user.id });
  });
  app.patch('/api/tasks/:taskId/done', authenticate, (req, res) => {
    if (req.user.role !== 'child') return res.status(403).json({ error: 'Only a child can complete their own tasks.' });
    const id = Number(req.params.taskId);
    if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: 'Invalid task ID.' });
    const task = db.prepare('SELECT id,child_id AS childId FROM tasks WHERE id=?').get(id);
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    const access = canAccessChild(db, task.childId, req.user);
    if (!access.allowed) return res.status(403).json({ error: 'Not your task.' });
    db.prepare('UPDATE tasks SET done=1, completed_at=COALESCE(completed_at, ?) WHERE id=?').run(new Date().toISOString(), id);
    return res.json({ id, done:true });
  });
}
module.exports = { registerModuleRoutes };
