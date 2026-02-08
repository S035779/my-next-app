export type MySqlErrorLike = {
  code?: unknown;
  errno?: unknown;
  sqlState?: unknown;
  message?: unknown;
  cause?: unknown;
};

/**
 * オブジェクト判定
 * @param v
 * @returns
 */
function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/**
 * MySqlエラーを確認し、MySqlErrorLike型として返却する
 * @param v 多重ラップ化されたエラー
 * @returns
 */
function asMySqlErrorLike(v: unknown): MySqlErrorLike | null {
  if (!isObject(v)) return null;
  return v as MySqlErrorLike;
}

/**
 * 多重ラップされたエラーから重複エントリエラーを探す
 * @param err エラーオブジェクト
 * @returns 重複エントリエラーオブジェクトまたは null
 */
export function findDuplicateEntryError(err: unknown): MySqlErrorLike | null {
  let cur: unknown = err;

  // 多重ラップに備えて最大 5 回たどる
  for (let i = 0; i < 5; i++) {
    const e = asMySqlErrorLike(cur);
    if (!e) return null;

    const code = typeof e.code === 'string' ? e.code : undefined;
    const errno = typeof e.errno === 'number' ? e.errno : undefined;

    // Duplicate entry だけに限定
    if (code === 'ER_DUP_ENTRY' || errno === 1062) {
      return e;
    }

    cur = e.cause;
    if (!cur) return null;
  }

  return null;
}

/**
 * 重複エラー判定
 * @param err エラーオブジェクト
 * @returns 重複エラーなら true
 */
export function isDuplicateEmailError(err: unknown): boolean {
  return findDuplicateEntryError(err) !== null;
}
