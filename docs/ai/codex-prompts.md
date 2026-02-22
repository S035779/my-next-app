# Codex Prompts (Advanced)

## 1) CRUDを丸ごと生成

docs/features/\<resource>.md を正として読み、
docs/ai/workflows/10-crud-generator.md に従って実装してください。
actions/db/api/ui/tests を生成し、pnpm test を通し、PRテンプレ形式で報告してください。

## 2) ER→Schema→Migration

docs/database/erd.md の変更を反映し、
docs/ai/workflows/20-migration-generator.md に従って schema.ts と migration手順を整備してください。
db:pushは禁止です。

## 3) Seed生成

ADMIN_EMAILS と E2E_* を利用し、
docs/ai/workflows/30-seed-generator.md に従って seed を実装・更新してください。

## 4) Playwright生成

docs/features/\<resource>.md を読んで
docs/ai/workflows/40-playwright-generator.md に従ってE2Eを追加してください。

## 5) Storybook導入（承認後）

依存追加の承認済み前提で、
docs/ai/workflows/50-storybook-generator.md に従って導入し、
主要コンポーネントのstoriesを追加してください。

## 6) docsとコードの差分検出

docs を正として
docs/ai/workflows/90-spec-code-diff.md に従い差分を列挙し、修正案を提示してください。
