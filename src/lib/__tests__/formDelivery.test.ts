import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const appendFileSyncMock = vi.hoisted(() => vi.fn());
const sendEmailMock = vi.hoisted(() => vi.fn());

vi.mock("node:fs", () => ({
  appendFileSync: appendFileSyncMock,
  default: { appendFileSync: appendFileSyncMock },
}));

vi.mock("resend", () => ({
  Resend: function Resend() {
    return { emails: { send: sendEmailMock } };
  },
}));

import { deliverFormSubmission } from "@/lib/formDelivery";

describe("deliverFormSubmission", () => {
  const originalApiKey = process.env.RESEND_API_KEY;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    appendFileSyncMock.mockReset();
    sendEmailMock.mockReset();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    if (originalApiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalApiKey;
    vi.restoreAllMocks();
  });

  it("persists to fallback file and logs error when RESEND_API_KEY is unset", async () => {
    delete process.env.RESEND_API_KEY;

    await deliverFormSubmission("contact", { name: "Ada", email: "ada@example.com" });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[form:contact] ACTION REQUIRED: RESEND_API_KEY is not configured")
    );
    expect(appendFileSyncMock).toHaveBeenCalledTimes(1);
    const [, contents] = appendFileSyncMock.mock.calls[0];
    const written = JSON.parse(contents as string);
    expect(written).toMatchObject({
      form: "contact",
      data: { name: "Ada", email: "ada@example.com" },
      reason: "no_api_key_configured",
    });
  });

  it("sends email via Resend when API key is configured", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.RESEND_FROM_EMAIL = "noreply@emotion-rennteam.de";
    sendEmailMock.mockResolvedValue({
      data: { id: "email_123" },
      error: null,
    });

    await deliverFormSubmission("sponsoring", { company: "Acme" });

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const [call] = sendEmailMock.mock.calls;
    expect(call[0].from).toBe("noreply@emotion-rennteam.de");
    expect(call[0].to).toBe("denny.svalina@emotion-rennteam.de");
    expect(call[0].subject).toContain("Sponsoring-Anfrage");
    expect(call[0].html).toContain("Acme");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("[form:sponsoring] Email sent successfully")
    );
    expect(appendFileSyncMock).not.toHaveBeenCalled();
  });

  it("logs error and persists to fallback when Resend returns error", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    const testError = { message: "Invalid email" };
    sendEmailMock.mockResolvedValue({
      data: null,
      error: testError,
    });

    await deliverFormSubmission("mitmachen", { name: "Bob" });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[form:mitmachen] Resend delivery failed:",
      testError
    );
    expect(appendFileSyncMock).toHaveBeenCalledTimes(1);
    const written = JSON.parse(appendFileSyncMock.mock.calls[0][1] as string);
    expect(written.reason).toBe("resend_error");
  });

  it("logs error and persists to fallback when Resend throws", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    const testError = new Error("Network error");
    sendEmailMock.mockRejectedValue(testError);

    await deliverFormSubmission("newsletter", { email: "test@example.com" });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[form:newsletter] Resend delivery threw",
      testError
    );
    expect(appendFileSyncMock).toHaveBeenCalledTimes(1);
    const written = JSON.parse(appendFileSyncMock.mock.calls[0][1] as string);
    expect(written.reason).toBe("resend_threw");
  });
});
