import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/admin.json';

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD!;

setup('admin auth', async ({ page }) => {
  await page.goto('/sign-in');

  // 👇 Clerk の identifier を確実に拾う
  const identifierInput = page
    .locator(
      'input[name="identifier"], input[type="email"], input[type="text"]',
    )
    .first();

  await expect(identifierInput).toBeVisible({ timeout: 15_000 });
  await identifierInput.fill(ADMIN_EMAIL);

  await page
    .getByRole('button', { name: /continue|sign in/i })
    .first()
    .click();

  // password
  const passwordInput = page.locator('input[type="password"]').first();
  await expect(passwordInput).toBeVisible({ timeout: 15_000 });
  await passwordInput.fill(ADMIN_PASSWORD);

  await page
    .getByRole('button', { name: /continue|sign in/i })
    .first()
    .click();

  await expect(page).not.toHaveURL(/\/sign-in/);

  // 管理画面
  await page.goto('/admin/users');
  await expect(page).toHaveURL(/\/admin\/users/);

  await page.context().storageState({ path: authFile });
});
