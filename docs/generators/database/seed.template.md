# Seed Template

## Inputs

- ADMIN_EMAILS（カンマ区切りなど。扱いは実装に合わせる）
- その他 seed 値（必要なら）

## What to seed

- roles（admin/user）
- adminユーザー（ADMIN_EMAILS）
- E2E用ユーザー（E2E_ADMIN_EMAIL）

## Commands

```bash
pnpm db:seed
pnpm db:seed:test
```

## Verification

- adminでログインできる（Clerk側の制約に合わせる）
- 管理画面でユーザー一覧が表示される
