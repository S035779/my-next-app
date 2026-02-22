# リポジトリ作業ルール（AGENTS.override.md）

これは Next.js + TypeScript プロジェクト（my-next-app）で、Codex（エージェント）が作業するためのルールです。

## 前提

- **Next.js** + **TypeScript**
- パッケージマネージャは **pnpm** を使用します。
- Node.js の要件: `>=22 <23`（この範囲を外れないこと） :contentReference[oaicite:2]{index=2}

## Features（このリポジトリの構成）

- Next.js App Router
- ESLint / Prettier によるコード品質管理 :contentReference[oaicite:3]{index=3}

## 作業方針（重要）

- 変更は **最小差分**で行います（大規模リファクタは禁止）。
- 依存関係の追加や設定の大きな変更は、**事前に理由と影響範囲を提示し、明示指示がある場合のみ**行います。
- DB関連の破壊的操作（reset など）は、依頼内容に含まれる場合のみ実行します。
- `pnpm db:push` は履歴が残らずロールバック不可のため、**明示指示がある場合のみ**使用します。 :contentReference[oaicite:4]{index=4}
- 秘密情報（`.env.local` の中身等）は出力しません。

---

## Getting Started

まず、依存関係をインストールします:

```bash:
pnpm install
```

アプリ環境変数を設定するために、`.env.example` をコピーして `.env.local` を作成し、必要な環境変数を設定してください（`.env.local` はコミットしません）:

```bash:
cp .env.example .env.local
```

開発サーバーを起動します:

```bash:
pnpm dev
```

---

## よく使うコマンド（package.json scripts を優先）

### 開発/ビルド

```bash:
pnpm dev
pnpm build
pnpm start
```

### Lint / Format

```bash:
pnpm lint
pnpm format
```

---

## DB 操作（必要な場合のみ）

### マイグレーション生成・適用

```bash:
pnpm db:generate
pnpm db:migrate
```

### DB 初期化/リセット（破壊的。依頼がある場合のみ）

```bash:
pnpm db:reset
```

### シードのみ

```bash:
pnpm db:seed
```

### push（危険。明示指示がある場合のみ）

```bash:
pnpm db:push
```

---

## Testing（Vitest）

テストを実行します:

```bash:
pnpm test
```

継続実行（watch）:

```bash:
pnpm test:watch
```

このリポジトリの `test` は、内部で `test:db` → `vitest run` を実行します。

---

## テスト用DB（必要な場合のみ）

`.env.local` に `DATABASE_URL_TEST` を設定してください。

テストDBの migrate/seed:

```bash:
pnpm db:migrate:test
pnpm db:seed:test
```

テストDB完全リセット（破壊的）:

```bash:
pnpm db:reset:test
```

---

## 完了条件（Definition of Done）

作業完了と判断する条件:

- 依頼された変更が実装されている
- 変更範囲が必要最小限である

可能な範囲で以下を実行し、結果を報告する:

- `pnpm lint`
- `pnpm test`
- 影響が大きい場合は `pnpm build`

最後に以下を簡潔にまとめる:

1. 実施内容の要約
2. 変更ファイル一覧
3. 動作確認手順（コマンド）
4. 注意点（あれば）

---

## 禁止事項

- 無断で依存追加
- 無断で `db:reset` / `db:push` / `db:reset:test` を実行
- secrets の出力
- 大規模リファクタ（依頼がない場合）

---

## 実装規約（Next.js + TypeScript / このリポジトリ向け）

このリポジトリの `src/` 構成に合わせて、コードの置き場所・責務・Server/Client境界・テスト方針を以下に定義します。

### ディレクトリと責務（配置ルール）

- `src/app/**`
  - Next.js App Router のルーティング層。
  - 原則として **ページ/レイアウトは薄く**保ち、ビジネスロジックは `actions/` または `db/` / `lib/` へ寄せる。
  - 例外なく、ルーティングに関するUI構成（layout、ページ構造、パラメータ）を扱う。

- `src/actions/**`
  - アプリケーションのユースケース層（操作・検証・整形）。
  - 例：`src/actions/users/*` は「ユーザーに対する操作（作成/更新/削除/検索など）」の入口。
  - **入力バリデーション**は `validation.ts`、公開APIは `index.ts` 経由を基本とする。
  - 型は `types.ts` に集約（DTO/入力/戻り値/エラー表現など）。

