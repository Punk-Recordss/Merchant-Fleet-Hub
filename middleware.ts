import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/auth');
  const isPublicAsset = request.nextUrl.pathname.match(/\.(.*)$/);

  // If no session and not on auth page, redirect to login
  if (!session && !isAuthPage && !isPublicAsset) {
      if (process.env.NODE_ENV === 'development') {
          return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If session exists and user is on login page, redirect to home
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
