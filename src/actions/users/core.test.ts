import { describe, it, expect, vi } from 'vitest';
import { createUserCore } from './core';
import type { Deps } from './core';
import { adminUsersRoutes } from '../../lib/routes/adminUsers';

function fd(obj: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.set(k, v);
  return f;
}

describe('createUserCore', () => {
  it('redirects on success', async () => {
    const deps: Deps = {
      requireAdmin: vi.fn<() => Promise<void>>(async () => {}),
      createUser: vi.fn<
        (email: string, name: string | null) => Promise<number>
      >(async () => 10),
      updateUser: vi.fn<
        (id: number, email: string, name: string | null) => Promise<boolean>
      >(async () => true),
      deleteUser: vi.fn<(id: number) => Promise<boolean>>(async () => true),
      routes: adminUsersRoutes,
    };

    const res = await createUserCore(
      deps,
      {},
      fd({ email: 'a@a.com', name: 'A' }),
    );

    expect(res.effect.kind).toBe('redirect');
    if (res.effect.kind === 'redirect') {
      expect(res.effect.to).toBe(
        deps.routes.detail(10, { from: deps.routes.index({ page: 1 }) }),
      );
    }
    expect(deps.createUser).toHaveBeenCalledWith('a@a.com', 'A');
  });

  it('returns field error on validation fail', async () => {
    const deps: Deps = {
      requireAdmin: vi.fn<() => Promise<void>>(async () => {}),
      createUser:
        vi.fn<(email: string, name: string | null) => Promise<number>>(),
      updateUser:
        vi.fn<
          (id: number, email: string, name: string | null) => Promise<boolean>
        >(),
      deleteUser: vi.fn<(id: number) => Promise<boolean>>(),
      routes: adminUsersRoutes,
    };
    const res = await createUserCore(deps, {}, fd({ email: '' }));
    expect(res.effect.kind).toBe('none');
    expect(res.state.fieldErrors?.email).toBeTruthy();
    expect(deps.createUser).not.toHaveBeenCalled();
  });

  it('bubbles up auth error (unit boundary)', async () => {
    const deps: Deps = {
      requireAdmin: vi.fn<() => Promise<void>>(async () => {
        throw new Error('Forbidden');
      }),
      createUser:
        vi.fn<(email: string, name: string | null) => Promise<number>>(),
      updateUser:
        vi.fn<
          (id: number, email: string, name: string | null) => Promise<boolean>
        >(),
      deleteUser: vi.fn<(id: number) => Promise<boolean>>(),
      routes: adminUsersRoutes,
    };

    await expect(
      createUserCore(deps, {}, fd({ email: 'a@a.com' })),
    ).rejects.toThrow('Forbidden');
  });
});