- `src/db/**`
  - DBアクセス層（Drizzle/クエリ/リポジトリ）。
  - `schema.ts` にスキーマ、`client.ts` に接続、`*.repo.ts` にリポジトリ実装。
  - `*.repo.test.ts` はテスト用実装、`*.repo.next.ts` はNext.js/実行環境向けの差し替え等、既存命名の意図を崩さない。
  - **アプリ層（actions/app/components）から直接SQL/クエリを増やさず、repo経由に寄せる**。

- `src/lib/**`
  - 横断ユーティリティ・共通処理。
  - 認可/認証は `lib/auth/*` に集約（例：`requireAdmin.ts`）。
  - ルーティング補助は `lib/routes/*`、URL生成は `lib/urls.ts` を優先利用。
  - サーバー側の制御/ログは `lib/server/*` に置く。

- `src/components/**`
  - 再利用可能なUIコンポーネント。
  - `components/admin/*` は管理画面用途。管理画面のUIは極力この配下へ寄せ、`app/admin` は薄く保つ。

- `src/types/**`
  - グローバル型定義/外部ライブラリ補完（`*.d.ts`）。
  - 型は原則「利用箇所の近く」に置き、グローバルは最小限。

- `src/services/`
  - 外部サービス連携などの“境界”を置く想定（現状空なら、追加時はここに集約）。
  - 例：外部APIクライアント、メール送信、Webhook 等。

### Server / Client 境界（Next.js App Router）

- `"use client"` は **必要最小限**にする（イベントハンドラやブラウザAPIが必要なUIのみ）。
- 可能な限り **Server Component をデフォルト**とし、クライアント化は局所化する。
- Client Component は `components/*` 配下に置くのを基本とし、`app/*` 直下に濫用しない。
- `AdminShellClient.tsx` のような既存の Client shell パターンがある場合、同様の設計を踏襲する。

### 認可・エラーハンドリング

- 管理者制御は `lib/auth/requireAdmin.ts` 等、既存の認可関数を優先利用。
- DBエラーの整形は `lib/db-errors.ts` を優先利用し、UI層で生のDB例外を直接扱わない。
- API routes（`app/api/**`）では、入力検証→アクション呼び出し→適切なHTTPレスポンス（ステータス/メッセージ）を徹底する。

### 形式・命名

- ファイル命名は既存の慣例を踏襲：
  - `*.test.ts`：Vitestのユニットテスト
  - `*.repo.ts`：DBリポジトリ
  - `validation.ts` / `types.ts` / `core.ts`：actions配下の分割単位
- export は可能な限り `index.ts` 経由に揃える（actions配下は特に）。

### テスト方針（Vitest）

- ロジック追加・仕様変更がある場合は、原則として `src/actions/**` でユニットテストを追加/更新する。
  - 例：`src/actions/users/core.test.ts` のパターンを踏襲。
- DBに依存する変更は、可能なら repoレイヤでテストし、アプリ層のテストはモック/スタブで分離する。
- テスト実行は原則 `pnpm test`（内部で `test:db` → `vitest run`）。必要に応じて `pnpm test:watch`。

### 変更時のチェックリスト（実装後）

- ルーティング層（`app/`）が肥大化していないか（ロジックがactionsへ寄っているか）
- `"use client"` の追加が必要最小限か
- 型（DTO/戻り値/エラー）の整合が取れているか（`types.ts` 等）
- エラー整形・認可が既存の `lib/*` を使えているか
- 関連テスト（最低 `pnpm test`、必要に応じて `pnpm lint` / `pnpm build`）を実行したか

---

## PRレビュー観点（必須チェック項目）

エージェントは変更完了時、以下の観点で自己レビューを行い、結果を報告してください。

---

### 1. アーキテクチャ整合性

- ルーティング層（`src/app/**`）にビジネスロジックが増えていないか
- ロジックは `src/actions/**` に適切に配置されているか
- DBアクセスは `src/db/**` 経由になっているか（直接SQLやORM操作を増やしていないか）
- 共通処理は `src/lib/**` を再利用しているか

---

### 2. Server / Client 境界

- `"use client"` は必要最小限か
- Server Componentで実装可能な箇所をClient化していないか
- 既存の `AdminShellClient` などの設計方針を踏襲しているか

---

### 3. 認可・セキュリティ

