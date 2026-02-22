# E2E Spec Template: \<Feature>

## Preconditions

- .env.local に E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD が設定されている
- DBが起動している（docker）
- 必要なら seed 済み

## Scenarios

1. Admin login
2. Navigate to /admin/\<resource>
3. List shows
4. Create
5. Update
6. Delete
7. Pagination/search（該当時）

## Commands

```bash
pnpm exec playwright test
pnpm exec playwright show-report --host 0.0.0.0
```
