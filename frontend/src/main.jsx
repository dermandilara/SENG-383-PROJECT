import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { navigationForRole } from './roleNavigation';
import './style.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('parent@example.test');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [loginError, setLoginError] = useState('');

  async function loadTasks() {
    try {
      const response = await fetch('/api/demo-tasks');
      if (!response.ok) throw new Error('Fetch failed');
      setTasks(await response.json()); setError('');
    } catch { setError('Backend is not available. Start it on port 3001.'); }
  }
  useEffect(() => { loadTasks(); }, []);

  async function addTask(event) {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      const response = await fetch('/api/demo-tasks', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      if (!response.ok) throw new Error('Save failed');
      setTitle(''); await loadTasks();
    } catch { setError('Could not save the demo task.'); }
  }

  async function login(event) {
    event.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error('Wrong email or password.');
      setSession(await response.json());
      setPassword('');
    } catch (e) { setLoginError(e.message); }
  }

  return <main>
    <p className="tag">SENG 383 · v0.1 development</p>
    <h1>Child Development Platform</h1>
    <p>A student prototype using synthetic data only. Real user data is not allowed.</p>
    <section>
      {!session ? <>
        <h2>Login (M1)</h2>
        <form onSubmit={login}>
          <input aria-label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input aria-label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Log in</button>
        </form>
        {loginError && <p role="alert">{loginError}</p>}
        <small>Use the synthetic accounts from README after running the seed script.</small>
      </> : <>
        <h2>Welcome, {session.user.name}</h2>
        <p>Account role: <strong>{session.user.role}</strong></p>
        <nav aria-label="Role navigation"><ul>{navigationForRole(session.user.role).map(item => <li key={item}>{item}</li>)}</ul></nav>
        <p>These screens are placeholders for M2–M8 and do not show protected child data yet.</p>
        <button onClick={() => setSession(null)}>Log out</button>
      </>}
    </section>
    <section>
      <h2>v0.0 demo tasks (synthetic data only)</h2>
      <p>This public technical demo is separate from the protected M4 module.</p>
      <form onSubmit={addTask}>
        <input aria-label="Demo task title" maxLength={120} placeholder="Enter a demo task" value={title} onChange={e => setTitle(e.target.value)} />
        <button>Add demo task</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <ul>{tasks.map(t => <li key={t.id}>{t.title}</li>)}</ul>
    </section>
  </main>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
