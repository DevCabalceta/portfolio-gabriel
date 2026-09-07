import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";

export function proxy(request: NextRequest) {
  const savedLocale = request.cookies.get("portfolio-locale")?.value;
  const locale = savedLocale && isLocale(savedLocale) ? savedLocale : defaultLocale;
  return NextResponse.redirect(new URL(`/${locale}${request.nextUrl.search}`, request.url));
}

export const config = { matcher: ["/"] };
