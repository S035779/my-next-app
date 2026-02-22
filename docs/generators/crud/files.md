# CRUD Generator: Files to Create/Update

対象リソースを `<resource>` とする（例: users, products）。

## actions（必須）

- src/actions/\<resource>/core.ts
- src/actions/\<resource>/types.ts
- src/actions/\<resource>/validation.ts
- src/actions/\<resource>/index.ts
- src/actions/\<resource>/core.test.ts

## db（必須）

- src/db/\<resource>.repo.ts
- （必要なら）src/db/\<resource>.repo.test.ts
- （必要なら）src/db/schema.ts

## api（必須）

- src/app/api/\<resource>/route.ts
- src/app/api/\<resource>/[id]/route.ts

## ui（Admin・必要なら）

- src/app/admin/\<resource>/page.tsx
- src/app/admin/\<resource>/new/page.tsx
- src/app/admin/\<resource>/[id]/page.tsx
- components: src/components/admin/**（再利用優先）

## docs（必須）

- docs/features/\<resource>.md
- docs/api/openapi.yaml（必要なら追記）
- docs/database/schema.md / erd.md（DB変更時）
