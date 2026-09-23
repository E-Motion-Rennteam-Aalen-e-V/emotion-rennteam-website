import { Resend } from "resend";

const ADMIN_EMAIL = "denny.svalina@emotion-rennteam.de";
const NEWSLETTER_SEGMENT_ID = "newsletter_subscribers";

export interface NewsletterContact {
  email: string;
  subscribedAt: string;
  source: "web" | "admin";
}

/**
 * Speichert Newsletter-Kontakt in Resend und erstellt/aktualisiert Segment
 */
export async function addNewsletterSubscriber(email: string, apiKey: string): Promise<boolean> {
  try {
    const client = new Resend(apiKey);

    // 1. Kontakt in Resend hinzufügen/aktualisieren
    const contactResult = await client.contacts.create({
      email,
      unsubscribed: false,
      custom_attributes: {
        subscribed_at: new Date().toISOString(),
        source: "website",
      },
    });

    if (contactResult.error) {
      // Wenn Kontakt bereits existiert, ist das auch ok
      if (!contactResult.error.message?.includes("already exists")) {
        console.error("[newsletter] Resend contact creation failed:", contactResult.error);
        return false;
      }
    }

    console.log(`[newsletter] Subscriber added: ${email}`);
    return true;
  } catch (error) {
    console.error("[newsletter] Failed to add subscriber:", error);
    return false;
  }
}

/**
 * Versendet Benachrichtigungen an Admin + generischer Willkommens-Email an Nutzer
 */
export async function sendNewsletterNotifications(
  email: string,
  apiKey: string,
  fromEmail: string
): Promise<{ adminNotified: boolean; userWelcomed: boolean }> {
  try {
    const client = new Resend(apiKey);

    // Admin-Benachrichtigung
    const adminResult = await client.emails.send({
      from: fromEmail,
      to: ADMIN_EMAIL,
      subject: "Neue Newsletter-Anmeldung",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #1a1a1a;">Neue Newsletter-Anmeldung</h2>
            <p><strong>E-Mail:</strong> ${email}</p>
            <p><strong>Anmeldezeitpunkt:</strong> ${new Date().toLocaleString("de-DE")}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
            <p><small>Diese Person ist jetzt für den Newsletter angemeldet und kann über Resend damit verwaltet werden.</small></p>
          </body>
        </html>
      `,
    });

    const adminNotified = !adminResult.error;
    if (adminResult.error) {
      console.error("[newsletter] Failed to send admin notification:", adminResult.error);
    }

    // Willkommens-Email an Nutzer (nur Basic Info)
    const userResult = await client.emails.send({
      from: fromEmail,
      to: email,
      subject: "Willkommen zum Newsletter",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1a1a;">Willkommen! 🏁</h2>
            <p>Vielen Dank für deine Anmeldung zu unserem Newsletter!</p>
            <p>Du wirst in Zukunft Updates und Blog-Artikel von uns erhalten.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
            <p><small>Du kannst dich jederzeit abmelden, wenn du keine E-Mails mehr erhalten möchtest.</small></p>
          </body>
        </html>
      `,
    });

    const userWelcomed = !userResult.error;
    if (userResult.error) {
      console.error("[newsletter] Failed to send welcome email:", userResult.error);
    }

    return { adminNotified, userWelcomed };
  } catch (error) {
    console.error("[newsletter] Failed to send notifications:", error);
    return { adminNotified: false, userWelcomed: false };
  }
}

/**
 * Erstellt oder aktualisiert Newsletter-Template für Blog-Posts
 */
export async function ensureNewsletterTemplate(apiKey: string): Promise<string | null> {
  try {
    const client = new Resend(apiKey);

    // Template erstellen
    const templateResult = await client.templates.create({
      name: "Newsletter - Blog Post",
      description: "Template für Blog-Artikel Newsletter",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h2>{{ blog_title }}</h2>
            <p>{{ blog_excerpt }}</p>

            {{{blog_content}}}

            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
            <p>
              <a href="{{ blog_url }}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
                Vollständigen Artikel lesen
              </a>
            </p>
          </body>
        </html>
      `,
    });

    if (templateResult.error) {
      console.error("[newsletter] Failed to create template:", templateResult.error);
      return null;
    }

    console.log(`[newsletter] Template created: ${templateResult.data?.id}`);
    return templateResult.data?.id || null;
  } catch (error) {
    console.error("[newsletter] Failed to ensure template:", error);
    return null;
  }
}

/**
 * Versendet Newsletter mit Blog-Post an alle Abonnenten
 */
export async function sendBlogPostNewsletter(
  templateId: string,
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

    const broadcastResult = await client.broadcasts.create({
      from: fromEmail,
      template_id: templateId,
      audience_list_ids: [NEWSLETTER_SEGMENT_ID],
      subject: `[Blog] ${blogData.title}`,
    });

    if (broadcastResult.error) {
      console.error("[newsletter] Failed to create broadcast:", broadcastResult.error);
      return { success: false };
    }

    console.log(`[newsletter] Broadcast created: ${broadcastResult.data?.id}`);
    return { success: true, broadcastId: broadcastResult.data?.id };
  } catch (error) {
    console.error("[newsletter] Failed to send newsletter:", error);
    return { success: false };
  }
}
