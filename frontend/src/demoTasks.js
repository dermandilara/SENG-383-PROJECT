export function getCompletedCount(tasks) { return tasks.filter(t => t.done === true).length; }
