import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getNews } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export const metadata: Metadata = {
  title: "News",
  description:
    "Aktuelle Neuigkeiten vom E-Motion Rennteam Aalen: Rollouts, Wettbewerbsergebnisse und Team-Updates.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  const news = getNews();

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">News</p>
        <h1 className="mt-2 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">Aktuelles</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Rollouts, Wettbewerbsergebnisse und Neuigkeiten aus dem Team – hier halten wir dich auf
          dem Laufenden.
        </p>
      </Reveal>

      {news.length === 0 ? (
        <p className="mt-14 text-sm text-muted">Aktuell sind keine News verfügbar.</p>
      ) : (
        <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                href={`/news/${post.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/60"
              >
                {post.coverImage && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <time
                    dateTime={post.date}
                    className="text-xs font-semibold uppercase tracking-wide text-accent-text"
                  >
                    {new Date(post.date).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <h2 className="mt-2 text-lg font-bold leading-snug">{post.title}</h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
