# Migration Strategy

## Rules

- schema変更は migration必須
- db:pushは禁止（特例のみ）

## Flow

1. db:generate
2. db:migrate