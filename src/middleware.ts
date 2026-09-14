import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/cms/auth";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = pathname === "/admin/login" || pathname === "/api/admin/login";

  if (!isPublic) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(token);

    if (!session) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isPasswordChangeRoute =
      pathname === "/admin/passwort-aendern" || pathname === "/api/admin/change-password";
    if (session.mustChangePassword && !isPasswordChangeRoute) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { error: "Bitte zuerst ein eigenes Passwort vergeben." },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL("/admin/passwort-aendern", request.url));
    }

    const isUserManagement =
      pathname.startsWith("/admin/benutzer") || pathname.startsWith("/api/admin/users");
    if (isUserManagement && session.username !== process.env.CMS_ADMIN_USER) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { error: "Nur der Hauptadministrator kann Benutzer verwalten." },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (
      pathname === "/api/admin/shutdown" &&
      session.username !== process.env.CMS_ADMIN_USER
    ) {
      return NextResponse.json(
        { error: "Nur der Hauptadministrator kann das CMS beenden." },
        { status: 403 }
      );
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}
