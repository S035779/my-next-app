# Migration Template

## Purpose

- 何のためのスキーマ変更か

## Changes

- 追加/変更/削除するテーブル・カラム

## Steps (Commands)

```bash
pnpm db:generate
pnpm db:migrate
```

## Backward Compatibility

- 互換性破壊があるか
- 既存データへの影響

## Rollback Plan

- 戻し方（可能なら）

## Verification

- pnpm test
- 必要に応じて pnpm db:reset:test で再現性確認
