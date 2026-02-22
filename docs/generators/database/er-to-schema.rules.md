# ER → Drizzle schema Rules (Strict)

- DBはsnake_case、TSはcamelCase
- すべてのテーブルに:
  - id（uuid or varchar(36)）
  - created_at / updated_at（必要なら）
- Unique制約はschemaで明示
- 外部キーは可能な範囲で表現
- 変更は migration 前提（db:pushは禁止、例外時のみ）
