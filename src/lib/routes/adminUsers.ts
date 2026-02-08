export const adminUsersRoutes = {
  usersIndex: '/admin/users',
  userDetail: (id: number) => `/admin/users/${id}`,
  userNew: '/admin/users/new',
} as const;
