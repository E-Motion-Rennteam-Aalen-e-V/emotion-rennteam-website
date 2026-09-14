/**
 * Delivers a validated form submission somewhere useful. If
 * FORM_WEBHOOK_URL is configured (e.g. a Slack/Teams incoming webhook, or a
 * small internal relay that sends email), the submission is POSTed there as
 * JSON. Otherwise it falls back to a structured server log so submissions
 * are never silently dropped — operators just need to set the env var to
 * start receiving them for real.
 */
/** Max time to wait for the webhook before giving up and logging a failure. */
const WEBHOOK_TIMEOUT_MS = 8000;

export type FormSubmission = {
  form: "contact" | "mitmachen" | "sponsoring" | "mediakit";
  submittedAt: string;
  data: Record<string, string>;
};

export async function deliverFormSubmission(
  form: FormSubmission["form"],
  data: Record<string, string>
): Promise<void> {
  const submission: FormSubmission = {
    form,
    submittedAt: new Date().toISOString(),
    data,
  };

  const webhookUrl = process.env.FORM_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error(`[form:${form}] FORM_WEBHOOK_URL is not configured — form submission cannot be delivered`);
    throw new Error("Formularversand ist momentan nicht verfügbar. Bitte versuche es später erneut.");
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
      // Every route handler `await`s this call before responding, so a
      // slow or unresponsive webhook endpoint would otherwise hold the
      // visitor's form submission open indefinitely (fetch has no default
      // timeout). Bound it so a misbehaving webhook degrades to a logged
      // failure instead of hanging the request.
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error(`[form:${form}] webhook delivery failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(`[form:${form}] webhook delivery threw`, error);
  }
}
