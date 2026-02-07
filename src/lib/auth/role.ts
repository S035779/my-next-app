export type Role = 'admin' | 'user';

type ClaimsWithRole = {
  publicMetadata?: { role?: string };
  metadata?: { role?: string };
};

export function getRoleFromSessionClaims(
  sessionClaims: unknown,
): Role | undefined {
  const claims = sessionClaims as unknown as ClaimsWithRole;
  const role = claims.publicMetadata?.role ?? claims.metadata?.role;
  return role as Role | undefined;
}
