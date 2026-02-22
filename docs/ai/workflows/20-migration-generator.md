# Workflow: Migration Generator

Input:

- docs/database/schema.md or erd.md の変更点

Steps:

1. schema.ts 更新（必要最小限）
2. pnpm db:generate / pnpm db:migrate の実行手順を提示
3. 互換性とロールバックを書き出す（migration.template.mdに沿う）
