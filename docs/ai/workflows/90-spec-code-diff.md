# Workflow: Spec ↔ Code Diff

Goal:

- docs を正として、コードと不整合を検出する

Check:

- API: openapi.yaml / api-spec.md vs app/api/**
- DB: erd/schema/migrations vs db/schema.ts, repo
- Auth: features/auth.md vs lib/auth/**
- UI: ui-spec.md vs app/admin/**, components/admin/**

Output:

- 差異の一覧
- 影響範囲
- 修正案（docs修正 or code修正）
