export type Role = 'admin' | 'user';

type ClaimsWithRole = {
  publicMetadata?: { role?: unknown };
  metadata?: { role?: unknown };
};

function isRole(v: unknown): v is Role {
  return v === 'admin' || v === 'user';
}

export function getRoleFromSessionClaims(
  sessionClaims: unknown,
): Role | undefined {
  const claims = sessionClaims as ClaimsWithRole;
  const role = claims.publicMetadata?.role ?? claims.metadata?.role;
  return isRole(role) ? role : undefined;
}
