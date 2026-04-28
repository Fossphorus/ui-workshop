import { expect, test } from '@playwright/test';

test('tag manager creates a global tag', async ({ page }) => {
  await page.goto('/tags');

  await page.getByLabel('Add tag').click();
  await page.getByLabel('Name').fill('  escalation  ');
  await page.getByLabel('Orange').click();
  await page.getByRole('button', { name: 'Save tag' }).click();

  await expect(page.getByText('"escalation" added')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'escalation' })).toBeVisible();
});

test('tag manager edits and deletes a tag', async ({ page }) => {
  await page.goto('/tags');

  await page.getByLabel('Edit billing').click();
  await page.getByLabel('Name').fill('billing ops');
  await page.getByLabel('Green').click();
  await page.getByRole('button', { name: 'Save tag' }).click();

  await expect(page.getByText('"billing ops" updated')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'billing ops' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete billing ops' }).click();
  await expect(page.getByText('"billing ops" deleted')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'billing ops' })).toHaveCount(0);
});

test('tag manager filters by name and toggles sort mode', async ({ page }) => {
  await page.goto('/tags');

  await page.getByRole('searchbox', { name: 'search text' }).fill('billing');
  await expect(page.getByRole('heading', { name: 'billing' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'priority' })).toHaveCount(0);

  await page.getByRole('searchbox', { name: 'search text' }).fill('');
  await page.locator('ion-segment-button[value="color"]').click();
  await expect(page.getByRole('tab', { name: 'Color' })).toHaveAttribute('aria-selected', 'true');
});

test('edit-user lays out user fields and embedded tags', async ({ page }) => {
  await page.goto('/edit-user');

  await expect(page.getByLabel('Username')).toHaveValue('ada.lovelace');
  await expect(page.getByText('priority')).toBeVisible();
  await expect(page.getByLabel('Role, admin')).toBeVisible();
  await expect(page.getByLabel('Notes')).toHaveValue('Primary technical contact for implementation planning.');
});

test('component browser navigates between workshop routes', async ({ page }) => {
  await page.goto('/edit-user');

  await page.getByLabel('Open components').click();
  await page.getByRole('button', { name: /Tag manager/ }).click();

  await expect(page).toHaveURL(/\/tags$/);
  await expect(page.getByRole('heading', { name: 'Tags' })).toBeVisible();
});

test('edit-contact lays out contact fields, tags, and phone numbers', async ({ page }) => {
  await page.goto('/edit-contact');

  await expect(page.getByLabel('First name')).toHaveValue('Grace');
  await expect(page.getByLabel('Last name')).toHaveValue('Hopper');
  await expect(page.getByText('priority')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Phone 1' })).toHaveValue('555-0142');
  await expect(page.getByRole('textbox', { name: 'Phone 2' })).toHaveValue('555-0188');
  await expect(page.getByLabel('Notes')).toHaveValue('Prefers concise implementation updates by phone.');
});

test('edit-contact can add and remove a phone number', async ({ page }) => {
  await page.goto('/edit-contact');

  await page.getByLabel('Add phone number').click();
  const phone3 = page.locator('input.native-input:not(.cloned-input)').nth(2);
  await phone3.fill('555-0199');
  await expect(phone3).toHaveValue('555-0199');

  await page.getByLabel('Remove phone 3').click();
  await expect(page.getByRole('textbox', { name: 'Phone 3' })).toHaveCount(0);
});
