/**
 * クラス結合 helper 関数
 * @param classes 結合するクラスの配列
 * @returns 結合されたクラス文字列
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
