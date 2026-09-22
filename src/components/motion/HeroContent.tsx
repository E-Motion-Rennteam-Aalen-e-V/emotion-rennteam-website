"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroContent({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const lastSpace = title.lastIndexOf(" ");
  const titleFirstLine = lastSpace === -1 ? title : title.slice(0, lastSpace);
  const titleLastLine = lastSpace === -1 ? "" : title.slice(lastSpace + 1);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="max-w-3xl"
    >
      <motion.p
        variants={item}
        className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-accent-text sm:text-sm"
      >
        <span className="h-px w-8 bg-accent-text" aria-hidden />
        {eyebrow}
      </motion.p>
      <motion.h1
        variants={item}
        className="text-5xl font-black uppercase leading-[0.95] tracking-tight text-foreground sm:text-7xl md:text-8xl"
      >
        {titleFirstLine}
        {titleLastLine && (
          <>
            <br />
            <span className="text-gradient-accent">{titleLastLine}</span>
          </>
        )}
      </motion.h1>
      <motion.p
        variants={item}
        className="mt-6 max-w-xl text-lg font-medium text-muted sm:text-xl"
      >
        {subtitle}
      </motion.p>
      <motion.div variants={item} className="mt-9 flex flex-wrap gap-3 sm:gap-4">
        <Link
          href="/mitmachen"
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-accent-foreground shadow-[0_8px_30px_-8px_rgba(0,113,181,0.6)] transition-all hover:scale-[1.04] hover:shadow-[0_12px_40px_-8px_rgba(0,113,181,0.75)] sm:px-7"
        >
          Jetzt mitmachen
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
        <Link
          href="/fahrzeuge"
          className="inline-flex items-center gap-2 rounded-full border-2 border-foreground/25 bg-background/30 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground backdrop-blur-sm transition-all hover:scale-[1.04] hover:border-foreground/60 sm:px-7"
        >
          Fahrzeuge
        </Link>
        <Link
          href="/sponsoren#werden"
          className="inline-flex items-center gap-2 rounded-full border-2 border-foreground/25 bg-background/30 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-foreground backdrop-blur-sm transition-all hover:scale-[1.04] hover:border-foreground/60 sm:px-7"
        >
          Sponsor werden
        </Link>
      </motion.div>
    </motion.div>
  );
}
