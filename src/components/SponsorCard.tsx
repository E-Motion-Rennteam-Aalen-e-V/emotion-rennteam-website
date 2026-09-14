"use client";

import { useRef, type CSSProperties, type MouseEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { Sponsor } from "@/lib/content";

type TierStyle = {
  shimmer: string;
  glow: string;
  borderGlow: string;
  tilt: boolean;
};

// Only the top three tiers get the animated treatment — Partner cards stay
// plain, so the effect itself communicates the sponsoring hierarchy instead
// of just being decoration.
const TIER_STYLES: Partial<Record<Sponsor["tier"], TierStyle>> = {
  Platin: {
    shimmer: "rgba(255,255,255,0.55)",
    glow: "rgba(255,255,255,0.45)",
    borderGlow: "rgba(255,255,255,0.75)",
    tilt: true,
  },
  Gold: {
    shimmer: "rgba(255,209,102,0.55)",
    glow: "rgba(250,204,21,0.4)",
    borderGlow: "rgba(250,204,21,0.8)",
    tilt: true,
  },
  Silber: {
    shimmer: "rgba(203,213,225,0.45)",
    glow: "rgba(203,213,225,0.3)",
    borderGlow: "rgba(203,213,225,0.65)",
    tilt: false,
  },
};

const TILT_RANGE_DEG = 12;

export default function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const style = TIER_STYLES[sponsor.tier];
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 22 });

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    if (!style?.tilt || reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawRotateY.set(px * TILT_RANGE_DEG);
    rawRotateX.set(-py * TILT_RANGE_DEG);
  }

  function handleMouseLeave() {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }

  if (!style) {
    if (!sponsor.website) {
      return (
        <div className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-surface p-8 text-center">
          <SponsorMark sponsor={sponsor} />
        </div>
      );
    }
    return (
      <a
        href={sponsor.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${sponsor.name} (öffnet in neuem Tab)`}
        className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-surface p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_30px_-10px_rgba(0,113,181,0.35)]"
      >
        <SponsorMark sponsor={sponsor} />
      </a>
    );
  }

  if (!sponsor.website) {
    return (
      <div
        style={
          {
            "--tier-shimmer": style.shimmer,
            "--tier-glow": style.glow,
            "--tier-border-glow": style.borderGlow,
          } as CSSProperties
        }
        className="sponsor-card--tier group relative flex h-full flex-col items-center justify-center overflow-hidden rounded-xl bg-surface p-8 text-center"
      >
        <span className="sponsor-card__shimmer" aria-hidden="true" />
        <SponsorMark sponsor={sponsor} />
      </div>
    );
  }

  return (
    <motion.a
      ref={ref}
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${sponsor.name} (öffnet in neuem Tab)`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          rotateX,
          rotateY,
          transformPerspective: 800,
          "--tier-shimmer": style.shimmer,
          "--tier-glow": style.glow,
          "--tier-border-glow": style.borderGlow,
        } as CSSProperties
      }
      className="sponsor-card--tier group relative flex h-full flex-col items-center justify-center overflow-hidden rounded-xl bg-surface p-8 text-center"
    >
      <span className="sponsor-card__shimmer" aria-hidden="true" />
      <SponsorMark sponsor={sponsor} />
    </motion.a>
  );
}

function SponsorMark({ sponsor }: { sponsor: Sponsor }) {
  if (!sponsor.logo) {
    return (
      <span className="relative z-10 text-2xl font-bold uppercase tracking-tight text-foreground">
        {sponsor.name}
      </span>
    );
  }
  return (
    <Image
      src={sponsor.logo}
      alt={sponsor.name}
      width={160}
      height={80}
      className="relative z-10 max-h-16 w-auto object-contain"
    />
  );
}
