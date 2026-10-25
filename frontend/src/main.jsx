import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
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
      const response = await fetch('/api/demo-tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });
      if (!response.ok) throw new Error('Save failed');
      setTitle(''); await loadTasks();
    } catch { setError('Could not save the task.'); }
  }
  return <main><p className="tag">SENG 383 · Week 5</p><h1>Child Development Platform</h1><p>Our v0.0 walking skeleton. Login, roles, and real assigned tasks will be built in later releases.</p><section><h2>Demo tasks (synthetic data)</h2><form onSubmit={addTask}><input aria-label="Demo task title" maxLength={120} placeholder="Enter a demo task" value={title} onChange={e => setTitle(e.target.value)} /><button>Add demo task</button></form>{error && <p role="alert">{error}</p>}<ul>{tasks.map(t => <li key={t.id}>{t.title}</li>)}</ul></section></main>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
