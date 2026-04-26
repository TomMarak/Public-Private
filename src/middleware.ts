import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { jwtVerify } from 'jose/jwt/verify';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// TextEncoder is available in Edge runtime; pre-compute the key once
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'development_secret'
);

// Redirect checking against the DB cannot run in Edge runtime (pg requires
// Node.js net/crypto).  Dynamic redirects from the Redirects collection are
// handled by the catch-all page at the route level instead.

async function checkAuth(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = pathname.replace(/^\/(cs|en)/, '') || '/';

  if (pathWithoutLocale.startsWith('/ucet')) {
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      const loginUrl = new URL('/prihlaseni', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(accessToken, JWT_SECRET);
      return null;
    } catch {
      const loginUrl = new URL('/prihlaseni', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin/') ||
    pathname.includes('.') ||
    pathname.startsWith('/_next/')
  ) {
    return NextResponse.next();
  }

  const authResponse = await checkAuth(request);
  if (authResponse) {
    return authResponse;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|api|admin|.*\\..*).*)'],
};
