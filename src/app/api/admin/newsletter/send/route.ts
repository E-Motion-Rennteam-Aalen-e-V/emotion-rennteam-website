import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/cms/auth";
import { sendBlogPostNewsletter, ensureNewsletterTemplate } from "@/lib/newsletter";

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
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const { templateId, blogData } = body as {
    templateId?: string;
    blogData?: {
      title: string;
      excerpt: string;
      content: string;
      url: string;
    };
  };

  if (!blogData || !blogData.title || !blogData.excerpt || !blogData.content || !blogData.url) {
    return NextResponse.json(
      { ok: false, error: "Missing required blog data fields" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@resend.dev";

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY not configured" },
      { status: 503 }
    );
  }

  try {
    // Template sicherstellen (wird verwiederverwendet wenn existiert)
    let template = templateId;
    if (!template) {
      template = await ensureNewsletterTemplate(apiKey);
      if (!template) {
        throw new Error("Failed to create newsletter template");
      }
    }

    // Newsletter versenden
    const result = await sendBlogPostNewsletter(template, blogData, apiKey, fromEmail);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: "Failed to send newsletter" },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      broadcastId: result.broadcastId,
      templateId: template,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[admin:newsletter:send]", message, err);
    return NextResponse.json(
      { ok: false, error: message },
      { status: 503 }
    );
  }
}
