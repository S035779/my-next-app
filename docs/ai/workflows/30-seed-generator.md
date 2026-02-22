# Workflow: Seed Generator

Input:

- ADMIN_EMAILS / E2E_* の要件
- docs/features/*（権限要件）

Steps:

1. seedが必要なエンティティを列挙
2. src/db/seed.ts の既存方針に合わせて実装/更新
3. pnpm db:seed / db:seed:test の確認手順を提示
