const bcrypt = require('bcryptjs');
const { openDatabase } = require('./db');
const db = openDatabase();
const demoCount = db.prepare('SELECT COUNT(*) AS count FROM demo_tasks').get().count;
if (!demoCount) {
  db.prepare('INSERT INTO demo_tasks (title) VALUES (?)').run('Read a short story');
  db.prepare('INSERT INTO demo_tasks (title) VALUES (?)').run('Practice drawing for 10 minutes');
}
// Synthetic-only demo accounts. These passwords are exclusively for local coursework testing.
const examples = [
  ['Example Parent', 'parent@example.test', 'parent'],
  ['Example Specialist', 'specialist@example.test', 'specialist'],
  ['Example Child', 'child@example.test', 'child'],
  ['Other Specialist', 'unlinked@example.test', 'specialist']
];
const addUser = db.prepare('INSERT OR IGNORE INTO users (name, email, role, password_hash) VALUES (?, ?, ?, ?)');
for (const [name, email, role] of examples) addUser.run(name, email, role, bcrypt.hashSync('DemoPass123!', 10));
const id = email => db.prepare('SELECT id FROM users WHERE email = ?').get(email).id;
db.prepare('INSERT OR IGNORE INTO children (id, display_name, parent_id, user_id) VALUES (1, ?, ?, ?)')
  .run('Example Child', id('parent@example.test'), id('child@example.test'));
db.prepare('INSERT OR IGNORE INTO specialist_links (child_id, specialist_id, specialist_type) VALUES (1, ?, ?)')
  .run(id('specialist@example.test'), 'teacher');
// Week 8 instructor walkthrough uses fictional records on a fixed date.
const sampleEvent = 'Demo: Speech and reading session';
if (!db.prepare('SELECT 1 FROM events WHERE child_id=1 AND title=?').get(sampleEvent)) {
  db.prepare('INSERT INTO events(child_id,created_by,title,starts_at,ends_at) VALUES(?,?,?,?,?)')
    .run(1, id('parent@example.test'), sampleEvent, '2026-11-18T11:00:00.000Z', '2026-11-18T11:45:00.000Z');
}
const sampleTasks = [
  ['Demo: Practice reading', 'Read a fictional short story aloud.', 'Language', '2026-11-17', 1],
  ['Demo: Draw three shapes', 'Practice drawing circles, squares and triangles.', 'Motor Skills', '2026-11-19', 0]
];
for (const [title, description, area, dueDate, done] of sampleTasks) {
  if (!db.prepare('SELECT 1 FROM tasks WHERE child_id=1 AND title=?').get(title)) {
    db.prepare('INSERT INTO tasks(child_id,assigned_by,title,description,area,due_date,done,completed_at) VALUES(?,?,?,?,?,?,?,?)')
      .run(1, id('parent@example.test'), title, description, area, dueDate, done, done ? '2026-11-17T10:00:00.000Z' : null);
  }
}
console.log('Synthetic demo accounts, events and tasks are ready for Week 8. No real child data is used.');
db.close();
