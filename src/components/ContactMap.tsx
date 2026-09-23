"use client";

// Hochschule Aalen, Beethovenstraße 1, 73430 Aalen
const LAT = 48.8383;
const LNG = 10.0932;

const MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Hochschule+Aalen+Beethovenstra%C3%9Fe+1+73430+Aalen";

// OpenStreetMap embed — already allowed by CSP (frame-src https://www.openstreetmap.org).
// bbox is ±0.02° around the marker to give ~2-3 blocks of context.
const OSM_EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=${LNG - 0.025}%2C${LAT - 0.012}%2C${LNG + 0.025}%2C${LAT + 0.012}&layer=mapnik&marker=${LAT}%2C${LNG}`;

export default function ContactMap() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-surface">
      {/* OSM iframe with invert+hue-rotate for a dark-map appearance */}
      <iframe
        src={OSM_EMBED}
        title="Karte – Hochschule Aalen"
        loading="lazy"
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full border-0"
        style={{ filter: "invert(1) hue-rotate(180deg) brightness(0.85) contrast(0.9)" }}
        sandbox="allow-scripts allow-same-origin"
        aria-label="Interaktive Karte: Hochschule Aalen, Beethovenstraße 1, 73430 Aalen"
      />

      {/* Address card overlay */}
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 sm:left-6 sm:right-auto sm:w-64">
        <div className="pointer-events-auto rounded-xl border border-border/80 bg-background/90 p-4 shadow-xl backdrop-blur-md">
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
