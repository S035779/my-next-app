# Feature Spec Template: \<FeatureName>

## Goal

- 何を達成する機能か（1〜2行）

## Actors

- Admin / User / Guest

## Permissions

- 例: Admin only
- 認可の実装箇所:
  - UI: src/app/admin/**（表示前）
  - API: src/app/api/**（route先頭で強制）
  - ユースケース: src/actions/**（必要なら二重で担保）

## Use Cases

- List
- Get (by id)
- Create
- Update
- Delete
- Search（必要なら）

## Data Model

- Entity:
  - id: string (uuid)
  - ...
- Unique constraints:
  - 例: email unique
- Optional fields:
  - 例: name?

## Validation Rules

- required / format / min-max / enum
- 例: email required + email format

## API

- GET /api/\<resource>
- GET /api/\<resource>/:id
- POST /api/\<resource>
- PATCH /api/\<resource>/:id
- DELETE /api/\<resource>/:id

### Response Format

Success:
{ "ok": true, "data": ... }

Error:
{ "ok": false, "error": { "code": "...", "message": "...", "details"?: ... } }

## UI (Admin)

- /admin/\<resource> : list + search + pagination
- /admin/\<resource>/new : create form
- /admin/\<resource>/[id] : edit form

## Testing

- Unit: actions/\<resource>/core.test.ts
- E2E: Playwright admin flow（必要なら）
- DB: migration + seed

## Definition of Done

- lint/test/build（必要に応じて）
- docs更新
- migration（DB変更時）
