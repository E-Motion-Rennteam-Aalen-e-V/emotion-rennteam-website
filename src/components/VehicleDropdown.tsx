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

  // Close on click outside
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
            className="absolute left-1/2 top-full -translate-x-1/2 mt-3 w-[480px] origin-top rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-0">
              {/* Vehicle Image Section */}
              <div className="relative aspect-[4/3] bg-background border-r border-border">
                {selected.coverImage && (
                  <Image
                    src={selected.coverImage}
                    alt={selected.name}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Vehicle Info Section */}
              <div className="p-4 flex flex-col">
                {/* Vehicle List */}
                <div className="space-y-1 mb-4 max-h-[200px] overflow-y-auto">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.slug}
                      onClick={() => {
                        setSelected(vehicle);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selected.slug === vehicle.slug
                          ? "bg-accent/10 text-accent font-semibold"
                          : "text-muted hover:bg-surface-2 hover:text-foreground"
                      }`}
                    >
                      <span className="font-mono text-xs text-muted mr-2">
                        {vehicle.year}
                      </span>
                      {vehicle.name}
                    </button>
                  ))}
                </div>

                {/* Selected Vehicle Details */}
                <div className="border-t border-border pt-3 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{selected.name}</h3>
                      {selected.tagline && (
                        <p className="text-xs text-muted mt-1 line-clamp-2">{selected.tagline}</p>
                      )}
                    </div>
                    {selected.current && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground whitespace-nowrap ml-2">
                        Aktuell
                      </span>
                    )}
                  </div>

                  {/* Quick Specs */}
                  {selected.specs && selected.specs.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      {selected.specs.slice(0, 4).map((spec, idx) => (
                        <div key={idx} className="border-t border-border pt-1">
                          <p className="text-muted font-mono">{spec.label}</p>
                          <p className="font-semibold text-foreground text-[11px]">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* View Details Link */}
                  <Link
                    href="/fahrzeuge"
                    onClick={() => setOpen(false)}
                    className="mt-3 inline-block text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
                  >
                    Alle Details →
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
