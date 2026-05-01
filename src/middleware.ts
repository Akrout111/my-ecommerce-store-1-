import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18nConfig, isValidLocale } from "@/i18n/config";

function getLocale(request: NextRequest): string {
  // Check cookie for saved locale preference
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (localeCookie && isValidLocale(localeCookie)) {
    return localeCookie;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(",")[0].split("-")[0].toLowerCase();
    if (isValidLocale(preferred)) {
      return preferred;
    }
  }

  return i18nConfig.defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and internal paths
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = i18nConfig.locales.some(
    (locale) => pathname.startsWith(`/${locale.code}/`) || pathname === `/${locale.code}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to locale-prefixed path
  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  const response = NextResponse.redirect(newUrl);

  // Set locale cookie
  response.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|images|icons|.*\\..*).*)"],
};
