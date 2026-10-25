const request = require('supertest');
const { createApp } = require('../src/app');
const { openDatabase } = require('../src/db');
let db, app;
beforeEach(() => { db = openDatabase(':memory:'); app = createApp(db); });
afterEach(() => db.close());
test('v0.0 health endpoint', async () => {
  const response = await request(app).get('/api/health');
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ status: 'ok', version: 'v0.0' });
});
test('can create and list a synthetic task in SQLite', async () => {
  const created = await request(app).post('/api/demo-tasks').send({ title: 'Practice reading' });
  expect(created.status).toBe(201);
  const listed = await request(app).get('/api/demo-tasks');
  expect(listed.body[0]).toEqual(expect.objectContaining({ title: 'Practice reading', done: false }));
});
test('rejects blank titles', async () => {
  const response = await request(app).post('/api/demo-tasks').send({ title: '   ' });
  expect(response.status).toBe(400);
});
