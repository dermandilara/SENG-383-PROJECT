import { test, expect } from 'vitest';
import { navigationForRole } from './roleNavigation';
test('FR-M1-04 children only receive child navigation', () => {
  expect(navigationForRole('child')).toEqual(['My tasks', 'My schedule']);
  expect(navigationForRole('child')).not.toContain('Linked specialists');
});
test('unknown roles get no navigation', () => expect(navigationForRole('admin')).toEqual([]));
