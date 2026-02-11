import { users } from './schema';
import { desc, eq } from 'drizzle-orm';
import type { AppDb } from './types';

export function usersRepo(db: AppDb) {
  const getAffectedRows = (result: unknown) => {
    if (!result || typeof result !== 'object') return 0;
    const r = result as {
      affectedRows?: number;
      rowsAffected?: number;
      rowCount?: number;
    };
    return Number(r.affectedRows ?? r.rowsAffected ?? r.rowCount ?? 0);
  };

  const listUsers = (limit = 50) => {
    return db.select().from(users).orderBy(desc(users.id)).limit(limit);
  };

  const findUserById = async (id: number) => {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return rows[0] ?? null;
  };

  const findUserIdByEmail = async (email: string) => {
    const rows = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return rows[0]?.id ?? null;
  };

  const createUser = async (
    email: string,
    name: string | null,
  ): Promise<number> => {
    await db.insert(users).values({ email, name });

    // MySQL + drizzle(mysql2) では insertId が安定して取れないため、
    // unique(email) を前提に再取得する
    const id = await findUserIdByEmail(email);

    if (!id) {
      throw new Error('Failed to retrieve inserted user id');
    }
    return id;
  };

  const updateUser = async (
    id: number,
    email: string,
    name: string | null,
  ): Promise<boolean> => {
    const result = await db
      .update(users)
      .set({ email, name })
      .where(eq(users.id, id));
    const affected = getAffectedRows(result);
    if (affected > 0) return true;
    // 変更がない or 影響行数が取得できない場合は存在確認して判断する
    const exists = await findUserById(id);
    return !!exists;
  };

  const deleteUser = async (id: number): Promise<boolean> => {
    const result = await db.delete(users).where(eq(users.id, id));
    const affected = getAffectedRows(result);
    if (affected > 0) return true;
    const exists = await findUserById(id);
    return !exists;
  };

  return {
    /**
     * ユーザー一覧を取得
     * @param limit 取得上限件数（デフォルト: 50）
     * @returns ユーザー配列
     */
    listUsers,

    /**
     * ユーザーIDでユーザーを取得
     * @param id ユーザーID
     * @returns ユーザー情報、存在しない場合は null
     */
    findUserById,

    /**
     * メールアドレスでユーザーIDを取得
     * @param email メールアドレス
     * @returns ユーザーID、存在しない場合は null
     */
    findUserIdByEmail,

    /**
     * ユーザー作成
     * @param email メールアドレス
     * @param name 名前
     * @returns 作成したユーザーのID
     */
    createUser,

    /**
     * ユーザー更新
     * @param id ユーザーID
     * @param email メールアドレス
     * @param name 名前
     * @returns 更新に成功したかどうか
     */
    updateUser,

    /**
     * ユーザー削除
     * @param id ユーザーID
     * @returns 削除に成功したかどうか
     */
    deleteUser,
  };
}
