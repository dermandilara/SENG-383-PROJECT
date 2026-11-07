const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
function openDatabase(file = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'app.sqlite')) {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS demo_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('parent', 'specialist', 'child'))
    );
    CREATE TABLE IF NOT EXISTS children (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      display_name TEXT NOT NULL,
      parent_id INTEGER NOT NULL REFERENCES users(id),
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS specialist_links (
      child_id INTEGER NOT NULL REFERENCES children(id),
      specialist_id INTEGER NOT NULL REFERENCES users(id),
      specialist_type TEXT NOT NULL,
      PRIMARY KEY(child_id, specialist_id)
    );
  `);
  return db;
}
module.exports = { openDatabase };
