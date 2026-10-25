import { expect, test } from 'vitest';
import { getCompletedCount } from './demoTasks';
test('counts completed tasks', () => expect(getCompletedCount([{ done: true }, { done: false }])).toBe(1));
