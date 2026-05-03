import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { LOCALES, DEFAULT_LOCALE } from '@/lib/constants';

const intlMiddleware = createIntlMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

// Public routes that don't require authentication
const PUBLIC_PATHS = ['/auth', '/products', '/search', '/categories', '/deals', '/api'];

function isPublicPath(pathname: string): boolean {
  // Root path
  if (pathname === '/' || pathname.match(/^\/(en|ar)(\/)?$/)) return true;
  // Public routes
  return PUBLIC_PATHS.some(path => pathname.includes(path)) ||
    pathname.match(/^\/(en|ar)?\/?(products|search|categories|deals|auth)(\/|$)/) !== null;
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin protection
    if (pathname.includes('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return intlMiddleware(req);
  },
  {
    pages: {
      signIn: '/auth/login',
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes are always accessible
        if (isPublicPath(pathname)) return true;

        // Protected routes require authentication
        // /account, /wishlist, /checkout, /admin require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
