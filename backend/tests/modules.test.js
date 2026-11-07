const request = require('supertest');
const bcrypt = require('bcryptjs');
const { createApp } = require('../src/app');
const { openDatabase } = require('../src/db');

let db, app, users;
beforeEach(() => {
  db = openDatabase(':memory:');
  const add = db.prepare('INSERT INTO users(name,email,password_hash,role) VALUES (?,?,?,?)');
  const hash = bcrypt.hashSync('TestPass123!', 4);
  users = {};
  for (const [name,role] of [['parent','parent'],['otherparent','parent'],['specialist','specialist'],['child','child'],['otherchild','child']]) {
    users[name] = Number(add.run(name,name+'@example.test',hash,role).lastInsertRowid);
  }
  db.prepare('INSERT INTO children(id,display_name,parent_id,user_id) VALUES (1,?,?,?)').run('Synthetic Child',users.parent,users.child);
  db.prepare('INSERT INTO children(id,display_name,parent_id,user_id) VALUES (2,?,?,?)').run('Other Child',users.otherparent,users.otherchild);
  app = createApp(db);
});
afterEach(() => db.close());
async function bearer(name) {
  const res = await request(app).post('/api/auth/login').send({ email:name+'@example.test',password:'TestPass123!' });
  if (!res.body.token) throw new Error('Login failed for '+name);
  return 'Bearer '+res.body.token;
}
test('FR-M2-01–05 parent can link/unlink; revocation enforced in API', async () => {
  const parent=await bearer('parent'), specialist=await bearer('specialist');
  let response=await request(app).get('/api/children/1/events?week=2026-11-09').set('Authorization',specialist);
  expect(response.status).toBe(403);
  response=await request(app).post('/api/children/1/specialists').set('Authorization',parent).send({email:'specialist@example.test',type:'teacher'});
  expect(response.status).toBe(201);
  expect((await request(app).get('/api/children/1/specialists').set('Authorization',parent)).body).toHaveLength(1);
  expect((await request(app).get('/api/children/1/events?week=2026-11-09').set('Authorization',specialist)).status).toBe(200);
  expect((await request(app).post('/api/children/1/specialists').set('Authorization',parent).send({email:'not-registered@example.test',type:'teacher'})).status).toBe(404);
  expect((await request(app).post('/api/children/1/specialists').set('Authorization',parent).send({email:'specialist@example.test',type:'teacher'})).status).toBe(409);
  expect((await request(app).delete('/api/children/1/specialists/'+users.specialist).set('Authorization',parent)).status).toBe(204);
  expect((await request(app).get('/api/children/1/events?week=2026-11-09').set('Authorization',specialist)).status).toBe(403);
});
test('FR-M3-01–03 parent creates event; child sees own week, not another child', async () => {
  const parent=await bearer('parent'), child=await bearer('child');
  const result=await request(app).post('/api/children/1/events').set('Authorization',parent).send({
    title:'Synthetic meeting',startsAt:'2026-11-10T12:00:00.000Z',endsAt:'2026-11-10T13:00:00.000Z'
  });
  expect(result.status).toBe(201);
  const events=await request(app).get('/api/children/1/events?week=2026-11-09').set('Authorization',child);
  expect(events.status).toBe(200);
  expect(events.body).toHaveLength(1);
  expect(events.body[0].title).toBe('Synthetic meeting');
  expect((await request(app).get('/api/children/2/events?week=2026-11-09').set('Authorization',child)).status).toBe(403);
  expect((await request(app).post('/api/children/1/events').set('Authorization',child).send({title:'Bad',startsAt:'2026-11-10T12:00:00Z',endsAt:'2026-11-10T13:00:00Z'})).status).toBe(403);
});
test('FR-M4-01–05 parent assigns, child completes and assigner sees done', async () => {
  const parent=await bearer('parent'), child=await bearer('child'), otherchild=await bearer('otherchild');
  const result=await request(app).post('/api/children/1/tasks').set('Authorization',parent).send({
    title:'Read ten pages',description:'Synthetic sample',area:'Learning',dueDate:'2026-11-11'
  });
  expect(result.status).toBe(201);
  const id=result.body.id;
  expect((await request(app).get('/api/children/1/tasks').set('Authorization',child)).body[0].done).toBe(false);
  expect((await request(app).patch('/api/tasks/'+id+'/done').set('Authorization',otherchild)).status).toBe(403);
  expect((await request(app).patch('/api/tasks/'+id+'/done').set('Authorization',parent)).status).toBe(403);
  expect((await request(app).patch('/api/tasks/'+id+'/done').set('Authorization',child)).status).toBe(200);
  expect((await request(app).get('/api/children/1/tasks').set('Authorization',parent)).body[0].done).toBe(true);
});
test('FR-M2 and FR-M4 unrelated parent cannot add links or tasks', async () => {
  const other=await bearer('otherparent');
  expect((await request(app).post('/api/children/1/specialists').set('Authorization',other).send({email:'specialist@example.test',type:'teacher'})).status).toBe(403);
  expect((await request(app).post('/api/children/1/tasks').set('Authorization',other).send({title:'No',description:'',area:'Learning',dueDate:'2026-11-12'})).status).toBe(403);
});

test('FR-M3-02 week filter excludes events outside selected week', async () => {
  const parent=await bearer('parent');
  const first=await request(app).post('/api/children/1/events').set('Authorization',parent).send({
    title:'Week one',startsAt:'2026-11-10T08:00:00.000Z',endsAt:'2026-11-10T09:00:00.000Z'
  });
  const second=await request(app).post('/api/children/1/events').set('Authorization',parent).send({
    title:'Week two',startsAt:'2026-11-17T08:00:00.000Z',endsAt:'2026-11-17T09:00:00.000Z'
  });
  expect(first.status).toBe(201);
  expect(second.status).toBe(201);
  const weekOne=await request(app).get('/api/children/1/events?week=2026-11-09').set('Authorization',parent);
  expect(weekOne.body.map(e=>e.title)).toEqual(['Week one']);
  const weekTwo=await request(app).get('/api/children/1/events?week=2026-11-16').set('Authorization',parent);
  expect(weekTwo.body.map(e=>e.title)).toEqual(['Week two']);
});
