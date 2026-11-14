import { expect, test } from 'vitest';
import { mondayOf } from './weekStart';
test('weekly schedule starts on Monday', () => {
  expect(mondayOf(new Date(2026, 10, 7))).toBe('2026-11-02');
  expect(mondayOf(new Date(2026, 10, 9))).toBe('2026-11-09');
});

import { shiftWeek, weekDays } from './weekStart';
test('seven day calendar starts on Monday and ends Sunday', () => {
  const days=weekDays('2026-11-16');
  expect(days).toHaveLength(7);
  expect(days[0].date).toBe('2026-11-16');
  expect(days[6].date).toBe('2026-11-22');
});
test('previous/next week navigation', () => {
  expect(shiftWeek('2026-11-16',-1)).toBe('2026-11-09');
  expect(shiftWeek('2026-11-16',1)).toBe('2026-11-23');
});
