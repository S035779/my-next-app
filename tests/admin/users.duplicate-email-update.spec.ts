import { test, expect } from '@playwright/test';

function uniqueEmail(prefix = 'e2e') {
  const ts = Date.now();
  return `${prefix}+${ts}@example.com`;
}

async function createUserViaUI(
  page: import('@playwright/test').Page,
  email: string,
  name: string,
) {
  await page.goto('/admin/users/new');
  await expect(page).toHaveURL(/\/admin\/users\/new\/?$/);

  await page.getByTestId('user-email').fill(email);
  await page.getByTestId('user-name').fill(name);
  await page.getByTestId('user-submit').click();

  // 成功すると編集ページへ
  await expect(page).toHaveURL(/\/admin\/users\/\d+\/?(?:\?.*)?$/);
}

test('admin: update email to existing one shows duplicate error (unique constraint)', async ({
  page,
}) => {
  // A, B のユーザーを作る
  const emailA = uniqueEmail('e2e-a');
  const emailB = uniqueEmail('e2e-b');

  await createUserViaUI(page, emailA, 'User A');
  await createUserViaUI(page, emailB, 'User B');

  // いまいるのはBの編集ページのはず。ここで email を A に変更して保存 → 重複エラー
  await expect(page.getByTestId('user-email')).toBeVisible();
  await page.getByTestId('user-email').fill(emailA);

  await page.getByTestId('user-save').click();

  // redirect されず、エラーが出る（update フォームは email-error に testid が無いので id で拾う）
  await expect(page.getByTestId('error-email')).toBeVisible();
  await expect(page.getByTestId('error-email')).toContainText(
    'このメールアドレスは既に使用されています',
  );
});
