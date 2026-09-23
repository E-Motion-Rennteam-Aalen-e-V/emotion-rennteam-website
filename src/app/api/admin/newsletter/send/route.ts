import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/cms/auth";
import { sendBlogPostNewsletter } from "@/lib/newsletter";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const { blogData } = body as {
    blogData?: {
      title: string;
      excerpt: string;
      content: string;
      url: string;
    };
  };

  if (
    !blogData ||
    typeof blogData.title !== "string" ||
    typeof blogData.excerpt !== "string" ||
    typeof blogData.content !== "string" ||
    typeof blogData.url !== "string"
  ) {
    return NextResponse.json(
      { ok: false, error: "blogData mit title, excerpt, content und url ist erforderlich" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@resend.dev";
  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID;

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY nicht konfiguriert" },
      { status: 503 }
    );
  }

  if (!segmentId) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "RESEND_NEWSLETTER_SEGMENT_ID nicht konfiguriert. Bitte Segment-ID in .env.local eintragen.",
      },
      { status: 503 }
    );
  }

  try {
    const result = await sendBlogPostNewsletter(segmentId, blogData, apiKey, fromEmail);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: "Newsletter konnte nicht versendet werden" },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true, broadcastId: result.broadcastId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Interner Fehler";
    console.error("[admin:newsletter:send]", message, err);
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
}
