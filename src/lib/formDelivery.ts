import { Resend } from "resend";
import { appendFileSync } from "node:fs";
import path from "node:path";

const FALLBACK_FILE = path.join(process.cwd(), ".pending-form-submissions.jsonl");
const RECIPIENT_EMAIL = "info@emotion-rennteam.de";

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

function formatSubmissionEmail(submission: FormSubmission): string {
  const formLabel = formLabels[submission.form];
  const dataRows = Object.entries(submission.data)
    .map(([key, value]) => `<tr><td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-weight: 500;">${key}:</td><td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${value}</td></tr>`)
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
    }
  } catch (error) {
    console.error(`[form:${form}] Resend delivery threw`, error);
    persistToFallbackFile(submission, "resend_threw");
  }
}
