import React, { useCallback, useEffect, useState } from 'react';
import { mondayOf, shiftWeek, weekDays, localDateKey } from './weekStart';

async function api(path, token, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { Authorization: 'Bearer ' + token, ...(options.body ? { 'Content-Type': 'application/json' } : {}) }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || ('Request failed: ' + res.status));
  }
  return res.status === 204 ? null : res.json();
}

export default function Workspace({ session }) {
  const token = session.token, role = session.user.role;
  const [children, setChildren] = useState([]);
  const [childId, setChildId] = useState('');
  const [specialists, setSpecialists] = useState([]);
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [week, setWeek] = useState(mondayOf(new Date()));
  const [error, setError] = useState('');
  const [linkEmail, setLinkEmail] = useState('');
  const [linkType, setLinkType] = useState('teacher');
  const [eventTitle, setEventTitle] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('Learning');
  const [dueDate, setDueDate] = useState('');

  const loadChildren = useCallback(async () => {
    try {
      const rows = await api('/api/children', token);
      setChildren(rows); setChildId(prev => rows.some(c => String(c.id) === String(prev)) ? prev : (rows[0] ? String(rows[0].id) : ''));
      setError('');
    } catch (e) { setError(e.message); }
  }, [token]);

  const refresh = useCallback(async () => {
    if (!childId) return;
    try {
      const base = '/api/children/' + childId;
      const requests = [
        api(base + '/events?week=' + encodeURIComponent(week), token),
        api(base + '/tasks', token)
      ];
      if (role === 'parent') requests.push(api(base + '/specialists', token));
      const results = await Promise.all(requests);
      setEvents(results[0]); setTasks(results[1]);
      if (role === 'parent') setSpecialists(results[2]);
      setError('');
    } catch (e) { setError(e.message); }
  }, [childId, week, role, token]);

  useEffect(() => { loadChildren(); }, [loadChildren]);
  useEffect(() => { refresh(); }, [refresh]);

  async function submitLink(event) {
    event.preventDefault();
    try {
      await api('/api/children/' + childId + '/specialists', token, {
        method: 'POST', body: JSON.stringify({ email: linkEmail, type: linkType })
      });
      setLinkEmail(''); await refresh();
    } catch (e) { setError(e.message); }
  }
  async function unlink(id) {
    if (!window.confirm('Remove this specialist?')) return;
    try {
      await api('/api/children/' + childId + '/specialists/' + id, token, { method: 'DELETE' });
      await refresh();
    } catch (e) { setError(e.message); }
  }
  async function submitEvent(event) {
    event.preventDefault();
    try {
      await api('/api/children/' + childId + '/events', token, {
        method: 'POST', body: JSON.stringify({ title: eventTitle, startsAt: new Date(startAt).toISOString(), endsAt: new Date(endAt).toISOString() })
      });
      setEventTitle(''); await refresh();
    } catch (e) { setError(e.message); }
  }
  async function submitTask(event) {
    event.preventDefault();
    try {
      await api('/api/children/' + childId + '/tasks', token, {
        method: 'POST', body: JSON.stringify({ title: taskTitle, description, area, dueDate })
      });
      setTaskTitle(''); setDescription(''); await refresh();
    } catch (e) { setError(e.message); }
  }
  async function done(id) {
    try {
      await api('/api/tasks/' + id + '/done', token, { method: 'PATCH' });
      await refresh();
    } catch (e) { setError(e.message); }
  }

  return <div className="workspace">
    <h3>{role === 'parent' ? 'My children' : role === 'specialist' ? 'Linked children' : 'My schedule and tasks'}</h3>
    {children.length > 0 ?
      <select aria-label="Select child" value={childId} onChange={e => setChildId(e.target.value)}>
        {children.map(c => <option key={c.id} value={c.id}>{c.displayName}</option>)}
      </select> : <p>No linked or owned child records available.</p>}
    {error && <p role="alert" className="error">{error}</p>}

    {childId && role === 'parent' && <section className="subsection">
      <h3>M2 — Linked specialists</h3>
      <form onSubmit={submitLink}>
        <input type="email" aria-label="Specialist email" placeholder="Registered specialist email" value={linkEmail} onChange={e => setLinkEmail(e.target.value)} required />
        <select aria-label="Specialist type" value={linkType} onChange={e => setLinkType(e.target.value)}>
          {['teacher','psychologist','doctor','special education teacher','coach'].map(type => <option key={type}>{type}</option>)}
        </select>
        <button>Link specialist</button>
      </form>
      <ul>{specialists.map(s => <li key={s.id}>{s.name} ({s.type}) <button type="button" onClick={() => unlink(s.id)}>Unlink</button></li>)}</ul>
    </section>}

    {childId && <section className="subsection">
      <h3>M3 — Weekly schedule</h3>
      <div className="week-controls">
        <button type="button" aria-label="Previous week" onClick={() => setWeek(shiftWeek(week, -1))}>← Previous</button>
        <label>Week beginning <input aria-label="Week beginning" type="date" value={week} onChange={e => {
          if (!e.target.value) return;
          const [year, month, day] = e.target.value.split('-').map(Number);
          setWeek(mondayOf(new Date(year, month - 1, day)));
        }} /></label>
        <button type="button" aria-label="Next week" onClick={() => setWeek(shiftWeek(week, 1))}>Next →</button>
      </div>
      <div className="week-grid" aria-label="Seven day weekly schedule">
        {weekDays(week).map(day => {
          const dayEvents = events.filter(event => localDateKey(new Date(event.startsAt)) === day.date);
          return <div className="week-day" key={day.date}>
            <h4>{day.label}</h4>
            {dayEvents.length ? <ul>{dayEvents.map(event => <li key={event.id}>
              <strong>{event.title}</strong>
              <small>{new Date(event.startsAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</small>
            </li>)}</ul> : <p className="empty-day">No events</p>}
          </div>;
        })}
      </div>
      {role !== 'child' && <form onSubmit={submitEvent}>
        <input aria-label="Event title" placeholder="Event title" value={eventTitle} onChange={e => setEventTitle(e.target.value)} required />
        <input aria-label="Event start" type="datetime-local" value={startAt} onChange={e => setStartAt(e.target.value)} required />
        <input aria-label="Event end" type="datetime-local" value={endAt} onChange={e => setEndAt(e.target.value)} required />
        <button>Add event</button>
      </form>}
    </section>}

    {childId && <section className="subsection">
      <h3>M4 — Tasks</h3>
      <ul>{tasks.map(t => <li key={t.id}>
        <strong>{t.title}</strong> — {t.area}, due {t.dueDate} — {t.done ? 'Done' : 'To do'}
        {role === 'child' && !t.done && <button type="button" onClick={() => done(t.id)}>Mark done</button>}
      </li>)}</ul>
      {role !== 'child' && <form onSubmit={submitTask}>
        <input aria-label="Task title" placeholder="Task title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required />
        <input aria-label="Task description" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input aria-label="Development area" placeholder="Development area" value={area} onChange={e => setArea(e.target.value)} required />
        <input aria-label="Task due date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
        <button>Assign task</button>
      </form>}
    </section>}
  </div>;
}
