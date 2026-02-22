export type UsersRoutes = {
  // 一覧（ページ・検索のクエリも含められる）
  index: (opts?: { page?: number; q?: string }) => string;

  // 詳細（from を持ち回れる）
  detail: (id: number, opts?: { from?: string }) => string;

  // 新規作成（from を持ち回れる）
  new: (opts?: { from?: string }) => string;
};

function qs(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const vv = (v ?? '').trim();
    if (vv) sp.set(k, vv);
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export const adminUsersRoutes: UsersRoutes = {
  index: (opts) => {
    const page = opts?.page ?? 1;
    const q = opts?.q?.trim();
    return `/admin/users${qs({ page: String(page), q })}`;
  },

  detail: (id, opts) => {
    return `/admin/users/${id}${qs({ from: opts?.from })}`;
  },

  new: (opts) => {
    return `/admin/users/new${qs({ from: opts?.from })}`;
  },
};
