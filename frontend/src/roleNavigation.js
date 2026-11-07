export const navigationByRole = {
  parent: ['Parent dashboard', 'Linked specialists', 'Weekly schedule', 'Tasks'],
  specialist: ['Linked children', 'Weekly schedule', 'Assigned tasks', 'Observations'],
  child: ['My tasks', 'My schedule']
};
export function navigationForRole(role) { return navigationByRole[role] || []; }
