export type MySqlErrorLike = {
  code?: string;
  errno?: number;
  sqlState?: string;
  message?: string;
  cause?: unknown;
};

/**
 * 多重ラップされたエラーから重複エントリエラーを探す
 * @param err エラーオブジェクト
 * @returns 重複エントリエラーオブジェクトまたは null
 */
export function findDuplicateEntryError(err: unknown): MySqlErrorLike | null {
  let cur: unknown = err;

  // 多重ラップに備えて最大 5 回たどる
  for (let i = 0; i < 5; i++) {
    if (typeof cur !== 'object' || cur === null) return null;

    const e = cur as MySqlErrorLike;

    if (
      e.code === 'ER_DUP_ENTRY' ||
      e.errno === 1062 ||
      e.sqlState === '23000'
    ) {
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
