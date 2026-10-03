"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroMedia({
  videoSrc,
  posterSrc,
  alt,
}: {
  videoSrc?: string;
  posterSrc?: string;
  alt: string;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      {videoSrc ? (
        <video
          className="h-full w-full object-cover"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : posterSrc ? (
        <Image
          src={posterSrc}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,113,181,0.35),transparent_60%)]" />
      )}

      {/* Dark gradients for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/20 to-transparent" />

      {/* Diagonal accent cut, echoing the team's race-livery stripes */}
      <div
        className="absolute inset-y-0 right-0 w-[45%] bg-accent/30 mix-blend-screen sm:w-[38%]"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 38% 100%, 68% 0)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[45%] border-l-2 border-accent/80 sm:w-[38%]"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 38% 100%, 68% 0)" }}
      />
      {/* Secondary thinner stripe for depth */}
      <div
        className="absolute inset-y-0 right-0 hidden w-[35%] border-l border-accent/30 sm:block"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 46% 100%, 74% 0)" }}
      />

      <motion.div
        className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-accent-2/20 blur-[130px]"
        animate={{ x: [0, 40, 0], y: [0, -25, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-0 h-64 w-64 rounded-full bg-accent/10 blur-[100px]"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </div>
  );
}
