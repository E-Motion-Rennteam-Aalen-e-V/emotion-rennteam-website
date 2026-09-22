import type { Metadata } from "next";
import Image from "next/image";
import { getResults } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";

type ParsedChip =
  | { kind: "placement"; rank: number; discipline: string }
  | { kind: "points"; points: number; discipline: string };

function parseDescChips(desc: string): { intro: string; chips: ParsedChip[] } | null {
  const colonIdx = desc.indexOf(":");
  if (colonIdx === -1) return null;
  const rest = desc.slice(colonIdx + 1).trim();
  const chips: ParsedChip[] = [];
  for (const p of rest.split(",").map((s) => s.trim())) {
    const pm = p.match(/^Platz\s+(\d+)\s+(.+)$/);
    if (pm) { chips.push({ kind: "placement", rank: parseInt(pm[1]), discipline: pm[2].trim() }); continue; }
    const qm = p.match(/^(\d+)\s+Pkt\.\s+(.+)$/);
    if (qm) chips.push({ kind: "points", points: parseInt(qm[1]), discipline: qm[2].trim() });
  }
  if (chips.length < 2) return null;
  return { intro: desc.slice(0, colonIdx + 1).trim(), chips };
}

function chipClass(chip: ParsedChip): string {
  if (chip.kind === "points") return "border-border/50 text-muted";
  const r = chip.rank;
  if (r === 1) return "border-yellow-400/60 text-yellow-300";
  if (r <= 3) return "border-yellow-600/50 text-yellow-400/80";
  if (r <= 5) return "border-accent/60 text-accent-text";
  if (r <= 10) return "border-accent/30 text-accent-text/70";
  return "border-border text-muted";
}

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "Die Timeline des E-Motion Rennteams Aalen: Platzierungen, Events und Meilensteine der Teamgeschichte im Überblick.",
  alternates: { canonical: "/erfolge" },
};

export default function ResultsPage() {
  const results = getResults();

  return (
    <div className="container-page py-20">
      <Reveal>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Timeline</p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl md:text-6xl xl:text-7xl">Unsere Historie</h1>
            <p className="mt-4 max-w-2xl text-muted">
              Von der Teamgründung bis zu unseren besten Wettbewerbsergebnissen – eine Zeitreise
              durch die Geschichte des E-Motion Rennteams. Seit 2009 sind wir bei internationalen
              FS-Events angetreten und landeten dabei immer wieder in den Top 5
              einzelner Disziplinen und in der Gesamtwertung unter den besten 10 Teams.
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:w-80 lg:w-96">
            <Image
              src="/uploads/rollout-2026/rollout-2026-team-buehne.webp"
              alt="E-Motion Team auf der Bühne beim Rollout 2026"
              fill
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 320px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Reveal>

      <div className="relative mt-20">
        {/* Timeline on mobile, hidden on desktop */}
        <div className="absolute left-4 top-0 h-full w-px bg-border sm:hidden" />

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          {results.map((result, i) => (
            <Reveal
              key={result.slug}
              direction={i % 2 === 0 ? "left" : "right"}
              className="relative"
            >
              {/* Mobile timeline dot */}
              <div className="absolute left-4 top-6 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-background sm:hidden" />

              <div className={i % 2 === 0 ? "sm:pl-0" : "sm:pl-0"}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6 sm:p-8 transition-all hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-accent-text">
                      {result.year}
                    </span>
                    {result.placement && (
                      <span className="shrink-0 rounded-full bg-gradient-to-r from-yellow-500/20 to-accent/20 px-3 py-1 text-xs font-bold text-yellow-300 border border-yellow-400/30">
                        {result.placement}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">{result.title}</h3>
                  <p className="text-sm text-accent-text/80 font-medium mb-4">{result.event}</p>

                  {result.description && (() => {
                    const parsed = parseDescChips(result.description);
                    if (!parsed) return <p className="text-sm text-muted">{result.description}</p>;
                    return (
                      <div>
                        <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-3">{parsed.intro}</p>
                        <div className="flex flex-wrap gap-2">
                          {parsed.chips.map((chip) => (
                            <span
                              key={chip.discipline}
                              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${chipClass(chip)}`}
                            >
                              {chip.kind === "placement"
                                ? <><span className="font-black">#{chip.rank}</span><span>{chip.discipline}</span></>
                                : <><span className="font-black">{chip.points}</span><span className="text-muted/70">Pkt.</span><span>{chip.discipline}</span></>
                              }
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
