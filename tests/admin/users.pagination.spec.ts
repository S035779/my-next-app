import { test, expect } from '@playwright/test';

test('admin users pagination works', async ({ page, request }) => {
  const token = process.env.E2E_SEED_TOKEN;
  if (!token) throw new Error('E2E_SEED_TOKEN is required');

  // まず seed（例: 35件追加 → PER_PAGE=20 なら 2ページ目が出る）
  const res = await request.post('/api/test/seed-users', {
    headers: { 'x-e2e-seed-token': token },
    data: { count: 35, prefix: 'e2e-page' },
  });
  expect(res.ok()).toBeTruthy();

  // 一覧へ
  await page.goto('/admin/users?page=1');
  await expect(page.getByTestId('page-title')).toHaveText('ユーザー管理');

  // 次へが有効
  const next = page.getByRole('link', { name: '次へ' });
  await expect(next).toBeVisible();
  await next.click();

  // 2ページ目に遷移
  await expect(page).toHaveURL(/\/admin\/users\?page=2/);

  // 2ページ目でもタイトルは出る（最低限の健全性）
  await expect(page.getByTestId('page-title')).toHaveText('ユーザー管理');
});
