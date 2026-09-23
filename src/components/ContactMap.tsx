"use client";

import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";
import { MapPin } from "lucide-react";

// Hochschule Aalen, Beethovenstraße 1, 73430 Aalen
const ADDRESS_COORDS: [number, number] = [10.0932, 48.8383];

const MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Hochschule+Aalen+Beethovenstra%C3%9Fe+1+73430+Aalen";

export default function ContactMap() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-surface">
      <Map theme="dark" center={ADDRESS_COORDS} zoom={15}>
        <MapControls showZoom />
        <MapMarker longitude={ADDRESS_COORDS[0]} latitude={ADDRESS_COORDS[1]}>
          <MarkerContent>
            <MapPin
              className="fill-accent stroke-white"
              size={32}
              aria-label="Standort Hochschule Aalen"
            />
          </MarkerContent>
          <MarkerPopup>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-semibold">Hochschule Aalen</p>
              <p className="text-muted-foreground text-xs">
                Beethovenstraße 1
                <br />
                73430 Aalen
              </p>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-text mt-1 inline-block text-xs font-medium underline underline-offset-2"
              >
                In Google Maps öffnen →
              </a>
            </div>
          </MarkerPopup>
        </MapMarker>
      </Map>

      {/* Address card overlay */}
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-64">
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
