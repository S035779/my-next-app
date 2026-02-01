# Next.js + Drizzle + Clerk Starter Template

これは [Next.js](https://nextjs.org) プロジェクトのスターターテンプレートです。

アーキテクチャは以下の通りです:

- **Next.js** - React フレームワーク
- **Drizzle ORM** - TypeScript ファーストの ORM
- **Clerk** - 認証とユーザ管理

## Features

- Next.js 13 App Router を使用
- Drizzle ORM を使用したデータベース操作
- Clerk を使用した認証とユーザ管理
- TypeScript サポート
- ESLint と Prettier によるコード品質管理
- 簡単なセットアップと起動手順

## Getting Started

まず、リポジトリをクローンし、依存関係をインストールします:

```bash
git clone
cd your-repo-name
pnpm install
```

アプリ環境変数を設定するために、`.env.example` ファイルをコピーして `.env.local` ファイルを作成し、必要な環境変数を設定してください:

```bash
cp .env.example .env.local
```

このファイルは Git にコミットされないことに注意してください。

次に、Dockerコンテナ用プロジェクト名を設定するために、`.env` ファイルを作成し、必要な環境変数を設定してください:

```shell:.env
COMPOSE_PROJECT_NAME="your_project_name"
```

このファイルは Git にコミットしても問題ありません。

同じく、scripts/db-reset.sh ファイル内の `PROJECT_NAME` 変数も同じ値に設定してください:

```shell:scripts/db-reset.sh
PROJECT_NAME="your_project_name"
```

初回セットアップには、以下のコマンドを実行してください:

```bash
pnpm db:reset
pnpm dev
```

次回からは、以下のコマンドで開発サーバーを起動できます:

```bash
pnpm dev
```

初回/DBリセット時に、`pnpm db:reset` コマンドは以下の操作を行います:

1. データベースをドロップします (存在する場合)。
2. 最新のマイグレーションを適用してデータベーススキーマを作成します。
3. 初期データをデータベースにシードします。

スキーマの変更を行った場合は、以下のコマンドでマイグレーションを生成し、適用してください:

```bash
pnpm db:generate
pnpm db:migrate
```

さらに、`pnpm db:push` コマンドを使用して、マイグレーションを生成せずにスキーマをデータベースに直接プッシュすることもできます。ただし、手軽である反面、履歴保持されず、ロールバック不可となるため、注意して使用してください:

```bash
pnpm db:push
```

データだけをリセットしたい場合は、以下のコマンドを実行してください:

```bash
pnpm db:seed
```

開発ページ [http://localhost:3000](http://localhost:3000) をブラウザで開きます。ページが表示されない場合は、サーバーのログを確認してください。

## Testing

まず、テスト用データベースをセットアップするために、`.env.local` ファイルに `DATABASE_URL_TEST` 環境変数を追加してください:

```env
DATABASE_URL_TEST="your_test_database_connection_string"
```

手動でテスト用データベースを作成してください:

```bash
mysql -hmysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON app_test.* TO 'app'@'%'; FLUSH PRIVILEGES;"
mysql -hmysql -uapp -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS app_test CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
```

その後、以下のコマンドでテスト用データベースが正しく作成されたことを確認できます:

```bash
mysql -hmysql -uapp -p"$MYSQL_ROOT_PASSWORD" -e "SHOW DATABASES;"
```

次に、以下のコマンドでテスト用データベースをマイグレーション、シードします:

```bash
pnpm db:migrate:test
pnpm db:seed:test
```

または、以下のコマンドで完全リセットを行うことができます:

```bash
pnpm db:reset:test
```

その後、以下のコマンドでテスト用データベースが正しくセットアップされたことを確認できます:

```bash
mysql -hmysql -uapp -p"$MYSQL_ROOT_PASSWORD" app_test -e "SHOW TABLES;"
mysql -hmysql -uapp -p"$MYSQL_ROOT_PASSWORD" app_test -e "SELECT * FROM users;"
```

テストを実行するには、以下のコマンドを使用します:

```bash
pnpm test
```

## Learn More

Next.js についてもっと知るには、以下のリソースを確認してください:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js の機能と API について学びます。
- [Learn Next.js](https://nextjs.org/learn) - インタラクティブな Next.js チュートリアルです。

Drizzle についてもっと知るには、以下のリソースを確認してください:

- [Drizzle Documentation](https://drizzle-orm.github.io/drizzle-orm/) - Drizzle ORM の機能と API について学びます。

Clerk についてもっと知るには、以下のリソースを確認してください:

- [Clerk Documentation](https://clerk.com/docs) - Clerk の機能と API について学びます。

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