- 管理者制御が必要な箇所で `requireAdmin` 等を使用しているか
- secrets（env値、トークン等）を出力していないか
- APIルートで入力検証が行われているか

---

### 4. 型安全性（TypeScript）

- `any` を不用意に使用していないか
- 型定義が `types.ts` 等に適切に配置されているか
- 戻り値の型が曖昧になっていないか

---

### 5. エラーハンドリング

- DB例外をUI層で直接扱っていないか
- `lib/db-errors.ts` 等の既存ユーティリティを利用しているか
- ユーザー表示メッセージと内部エラーが分離されているか

---

### 6. テスト

変更内容に応じて以下を確認：

- ロジック変更:
  - `src/actions/**` にユニットテストが追加または更新されているか
- DB変更:
  - repo層テストまたはテストDB確認が可能か
- UI変更:
  - 動作確認手順が記載されているか

実行確認:

```bash
pnpm test
```

必要に応じて:

```bash
pnpm lint
pnpm build
```

---

### 7. データベース変更（該当する場合）

- schema変更が migration として生成されているか
- `db:push` を不用意に使用していないか
- 既存データへの影響が説明されているか

---

### 8. パフォーマンス / 不要処理

- 不要な再レンダリングを増やしていないか
- 不必要なクライアントフェッチを追加していないか
- 重複処理や未使用コードがないか

---

### 9. 破壊的変更の有無

以下がある場合は明示:

- API仕様変更
- DB構造変更
- 既存画面挙動変更
- 依存追加

---

### 10. PR説明に必ず含める内容

エージェントは最終回答に以下を含めてください:

1. 実施内容の概要
2. 変更ファイル一覧
3. 動作確認手順
4. 影響範囲
5. 破壊的変更の有無
6. 未解決事項（あれば）

---

### UI変更がある場合の追加要件

UIに変更がある場合は以下を必ず含める:

- 確認URLまたは画面遷移手順
- 期待動作
- 入力例

---

### API変更がある場合の追加要件

API変更がある場合は以下を必ず含める:

- エンドポイント
- リクエスト例
- レスポンス例
- ステータスコード

---

### マージ前セルフチェック

以下を満たしていること:

- [ ] `pnpm test` が成功
- [ ] 必要に応じて `pnpm lint`
- [ ] 必要に応じて `pnpm build`
- [ ] 実装規約違反なし
- [ ] PR説明が記載されている

---

## コード生成テンプレ（雛形）と運用ルール

このセクションは、Codexが新規実装を行う際に「毎回同じ型」でファイルを生成・編集するためのテンプレです。
新機能追加や改修の際は、原則として以下の構成・分割・命名に従ってください。

---

### A. actions（ユースケース層）テンプレ

#### A-1. 新しいドメイン（例: products）を追加する場合

配置:

- `src/actions/<domain>/`
  - `core.ts`       : ユースケース本体（DB repo呼び出し、整形、例外変換）
  - `validation.ts` : 入力バリデーション（zod等。既存実装に合わせる）
  - `types.ts`      : 入出力型/DTO/エラー型
  - `index.ts`      : 公開API（外部からはここ経由で呼ぶ）
  - `core.test.ts`  : ユースケースのユニットテスト（Vitest）

##### core.ts（例）

- ルール:
  - 直接 `app/*` からDB repoを呼ばない。必ず actions 経由にする。
  - DB例外は `lib/db-errors.ts` 等の既存ユーティリティを使って変換/整形する。
  - 認可が絡む場合は `lib/auth/*` を利用する（例: requireAdmin）。

##### validation.ts（例）

- ルール:
  - 入力はここで検証し、`core.ts` は検証済み入力を前提にする。
  - エラーメッセージはUI側で使える粒度にする（可能ならフィールド単位）。

##### index.ts（例）

- ルール:
  - 外部公開関数は index.ts に集約し、core関数は直接exportしない（必要な場合のみ）。
  - 可能なら `create/update/delete/get/list` の命名で統一する。

---

### B. db（リポジトリ層）テンプレ

#### B-1. 新しい repo を追加する場合

配置:

- `src/db/<domain>.repo.ts`       : 本番実装
- `src/db/<domain>.repo.test.ts`  : テスト用実装/補助（既存運用に合わせる）
- `src/db/types.ts`               : DB用の型（必要な場合）
- `src/db/schema.ts`              : schema更新（必要な場合）

ルール:

- repoは「DBのI/O」に責務を限定する（ビジネス判断はactionsへ）。
- 返り値の型は明示し、UIが扱いやすい形に整形しすぎない（整形はactionsへ）。
- クエリを増やすときは既存 `users.repo.ts` を参照し、同じスタイルで実装する。

---

### C. API Routes（app/api）テンプレ

#### C-1. 新しいAPIエンドポイントを作る場合

配置:

- `src/app/api/<domain>/route.ts` または `src/app/api/<domain>/<action>/route.ts`

ルール（必須）:

1. 入力を受け取る（query/body）
2. `actions/<domain>` の validation を通す
3. `actions/<domain>` のユースケースを呼ぶ
4. 結果を JSON で返す
5. エラーは「想定エラー」と「不明エラー」を分離し、HTTPステータスを適切に返す
6. 管理者向けなら `requireAdmin` 等で認可を先に行う

レスポンス方針:

- 成功: 200/201
- バリデーション: 400
- 認可: 401/403
- NotFound: 404
- 競合/一意制約等: 409（可能なら）
- 想定外: 500（ログは server util を使う）

---

### D. UI（admin components / app）テンプレ

#### D-1. 管理画面UIを追加/改修する場合

配置方針:

- `src/app/admin/**` はページ/ルーティング/レイアウト中心（薄く）
- 再利用可能なUIは `src/components/admin/**` へ

Client Component方針:

- `"use client"` はUIイベントが必要な最小単位にのみ付与
- 既存の `AdminShellClient.tsx` などの設計を優先利用

フォームの方針（推奨）:

- バリデーションエラーはフィールド単位で出す
- 送信中/成功/失敗の状態を明確にする
- 既存の `AdminForm*` / `TextInput` / `ToastHost` を優先利用する

---

### E. テスト生成ルール（必須）

変更タイプ別に、最低限のテストを追加する。

1)actionsのロジック変更:

- `src/actions/<domain>/core.test.ts` を追加/更新

2)repo変更:

- 可能ならrepoのテスト（既存の `*.repo.test.ts` に寄せる）
- テストDBが必要な場合は README のテストDB手順に従う

3)API変更:

- 可能なら actions のテストでカバー（API route自体は薄く保つ）
- API routeにロジックを入れない（テスト困難化を防ぐ）

---

### F. マイグレーション運用ルール（DB変更時）

- schema変更が必要な場合:
  1. `pnpm db:generate`
  2. `pnpm db:migrate`
- `pnpm db:push` は明示指示がある場合のみ（履歴なし・ロールバック不可）

---

### G. 生成時の“最終報告テンプレ”（Codexの出力）

作業完了時、以下を必ず出力する:

#### Summary

- 何をどう変えたか（3行以内）

#### Files changed

- 変更ファイル一覧（箇条書き）

#### How to verify

- 実行コマンド
  - `pnpm test`
  - 必要に応じて `pnpm lint` / `pnpm build`
- 画面確認手順（UIの場合）

#### Notes

- 破壊的変更の有無
- 互換性/移行/注意点（あれば）

---

### H. 新規実装の“提案テンプレ”（着手前）

新規追加の依頼を受けたら、まず以下を提示してから実装する:

1. 追加/変更するファイル候補
2. actions/db/api/ui の分割方針
3. 追加するテストの種類
4. 実行するコマンド（lint/test/build）

---

## 実装と出力の統一ルール

このセクションは、実装の揺れ（命名・配置・API形・型・エラー・レビュー出力）を最小化するための強制ルールです。
例外が必要な場合は、必ず理由と影響範囲を明記してから実施してください。

---

### I. 公開APIの統一（actions）

#### I-1. actions の公開点は `index.ts` のみ

- `src/actions/<domain>/index.ts` をそのドメインの唯一の公開点とする。
- `core.ts` / `validation.ts` / `types.ts` は原則として外部へ直接exportしない。
- 他レイヤ（app/api/app/page/components）からは **必ず** `actions/<domain>`（=index）経由で呼ぶ。

例（呼び出し）:

- ✅ `import { createUser } from "@/actions/users";`
- ❌ `import { createUserCore } from "@/actions/users/core";`

例外:

- テスト（`*.test.ts`）で内部関数を参照する必要がある場合のみ可（ただし可能ならindex経由を優先）。

---

### J. 命名規約の強制（functions / files）

#### J-1. actions 関数命名（推奨セット）

