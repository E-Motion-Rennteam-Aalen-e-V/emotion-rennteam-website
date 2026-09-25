import { Resend } from "resend";

const ADMIN_EMAIL = process.env.RESEND_RECIPIENT_EMAIL || "info@emotion-rennteam.de";

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function getSegmentId(): string | null {
  return process.env.RESEND_NEWSLETTER_SEGMENT_ID ?? null;
}

/**
 * Speichert Newsletter-Kontakt in Resend (global oder einem Segment zugeordnet)
 */
export async function addNewsletterSubscriber(email: string, apiKey: string): Promise<boolean> {
  try {
    const client = new Resend(apiKey);
    const segmentId = getSegmentId();

    const contactPayload = segmentId
      ? {
          email,
          unsubscribed: false,
          properties: { subscribed_at: new Date().toISOString(), source: "website" },
          segments: [{ id: segmentId }],
        }
      : {
          email,
          unsubscribed: false,
          properties: { subscribed_at: new Date().toISOString(), source: "website" },
        };

    const contactResult = await client.contacts.create(contactPayload);

    if (contactResult.error) {
      // Kontakt bereits vorhanden ist kein Fehler
      if (!contactResult.error.message?.includes("already exists")) {
        console.error("[newsletter] Resend contact creation failed:", contactResult.error);
        return false;
      }
    }

    console.log(`[newsletter] Subscriber added/exists: ${email}`);
    return true;
  } catch (error) {
    console.error("[newsletter] Failed to add subscriber:", error);
    return false;
  }
}

/**
 * Sendet Admin-Benachrichtigung + Willkommens-E-Mail an neuen Abonnenten
 */
export async function sendNewsletterNotifications(
  email: string,
  apiKey: string,
  fromEmail: string
): Promise<{ adminNotified: boolean; userWelcomed: boolean }> {
  try {
    const client = new Resend(apiKey);
    const now = new Date().toLocaleString("de-DE");

    const [adminResult, userResult] = await Promise.all([
      client.emails.send({
        from: fromEmail,
        to: ADMIN_EMAIL,
        subject: "Neue Newsletter-Anmeldung",
        html: `
          <html><body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto">
            <h2>Neue Newsletter-Anmeldung</h2>
            <table style="border-collapse:collapse;width:100%">
              <tr><td style="padding:8px;border-bottom:1px solid #e0e0e0;font-weight:500">E-Mail:</td><td style="padding:8px;border-bottom:1px solid #e0e0e0">${escHtml(email)}</td></tr>
              <tr><td style="padding:8px;font-weight:500">Zeitpunkt:</td><td style="padding:8px">${now}</td></tr>
            </table>
            <p style="margin-top:16px;color:#666;font-size:14px">Dieser Kontakt wurde automatisch in Resend gespeichert.</p>
          </body></html>
        `,
      }),
      client.emails.send({
        from: fromEmail,
        to: email,
        subject: "Willkommen beim E-Motion Rennteam Newsletter!",
        html: `
          <html><body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto">
            <h2 style="color:#1a1a1a">Willkommen! 🏁</h2>
            <p>Vielen Dank für deine Anmeldung zu unserem Newsletter!</p>
            <p>Du wirst ab sofort über neue Blog-Artikel, Rennergebnisse und Team-Updates informiert.</p>
            <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0">
            <p style="font-size:12px;color:#999">Wenn du diese E-Mail nicht angefordert hast, kannst du sie ignorieren. Du kannst dich jederzeit abmelden.</p>
          </body></html>
        `,
      }),
    ]);

    return {
      adminNotified: !adminResult.error,
      userWelcomed: !userResult.error,
    };
  } catch (error) {
    console.error("[newsletter] Failed to send notifications:", error);
    return { adminNotified: false, userWelcomed: false };
  }
}

/**
 * Erstellt ein Template in Resend für Blog-Post-Versand.
 * Gibt die Template-ID zurück oder null bei Fehler.
 */
