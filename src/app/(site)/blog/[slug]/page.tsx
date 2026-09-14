import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import Reveal from "@/components/motion/Reveal";

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: post.coverImage ? { images: [{ url: post.coverImage }] } : undefined,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const bodyHtml = await renderMarkdown(post.body);

  return (
    <div className="container-page py-20">
      <Reveal className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="text-sm font-semibold text-accent-text transition-colors hover:underline"
        >
          &larr; Zurück zum Blog
        </Link>

        <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent-text">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </time>
          {post.author && <span className="text-muted">· {post.author}</span>}
        </div>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{post.title}</h1>

        {post.coverImage && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-invert mt-8 max-w-none text-muted [&_a]:text-accent-text [&_h2]:mt-8 [&_h2]:text-foreground [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </Reveal>
    </div>
  );
}
