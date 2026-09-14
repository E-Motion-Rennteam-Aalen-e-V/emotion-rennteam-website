import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/cms/auth";
import { burnPasswordVerificationTime, verifyPassword } from "@/lib/cms/password";
import { findUser } from "@/lib/cms/users";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`cms-login:${ip}`, 5, 5 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Zu viele Anmeldeversuche. Bitte in ein paar Minuten erneut versuchen." },
      { status: 429 }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { username, password } = body;
  const adminUser = process.env.CMS_ADMIN_USER;
  const adminHash = process.env.CMS_ADMIN_PASSWORD_HASH;

  if ((!adminUser || !adminHash) && typeof username === "string" && !findUser(username)) {
    return NextResponse.json(
      { error: "CMS-Login ist serverseitig nicht konfiguriert (CMS_ADMIN_USER/CMS_ADMIN_PASSWORD_HASH fehlen)." },
      { status: 503 }
    );
  }

  const sessionSecret = process.env.CMS_SESSION_SECRET;
  if (!sessionSecret || sessionSecret.length < 16) {
    return NextResponse.json(
      { error: "CMS-Login ist serverseitig nicht konfiguriert (CMS_SESSION_SECRET fehlt oder ist zu kurz)." },
      { status: 503 }
    );
  }

  let mustChangePassword = false;
  let authenticated = false;

  if (typeof username === "string" && typeof password === "string") {
    if (adminUser && adminHash && username === adminUser && verifyPassword(password, adminHash)) {
      authenticated = true;
    } else {
      const user = findUser(username);
      if (user && verifyPassword(password, user.passwordHash)) {
        authenticated = true;
        mustChangePassword = user.mustChangePassword;
      } else if (!user) {
        // No such user: still do scrypt-equivalent work so this branch
        // takes about as long as a wrong-password attempt for a real user,
        // closing the timing side channel that would otherwise let an
        // attacker enumerate valid usernames (see password.ts).
        burnPasswordVerificationTime(password);
      }
    }
  }

  if (!authenticated) {
    return NextResponse.json({ error: "Benutzername oder Passwort ist falsch." }, { status: 401 });
  }

  const token = await createSessionToken(username as string, mustChangePassword);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
