import { test, expect } from '@playwright/test';

test('admin can open users list', async ({ page }) => {
  await page.goto('/admin/users');
  await expect(page).toHaveURL(/\/admin\/users/);

  await expect(page.locator('main').getByText('ユーザー管理')).toBeVisible();
});
