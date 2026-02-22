# Storybook Setup (Plan)

目的:

- components/admin のUIを単体で検証できるようにする
- E2Eが重い箇所のUI確認を高速化する

基本方針:

- UI部品は既存の components/admin を優先
- "use client" を増やしすぎない
- Storyは最小（主要コンポーネントのみ）

導入（例）:

- 依存追加は必ず事前承認が必要（AGENTSルール）
- 承認後、Codexは最小差分で導入し、起動方法を docs に追記する

Done:

- storybook 起動コマンドが `pnpm storybook` 等で統一されている
- 主要コンポーネントのstoriesがある
