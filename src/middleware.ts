import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

// Add project slugs that should be open without password
const PUBLIC_PROJECTS = [
  "/work/mdetect",
  "/work/low-voltage-electrical-system-design",

];

function isProjectPath(pathname: string) {
  return pathname.startsWith("/work/");
}

function isPublicProject(pathname: string) {
  return PUBLIC_PROJECTS.some(
    (projectPath) =>
      pathname === projectPath || pathname.startsWith(`${projectPath}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isPublicPath =
    pathname.startsWith("/access") ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/logout") ||
    pathname.startsWith("/api/check-auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/trademark") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname);

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Keep main project list page open
  if (pathname === "/work") {
    return NextResponse.next();
  }

  // Keep selected project pages open
  if (isPublicProject(pathname)) {
    return NextResponse.next();
  }

  // Only protect the remaining individual project pages
  if (!isProjectPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = process.env.SITE_ACCESS_TOKEN;
  const authCookie = request.cookies.get("site-auth")?.value;

  if (accessToken && authCookie === accessToken) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/access";
  loginUrl.searchParams.set("redirect", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};