declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a Meta Pixel standard event (e.g. "PageView", "Contact", "Lead").
 * A no-op whenever the pixel script hasn't been loaded - which is the case
 * whenever NEXT_PUBLIC_META_PIXEL_ID is unset or the visitor hasn't given
 * marketing consent (see MetaPixel.tsx / src/lib/consent.ts) - so callers
 * (ContactForm, SponsorForm, ...) can call this unconditionally.
 */
export function trackPixelEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", eventName, params);
}
