"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  getConsentServerSnapshot,
  readConsentCookie,
  subscribeConsent,
  writeConsentCookie,
} from "@/lib/consent";

export default function CookieConsent() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeConsent,
    readConsentCookie,
    getConsentServerSnapshot
  );
  const visible = consent === undefined;

  // The notice is about cookies the public marketing site sets - it has
  // nothing to do with the separate internal CMS, and its fixed
  // bottom-of-viewport banner can otherwise overlap and block real UI there
  // (e.g. an editor form's Speichern button) for anyone who hasn't answered
  // it yet in that browser.
  if (pathname?.startsWith("/admin")) return null;
  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Hinweis"
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-border bg-surface/95 backdrop-blur-sm"
    >
      <div className="container-page flex flex-col items-center gap-2 py-3 text-xs text-muted sm:flex-row sm:justify-between sm:gap-4 sm:py-5 sm:text-sm">
        <p className="line-clamp-2 max-w-2xl sm:line-clamp-none">
          Wir setzen ein technisch notwendiges Cookie, um deine Auswahl zu diesem Hinweis zu
          speichern. Mit deiner Einwilligung nutzen wir zusätzlich Meta Pixel, um die Wirksamkeit
          unserer Social-Media-Inhalte zu messen. Mehr dazu in unserer{" "}
          <Link href="/datenschutz" className="text-accent-text underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="flex w-full shrink-0 gap-2 sm:w-auto sm:gap-3">
          <button
            type="button"
            onClick={() => writeConsentCookie("necessary")}
            className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent/60 sm:flex-none sm:px-4 sm:py-2 sm:text-sm"
          >
            Nur notwendige
          </button>
          <button
            type="button"
            onClick={() => writeConsentCookie("all")}
            className="flex-1 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-transform hover:scale-105 sm:flex-none sm:px-4 sm:py-2 sm:text-sm"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
