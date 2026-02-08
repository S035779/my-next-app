import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req)) return;

  const { userId, redirectToSignIn } = await auth();

  // ✅ 未ログインは「元のURL(req.url)」を returnBackUrl に入れて /sign-in へ
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // ログイン済みなら通す（admin判定は requireAdmin で）
});

export const config = {
  matcher: ['/admin/:path*'],
};
