# CRUD Generator Checklist

- [ ] docs/features/\<resource>.md を作成/更新した
- [ ] actions/\<resource> をテンプレ構造で実装した（core/types/validation/index/test）
- [ ] repo は db/\<resource>.repo.ts に閉じ込めた（actionsからのみ呼ぶ）
- [ ] API は validation → actions → response の薄い構造
- [ ] 認可: admin系は API route 先頭で requireAdmin
- [ ] レスポンス形式: {ok,data}/{ok,error} に統一
- [ ] migration（DB変更時）: db:generate → db:migrate
- [ ] seed（必要時）: ADMIN_EMAILS / テスト用
- [ ] pnpm test（必須）、必要に応じて pnpm lint / pnpm build
- [ ] PRテンプレの項目を満たす出力（Summary/Why/How to verify など）