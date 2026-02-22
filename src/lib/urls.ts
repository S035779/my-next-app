/**
 * formData の from を安全に解釈して戻り先を作る
 * - 同一オリジンの相対パスのみ許可（/ で始まる or 相対URL）
 * - 不正/空なら fallback
 * @param from
 * @param fallback
 * @return
 */
export function safeFrom(from: unknown, fallback: string): string {
  if (typeof from !== 'string') return fallback;
  const s = from.trim();
  if (!s) return fallback;

  // いちばん安全: 「/」から始まるアプリ内パスだけ許可
  if (s.startsWith('/')) return s;

  // どうしても "admin/users?page=1" のような相対を許すならここで許可
  //（不要ならこのブロックは削除でOK）
  if (!s.includes('://') && !s.startsWith('//'))
    return `/${s.replace(/^\/+/, '')}`;

  return fallback;
}
