"use client";

import { useState } from "react";

const MAPS_EMBED_URL =
  "https://maps.google.com/maps?q=Hochschule+Aalen+Beethovenstrase+1+73430+Aalen&t=&z=15&ie=UTF8&iwloc=&output=embed";

const MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Hochschule+Aalen+Beethovenstra%C3%9Fe+1+73430+Aalen";

export default function ContactMap() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-surface">
      {/* Skeleton shown until iframe loads */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      )}

      {/* Google Maps iframe — dark-themed via CSS filter */}
      <iframe
        src={MAPS_EMBED_URL}
        title="Standort Hochschule Aalen"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 h-full w-full border-0"
        style={{
          /* Invert colors → dark map; hue-rotate corrects blues back to blue */
          filter: "invert(92%) hue-rotate(180deg) saturate(0.75) brightness(0.88) contrast(1.05)",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
        aria-hidden={!loaded}
      />

      {/* Address card overlay */}
      <div className="pointer-events-none absolute inset-0" aria-hidden />
      <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-64">
        <div className="rounded-xl border border-border/80 bg-background/90 p-4 shadow-xl backdrop-blur-md">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm">
              📍
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-text">
              Standort
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug">Hochschule Aalen</p>
          <p className="mt-0.5 text-xs text-muted">
            Beethovenstraße 1
            <br />
            73430 Aalen
          </p>
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground transition-all hover:gap-2.5"
          >
            In Google Maps öffnen <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
