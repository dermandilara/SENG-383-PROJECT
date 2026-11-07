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
console.log('Synthetic demo tasks and accounts are ready. No real child data is used.');
db.close();
