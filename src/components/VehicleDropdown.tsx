"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Vehicle } from "@/lib/content";

interface VehicleDropdownProps {
  vehicles: Vehicle[];
}

export default function VehicleDropdown({ vehicles }: VehicleDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Vehicle | null>(vehicles[0] || null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (!selected) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative flex items-center gap-1.5 py-1 text-sm font-semibold tracking-wide transition-colors text-muted hover:text-foreground lg:text-[0.9375rem]"
      >
        Fahrzeuge
        <motion.svg
          viewBox="0 0 12 8"
          className="h-2.5 w-2.5 fill-none stroke-current stroke-2"
          animate={{ rotate: open ? 180 : 0 }}
        >
          <path d="M1 1.5 6 6.5 11 1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            onMouseLeave={() => setOpen(false)}
            className="absolute left-1/2 top-full -translate-x-1/2 mt-3 w-[520px] origin-top rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-6 p-6">
              {/* Left: Vehicle List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {vehicles.map((vehicle) => (
                  <button
                    key={vehicle.slug}
                    onClick={() => {
                      setSelected(vehicle);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      selected.slug === vehicle.slug
                        ? "bg-accent/10 border-accent/50 text-foreground"
                        : "border-border hover:border-accent/30 text-muted hover:text-foreground"
                    }`}
                  >
                    <span className="font-bold text-sm">{vehicle.name}</span>
                    <p className="text-xs text-muted mt-0.5">{vehicle.year}</p>
                  </button>
                ))}
              </div>

              {/* Right: Vehicle Details Card */}
              <div className="rounded-2xl border border-border bg-surface-2 p-6 h-fit">
                {/* Cover Image */}
                {selected.coverImage && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl mb-4 border border-border">
                    <Image
                      src={selected.coverImage}
                      alt={selected.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{selected.name}</h3>
                      {selected.tagline && (
                        <p className="text-xs text-muted mt-1">{selected.tagline}</p>
                      )}
                    </div>
                    {selected.current && (
                      <span className="shrink-0 rounded-full bg-gradient-to-r from-yellow-500/20 to-accent/20 px-2.5 py-0.5 text-xs font-bold text-yellow-300 border border-yellow-400/30">
                        Aktuell
                      </span>
                    )}
                  </div>

                  {/* Quick Specs Grid */}
                  {selected.specs && selected.specs.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                      {selected.specs.slice(0, 4).map((spec, idx) => (
                        <div key={idx} className="pt-2">
                          <p className="text-xs font-semibold uppercase tracking-widest text-accent-text">
                            {spec.label}
                          </p>
                          <p className="text-sm font-bold text-foreground mt-0.5">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* View Details */}
                  <Link
                    href="/fahrzeuge"
                    onClick={() => setOpen(false)}
                    className="mt-4 block text-center rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground hover:shadow-lg transition-all"
                  >
                    Alle Details ansehen
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
