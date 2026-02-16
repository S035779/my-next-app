import { test, expect } from '@playwright/test';

function uniqueEmail(prefix = 'e2e-del') {
  return `${prefix}+${Date.now()}@example.com`;
}

async function createUserViaUI(
  page: import('@playwright/test').Page,
  email: string,
) {
  await page.goto('/admin/users/new');
  await expect(page).toHaveURL(/\/admin\/users\/new\/?$/);

  await page.getByTestId('user-email').fill(email);
  await page.getByTestId('user-name').fill('To Delete');
  await page.getByTestId('user-submit').click();

  await expect(page).toHaveURL(/\/admin\/users\/\d+\/?(?:\?.*)?$/);
}

test('admin: delete -> removed from list -> edit page becomes 404', async ({
  page,
}) => {
  const email = uniqueEmail();

  // 1) 作成して編集ページへ
  await createUserViaUI(page, email);

  // 編集URL（/admin/users/:id）を保存
  const editPath = new URL(page.url()).pathname; // 例: /admin/users/123
  expect(editPath).toMatch(/^\/admin\/users\/\d+\/?$/);

  // 2) 削除
  await page.getByTestId('user-delete').click();

  // 3) 一覧に戻る
  await expect(page).toHaveURL(/\/admin\/users\/?(?:\?.*)?$/);

  // 4) 一覧から消えている
  await expect(page.getByRole('link', { name: email })).toHaveCount(0);

  // 5) 削除済みの編集URLに再アクセス → 404
  const res = await page.goto(editPath);
  expect(res).not.toBeNull();
  expect(res!.status()).toBe(404);

  // 画面表示も確認（not-found.tsx の文言に寄せる）
  // 例: "Not Found" や "見つかりません" など。あなたのUIに合わせてどちらか残す。
  await expect(
    page.getByText(/not found|見つかりません|見つからない/i),
  ).toBeVisible();
});
