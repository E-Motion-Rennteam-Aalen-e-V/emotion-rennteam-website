/**
 * Official list of the team's specialist groups, in display order. Single
 * source of truth so the Team page, the homepage stat, the Mitmachen
 * application form, and the CMS "Abteilung" field can't drift apart again.
 *
 * Kept in its own module (no fs/path imports) so it can be imported both
 * from server-only code (src/lib/content.ts) and from client components
 * (src/lib/cms/collections.ts is bundled into the admin UI).
 */
export const TEAM_DEPARTMENTS = [
  "Project Management",
  "Workshop",
  "Chassis and Ergonomics",
  "Electrics",
  "Powertrain",
  "Aerodynamics",
  "Suspension and Steering Systems",
  "Driverless",
  "Vehicle Dynamics",
  "Testing and Data Acquisition",
  "Media and Marketing",
  "Business Plan",
  "Sponsoring",
  "Eventmanagement",
  "Finance",
] as const;

/**
 * Known race seasons, newest first. Used for the year-filter tabs on /team
 * and as the CMS "Saison" select options. Extend this list when a new car
 * season starts; the oldest entry is used as the default for members whose
 * season field is empty (backwards-compat with existing content).
 */
export const TEAM_SEASONS = [
  "ERT-15/27",
  "ERT-14/26",
] as const;

export type TeamSeason = (typeof TEAM_SEASONS)[number];

/** The season shown by default (current active season). */
export const DEFAULT_SEASON: TeamSeason = "ERT-14/26";
