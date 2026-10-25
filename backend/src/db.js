const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
function openDatabase(file = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'app.sqlite')) {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.exec('CREATE TABLE IF NOT EXISTS demo_tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0)');
  return db;
}
module.exports = { openDatabase };
