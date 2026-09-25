/**
 * Shared cookie-consent state (`cookie-consent` cookie) read by both the
 * consent banner (CookieConsent) and anything gated behind marketing
 * consent (MetaPixel). "necessary" = only the consent cookie itself,
 * "all" = necessary + marketing/tracking (Meta Pixel).
 */
const COOKIE_NAME = "cookie-consent";
const COOKIE_MAX_AGE_DAYS = 180;

export type ConsentValue = "all" | "necessary";

export function readConsentCookie(): ConsentValue | undefined {
  if (typeof document === "undefined") return undefined;
  const raw = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
    ?.split("=")[1];
  return raw === "all" || raw === "necessary" ? raw : undefined;
}

const listeners = new Set<() => void>();

/**
 * document.cookie has no change event, so there is nothing to subscribe to -
 * writeConsentCookie() below notifies listeners itself right after writing.
 */
export function subscribeConsent(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/**
 * No cookies exist during SSR. Reporting "necessary" here (rather than
 * undefined) keeps consent-gated UI (banner, pixel) out of the
 * server-rendered markup so nothing flashes in and immediately back out for
 * returning visitors between the server response and hydration reading the
 * real cookie value.
 */
export function getConsentServerSnapshot(): ConsentValue {
  return "necessary";
}

export function writeConsentCookie(value: ConsentValue) {
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${value}; max-age=${maxAge}; path=/; SameSite=Lax${secure}`;
  for (const callback of listeners) callback();
}

export function hasMarketingConsent(consent: ConsentValue | undefined) {
  return consent === "all";
}