- `getXxx` / `listXxx` / `createXxx` / `updateXxx` / `deleteXxx`
- 検索は `searchXxx`（フィルタ条件あり）
- 管理画面用途のAPIは `admin` をprefixにしない（役割は認可で分離）

#### J-2. repo 関数命名

- DBの操作に限定した命名:
  - `findById` / `findByEmail` / `list` / `insert` / `updateById` / `deleteById`
- repoに `validate` / `authorize` / `toViewModel` のような責務混在関数を追加しない。

---

### K. 型・DTOの配置と形（TypeScript）

#### K-1. DTOを明示し、境界を分離する

- UI用の型（表示用）と、DB用の型（永続化用）を混ぜない。
- actions の境界型は `src/actions/<domain>/types.ts` に置く。
- DBの型は `src/db/types.ts` または repoファイル内（必要最小限）に置く。

#### K-2. 禁止事項

- 原則 `any` 禁止（必要なら `unknown` → narrow）
- `as` キャスト乱用禁止（必要なら型ガード関数を作る）
- `NonNullable` 等で無理やり押し込まない（上流で検証/分岐）

---

### L. APIレスポンス形式の統一（app/api）

#### L-1. JSONレスポンスは `{ ok, data } / { ok, error }` に統一

成功:

- `200/201`:
  - `{ ok: true, data: ... }`

失敗:

- `{ ok: false, error: { code, message, details? } }`

例:

- `code`: `VALIDATION_ERROR` / `UNAUTHORIZED` / `FORBIDDEN` / `NOT_FOUND` / `CONFLICT` / `INTERNAL`

#### L-2. エラーのdetails

- バリデーションエラーは `details` にフィールド単位の情報を入れる（可能な範囲で）。
- secretsや内部例外スタックはレスポンスに含めない（ログ側に寄せる）。

---

### M. 文字列/命名の統一（camelCase）

#### M-1. 内部表現は camelCase

- actions・UI・APIレスポンスのキーは camelCase に統一。
- DBが snake_case の場合は repo層で吸収し、上位へは漏らさない（可能な範囲で）。

---

### N. 認可の強制ルール（admin）

#### N-1. 管理系機能は必ず認可を通す

- `src/app/admin/**` と、管理系API（`src/app/api/**` の該当）では、
  既存の `lib/auth/requireAdmin.ts` 等を用いて **先に** 認可を実施する。
- UI側での表示制御のみで守らない（APIで必ず守る）。

---

### O. Server/Clientの強制ルール

#### O-1. `"use client"` を追加する際の手順

追加が必要になったら、回答（PR説明）に必ず以下を含める:

1. なぜ client が必要か（イベント/状態/ブラウザAPIなど）
2. client化したファイル名
3. serverで代替できない理由
4. 影響範囲（バンドル増加など）

#### O-2. client化の範囲

- clientは最小コンポーネントに閉じ込める（ページ全体のclient化禁止）。
- 既存の `AdminShellClient` / `ToastHost` のような分割思想を踏襲する。

---

### P. テストの最低基準（必須）

#### P-1. 変更タイプ別の必須テスト

- actions のロジック変更:
  - 該当する `core.test.ts` を必ず追加/更新
- バリデーション変更:
  - バリデーションエラーのケースを最低1つ追加
- 重大なUI変更:
  - 動作確認手順に「入力例」「期待結果」を必ず書く
- 重大なAPI変更:
  - リクエスト/レスポンス例（JSON）を必ず書く

#### P-2. 実行コマンド（最低ライン）

- 原則 `pnpm test`
- 変更が横断的なら `pnpm lint`
- ビルドに関わる変更なら `pnpm build`

---

### Q. PR説明（テンプレ強制）

PR説明（または最終回答）に必ず次の見出しを含める:

```markdown:pr_review.md
## Summary
## Why
## What changed
## How to verify
## Risk / Impact
## Rollback plan（必要な場合）
## Notes
```

---

### R. 破壊的変更のルール

#### R-1. DB変更

- schema変更がある場合は migration を必須とする（`db:generate` → `db:migrate`）。
- `db:push` は原則禁止（明示指示がある場合のみ）。

#### R-2. API契約変更

- 互換性が壊れる場合は、必ず `Risk / Impact` に影響範囲を記載する。
- クライアント側の変更が必要なら同PRに含めるか、別PR計画を提示する。

---

### S. 依存追加のルール（厳格）

