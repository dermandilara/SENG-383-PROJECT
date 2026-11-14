export function mondayOf(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - ((day + 6) % 7));
  return d.toISOString().slice(0, 10);
}

export function weekDays(weekStart) {
  const monday = new Date(weekStart + 'T00:00:00.000Z');
  if (Number.isNaN(monday.getTime())) return [];
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);
    day.setUTCDate(day.getUTCDate() + index);
    return { date: day.toISOString().slice(0, 10), label: day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }) };
  });
}

export function shiftWeek(weekStart, offset) {
  const day = new Date(weekStart + 'T00:00:00.000Z');
  day.setUTCDate(day.getUTCDate() + 7 * offset);
  return day.toISOString().slice(0, 10);
}

export function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}
