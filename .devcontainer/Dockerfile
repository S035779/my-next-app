FROM mcr.microsoft.com/devcontainers/javascript-node:22-bookworm

# MySQL client / Redis client（redis-cli）を追加
# default-mysql-client: mysql コマンド
# redis-tools: redis-cli コマンド
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    libnspr4 \
    libnss3 \
    libatk1.0-0 \
    libdbus-1-3 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libxkbcommon0 \
    libasound2 \
    default-mysql-client \
    redis-tools \
  && rm -rf /var/lib/apt/lists/*

# Corepack は sudo 不要で確実にしておきたいので、ここで有効化・pnpm固定まで実施
RUN corepack enable \
  && corepack prepare pnpm@10.28.1 --activate
