import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req)) return NextResponse.next();

  const { userId } = await auth();

  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', new URL(req.url).pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

// /admin 配下だけで proxy を走らせる（最小・高速）
export const config = {
  matcher: ['/admin/:path*'],
};
