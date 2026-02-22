# Workflow: Playwright Generator

Input:

- docs/features/\<resource>.md
- UI routes（/admin/\<resource> 等）

Steps:

1. 安定セレクタ方針（selectors.rules.md）に従う
2. シナリオを scenarios.template.md に沿って定義
3. specファイルを生成（tests/admin/* など既存配置に合わせる）
4. 実行コマンドとレポート手順を提示
