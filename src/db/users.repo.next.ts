import 'server-only';
import { db } from './index';
import { usersRepo } from './users.repo';

export const {
  listUsers,
  findUserById,
  findUserIdByEmail,
  createUser,
  updateUser,
  deleteUser,
} = usersRepo(db);
