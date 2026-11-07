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
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      child_id INTEGER NOT NULL REFERENCES children(id),
      created_by INTEGER NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      ends_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      child_id INTEGER NOT NULL REFERENCES children(id),
      assigned_by INTEGER NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      area TEXT NOT NULL,
      due_date TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_events_child_start ON events(child_id, starts_at);
    CREATE INDEX IF NOT EXISTS idx_tasks_child_due ON tasks(child_id, due_date);
  `);
  return db;
}
module.exports = { openDatabase };
