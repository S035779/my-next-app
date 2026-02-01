export type Role = 'admin' | 'user';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getRoleFromSessionClaims(
  sessionClaims: unknown,
): Role | undefined {
  if (!isRecord(sessionClaims)) return undefined;

  const publicMetadata = sessionClaims.publicMetadata;
  if (!isRecord(publicMetadata)) return undefined;

  const role = publicMetadata.role;
  if (role === 'admin' || role === 'user') return role;

  return undefined;
}
