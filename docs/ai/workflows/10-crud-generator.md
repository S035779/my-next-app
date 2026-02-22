# Workflow: CRUD Generator

Input:

- docs/features/\<resource>.md（feature spec）
- docs/database/erd.md（必要なら）
- docs/api/openapi.yaml（必要なら）

Steps:

1. specを読み、必要ファイル一覧を確定
2. actions/\<resource> をテンプレ構造で生成
3. db/\<resource>.repo.ts を生成（schemaが必要なら schema.ts 更新）
4. app/api/\<resource> の route を生成（レスポンス統一）
5. admin UI（必要時）を既存 components/admin を再利用して実装
6. ユニットテスト追加
7. pnpm test（必須）、必要に応じて lint/build
8. docs（feature/api/db）更新

Output:

- Summary / Files changed / How to verify / Notes
