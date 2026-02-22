# Project Documentation

このディレクトリはシステム仕様のソースオブトゥルースです。

## 優先順位

docs > code

コードと仕様が不整合の場合：

1. docsを正とする
2. 差異を報告
3. 修正提案を行う

## 構成

- ai: AIプロンプト・ルール
- generators: コードジェネレーターのテンプレートとルール
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

  ai/
    codex-prompts.md
    workflows/
      00-bootstrap.md
      10-crud-generator.md
      20-migration-generator.md
      30-seed-generator.md
      40-playwright-generator.md
      50-storybook-generator.md
      90-spec-code-diff.md

  generators/
    crud/
      feature-spec.template.md
      checklist.md
      naming.md
      files.md
      templates/
        actions.core.ts.template
        actions.types.ts.template
        actions.validation.ts.template
        actions.index.ts.template
        actions.core.test.ts.template
        db.repo.ts.template
        api.route.ts.template
        ui.admin.list.page.tsx.template
        ui.admin.form.client.tsx.template
        ui.admin.components.tsx.template
    
    database/
      er-to-schema.rules.md
      schema.template.md
      migration.template.md
      seed.template.md
      e2e-fixtures.template.md

    playwright/
      e2e-spec.template.md
      selectors.rules.md
      scenarios.template.md

    storybook/
      setup.md
      stories.template.tsx
      conventions.md
  
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
