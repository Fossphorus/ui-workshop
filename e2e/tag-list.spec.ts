import { expect, test } from '@playwright/test';

test('adds an existing tag from the mobile picker', async ({ page }) => {
  await page.goto('/tags');

  await expect(page.getByRole('heading', { name: 'Ada Lovelace' })).toBeVisible();
  await page.getByLabel('Add tag').click();
  await page.getByRole('searchbox', { name: 'search text' }).fill('billing');
  await page.getByRole('button', { name: /billing/ }).click();

  await expect(page.getByText('"billing" added')).toBeVisible();
});

test('scenario drawer switches to empty state', async ({ page }) => {
  await page.goto('/tags');

  await page.getByLabel('Open scenarios').click();
  await page.getByRole('button', { name: /No tags/ }).click();

  await expect(page.getByText('no tags')).toBeVisible();
});
