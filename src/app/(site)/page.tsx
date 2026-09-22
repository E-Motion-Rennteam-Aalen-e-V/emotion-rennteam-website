import Link from "next/link";
import Image from "next/image";
import { getPage, getVehicles, TEAM_DEPARTMENTS } from "@/lib/content";
import HeroMedia from "@/components/motion/HeroMedia";
import HeroContent from "@/components/motion/HeroContent";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import Counter from "@/components/motion/Counter";

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
          posterSrc={vehicle?.coverImage}
          alt={vehicle?.name ?? "E-Motion Rennteam Aalen"}
        />

        <div className="container-page relative pb-24 pt-32 sm:pb-28">
          <HeroContent
            eyebrow="Formula Student Electric"
            title={page?.heroTitle ?? "E-Motion Rennteam Aalen"}
            subtitle={page?.heroSubtitle ?? "Elektrisch. Ambitioniert. Aalen."}
          />
        </div>

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce flex-col items-center gap-2 text-foreground/50 sm:flex">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em]">Scrollen</span>
          <span aria-hidden className="text-lg leading-none">&darr;</span>
        </div>
      </section>

      <div className="relative z-10 -mt-12 sm:-mt-16">
        <div className="container-page">
          <StaggerGroup className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-surface/95 p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md sm:grid-cols-4 sm:gap-8 sm:rounded-[1.75rem] sm:p-8">
            {stats.map((stat) => (
              <StaggerItem key={stat.label} className="text-center sm:text-left">
                <div className="text-2xl font-extrabold text-foreground sm:text-3xl lg:text-4xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-muted">
                  {stat.label}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>

      <section className="container-page py-16">
        <StaggerGroup className="grid gap-4 sm:grid-cols-2">
          <StaggerItem>
            <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-accent/60 sm:p-8">
              <div>
                <h2 className="text-2xl font-extrabold tracking-normal sm:text-3xl">
                  Unsere Sponsoren
                </h2>
                <p className="mt-3 text-muted">
                  Ohne unsere Partner wäre unser Projekt nicht möglich.
                </p>
              </div>
              <Link
                href="/sponsoren"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wide text-accent-foreground shadow-[0_8px_30px_-8px_rgba(0,113,181,0.6)] transition-all hover:scale-[1.04] hover:gap-3"
              >
                Zu unseren Sponsoren <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-accent/60 sm:p-8">
              <div>
                <h2 className="text-2xl font-extrabold tracking-normal sm:text-3xl">
                  Werde Teil des Teams
                </h2>
                <p className="mt-3 text-muted">
                  Wir suchen laufend motivierte Studierende für den nächsten Boliden.
                </p>
              </div>
              <Link
                href="/mitmachen"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wide text-accent-foreground shadow-[0_8px_30px_-8px_rgba(0,113,181,0.6)] transition-all hover:scale-[1.04] hover:gap-3"
              >
                Offene Positionen ansehen <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </section>

      {aboutSentence && (
        <section className="container-page py-20">
          <Reveal>
            <div className="mx-auto max-w-2xl space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">
                Über uns
              </p>
              <p className="text-xl font-medium text-foreground">{aboutSentence}</p>
            </div>
          </Reveal>
        </section>
      )}

      {vehicle && (
        <section className="container-page py-28 text-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">
              {vehicle.year} · Aktuelles Fahrzeug
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold tracking-normal text-balance sm:text-5xl">
              {vehicle.name}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{vehicle.tagline}</p>
          </Reveal>
          <StaggerGroup className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 items-stretch">
            {vehicle.specs?.slice(0, 4).map((spec) => (
              <StaggerItem key={spec.label} className="h-full">
                <div className="flex h-full flex-col justify-center rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/60">
                  <div className="text-xs uppercase tracking-wide text-muted">{spec.label}</div>
                  <div className="mt-1.5 text-lg font-semibold">{spec.value}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1} className="mt-10">
            <Link
              href="/fahrzeuge"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:gap-3"
            >
              Alle technischen Daten ansehen <span aria-hidden>&rarr;</span>
            </Link>
          </Reveal>
        </section>
      )}

      <section className="border-t border-border/60 bg-background/40 py-28">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">
                Fachbereiche
              </p>
              <p className="mt-4 text-lg text-muted">
                Von der Konstruktion bis zum Marketing – jedes Fachteam trägt seinen Teil zum
                fertigen Rennwagen bei.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 text-center">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:gap-3"
            >
              Das ganze Team kennenlernen <span aria-hidden>&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="overflow-hidden py-16">
        <Reveal>
          <div className="container-page mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">
              Wettbewerbe & Momente
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-normal text-balance sm:text-3xl">
              Auf der Strecke zuhause
            </h2>
          </div>
        </Reveal>
        <div className="flex gap-3 overflow-x-auto px-4 pb-4 sm:px-8 lg:px-0 lg:container-page lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          <div className="relative aspect-[4/3] w-72 flex-none overflow-hidden rounded-2xl lg:w-auto">
            <Image
              src="/uploads/ert-14-26-studio.jpg"
              alt="ERT 14-26 Studio"
              fill
              sizes="(min-width: 1024px) 33vw, 288px"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="relative aspect-[4/3] w-72 flex-none overflow-hidden rounded-2xl lg:w-auto">
            <Image
              src="/uploads/rollout-2026/rollout-2026-buehne-enthuellung.webp"
              alt="Rollout 2026 Enthüllung"
              fill
              sizes="(min-width: 1024px) 33vw, 288px"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="relative aspect-[4/3] w-72 flex-none overflow-hidden rounded-2xl lg:w-auto">
            <Image
              src="/uploads/ert-12-24-track.jpg"
              alt="ERT auf der Rennstrecke"
              fill
              sizes="(min-width: 1024px) 33vw, 288px"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

    </>
  );
}
