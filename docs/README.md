# Project Documentation

このディレクトリはシステム仕様のソースオブトゥルースです。

## 優先順位

docs > code

コードと仕様が不整合の場合：

1. docsを正とする
2. 差異を報告
3. 修正提案を行う

## 構成

- requirements : 要件定義
- architecture : アーキテクチャ設計
- database : DB設計
- api : API仕様
- features : 機能単位仕様
- ui: UI仕様
- testing: テスト要領
- infrastructure: インフラ構成
- operations: 運用仕様

```text:
docs/
  README.md

  requirements/
    system.md
    user-stories.md
    non-functional.md

  architecture/
    architecture.md
    decisions.md
    sequence.md

  database/
    erd.md
    schema.md
    migrations.md

  api/
    api-spec.md
    openapi.yaml

  features/
    users.md
    auth.md
    admin.md

  ui/
    ui-spec.md
    components.md

  testing/
    test-strategy.md
    e2e.md

  infrastructure/
    infrastructure.md
    docker.md
    environments.md

  operations/
    runbook.md
    monitoring.md
    security.md
```