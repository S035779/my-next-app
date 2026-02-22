# ROADMAP.md

## ① 開発基盤の整備（devcontainer + Node + pnpm）

目的: 誰が clone しても「同じ環境で動く」状態を作る。

### 作業内容

- devcontainer（Dockerfile / docker-compose / devcontainer.json）
- Node LTS 固定（.node-version）
- pnpm 固定（corepack / pnpm-lock.yaml）
- MySQL / Redis / MinIO のローカル構成
- .env.example 整備（秘密情報は含めない）

### 完了条件

- devcontainer open → pnpm dev でアプリが起動
- Git はホスト運用、コンテナは実行専用

## ② DB 基盤（Drizzle + MySQL）と migrate/seed 運用

目的: DB 構造と初期データを「コードで再現可能」にする。

### 作業内容

- Drizzle schema 定義
- migrate / seed / reset（in-container）運用
- DATABASE_URL / DATABASE_URL_TEST の整理
- seed の冪等性（idempotent）

### 完了条件

- pnpm db:migrate
- pnpm db:seed
- pnpm db:reset:in が安定して動く

## ③ DB アクセス層の分離とテスト（Repository）

目的: Next.js 依存を切り、DB ロジックを安全にテスト可能にする。

### 作業内容

- users.repo.ts（汎用）
- users.repo.next.ts（Next.js 用）
- integration test（Vitest + MySQL）
- any 排除、型の正規化

### 完了条件

- CRUD テストが通る
- insert/update/delete の結果が boolean / id で返る

## ④ Server Actions の設計（バリデーション・エラー制御）

目的: フォーム処理を「壊れにくい構造」にする。

### 作業内容

- actions を core / index / types / validation に分離
- unique 制約エラーの捕捉（email 重複）
- redirect / notFound / forbidden の制御フロー整理
- form state によるエラー表示

### 完了条件

- 重複 email がフォームに表示される
- 成功時は正しく redirect

## ⑤ 認証・認可の“基盤”を固める（Clerk + 管理者権限）

目的: 「誰が管理画面を触れるか」を一貫したルールで保証する。

### 作業内容

- Clerk 導入（App Router 対応）
- role.ts による role 判定の正規化
- requireAdmin() の単一責務化
- proxy.ts で /admin/* をログイン必須に
- 403 / 未ログイン UX の整理

### 完了条件

- 未ログイン → sign-in
- 非admin → 403
- admin → /admin/* 表示

## ⑥ DB “制約とエラー” を本番想定に整える

目的: 本番で起きる失敗を「想定内の挙動」にする。

### 作業内容

- unique / not null / default の見直し
- update/delete 0件時の notFound 判定
- MySQL エラーコードの正規化
- transaction 方針の明文化

### 完了条件

- DB 由来の例外が UI/Action で正しく処理される

## ⑦ E2E テスト導入（Playwright）

目的: ブラウザ上の“重要導線”が壊れていないことを保証。

### 作業内容

- Playwright セットアップ
- 管理画面の最小 E2E
  - 未ログイン
  - 非admin
  - admin CRUD
- Clerk 認証の扱い（テスト用ユーザー）

### 完了条件

- CI で管理画面の基本操作が検証される

## ⑧ 管理画面 UI の完成度を上げる

目的: 「実務で使える管理画面」にする。

### 作業内容

- レイアウト責務の単一化（AdminShell）
- 余白設計（A案：フル幅） ← 完了
- 一覧の検索 / ソート / ページング
- 編集・削除 UX 改善
- ナビ・パンくずの最終調整

### 完了条件

- 日常的に使っても違和感がない

eol