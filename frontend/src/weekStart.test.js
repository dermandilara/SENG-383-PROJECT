import { expect, test } from 'vitest';
import { mondayOf } from './weekStart';
test('weekly schedule starts on Monday', () => {
  expect(mondayOf(new Date(2026, 10, 7))).toBe('2026-11-02');
  expect(mondayOf(new Date(2026, 10, 9))).toBe('2026-11-09');
});
