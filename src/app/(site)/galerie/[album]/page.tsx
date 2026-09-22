import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGalleryAlbum, getGalleryAlbums } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import GalleryGrid from "@/components/GalleryGrid";

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
    description: `Bilder aus dem Album "${album.name}" des E-Motion Rennteams Aalen.`,
    alternates: { canonical: `/galerie/${encodeURIComponent(album.name)}` },
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

  return (
    <div className="container-page py-20">
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
