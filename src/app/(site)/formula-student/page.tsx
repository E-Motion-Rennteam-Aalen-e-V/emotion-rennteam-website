import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import DisciplinesChart from "@/components/DisciplinesChart";
import FSTimeline from "@/components/FormulaStudent/FSTimeline";
import FSPillars from "@/components/FormulaStudent/FSPillars";
import FSStats from "@/components/FormulaStudent/FSStats";
import FSCompetitions from "@/components/FormulaStudent/FSCompetitions";

export const metadata: Metadata = {
  title: "Was ist Formula Student?",
  description:
    "Formula Student erklärt: der internationale Konstruktionswettbewerb, bei dem Studierendenteams eigene Rennwagen entwickeln, bauen und gegeneinander antreten lassen.",
  alternates: { canonical: "/formula-student" },
};

export default function FormulaStudentPage() {
  return (
    <div className="container-page space-y-20 py-20">
      {/* Hero */}
      <Reveal>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">
              Formula Student
            </p>
            <h1 className="mt-2 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Studierendenteams bauen Rennwagen
            </h1>
          </div>
          <p className="max-w-xl text-base text-muted">
            Ein internationaler Konstruktionswettbewerb, in dem Teams Elektrorennwagen entwickeln,
            bauen und auf Rennstrecken testen – Technik trifft Teamgeist. Genau das machen wir mit
            dem E-Motion Rennteam Aalen jedes Jahr aufs Neue.
          </p>
        </div>
      </Reveal>

      {/* Hero Image */}
      <Reveal delay={0.03}>
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border/60">
          <Image
            src="/uploads/ert-14-26-rollout-2026.jpg"
            alt="E-Motion Rennteam ERT 14-26 auf der Strecke"
            fill
            priority
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              ERT 14-26 · Saison 2026
            </span>
          </div>
        </div>
      </Reveal>

      {/* Stats */}
      <Reveal delay={0.05}>
        <FSStats />
      </Reveal>

      {/* Pillars */}
      <Reveal delay={0.1}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Die vier Säulen</h2>
            <p className="mt-2 text-sm text-muted">
              Ein erfolgreiches Projekt erfordert Balance über alle Bereiche
            </p>
          </div>
          <FSPillars />
        </div>
      </Reveal>

      {/* Timeline */}
      <Reveal delay={0.15}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Geschichte & Meilensteine</h2>
            <p className="mt-2 text-sm text-muted">
              Von 1981 bis heute – die Evolution der Formula Student
            </p>
          </div>
          <FSTimeline />
        </div>
      </Reveal>

      {/* Disziplinen */}
      <Reveal delay={0.2}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Disziplinen & Punktevergabe</h2>
            <p className="mt-2 text-sm text-muted">
              1.000 Punkte über 8 Wettbewerbe – Technik, Design & Performance
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-8">
            <DisciplinesChart />
          </div>
        </div>
      </Reveal>

      {/* Competitions */}
      <Reveal delay={0.25}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Wettbewerbe weltweit</h2>
            <p className="mt-2 text-sm text-muted">
              Die besten Teams treten auf renommierten Rennstrecken an
            </p>
          </div>
          <FSCompetitions />
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal delay={0.3}>
        <div className="rounded-2xl border border-border bg-surface/50 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Lust, selbst mitzubauen?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Beim E-Motion Rennteam Aalen setzen wir Formula Student in die Praxis um – vom
            CAD-Modell bis zur Zieldurchfahrt. Wir suchen laufend Studierende aus allen
            Fachrichtungen.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/mitmachen"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:gap-2.5"
            >
              Offene Positionen ansehen <span aria-hidden>&rarr;</span>
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent-text transition-all hover:gap-2 hover:underline"
            >
              Unser Team kennenlernen <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
