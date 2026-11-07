const request = require('supertest');
const bcrypt = require('bcryptjs');
const { createApp } = require('../src/app');
const { openDatabase } = require('../src/db');
let db, app, ids;
beforeEach(() => {
  db = openDatabase(':memory:');
  const create = db.prepare('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)');
  const hash = bcrypt.hashSync('TestPass123!', 4);
  ids = {};
  for (const role of ['parent', 'child', 'specialist']) {
    ids[role] = Number(create.run(role, role + '@example.test', hash, role).lastInsertRowid);
  }
  ids.unlinked = Number(create.run('unlinked', 'unlinked@example.test', hash, 'specialist').lastInsertRowid);
  db.prepare('INSERT INTO children (id,display_name,parent_id,user_id) VALUES(1,?,?,?)').run('Test Child', ids.parent, ids.child);
  db.prepare('INSERT INTO specialist_links(child_id,specialist_id,specialist_type) VALUES(?,?,?)').run(1, ids.specialist, 'teacher');
  app = createApp(db);
});
afterEach(() => db.close());
async function login(role) {
  const email = role + '@example.test';
  const response = await request(app).post('/api/auth/login').send({ email, password: 'TestPass123!', role: 'parent' });
  return response.body.token;
}
test('FR-M1-01 valid login gives role from database, not client body', async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'child@example.test', password: 'TestPass123!', role: 'parent' });
  expect(res.status).toBe(200);
  expect(res.body.user.role).toBe('child');
  expect(res.body.token).toBeTruthy();
});
test('FR-M1-02 invalid login cannot get a token', async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'parent@example.test', password: 'wrong' });
  expect(res.status).toBe(401);
  expect(res.body.token).toBeUndefined();
});
test('FR-M1-05 protected endpoint rejects missing/invalid token', async () => {
  expect((await request(app).get('/api/auth/me')).status).toBe(401);
  expect((await request(app).get('/api/auth/me').set('Authorization', 'Bearer badtoken')).status).toBe(401);
});
test('FR-M1-06 parent, child and linked specialist can view child, unlinked cannot', async () => {
  for (const role of ['parent', 'child', 'specialist']) {
    const token = await login(role);
    expect((await request(app).get('/api/children/1').set('Authorization', 'Bearer ' + token)).status).toBe(200);
  }
  const unlinked = await login('unlinked');
  expect((await request(app).get('/api/children/1').set('Authorization', 'Bearer ' + unlinked)).status).toBe(403);
});
test('FR-M2-05 removing link immediately denies specialist data', async () => {
  const token = await login('specialist');
  db.prepare('DELETE FROM specialist_links WHERE child_id=1 AND specialist_id=?').run(ids.specialist);
  expect((await request(app).get('/api/children/1').set('Authorization', 'Bearer ' + token)).status).toBe(403);
});
