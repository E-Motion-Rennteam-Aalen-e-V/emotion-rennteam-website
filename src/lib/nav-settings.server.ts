import { promises as fs } from "node:fs";
import path from "node:path";
import { NAV_ITEMS, isNavItemVisible } from "@/lib/nav";

// Server-only: reads which nav items are hidden. Kept out of nav.ts (which
// Header.tsx, a client component, also imports) so the node:fs import never
// ends up in a client bundle.
export const NAV_SETTINGS_REL_PATH = "content/settings/navigation.json";
const NAV_SETTINGS_ABS_PATH = path.join(/* turbopackIgnore: true */ process.cwd(), NAV_SETTINGS_REL_PATH);

/**
 * The file only ever stores `false` entries (see the admin API route) - a
 * missing/unreadable file or a missing key both mean "visible", so a fresh
 * checkout without this file shows the full, unmodified navigation.
 */
export async function getNavVisibility(): Promise<Record<string, boolean>> {
  try {
    const raw = await fs.readFile(NAV_SETTINGS_ABS_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/** IDs of items that should NOT be rendered, ready to hand to <Header hiddenIds=... />. */
export async function getHiddenNavIds(): Promise<string[]> {
  const visibility = await getNavVisibility();
  return NAV_ITEMS.filter((item) => !isNavItemVisible(item.id, visibility)).map((item) => item.id);
}
