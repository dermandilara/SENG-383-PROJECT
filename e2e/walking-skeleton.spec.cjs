const { test, expect } = require('@playwright/test');

test('Week 5 browser → API → SQLite persists after refresh', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Child Development Platform' })).toBeVisible();

  const taskName = 'Synthetic browser task ' + Date.now();
  await page.getByRole('textbox', { name: 'Demo task title' }).fill(taskName);
  await page.getByRole('button', { name: 'Add demo task' }).click();
  await expect(page.getByText(taskName)).toBeVisible();

  await page.reload();
  await expect(page.getByText(taskName)).toBeVisible();
});