- 依存追加を行う前に必ず以下を提示する:
  1. 追加理由
  2. 代替案（既存依存/素実装）
  3. bundle/セキュリティ/保守への影響
- 明示承認がない限り依存追加しない。

---

## Drizzle / Clerk / Docker / DB（設置場所・運用ルール）

このリポジトリでは以下を前提とします。

- DBアクセス: Drizzle（`src/db/**`）
- 認証/ユーザ管理: Clerk（`src/lib/auth/**` と `src/types/clerk.d.ts`）
- ローカル開発DB: Docker Compose（`.env` + `docker compose`）
- 破壊的操作（reset/push）は明示指示がある場合のみ

---

### 1) 設置場所（責務と配置）

#### 1-1. Clerk（認証/認可）

配置:

- `src/lib/auth/role.ts` : ロール/権限の定義・判定（追加はここ）
- `src/lib/auth/requireAdmin.ts` : 管理者権限の強制（admin/APIで必須）
- `src/types/clerk.d.ts` : Clerkの型補完（必要に応じて追記）

ルール:

- 認可はUI表示だけで守らない（API/サーバ側で必ず守る）
- admin系:
  - `src/app/admin/**` は表示前に認可（既存パターンを踏襲）
  - `src/app/api/**` は route の先頭で認可（`requireAdmin` 等）

---

#### 1-2. Drizzle（DB・永続化）

配置:

- `src/db/schema.ts` : テーブル定義
- `src/db/client.ts` : Drizzle client / DB接続
- `src/db/index.ts`  : db export の集約（あればここ経由）
- `src/db/*.repo.ts` : リポジトリ（DB I/O）
- `src/db/types.ts`  : DB周辺の型（必要最小限）
- `src/db/seed.ts` / `src/db/reset.ts` : seed/reset の実装（既存通り）
- `src/db/cli.ts` : CLI実行の入口（既存通り）

ルール:

- **app/actions/components から Drizzle client を直接呼ばない**
- DB例外/一意制約等の扱いは `src/lib/db-errors.ts` の既存方針を優先
- schema変更は migration を基本（`db:generate` → `db:migrate`）
- `db:push` は原則禁止（明示指示がある場合のみ）

---

#### 1-3. Docker（ローカルDB/開発環境）

配置（推奨）:

- `compose.yaml` / `docker-compose.yml` : compose本体（既存に合わせる）
- `.env` : Docker Compose用（`COMPOSE_PROJECT_NAME` 等、コミット可）
- `.env.local` : Next/Clerk/DB接続用（コミット禁止）

ルール:

- `.env.local` の値は出力しない（キー名のみ列挙）
- composeのサービス名/ホスト名は README の手順（例: `-hmysql`）を尊重
- DB初期化は `pnpm db:reset` / `pnpm db:reset:test` を優先（手動SQLは必要時のみ）

---

### 2) 環境変数（キーの扱い）

#### 2-1. `.env.local`（コミット禁止）

- Next.js 実行に必要なキーを置く
- Clerkキー、DB URL、テストDB URL をここに集約

例（キー名のみ。値は出力しない）:

- `DATABASE_URL`
- `DATABASE_URL_TEST`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- （必要なら）`CLERK_SIGN_IN_URL` / `CLERK_SIGN_UP_URL` 等

#### 2-2. `.env`（Docker Compose用・コミット可）

- `COMPOSE_PROJECT_NAME="..."` など、composeの安定稼働に必要な値のみ

---

### 3) DB運用（開発・テスト）

#### 3-1. 初回/リセット

- 初回セットアップ（破壊的）:
  - `pnpm db:reset`
- テストDB完全リセット（破壊的）:
  - `pnpm db:reset:test`

#### 3-2. スキーマ変更

- migration作成:
  - `pnpm db:generate`
- migration適用:
  - `pnpm db:migrate`
- テストDBに反映（必要時）:
  - `pnpm db:migrate:test`

#### 3-3. seed

- 開発DB seed:
  - `pnpm db:seed`
- テストDB seed:
  - `pnpm db:seed:test`

#### 3-4. 禁止/制限

- `pnpm db:push` は原則禁止（明示指示がある場合のみ）
  - 理由: 履歴が残らずロールバック不可

---

### 4) 典型的な実装パターン（Clerk × actions × repo × API）

#### 4-1. 管理者限定API（例: users管理）

