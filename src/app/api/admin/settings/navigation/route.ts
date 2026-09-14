import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getSessionUser } from "@/lib/cms/auth";
import { commitFile, getGithubConfig } from "@/lib/cms/github";
import { syncLocalGitAfterCommit } from "@/lib/cms/content";
import { NAV_ITEMS, isNavItemVisible } from "@/lib/nav";
import { NAV_SETTINGS_REL_PATH, getNavVisibility } from "@/lib/nav-settings.server";

const ABS_PATH = path.join(/* turbopackIgnore: true */ process.cwd(), NAV_SETTINGS_REL_PATH);

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const visibility = await getNavVisibility();
  const items = NAV_ITEMS.map((item) => ({ ...item, visible: isNavItemVisible(item.id, visibility) }));
  return NextResponse.json({ items });
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  let body: { visibility?: Record<string, boolean> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const incoming = body.visibility ?? {};
  const knownIds = new Set(NAV_ITEMS.map((item) => item.id));
  // Only ever store explicit "hidden" entries - a missing key already means
  // "visible" (see getNavVisibility()), which keeps the file minimal and
  // means newly added nav items default to visible without touching this file.
  const toStore: Record<string, boolean> = {};
  for (const [id, visible] of Object.entries(incoming)) {
    if (!knownIds.has(id)) continue;
    if (visible === false) toStore[id] = false;
  }

  const content = `${JSON.stringify(toStore, null, 2)}\n`;

  // Best-effort local write so the running dev instance reflects the change
  // immediately - same pattern as saveItem() in lib/cms/content.ts. The
  // GitHub commit below is the source of truth.
  try {
    await fs.mkdir(path.dirname(ABS_PATH), { recursive: true });
    await fs.writeFile(ABS_PATH, content, "utf-8");
  } catch {
    // ignore (read-only filesystem in some deployments)
  }

  if (!getGithubConfig()) {
    return NextResponse.json({
      committedToGithub: false,
      commitUrl: null,
      warning:
        "GitHub-Anbindung ist nicht konfiguriert (GITHUB_TOKEN/GITHUB_OWNER/GITHUB_REPO). Änderung wurde nur lokal gespeichert und ist NICHT auf GitHub gesichert.",
    });
  }

  try {
    const { commitUrl } = await commitFile(
      NAV_SETTINGS_REL_PATH,
      content,
      "cms: Menü-Sichtbarkeit aktualisieren",
      user.username
    );
    await syncLocalGitAfterCommit(NAV_SETTINGS_REL_PATH);
    return NextResponse.json({ committedToGithub: true, commitUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Speichern fehlgeschlagen." },
      { status: 502 }
    );
  }
}
