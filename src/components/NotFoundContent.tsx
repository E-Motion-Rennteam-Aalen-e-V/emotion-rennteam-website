"use client";

import Link from "next/link";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

function RaceCar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Body */}
      <path
        d="M18 48 L28 30 L60 22 L110 20 L150 22 L175 32 L190 48 L18 48Z"
        fill="#0071b5"
      />
      {/* Cockpit / canopy */}
      <path
        d="M70 22 L80 10 L130 10 L148 22Z"
        fill="#162e7b"
      />
      {/* Windshield */}
      <path
        d="M78 21 L85 12 L125 12 L140 21Z"
        fill="#5aa6d6"
        opacity="0.6"
      />
      {/* Front wing */}
      <path d="M175 44 L205 44 L205 50 L175 50Z" fill="#162e7b" />
      <path d="M200 44 L210 38 L214 44Z" fill="#162e7b" />
      {/* Rear wing */}
      <path d="M15 30 L28 30 L28 34 L15 34Z" fill="#162e7b" />
      <path d="M15 28 L29 28 L29 32 L15 32Z" fill="#0071b5" />
      {/* Floor / diffuser */}
      <rect x="28" y="47" width="148" height="4" rx="1" fill="#0a0e1a" />
      {/* Sidepods */}
      <path d="M60 34 L60 47 L90 47 L90 34Z" fill="#005a91" />
      <path d="M130 34 L130 47 L160 47 L160 34Z" fill="#005a91" />
      {/* Wheels */}
      <circle cx="48" cy="52" r="12" fill="#1a1a2e" />
      <circle cx="48" cy="52" r="8" fill="#232635" />
      <circle cx="48" cy="52" r="4" fill="#0071b5" />
      <circle cx="168" cy="52" r="12" fill="#1a1a2e" />
      <circle cx="168" cy="52" r="8" fill="#232635" />
      <circle cx="168" cy="52" r="4" fill="#0071b5" />
      {/* E-Motion number */}
      <text x="100" y="40" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">ERT</text>
      {/* Halo */}
      <path d="M88 18 Q108 13 132 18" stroke="#c0c0c0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function SpeedLine({ delay, y, width }: { delay: number; y: number; width: number }) {
  return (
    <motion.div
      className="absolute h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      style={{ top: `${y}%`, width: `${width}%` }}
      initial={{ x: "110%", opacity: 0 }}
      animate={{ x: "-110%", opacity: [0, 0.7, 0] }}
      transition={{
        duration: 1.2,
        delay,
        repeat: Infinity,
        repeatDelay: 2.5,
        ease: "linear",
      }}
    />
  );
}

export default function NotFoundContent() {
  const carControls = useAnimationControls();

  useEffect(() => {
    async function runSequence() {
      await carControls.start({
        x: ["-120%", "0%"],
        transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
      });
      await carControls.start({
        y: [0, -6, 0, -3, 0],
        transition: { duration: 0.8, ease: "easeInOut" },
      });
      carControls.start({
        y: [0, -5, 0],
        transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
      });
    }
    runSequence();
  }, [carControls]);

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[140px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-0 h-[30vh] w-[30vh] rounded-full bg-accent-2/20 blur-[100px]"
        aria-hidden
      />

      {/* Speed lines */}
      <SpeedLine delay={0} y={35} width={45} />
      <SpeedLine delay={0.4} y={55} width={35} />
      <SpeedLine delay={0.9} y={45} width={55} />
      <SpeedLine delay={1.5} y={38} width={30} />
      <SpeedLine delay={2.2} y={60} width={40} />

      {/* 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="relative"
      >
        <span
          className="select-none text-[10rem] font-black leading-none tracking-tighter sm:text-[14rem]"
          style={{
            background: "linear-gradient(135deg, #5aa6d6 0%, #0071b5 40%, #162e7b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </span>
        {/* Subtle shimmer overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
        />
      </motion.div>

      {/* Animated race car */}
      <div className="relative mx-auto mt-2 w-full max-w-xs sm:max-w-sm">
        {/* Track */}
        <div className="relative h-1 w-full rounded-full bg-border">
          <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-accent/60 to-transparent" />
        </div>
        <motion.div animate={carControls} className="relative -mt-1">
          <RaceCar className="w-full" />
          {/* Exhaust glow */}
          <motion.div
            className="absolute bottom-4 left-6 h-3 w-8 rounded-full bg-accent/50 blur-md"
            animate={{ opacity: [0.3, 0.8, 0.3], scaleX: [1, 1.4, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        </motion.div>
        {/* Ground shadow */}
        <motion.div
          className="mx-auto h-2 w-3/4 rounded-full bg-accent/10 blur-sm"
          animate={{ scaleX: [1, 0.9, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative mt-8"
      >
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Falsche Strecke!
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Diese Seite existiert nicht (mehr). Vielleicht wurde der Link verschoben oder du hast dich in einer Kurve verfahren.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:scale-105 hover:shadow-accent/40"
          >
            Zur Startseite
          </Link>
          <Link
            href="/news"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-muted transition-all hover:border-accent/50 hover:text-foreground"
          >
            Aktuelle News
          </Link>
        </div>
      </motion.div>

      {/* Checkered bottom strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 h-2 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #fff 0px, #fff 10px, transparent 10px, transparent 20px)",
        }}
        aria-hidden
      />
    </div>
  );
}