1. `src/app/api/users/.../route.ts`
   - 先頭で `requireAdmin`
   - 入力を validation
   - actions を呼ぶ
   - `{ ok, data } / { ok, error }` 形式で返す

2. `src/actions/users/*`
   - validation/types/core/index の分割を維持
   - repoを呼ぶのは core のみ

3. `src/db/users.repo.ts`
   - DB I/Oのみ
   - 例外は上に漏らして良いが、想定エラーへの変換は actions で行う（既存方針に合わせる）

---

### 5) 追加ファイルを作る場合の置き場所（新規導入時）

- Clerkの認可ユーティリティ追加:
  - `src/lib/auth/<name>.ts`
- DBの共通クエリ/ヘルパ:
  - まずは `src/db/<domain>.repo.ts` に閉じ込め、横断化が必要なら `src/db/<name>.ts`
- 外部サービス連携（将来: Webhook, メール, 外部API）:
  - `src/services/<serviceName>/...`
  - ただし DB/認可の責務を services に混ぜない

---

### 6) PRレビュー追加観点（Drizzle/Clerk/Docker/DB）

- Clerk:
  - 認可が API で担保されているか（UIだけで守っていないか）
  - secrets をログ/レスポンスに含めていないか
- Drizzle/DB:
  - schema変更は migration になっているか
  - repo直呼びが増えていないか（actions 経由か）
- Docker:
  - `.env.local` を触っていないか（値を出していないか）
  - compose変更があるなら影響範囲とローカル手順が書かれているか

---

## services/ + Docker(Devcontainer Compose) + Redis/MinIO/Seed/E2E（実態一致）

このリポジトリでは、外部依存（Redis/MinIO/外部APIなど）を `src/services/**` に集約し、
DB（MySQL/Drizzle）は `src/db/**`、認可（Clerk/role）は `src/lib/auth/**` に集約します。

---

### 1) Docker（devcontainer）運用ルール

#### 1-1. compose の実体

- このリポジトリのローカル環境は **`.devcontainer/docker-compose.yml`** を前提とする。
- services:
  - `app`（Next.js実行コンテナ）
  - `mysql`（MySQL 8.0）
  - `redis`（Redis 7）
  - `minio`（MinIO）

#### 1-2. 環境変数の読み込み

- `app / mysql / minio` は `${PWD}/.env.local` を `env_file` として読み込む。
- `.env.local` は **`.env.example` をコピーして作成**し、値を設定する（コミット禁止）。

#### 1-3. ポート

- Next.js: `3000:3000`
- MySQL: `3306:3306`
- Redis: `6379:6379`
- MinIO: `9000:9000`（API）, `9001:9001`（Console）

#### 1-4. 依存関係

- `app` は `mysql` の healthcheck 成功後に起動する。
- `redis` / `minio` は起動待ちのみ。

#### 1-5. 禁止事項

- `.env.local` の値（キーや秘密情報）をログ/レスポンス/PRに貼らない。
- compose のサービス名（`mysql` / `redis` / `minio`）を変える場合は必ず影響範囲を説明する。

---

### 2) 環境変数（.env.example 準拠・キー一覧）

このリポジトリの `.env.local` は `.env.example` に準拠する。

#### 2-1. Next.js

- `NODE_ENV`
- `NEXT_PUBLIC_APP_URL`

#### 2-2. Clerk

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL`

#### 2-3. MySQL / Drizzle

- `MYSQL_HOST=mysql`
- `MYSQL_PORT=3306`
- `MYSQL_DATABASE=app`
- `MYSQL_USER=app`
- `MYSQL_PASSWORD=app_password`
- `MYSQL_ROOT_PASSWORD=root_password`
- `DATABASE_URL=mysql://app:app_password@mysql:3306/app`

#### 2-4. Test DB（任意）

- `DATABASE_URL_TEST=mysql://app:app_password@mysql:3306/app_test`

#### 2-5. Redis

- `REDIS_HOST=redis`
- `REDIS_PORT=6379`

#### 2-6. MinIO