export async function ensureNewsletterTemplate(apiKey: string): Promise<string | null> {
  try {
    const client = new Resend(apiKey);

    const templateResult = await client.templates.create({
      name: "Newsletter – Blog Artikel",
      subject: "Neuer Artikel: {{blog_title}}",
      from: process.env.RESEND_FROM_EMAIL || undefined,
      html: `
        <html><body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto">
          <h2 style="color:#1a1a1a">{{blog_title}}</h2>
          <p style="color:#555;font-size:16px;line-height:1.6">{{blog_excerpt}}</p>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0">
          <div style="line-height:1.8">{{{blog_content}}}</div>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0">
          <a href="{{blog_url}}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:4px;font-weight:600">
            Vollständigen Artikel lesen →
          </a>
          <p style="margin-top:24px;font-size:12px;color:#999">
            Du erhältst diese E-Mail, weil du den E-Motion Rennteam Newsletter abonniert hast.
          </p>
        </body></html>
      `,
      variables: [
        { key: "blog_title", type: "string", fallbackValue: "Neuer Artikel" },
        { key: "blog_excerpt", type: "string", fallbackValue: "" },
        { key: "blog_content", type: "string", fallbackValue: "" },
        { key: "blog_url", type: "string", fallbackValue: "https://emotion-rennteam.de/blog" },
      ],
    });

    if (templateResult.error) {
      console.error("[newsletter] Template creation failed:", templateResult.error);
      return null;
    }

    console.log(`[newsletter] Template created: ${templateResult.data?.id}`);
    return templateResult.data?.id ?? null;
  } catch (error) {
    console.error("[newsletter] Failed to create template:", error);
    return null;
  }
}

/**
 * Versendet Newsletter an alle Abonnenten im konfigurierten Segment.
 * Erstellt zuerst einen Broadcast-Draft und versendet ihn dann.
 */
export async function sendBlogPostNewsletter(
  segmentOrAudienceId: string,
  blogData: {
    title: string;
    excerpt: string;
    content: string;
    url: string;
  },
  apiKey: string,
  fromEmail: string
): Promise<{ success: boolean; broadcastId?: string }> {
  try {
    const client = new Resend(apiKey);

    // 1. Broadcast erstellen
    const createResult = await client.broadcasts.create({
      name: `Blog: ${blogData.title}`,
      subject: `Neuer Artikel: ${blogData.title}`,
      from: fromEmail,
      segmentId: segmentOrAudienceId,
      html: `
        <html><body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto">
          <h2 style="color:#1a1a1a">${escHtml(blogData.title)}</h2>
          <p style="color:#555;font-size:16px;line-height:1.6">${escHtml(blogData.excerpt)}</p>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0">
          <div style="line-height:1.8">${escHtml(blogData.content)}</div>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0">
          <a href="${escHtml(blogData.url)}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:4px;font-weight:600">
            Vollständigen Artikel lesen →
          </a>
          <p style="margin-top:24px;font-size:12px;color:#999">
            Du erhältst diese E-Mail, weil du den E-Motion Rennteam Newsletter abonniert hast.
          </p>
        </body></html>
      `,
    });

    if (createResult.error) {
      console.error("[newsletter] Broadcast creation failed:", createResult.error);
      return { success: false };
    }

    const broadcastId = createResult.data?.id;
    if (!broadcastId) {
      console.error("[newsletter] No broadcast ID returned");
      return { success: false };
    }

    // 2. Broadcast sofort versenden
    const sendResult = await client.broadcasts.send(broadcastId);
    if (sendResult.error) {
      console.error("[newsletter] Broadcast send failed:", sendResult.error);
      return { success: false };
    }

    console.log(`[newsletter] Broadcast sent: ${broadcastId}`);
    return { success: true, broadcastId };
  } catch (error) {
    console.error("[newsletter] Failed to send newsletter:", error);
    return { success: false };
  }
}
