import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Newsletter-Bestätigung",
  robots: { index: false },
};

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function NewsletterConfirmPage({ searchParams }: Props) {
  const { status } = await searchParams;

  const content = {
    success: {
      icon: "✓",
      iconColor: "text-green-400",
      heading: "Anmeldung bestätigt!",
      body: "Du bist jetzt für den E-Motion Rennteam Newsletter angemeldet. Wir halten dich über Rennergebnisse, neue Fahrzeuge und Team-Updates auf dem Laufenden.",
    },
    expired: {
      icon: "⏰",
      iconColor: "text-yellow-400",
      heading: "Link abgelaufen",
      body: "Dein Bestätigungslink ist nach 24 Stunden abgelaufen. Bitte melde dich erneut an, um einen neuen Link zu erhalten.",
    },
    invalid: {
      icon: "✕",
      iconColor: "text-red-400",
      heading: "Ungültiger Link",
      body: "Der Bestätigungslink ist ungültig. Bitte melde dich erneut an oder kontaktiere uns, falls das Problem weiterhin besteht.",
    },
    error: {
      icon: "!",
      iconColor: "text-red-400",
      heading: "Ein Fehler ist aufgetreten",
      body: "Die Bestätigung konnte nicht abgeschlossen werden. Bitte versuche es später erneut oder kontaktiere uns.",
    },
  } as const;

  const state =
    status === "success" || status === "expired" || status === "invalid" || status === "error"
      ? status
      : "invalid";

  const { icon, iconColor, heading, body } = content[state];

  return (
    <main className="container-page flex min-h-[60vh] items-center justify-center py-20">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 text-center">
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-2xl font-bold ${iconColor}`}>
          {icon}
        </div>
        <h1 className="mb-3 text-xl font-semibold">{heading}</h1>
        <p className="text-sm text-muted">{body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
          >
            Zur Startseite
          </Link>
          {state !== "success" && (
            <Link
              href="/kontakt"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent/50"
            >
              Kontakt
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
