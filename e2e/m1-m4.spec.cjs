const { test, expect } = require('@playwright/test');

test('M1–M4 synthetic flow: parent links specialist, assigns task, child marks done', async ({ page }) => {
  const name='Synthetic E2E task '+Date.now();
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email' }).fill('parent@example.test');
  await page.getByRole('textbox', { name: 'Password' }).fill('DemoPass123!');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByText('Account role:')).toBeVisible();

  await page.getByRole('textbox', { name: 'Specialist email' }).fill('unlinked@example.test');
  await page.getByRole('button', { name: 'Link specialist' }).click();
  await expect(page.getByText('Other Specialist')).toBeVisible();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Unlink' }).last().click();
  await expect(page.getByText('Other Specialist')).toHaveCount(0);

  await page.getByRole('textbox', { name: 'Task title', exact:true }).fill(name);
  await page.getByRole('textbox', { name: 'Task description' }).fill('A synthetic assignment');
  await page.getByRole('textbox', { name: 'Development area' }).fill('Learning');
  await page.getByLabel('Task due date').fill('2026-11-12');
  await page.getByRole('button', { name: 'Assign task' }).click();
  await expect(page.getByText(name)).toBeVisible();

  await page.getByRole('button', { name: 'Log out' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('child@example.test');
  await page.getByRole('textbox', { name: 'Password' }).fill('DemoPass123!');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByText(name)).toBeVisible();
  const taskRow = page.getByRole('listitem').filter({ hasText: name });
  await taskRow.getByRole('button', { name: 'Mark done' }).click();
  await expect(taskRow).toContainText('Done');
});

test('M3 real seven-day view and linked specialist creates an event', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email' }).fill('specialist@example.test');
  await page.getByRole('textbox', { name: 'Password' }).fill('DemoPass123!');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByText('Account role:')).toBeVisible();
  await page.getByLabel('Week beginning').fill('2026-11-16');
  const grid = page.getByLabel('Seven day weekly schedule');
  await expect(grid.locator('.week-day')).toHaveCount(7);
  await expect(grid.getByText('Demo: Speech and reading session')).toBeVisible();

  const title = 'Synthetic specialist workshop ' + Date.now();
  await page.getByRole('textbox', { name: 'Event title' }).fill(title);
  await page.getByLabel('Event start').fill('2026-11-19T10:00');
  await page.getByLabel('Event end').fill('2026-11-19T11:00');
  await page.getByRole('button', { name: 'Add event' }).click();
  await expect(grid.getByText(title)).toBeVisible();

  await page.getByRole('button', { name: 'Log out' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('child@example.test');
  await page.getByRole('textbox', { name: 'Password' }).fill('DemoPass123!');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByLabel('Week beginning').fill('2026-11-16');
  await expect(page.getByLabel('Seven day weekly schedule').getByText(title)).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Event title' })).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Specialist email' })).toHaveCount(0);
});
