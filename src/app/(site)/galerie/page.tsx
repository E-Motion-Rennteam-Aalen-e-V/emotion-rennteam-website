import type { Metadata } from "next";
import Link from "next/link";
import { getGalleryAlbums } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import ImageWithFallback from "@/components/ImageWithFallback";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Bildergalerie des E-Motion Rennteams Aalen: Impressionen von Fahrzeugbau, Testfahrten, Events und Wettbewerben, nach Album sortiert.",
  alternates: { canonical: "/galerie" },
};

export default function GalleryPage() {
  const albums = getGalleryAlbums();
  const hasAlbums = albums.length > 0;

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Galerie</p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl md:text-6xl xl:text-7xl">Impressionen</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Eindrücke von Wettbewerben, aus der Werkstatt und von Events – das E-Motion
          Rennteam Aalen in Bildern, nach Album sortiert.
        </p>
      </Reveal>

      {hasAlbums ? (
        <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <StaggerItem key={album.name}>
              <Link
                href={`/galerie/${encodeURIComponent(album.name)}`}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <ImageWithFallback
                  src={album.images[0]?.image ?? ""}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <h2 className="text-2xl font-bold text-white drop-shadow sm:text-3xl">{album.name}</h2>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
                    Mehr ansehen
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <p className="mt-14 text-muted">Es sind noch keine Bilder hinterlegt.</p>
      )}

      <Reveal delay={0.1} className="mt-20 rounded-2xl border border-accent/40 bg-surface p-8 text-center sm:p-10">
        <h2 className="text-2xl font-bold">Mediakit</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Sponsoren und Presse können unser Mediakit mit Logos, Fahrzeugbildern und Team-Fotos in
          hoher Auflösung direkt bei uns anfragen.
        </p>
        <Link
          href="/mediakit"
          className="mt-6 inline-flex items-center gap-1 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
        >
          Mediakit anfragen
        </Link>
      </Reveal>
    </div>
  );
}
