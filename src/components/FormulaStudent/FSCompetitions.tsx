"use client";

import { motion } from "framer-motion";
import type { Competition } from "@/lib/content";

interface Props {
  competitions: Competition[];
}

function renderStars(count: number): string {
  const n = Math.max(0, Math.min(5, Math.round(count)));
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export default function FSCompetitions({ competitions }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {competitions.map((comp, i) => (
        <motion.div
          key={comp.slug}
          className="space-y-4 rounded-xl border border-border bg-gradient-to-br from-surface/80 to-surface p-5"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {comp.region && <div className="text-2xl">{comp.region}</div>}
              <h3 className="font-semibold text-foreground">{comp.name}</h3>
              <p className="text-xs text-muted">{comp.location}</p>
            </div>
            {comp.prestige != null && (
              <div className="text-right">
                <div className="text-xs text-muted">Prestige</div>
                <div className="text-yellow-500">{renderStars(comp.prestige)}</div>
              </div>
            )}
          </div>

          {comp.teams && (
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Teams im Event</span>
                <span className="font-bold text-accent">{comp.teams}</span>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
