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
      <div className="container-page flex flex-col items-center gap-4 py-5 text-sm text-muted sm:flex-row sm:justify-between">
        <p className="max-w-2xl">
          Wir setzen ein technisch notwendiges Cookie, um deine Auswahl zu diesem Hinweis zu
          speichern. Mit deiner Einwilligung nutzen wir zusätzlich Meta Pixel, um die Wirksamkeit
          unserer Social-Media-Inhalte zu messen. Mehr dazu in unserer{" "}
          <Link href="/datenschutz" className="text-accent-text underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => writeConsentCookie("necessary")}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-accent/60"
          >
            Nur notwendige
          </button>
          <button
            type="button"
            onClick={() => writeConsentCookie("all")}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
