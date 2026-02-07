import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req)) return;

  // ログイン必須（未ログインは sign-in に誘導）
  await auth.protect({
    unauthenticatedUrl: '/sign-in',
    unauthorizedUrl: '/forbidden',
  });
});

// /admin 配下だけで proxy を走らせる（最小・高速）
export const config = {
  matcher: ['/admin/:path*'],
};