- `MINIO_ENDPOINT=http://minio:9000`
- `MINIO_REGION=us-east-1`
- `MINIO_ROOT_USER`
- `MINIO_ROOT_PASSWORD`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_BUCKET`

#### 2-7. Seed / E2E

- `ADMIN_EMAILS`
- `E2E_ADMIN_EMAIL`
- `E2E_ADMIN_PASSWORD`

ルール:

- `.env.local` の値は出力しない（必要ならキー名のみ列挙）。
- `NEXT_PUBLIC_` 以外はサーバー専用として扱う（クライアントに露出しない）。

---

### 3) services/ の正式運用（外部境界の集約）

#### 3-1. services の責務

`src/services/**` は **外部依存や境界（IO）**を集約する。

例:

- Redis（キャッシュ/セッション/レート制限等）
- MinIO（オブジェクトストレージ）
- 外部HTTP API（将来追加）
- メール送信（将来追加）

禁止:

- DBの永続化ロジック（それは `src/db/**`）
- 認可判断（それは `src/lib/auth/**`）
- UI用の整形（それは `src/actions/**`）

#### 3-2. 推奨ディレクトリ構造（新規追加時）

- `src/services/redis/`
  - `client.ts`（接続/クライアント生成）
  - `index.ts`（公開API）
  - `types.ts`（必要なら）
- `src/services/minio/`
  - `client.ts`
  - `index.ts`
  - `types.ts`（必要なら）
- `src/services/http/`（外部API共通）
  - `fetcher.ts`（共通fetch/リトライ/タイムアウト等）
  - `errors.ts`

#### 3-3. 公開点の統一

- services も actions と同様に **`index.ts` を唯一の公開点**とする。
- `client.ts` は内部実装（必要ならテストでのみ参照）。

---

### 4) services の生成テンプレ（雛形）

#### 4-1. Redis service 雛形（作成時の型）

- `src/services/redis/client.ts`
  - 接続設定（`REDIS_HOST` / `REDIS_PORT`）を使用
  - クライアントは singleton（または lazy init）で扱い、作り直しを乱発しない
- `src/services/redis/index.ts`
  - `get/set/del` など用途に合わせた薄い関数群
  - 低レベルAPIを上位に漏らさない

#### 4-2. MinIO service 雛形（作成時の型）

- `src/services/minio/client.ts`
  - `MINIO_ENDPOINT` / credentials / region を使用
- `src/services/minio/index.ts`
  - `putObject/getObjectUrl/deleteObject/ensureBucket` 等
  - バケット名は `MINIO_BUCKET` を基本とし、ハードコードしない

---

### 5) actions × services × repo の接続ルール（境界の固定）

- UI（`app/**`, `components/**`）は **actions** を呼ぶ
- actions は必要に応じて
  - DB: `src/db/*.repo.ts`
  - 外部: `src/services/**`
  を呼ぶ
- ルーティング（`app/api/**`）は薄く保ち、validation → actions → response

例:

- `app/api/...` → `actions/users` → `db/users.repo.ts`
- `app/api/...` → `actions/...` → `services/minio`（署名URL発行など）

---

### 6) Seed / E2E の扱い

#### 6-1. Seed（ADMIN_EMAILS）

- seed に関する値は `.env.local` の `ADMIN_EMAILS` を利用する（値は出力しない）。
- seed 実装は既存の `src/db/seed.ts` / `pnpm db:seed` の方針を尊重する。

#### 6-2. E2E（E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD）

- E2E用の認証情報は `.env.local` で管理し、コードやREADMEに値を書かない。
- E2Eテストに影響する変更は「How to verify」に Playwright 実行手順を含める。

---

### 7) PRレビュー追加観点（services / docker / redis / minio）

- services:
  - 外部I/Oが `src/services/**` に集約されているか（散らばっていないか）
  - 公開点が `index.ts` に統一されているか
  - リトライ/タイムアウト/例外の扱いが上位（actions）で制御できる形か

- docker/compose:
  - `.devcontainer/docker-compose.yml` の変更がある場合、影響範囲と再現手順が明記されているか
  - envキーの追加/変更がある場合、`.env.example` も更新されているか
  - `.env.local` の値が漏れていないか

- redis/minio:
  - env（host/port/endpoint/bucket）がハードコードされていないか
  - ローカル（compose）で再現できる検証手順があるか

---

#### 設計ドキュメントの優先順位

実装は docs ディレクトリ配下の仕様を正とする。
不整合がある場合はコードより docs を優先し、差異を報告すること。

---

## Docs優先ルール

実装は docs ディレクトリ配下の仕様を正とする。

docs とコードに差異がある場合：

1. docs を優先
2. 差異を報告
3. 修正提案を出す
