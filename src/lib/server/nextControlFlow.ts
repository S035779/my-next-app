// src/lib/server/nextControlFlow.ts
/**
 * Next.js の制御フロー例外かどうかを判定する
 * redirect / notFound / forbidden などは例外で制御されるため
 * catch で握りつぶしてはいけない
 */
export function isNextControlFlowError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;

  const digest = (err as { digest?: unknown }).digest;

  if (typeof digest !== 'string') return false;

  return (
    digest.startsWith('NEXT_REDIRECT') ||
    digest.startsWith('NEXT_NOT_FOUND') ||
    digest.startsWith('NEXT_FORBIDDEN')
  );
}