import Link from "next/link";
import path from "node:path";
import { collections } from "@/lib/cms/collections";
import { listItems } from "@/lib/cms/content";
import { getGithubConfig } from "@/lib/cms/github";
import { listUploadedImages } from "@/lib/cms/media";
import { existsSync, readFileSync } from "node:fs";

function countPendingSubmissions(): number {
  const file = path.join(process.cwd(), ".pending-form-submissions.jsonl");
  if (!existsSync(file)) return 0;
  try {
    const lines = readFileSync(file, "utf-8").trim().split("\n").filter(Boolean);
    return lines.length;
  } catch {
    return 0;
  }
}

export default async function AdminDashboard() {
  const [counts, mediaCount] = await Promise.all([
    Promise.all(collections.map((c) => listItems(c.name).then((items) => items.length))),
    listUploadedImages().then((files) => files.length),
  ]);
  const githubConnected = Boolean(getGithubConfig());
  const webhookConfigured = Boolean(process.env.FORM_WEBHOOK_URL);
  const pendingSubmissions = webhookConfigured ? 0 : countPendingSubmissions();

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Übersicht</h1>
        <p className="text-sm text-muted">Wähle einen Inhaltsbereich aus, um Texte und Bilder zu bearbeiten.</p>
      </div>

      <div
        className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
          githubConnected
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            : "border-amber-500/30 bg-amber-500/10 text-amber-300"
        }`}
      >
        <span aria-hidden>{githubConnected ? "✓" : "!"}</span>
        <p>
          {githubConnected
            ? "GitHub-Anbindung aktiv – jede Speicherung wird automatisch als Commit ins Repository geschrieben."
            : "GitHub-Anbindung ist nicht konfiguriert (GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO fehlen). Änderungen werden nur lokal gespeichert und nicht auf GitHub gesichert."}
        </p>
      </div>

      {!webhookConfigured && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          <span aria-hidden>!</span>
          <p>
            <strong>FORM_WEBHOOK_URL nicht konfiguriert</strong> – Kontakt-, Bewerbungs- und Sponsoring-Anfragen
            werden nicht zugestellt, sondern nur lokal in{" "}
            <code className="font-mono">.pending-form-submissions.jsonl</code> gepuffert.
            {pendingSubmissions > 0 && (
              <> Aktuell {pendingSubmissions} ausstehende Einreichung{pendingSubmissions !== 1 ? "en" : ""}.</>
            )}{" "}
            Einen Webhook (z.B. Make.com oder Zapier) in <code className="font-mono">.env.local</code> eintragen.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c, i) => (
          <Link
            key={c.name}
            href={`/admin/${c.name}`}
            className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground group-hover:text-accent-text">{c.label}</h2>
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">{counts[i]}</span>
            </div>
            <p className="mt-1.5 text-xs text-muted">{c.path}</p>
          </Link>
        ))}

        {/* Media library card */}
        <Link
          href="/admin/medien"
          className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground group-hover:text-accent-text">Medienbibliothek</h2>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">{mediaCount}</span>
          </div>
          <p className="mt-1.5 text-xs text-muted">public/uploads</p>
        </Link>
      </div>
    </div>
  );
}
