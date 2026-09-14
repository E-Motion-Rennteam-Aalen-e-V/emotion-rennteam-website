// Base sponsoring tiers, used by both the sponsor content model (CMS
// dropdown) and the public sponsor-inquiry form. No filesystem access, so
// it can be imported from client components too.
export const SPONSOR_TIERS_BASE = ["Platin", "Gold", "Silber", "Partner"] as const;
