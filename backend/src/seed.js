const { openDatabase } = require('./db');
const db = openDatabase();
const count = db.prepare('SELECT COUNT(*) AS count FROM demo_tasks').get().count;
if (!count) {
  const add = db.prepare('INSERT INTO demo_tasks (title) VALUES (?)');
  add.run('Read a short story');
  add.run('Practice drawing for 10 minutes');
}
console.log('Synthetic demo data ready.');
db.close();
