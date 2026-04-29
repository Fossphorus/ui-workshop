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

  await page.getByRole('button', { name: /Edit billing/ }).click();
  await page.getByLabel('Name').fill('billing ops');
  await page.getByLabel('Green').click();
  await page.getByRole('button', { name: 'Save tag' }).click();

  await expect(page.getByText('"billing ops" updated')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'billing ops' })).toBeVisible();

  await page.locator('ion-item[aria-label="Edit billing ops"]').click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('Confirm tag deletion?')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm' }).click();
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

test('edit-job-site manages address and associated contacts', async ({ page }) => {
  await page.goto('/edit-job-site');

  await expect(page.getByLabel('Address 1')).toHaveValue('121 Commerce Way');
  await expect(page.getByLabel('City')).toHaveValue('Austin');
  await expect(page.getByText('priority')).toBeVisible();
  await expect(page.getByText('Grace Hopper')).toBeVisible();

  await page.getByRole('button', { name: 'Add contact' }).click();
  await page.getByRole('searchbox', { name: 'search text' }).fill('margaret hamilton');
  await expect(page.getByRole('heading', { name: 'Margaret Hamilton' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Margaret Hamilton' }).click();
  await expect(page.getByText('Contact added')).toBeVisible();
  await expect(page.getByLabel('Associated contacts').getByText('Margaret Hamilton')).toBeVisible();

  await page.getByRole('button', { name: 'Add contact' }).click();
  await page.getByLabel('Create contact').click();
  await page.getByLabel('First name').fill('Dorothy');
  await page.getByLabel('Last name').fill('Vaughan');
  await page.getByLabel('Add phone number').click();
  await page.getByRole('textbox', { name: 'Phone 1' }).fill('555-0111');
  await page.getByLabel('Notes', { exact: true }).fill('New site access contact.');
  await page.getByRole('button', { name: 'Save contact' }).click();
  await expect(page.getByLabel('Associated contacts').getByText('Dorothy Vaughan')).toBeVisible();

  await page.getByLabel('Remove Grace Hopper').click();
  await expect(page.getByText('Grace Hopper')).toHaveCount(0);
});
