import { Resend } from "resend";
import { appendFileSync } from "node:fs";
import path from "node:path";

const FALLBACK_FILE = path.join(process.cwd(), ".pending-form-submissions.jsonl");
const RECIPIENT_EMAIL = process.env.RESEND_RECIPIENT_EMAIL || "info@emotion-rennteam.de";

export type FormSubmission = {
  form: "contact" | "newsletter" | "mitmachen" | "sponsoring" | "mediakit";
  submittedAt: string;
  data: Record<string, string>;
};

const formLabels: Record<FormSubmission["form"], string> = {
  contact: "Kontaktformular",
  newsletter: "Newsletter-Anmeldung",
  mitmachen: "Mitgliedsantrag",
  sponsoring: "Sponsoring-Anfrage",
  mediakit: "Mediakit-Anfrage",
};

function persistToFallbackFile(submission: FormSubmission, reason: string): void {
  try {
    appendFileSync(FALLBACK_FILE, JSON.stringify({ ...submission, reason }) + "\n", "utf-8");
  } catch (error) {
    console.error(`[form:${submission.form}] failed to write fallback file`, error);
  }
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function formatSubmissionEmail(submission: FormSubmission): string {
  const formLabel = formLabels[submission.form];
  const dataRows = Object.entries(submission.data)
    .map(([key, value]) => `<tr><td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-weight: 500;">${escHtml(key)}:</td><td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${escHtml(value)}</td></tr>`)
    .join("");

  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #1a1a1a;">Neue Einreichung: ${formLabel}</h2>
        <p><strong>Eingereicht am:</strong> ${new Date(submission.submittedAt).toLocaleString("de-DE")}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          ${dataRows}
        </table>
      </body>
    </html>
  `;
}

const customerConfirmationMessages: Record<FormSubmission["form"], { subject: string; body: string }> = {
  contact: {
    subject: "Wir haben deine Nachricht erhalten",
    body: "Vielen Dank für deine Kontaktanfrage! Wir haben deine Nachricht erhalten und werden uns schnellstmöglich bei dir melden.",
  },
  newsletter: {
    subject: "Willkommen zum Newsletter!",
    body: "Herzlich willkommen! Du wirst ab sofort alle Updates rund um e-motion Rennteam Aalen erhalten.",
  },
  mitmachen: {
    subject: "Danke für deine Anmeldung",
    body: "Vielen Dank für dein Interesse an e-motion Rennteam Aalen! Wir haben deine Anmeldung erhalten und werden uns demnächst mit dir in Verbindung setzen.",
  },
  sponsoring: {
    subject: "Danke für deine Anfrage",
    body: "Vielen Dank für dein Interesse an einer Sponsorship mit e-motion Rennteam Aalen! Wir werden deine Anfrage prüfen und uns zeitnah bei dir melden.",
  },
  mediakit: {
    subject: "Danke für deine Anfrage",
    body: "Vielen Dank für deine Mediakit-Anfrage! Wir werden deine Anfrage bearbeiten und dir die angeforderten Materialien sobald wie möglich zukommen lassen.",
  },
};

function getCustomerConfirmationEmail(form: FormSubmission["form"]): string {
  const { subject, body } = customerConfirmationMessages[form];
  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #1a1a1a;">${subject}</h2>
        <p>${body}</p>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Mit freundlichen Grüßen,<br>
          e-motion Rennteam Aalen
        </p>
      </body>
    </html>
  `;
}

async function sendCustomerConfirmationEmail(
  form: FormSubmission["form"],
  customerEmail: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[form:${form}] RESEND_API_KEY not configured - skipping customer confirmation`);
    return;
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@resend.dev";
    const client = new Resend(apiKey);
    const { subject } = customerConfirmationMessages[form];

    const response = await client.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject,
      html: getCustomerConfirmationEmail(form),
    });

    if (response.error) {
      console.error(
        `[form:${form}] Customer confirmation delivery failed to ${customerEmail}:`,
        response.error
      );
    } else {
      console.log(
        `[form:${form}] Customer confirmation sent to ${customerEmail} (ID: ${response.data?.id})`
      );
    }
  } catch (error) {
    console.error(`[form:${form}] Customer confirmation threw:`, error);
  }
}

export async function deliverFormSubmission(
  form: FormSubmission["form"],
  data: Record<string, string>
): Promise<void> {
  const submission: FormSubmission = {
    form,
    submittedAt: new Date().toISOString(),
    data,
  };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      `[form:${form}] ACTION REQUIRED: RESEND_API_KEY is not configured - submission written to ${FALLBACK_FILE}`
    );
    persistToFallbackFile(submission, "no_api_key_configured");
    return;
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@resend.dev";
    const client = new Resend(apiKey);
    const response = await client.emails.send({
      from: fromEmail,
      to: RECIPIENT_EMAIL,
      subject: `[${formLabels[form]}] Neue Einreichung`,
      html: formatSubmissionEmail(submission),
    });

    if (response.error) {
      console.error(`[form:${form}] Resend delivery failed:`, response.error);
      persistToFallbackFile(submission, "resend_error");
    } else {
      console.log(`[form:${form}] Email sent successfully (ID: ${response.data?.id})`);

      const customerEmail = data.email;
      if (customerEmail) {
        await sendCustomerConfirmationEmail(form, customerEmail);
      }
    }
  } catch (error) {
    console.error(`[form:${form}] Resend delivery threw`, error);
    persistToFallbackFile(submission, "resend_threw");
  }
}
