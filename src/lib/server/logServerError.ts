// src/lib/server/logServerError.ts
type LogContext = {
  scope: string; // e.g. 'users.create'
  userId?: string | null; // 任意（今回なくてもOK）
};

function safeMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export function logServerError(ctx: LogContext, err: unknown): void {
  // 本番では詳細を出しすぎない（PIIやSQLなどが混ざる可能性があるため）
  if (process.env.NODE_ENV === 'production') {
    console.error(`[${ctx.scope}]`, safeMessage(err));
    return;
  }
  console.error(`[${ctx.scope}]`, err);
}
