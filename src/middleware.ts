import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { verifyAccessToken } from './lib/auth/jwt';
import { query } from './lib/db';

const intlMiddleware = createMiddleware(routing);

async function checkRedirect(pathname: string): Promise<{ to: string; type: number } | null> {
  try {
    const cleanPath = pathname.replace(/^\/(cs|en)/, '') || '/';

    const redirectResult = await query(
      'SELECT "to", type FROM redirects WHERE "from" = $1 AND "isActive" = true',
      [cleanPath]
    );

    if (redirectResult.rows.length === 0) {
      return null;
    }

    const redirect = redirectResult.rows[0];
    return {
      to: redirect.to,
      type: parseInt(redirect.type),
    };
  } catch (error) {
    console.error('Redirect check failed:', error);
    return null;
  }
}

function checkAuth(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = pathname.replace(/^\/(cs|en)/, '') || '/';

  if (pathWithoutLocale.startsWith('/ucet')) {
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      const loginUrl = new URL('/prihlaseni', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      verifyAccessToken(accessToken);
      return null;
    } catch (error) {
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

  const redirect = await checkRedirect(pathname);
  if (redirect) {
    const redirectUrl = new URL(redirect.to, request.url);
    return NextResponse.redirect(redirectUrl, { status: redirect.type });
  }

  const authResponse = checkAuth(request);
  if (authResponse) {
    return authResponse;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|api|admin|.*\\..*).*)'],
};