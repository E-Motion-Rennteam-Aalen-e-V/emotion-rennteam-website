import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Einblicke aus dem Teamalltag des E-Motion Rennteams Aalen – Werkstatt, Onboarding und Geschichten hinter dem Fahrzeug.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Blog</p>
        <h1 className="mt-2 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Einblicke ins Team
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Geschichten aus der Werkstatt, dem Onboarding neuer Mitglieder und dem Alltag hinter
          unserem Rennwagen.
        </p>
      </Reveal>

      {posts.length === 0 ? (
        <p className="mt-14 text-sm text-muted">Aktuell sind keine Blogbeiträge verfügbar.</p>
      ) : (
        <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
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
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent-text">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    {post.author && <span className="text-muted">· {post.author}</span>}
                  </div>
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
