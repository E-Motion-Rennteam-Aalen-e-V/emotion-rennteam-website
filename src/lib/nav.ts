// Single source of truth for the site's navigation *structure* (which links
// exist, in which menu group) - pure data, no server-only imports, so it's
// safe to import from client components like Header.tsx. The *visibility*
// layer (CMS-editable, reads content/settings/navigation.json from disk)
// lives in nav-settings.server.ts instead: mixing a node:fs import into this
// file makes bundlers try to include it in the client bundle too, which
// breaks the build ("chunking context does not support external modules").
export interface NavItemDef {
  id: string;
  href: string;
  label: string;
  group: "main" | "more" | "cta";
}

export const NAV_ITEMS: NavItemDef[] = [
  { id: "team", href: "/team", label: "Team", group: "main" },
  { id: "fahrzeuge", href: "/fahrzeuge", label: "Fahrzeuge", group: "main" },
  { id: "sponsoren", href: "/sponsoren", label: "Sponsoren", group: "main" },
  { id: "formula-student", href: "/formula-student", label: "Formula Student", group: "more" },
  { id: "galerie", href: "/galerie", label: "Galerie", group: "more" },
  { id: "erfolge", href: "/erfolge", label: "Timeline", group: "more" },
  { id: "news", href: "/news", label: "News", group: "more" },
  { id: "blog", href: "/blog", label: "Blog", group: "more" },
  { id: "kontakt", href: "/kontakt", label: "Kontakt", group: "more" },
  { id: "mitmachen", href: "/mitmachen", label: "Mitmachen", group: "cta" },
];

export function isNavItemVisible(id: string, visibility: Record<string, boolean>): boolean {
  return visibility[id] !== false;
}
