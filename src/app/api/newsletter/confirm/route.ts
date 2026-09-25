import { NextRequest, NextResponse } from "next/server";
import { verifyConfirmToken } from "@/lib/newsletterToken";
import { addNewsletterSubscriber, sendNewsletterNotifications } from "@/lib/newsletter";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";

  const ip = getClientIp(request);
  if (!checkRateLimit(`newsletter_confirm:${ip}`, 10, 60 * 60 * 1000)) {
    return NextResponse.redirect(new URL("/newsletter/confirm?status=error", request.url));
  }

  const verification = verifyConfirmToken(token);
  if (!verification.valid) {
    const status = verification.reason === "expired" ? "expired" : "invalid";
    return NextResponse.redirect(new URL(`/newsletter/confirm?status=${status}`, request.url));
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@resend.dev";

  if (!apiKey) {
    console.error("[newsletter/confirm] RESEND_API_KEY not configured");
    return NextResponse.redirect(new URL("/newsletter/confirm?status=error", request.url));
  }

  try {
    const added = await addNewsletterSubscriber(verification.email, apiKey);
    if (!added) {
      return NextResponse.redirect(new URL("/newsletter/confirm?status=error", request.url));
    }

    await sendNewsletterNotifications(verification.email, apiKey, fromEmail);

    console.log(`[newsletter/confirm] Confirmed: ${verification.email}`);
    return NextResponse.redirect(new URL("/newsletter/confirm?status=success", request.url));
  } catch (err) {
    console.error("[newsletter/confirm] Error:", err);
    return NextResponse.redirect(new URL("/newsletter/confirm?status=error", request.url));
  }
}
