import type { Metadata } from "next";
import Image from "next/image";
import { getVehicles } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import VehicleSpecs from "@/components/VehicleSpecs";

export const metadata: Metadata = {
  title: "Fahrzeuge",
  description:
    "Die Rennwagen des E-Motion Rennteams Aalen: technische Daten, Baujahre und Entwicklung unserer Formula-Student-Electric-Boliden.",
  alternates: { canonical: "/fahrzeuge" },
};

export default function VehiclesPage() {
  const vehicles = getVehicles();

  return (
    <div className="container-page py-20">
      <Reveal className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Fahrzeuge</p>
        <h1 className="mx-auto mt-2 max-w-2xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Unsere Boliden
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
          Jedes Jahr entwickeln wir ein neues, vollelektrisches Formula-Student-Fahrzeug – von
          der Simulation bis zur Rennstrecke.
        </p>
      </Reveal>

      <div className="relative mt-20">
        <div className="absolute left-4 top-0 h-full w-px bg-border lg:left-1/2" />

        <div className="space-y-16 lg:space-y-28">
          {vehicles.map((vehicle, i) => {
            const reversed = i % 2 === 1;
            return (
              <Reveal
                key={vehicle.slug}
                direction={reversed ? "right" : "left"}
                className="relative"
              >
                <span className="absolute left-4 top-6 z-10 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2">
                  {vehicle.current && (
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`relative h-3 w-3 rounded-full border-2 ${
                      vehicle.current ? "border-accent bg-accent" : "border-border bg-background"
                    }`}
                  />
                </span>

                <div className="grid gap-6 pl-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pl-0">
                  <div className={reversed ? "lg:order-2" : undefined}>
                    {vehicle.coverImage && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
                        <Image
                          src={vehicle.coverImage}
                          alt={vehicle.name}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div
                    className={`rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/50 sm:p-8 ${
                      reversed ? "lg:order-1" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-accent-text">
                        {vehicle.year}
                      </span>
                      {vehicle.current && (
                        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                          Aktuell
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                      {vehicle.name}
                    </h2>
                    {vehicle.tagline && <p className="mt-2 text-muted">{vehicle.tagline}</p>}
                    {vehicle.body && <p className="mt-4 text-sm text-muted">{vehicle.body}</p>}

                    {vehicle.specs && vehicle.specs.length > 0 && (
                      <VehicleSpecs specs={vehicle.specs} achievements={vehicle.achievements} />
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
