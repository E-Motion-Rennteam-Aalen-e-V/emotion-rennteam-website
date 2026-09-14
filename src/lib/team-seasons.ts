// No filesystem access here (unlike src/lib/content.ts) so this can be
// imported from client components (e.g. the CMS admin UI) without pulling
// `fs` into the browser bundle.

/**
 * Team roster archive by car generation / season, newest first. Single
 * source of truth so the Team page's season switcher and the CMS admin UI
 * can't drift apart.
 */
export const TEAM_SEASONS = ["ERT-15/27", "ERT-14/26"] as const;

/** Season shown on /team when no ?season= query param is set. */
export const DEFAULT_TEAM_SEASON: (typeof TEAM_SEASONS)[number] = "ERT-15/27";
