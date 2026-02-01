import { describe, it, expect } from 'vitest';
import { db } from './cli';
import { usersRepo } from './users.repo';

const repo = usersRepo(db);

describe('users.repo (integration)', () => {
  it('create -> find -> update -> delete', async () => {
    const email = `t_${Date.now()}@example.com`;

    const id = await repo.createUser(email, 'Test User');
    expect(Number.isFinite(Number(id))).toBe(true);

    const user = await repo.findUserById(Number(id));
    expect(user).not.toBeNull();
    expect(user!.email).toBe(email);

    await repo.updateUser(Number(id), email, 'Updated');
    const updated = await repo.findUserById(Number(id));
    expect(updated!.name).toBe('Updated');

    await repo.deleteUser(Number(id));
    const after = await repo.findUserById(Number(id));
    expect(after).toBeNull();
  });
});
