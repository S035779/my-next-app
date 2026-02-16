import { test, expect } from '@playwright/test';

function uniqEmail(prefix = 'e2e') {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
}

test.describe('admin users CRUD (fully testid based)', () => {
  test('作成→一覧 / 重複(create) / 編集 / 重複(update) / 削除→404', async ({
    page,
  }) => {
    await page.goto('/admin/users');
    await expect(page.getByTestId('page-title')).toHaveText('ユーザー管理');

    // =========================================================
    // 1) 作成
    // =========================================================
    const email1 = uniqEmail('user');
    const name1 = 'User One';

    await page.getByTestId('user-new-link').click();
    await page.getByTestId('user-email').fill(email1);
    await page.getByTestId('user-name').fill(name1);
    await page.getByTestId('user-submit').click();

    await expect(page).toHaveURL(/\/admin\/users\/\d+\/?(?:\?.*)?$/);

    // id抽出
    const url1 = page.url();
    const id1 = url1.match(/\/admin\/users\/(\d+)(?:\?.*)?$/)?.[1];
    expect(id1).toBeTruthy();

    // 一覧へ戻る
    await page.goto('/admin/users');

    // testidで取得
    await expect(page.getByTestId(`user-link-${id1}`)).toBeVisible();

    // =========================================================
    // 2) 作成の重複
    // =========================================================
    await page.getByTestId('user-new-link').click();
    await page.getByTestId('user-email').fill(email1);
    await page.getByTestId('user-name').fill('Dup Create');
    await page.getByTestId('user-submit').click();

    const createDupErr = page.getByTestId('error-email');
    await expect(createDupErr).toBeVisible();
    await expect(createDupErr).toHaveAttribute(
      'data-error-code',
      'DUPLICATE_EMAIL',
    );

    // =========================================================
    // 3) 編集
    // =========================================================
    await page.goto('/admin/users');
    await page.getByTestId(`user-link-${id1}`).click();

    const name2 = 'User One Updated';
    await page.getByTestId('user-name').fill(name2);
    await page.getByTestId('user-save').click();

    await expect(page.getByTestId('user-name')).toHaveValue(name2);

    // =========================================================
    // 4) 更新の重複
    // =========================================================
    const email2 = uniqEmail('user2');

    await page.goto('/admin/users/new');
    await page.getByTestId('user-email').fill(email2);
    await page.getByTestId('user-name').fill('User Two');
    await page.getByTestId('user-submit').click();

    await expect(page).toHaveURL(/\/admin\/users\/\d+\/?(?:\?.*)?$/);
    const id2 = page.url().match(/\/admin\/users\/(\d+)(?:\/)?(?:\?.*)?$/)?.[1];
    expect(id2).toBeTruthy();

    await page.getByTestId('user-email').fill(email1);
    await page.getByTestId('user-save').click();

    const updateDupErr = page.getByTestId('error-email');
    await expect(updateDupErr).toBeVisible();
    await expect(updateDupErr).toHaveAttribute(
      'data-error-code',
      'DUPLICATE_EMAIL',
    );

    // =========================================================
    // 5) 削除 → 404
    // =========================================================
    const deletedUrl = page.url(); // id2の編集画面

    await page.getByTestId('user-delete').click();
    await expect(page).toHaveURL(/\/admin\/users\/?(?:\?.*)?$/);

    const res = await page.goto(deletedUrl);
    expect(res?.status()).toBe(404);

    await expect(page.getByTestId('not-found')).toBeVisible();
  });
});
