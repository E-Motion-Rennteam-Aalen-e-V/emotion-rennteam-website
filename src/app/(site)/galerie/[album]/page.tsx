import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGalleryAlbum, getGalleryAlbums } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import GalleryGrid from "@/components/GalleryGrid";
import { getBreadcrumbJsonLd } from "@/lib/structuredData";

export function generateStaticParams() {
  return getGalleryAlbums().map((album) => ({ album: album.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ album: string }>;
}): Promise<Metadata> {
  const { album: albumParam } = await params;
  const album = getGalleryAlbum(decodeURIComponent(albumParam));
  if (!album) return {};

  return {
    title: `${album.name} – Galerie`,
    description: `Bilder aus dem Album "${album.name}" des E-Motion Rennteams Aalen: Fotos vom Fahrzeugbau, Wettbewerben und Team-Events.`,
    alternates: { canonical: `/galerie/${encodeURIComponent(album.name)}` },
    openGraph: {
      title: `${album.name} – Galerie · E-Motion Rennteam Aalen`,
      description: `${album.images.length} Fotos aus dem Album "${album.name}".`,
      type: "website",
      images: album.images[0]
        ? [{ url: album.images[0].image, width: 1200, height: 630 }]
        : [{ url: "/uploads/ert-14-26-studio.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function GalleryAlbumPage({
  params,
}: {
  params: Promise<{ album: string }>;
}) {
  const { album: albumParam } = await params;
  const album = getGalleryAlbum(decodeURIComponent(albumParam));
  if (!album) notFound();

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Galerie", path: "/galerie" },
    { name: album.name, path: `/galerie/${encodeURIComponent(album.name)}` },
  ]);

  return (
    <div className="container-page py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Reveal>
        <Link
          href="/galerie"
          className="text-sm font-semibold text-accent-text transition-colors hover:underline"
        >
          &larr; Zurück zur Galerie
        </Link>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl md:text-6xl">
          {album.name}
        </h1>
        <p className="mt-4 text-muted">{album.images.length} Bilder</p>
      </Reveal>

      <GalleryGrid images={album.images} />
    </div>
  );
}
