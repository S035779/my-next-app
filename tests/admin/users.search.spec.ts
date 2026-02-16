import { test, expect } from '@playwright/test';

test('admin users search works (email/name) and keeps q on pagination', async ({
  page,
}) => {
  // まず一覧
  await page.goto('/admin/users?page=1');
  await expect(page.getByTestId('page-title')).toHaveText('ユーザー管理');

  // 検索：seed の user1@example.com を狙う
  await page.getByTestId('user-search-input').fill('user1');
  await page.getByTestId('user-search-submit').click();

  // URLに q が乗る & 1ページ目
  await expect(page).toHaveURL(/\/admin\/users\?page=1(&|.*)q=user1/);

  // 結果が出る（リンクの存在で判定）
  await expect(page.getByTestId('user-link-3')).toBeVisible();

  // 次へ（データ量によっては disabled になり得るので条件分岐）
  const next = page.getByRole('link', { name: '次へ' });
  const nextDisabled = await next.getAttribute('aria-disabled');

  if (nextDisabled !== 'true') {
    await next.click();
    // q が維持される
    await expect(page).toHaveURL(/\/admin\/users\?page=2(&|.*)q=user1/);
  }

  // クリアで q が消える
  await page.getByTestId('user-search-clear').click();
  await expect(page).toHaveURL(/\/admin\/users\?page=1$/);
});
