import { test, expect } from '@playwright/test';

function uniqueEmail() {
  const ts = Date.now();
  return `e2e+dup-${ts}@example.com`;
}

test('admin: duplicate email shows validation error (unique constraint)', async ({
  page,
}) => {
  const email = uniqueEmail();

  // 1回目: ユーザー作成（成功）
  await page.goto('/admin/users/new');
  await expect(page).toHaveURL(/\/admin\/users\/new\/?$/);

  await page.getByTestId('user-email').fill(email);
  await page.getByTestId('user-name').fill('First');
  await page.getByTestId('user-submit').click();

  // 成功すると編集ページへ redirect される想定
  await expect(page).toHaveURL(/\/admin\/users\/\d+\/?$/);

  // 2回目: 同じメールで作成（失敗してフォームに留まる）
  await page.goto('/admin/users/new');
  await expect(page).toHaveURL(/\/admin\/users\/new\/?$/);

  await page.getByTestId('user-email').fill(email);
  await page.getByTestId('user-name').fill('Second');
  await page.getByTestId('user-submit').click();

  // redirect されない（= /new のまま）
  await expect(page).toHaveURL(/\/admin\/users\/new\/?$/);

  // 重複メールのエラーが表示される
  const emailErr = page.getByTestId('error-email');
  await expect(emailErr).toBeVisible();
  await expect(emailErr).toContainText('既に使用されています');
});
