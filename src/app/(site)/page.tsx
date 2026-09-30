import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPage, getVehicles, TEAM_DEPARTMENTS } from "@/lib/content";
import HeroMedia from "@/components/motion/HeroMedia";
import HeroContent from "@/components/motion/HeroContent";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import Counter from "@/components/motion/Counter";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { TEAM_STRUCTURE } from "@/lib/team-departments";

export const metadata: Metadata = {
  title: "E-Motion Rennteam Aalen | Formula Student Electric",
  description:
    "Das Formula-Student-Electric-Team der Hochschule Aalen. Über 50 Studierende entwickeln und bauen eigenständig Elektro-Rennwagen für den internationalen Wettbewerb.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "E-Motion Rennteam Aalen | Formula Student Electric",
    description:
      "Das Formula-Student-Electric-Team der Hochschule Aalen. Über 50 Studierende entwickeln und bauen eigenständig Elektro-Rennwagen für den internationalen Wettbewerb.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/uploads/ert-14-26-studio.jpg",
        alt: "ERT 14-26 – Formula Student Electric Rennwagen des E-Motion Rennteams Aalen",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const DEFAULT_STATS = [
  { value: 50, suffix: "+", label: "Studierende im Team" },
  { value: TEAM_DEPARTMENTS.length, suffix: "", label: "Fachbereiche" },
  { value: new Date().getFullYear() - 2009, suffix: "+", label: "Jahre Erfahrung" },
];

function parseStats(page: ReturnType<typeof getPage>) {
  if (!page?.stats?.length) return DEFAULT_STATS;
  return page.stats.map((s) => {
    const match = s.value.match(/^(\d+)(.*)$/);
    return {
      value: match ? Number(match[1]) : 0,
      suffix: match ? match[2] : "",
      label: s.label,
    };
  });
}

export default function Home() {
  const page = getPage("home");
  const stats = parseStats(page);
  const vehicles = getVehicles();
  const vehicle = vehicles.find((v) => v.current) ?? vehicles[0];
  const bodyParagraphs = page?.body?.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) ?? [];
  const aboutSentence = bodyParagraphs[0]?.split(/(?<=[.!?])\s+/)[0] ?? "";

  return (
    <>
      <section className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden">
        <HeroMedia
          videoSrc={page?.heroVideo}
          posterSrc="/uploads/ert-14-26-e61-map1-sonnenuntergang.jpg"
          alt="E61 und MAP1 bei Sonnenuntergang auf der Rennstrecke"
        />

        <div className="container-page relative pb-24 pt-32 sm:pb-28">
          <HeroContent
            eyebrow="Formula Student Electric"
            title={page?.heroTitle ?? "E-Motion Rennteam Aalen"}
            subtitle={page?.heroSubtitle}
          />
        </div>

        <div aria-hidden="true" className="absolute bottom-8 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center gap-1.5">
          <span className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-white/60 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] sm:block">Scrollen</span>
          <svg className="h-5 w-5 text-white/60 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      <div className="border-b border-t border-border/50 bg-surface/80 backdrop-blur-sm">
        <div className="container-page">
          <StaggerGroup className="grid grid-cols-2 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <StaggerItem
                key={stat.label}
                className={`group flex flex-col items-center justify-center px-6 py-9 text-center sm:px-10 sm:py-11 ${
                  i < stats.length - 1 ? "border-r border-border" : ""
                } [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r [&:nth-child(1)]:border-b [&:nth-child(2)]:border-b sm:[&:nth-child(1)]:border-b-0 sm:[&:nth-child(2)]:border-b-0`}
              >
                <div className="font-mono text-3xl font-bold tabular-nums text-gradient-accent lg:text-4xl xl:text-5xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-accent-text">
                  {stat.label}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>

      <section className="container-page py-16 sm:py-20">
        <StaggerGroup className="grid gap-5 sm:grid-cols-2">
          <StaggerItem className="h-full">
            <div className="card-gradient-border flex h-full flex-col gap-6 rounded-xl bg-surface p-8 sm:p-10">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-accent" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-text">Partner</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold tracking-normal sm:text-3xl">
                  Unsere Sponsoren
                </h2>
                <p className="mt-3 max-w-xs text-muted">
                  Ohne unsere Partner wäre die Entwicklung unseres Fahrzeugs nicht möglich.
                </p>
              </div>
              <Link
                href="/sponsoren"
                className="group inline-flex w-fit items-center gap-2 rounded-sm bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-accent-foreground transition-all hover:bg-accent/90 hover:gap-3"
              >
                Zu unseren Sponsoren <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
              </Link>
            </div>
          </StaggerItem>
          <StaggerItem className="h-full">
            <div className="card-gradient-border flex h-full flex-col gap-6 rounded-xl bg-surface p-8 sm:p-10">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-accent" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-text">Bewerbung</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold tracking-normal sm:text-3xl">
                  Werde Teil des Teams
                </h2>
                <p className="mt-3 max-w-xs text-muted">
                  Wir suchen laufend motivierte Studierende aus allen Fachrichtungen.
                </p>
              </div>
              <Link
                href="/mitmachen"
                className="group inline-flex w-fit items-center gap-2 rounded-sm bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-accent-foreground transition-all hover:bg-accent/90 hover:gap-3"
              >
                Offene Positionen <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
              </Link>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </section>

      {aboutSentence && (
        <section className="container-page py-20">
          <Reveal>
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-12">
                <div className="shrink-0">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-text">Über uns</p>
                  <div className="speed-line-divider mt-3 w-24" />
                </div>
                <div>
                  <p className="text-xl font-medium leading-relaxed text-foreground sm:text-2xl">{aboutSentence}</p>
                  <Link
                    href="/formula-student"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-text transition-colors hover:text-foreground"
                  >
                    Mehr über Formula Student <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {vehicle && (
        <section className="container-page py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            {vehicle.coverImage && (
              <Reveal direction="left" className="relative">
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md border border-border/60">
                  <Image
                    src={vehicle.coverImage}
                    alt={vehicle.name}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-sm bg-accent px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-accent-foreground">
                      {vehicle.year} · Aktuell
                    </span>
                  </div>
                </div>
              </Reveal>
            )}
            <Reveal direction={vehicle.coverImage ? "right" : "up"}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-text">
                {vehicle.year} · Aktuelles Fahrzeug
              </p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-normal text-balance sm:text-5xl xl:text-6xl">
                {vehicle.name}
              </h2>
              {vehicle.tagline && (
                <p className="mt-4 text-lg text-muted">{vehicle.tagline}</p>
              )}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {vehicle.specs?.slice(0, 4).map((spec) => (
                  <div key={spec.label} className="rounded-md border border-border/60 bg-surface p-4 transition-all hover:border-accent/50 hover:-translate-y-0.5">
                    <div className="text-[0.65rem] uppercase tracking-[0.18em] text-muted">{spec.label}</div>
                    <div className="mt-1.5 font-mono text-xl font-bold text-foreground">{spec.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/fahrzeuge"
                  className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-accent-foreground transition-all hover:bg-accent/90 hover:gap-3"
                >
                  Alle technischen Daten <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="border-t border-border/60 bg-surface/30 py-20">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-text">
                  Fachbereiche
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-normal sm:text-4xl">
                  {TEAM_STRUCTURE.filter(s => s.category !== "Board").reduce((n, s) => n + s.departments.length, 0)}+ Spezialisierungen
                </h2>
              </div>
              <p className="max-w-sm text-muted sm:text-right">
                Von der Simulation bis zum Renntrack — jedes Fachteam trägt seinen Teil bei.
              </p>
            </div>
          </Reveal>

          <StaggerGroup className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {TEAM_STRUCTURE.filter(s => s.category !== "Board").flatMap(s => s.departments).map((dept) => (
              <StaggerItem key={dept}>
                <div className="group rounded-md border border-border/50 bg-surface px-4 py-3 text-left transition-all hover:border-accent/50 hover:bg-surface/80">
                  <div className="h-0.5 w-6 rounded-full bg-accent/50 transition-all group-hover:w-8 group-hover:bg-accent" />
                  <div className="mt-2 text-sm font-medium leading-snug text-foreground/80 transition-colors group-hover:text-foreground">
                    {dept}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal delay={0.1} className="mt-10">
            <Link
              href="/team"
              className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-accent-foreground transition-all hover:bg-accent/90 hover:gap-3"
            >
              Das ganze Team kennenlernen <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="overflow-hidden py-16">
        <Reveal>
          <div className="container-page mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-text">
                Wettbewerbe & Momente
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-normal text-balance sm:text-3xl">
                Auf der Strecke zuhause
              </h2>
            </div>
            <Link
              href="/galerie"
              className="hidden items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-accent-text sm:flex"
            >
              Alle Fotos <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </Reveal>
        <div className="flex gap-3 overflow-x-auto px-4 pb-4 sm:px-8 lg:px-0 lg:container-page lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {[
            { src: "/uploads/ert-14-26-rollout-buehne.png", alt: "ERT 14-26 Rollout Bühne", caption: "Rollout 2024" },
            { src: "/uploads/rollout-2026/rollout-2026-buehne-enthuellung.webp", alt: "Rollout 2026 Enthüllung", caption: "Rollout 2026" },
            { src: "/uploads/ert-14-26-sunset.webp", alt: "ERT 14-26 im Sonnenuntergang", caption: "Rennstrecke" },
          ].map((photo, i) => (
            <div key={i} className="group relative aspect-[4/3] w-72 flex-none overflow-hidden rounded-md lg:w-auto">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 288px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-3 left-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-white">{photo.caption}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="container-page mt-6 sm:hidden">
          <Link href="/galerie" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent-text">
            Alle Fotos ansehen <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

    </>
  );
}
