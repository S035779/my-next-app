import { users } from './schema';
import { desc, eq } from 'drizzle-orm';
import type { AppDb } from './types';

export function usersRepo(db: AppDb) {
  return {
    /**
     * ユーザー一覧を取得
     * @param limit 取得上限件数（デフォルト: 50）
     * @returns ユーザー配列
     */
    listUsers(limit = 50) {
      return db.select().from(users).orderBy(desc(users.id)).limit(limit);
    },

    /**
     * ユーザーIDでユーザーを取得
     * @param id ユーザーID
     * @returns ユーザー情報、存在しない場合は null
     */
    async findUserById(id: number) {
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return rows[0] ?? null;
    },

    /**
     * メールアドレスでユーザーIDを取得
     * @param email メールアドレス
     * @returns ユーザーID、存在しない場合は null
     */
    async findUserIdByEmail(email: string) {
      const rows = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      return rows[0]?.id ?? null;
    },

    /**
     * ユーザー作成
     * @param email メールアドレス
     * @param name 名前
     * @returns 作成したユーザーのID
     */
    async createUser(email: string, name: string | null): Promise<number> {
      await db.insert(users).values({ email, name });

      // MySQL + drizzle(mysql2) では insertId が安定して取れないため、
      // unique(email) を前提に再取得する
      const id = await this.findUserIdByEmail(email);

      if (!id) {
        throw new Error('Failed to retrieve inserted user id');
      }
      return id;
    },

    /**
     * ユーザー更新
     * @param id ユーザーID
     * @param email メールアドレス
     * @param name 名前
     * @returns 更新に成功したかどうか
     */
    async updateUser(
      id: number,
      email: string,
      name: string | null,
    ): Promise<boolean> {
      const result = await db
        .update(users)
        .set({ email, name })
        .where(eq(users.id, id));
      const affected = Number(
        (result as unknown as { affectedRows?: number }).affectedRows ?? 0,
      );
      return affected > 0;
    },

    /**
     * ユーザー削除
     * @param id ユーザーID
     * @returns 削除に成功したかどうか
     */
    async deleteUser(id: number): Promise<boolean> {
      const result = await db.delete(users).where(eq(users.id, id));
      const affected = Number(
        (result as unknown as { affectedRows?: number }).affectedRows ?? 0,
      );
      return affected > 0;
    },
  };
}
