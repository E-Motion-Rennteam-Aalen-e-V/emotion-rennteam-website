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
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/30" />

      {/* Diagonal accent cut, echoing the team's race-livery stripes */}
      <div
        className="absolute inset-y-0 right-0 w-[45%] bg-accent/25 mix-blend-screen sm:w-[35%]"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 40% 100%, 70% 0)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[45%] border-l-2 border-accent/70 sm:w-[35%]"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 40% 100%, 70% 0)" }}
      />

      <motion.div
        className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-accent-2/25 blur-[110px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
