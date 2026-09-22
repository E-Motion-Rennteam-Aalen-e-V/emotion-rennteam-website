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

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce flex-col items-center gap-1.5 sm:flex">
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-white/60 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">Scrollen</span>
          <span aria-hidden className="text-base leading-none text-white/60 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">&darr;</span>
        </div>
      </section>

      <div className="border-b border-t border-border/50 bg-surface/80 backdrop-blur-sm">
        <div className="container-page">
          <StaggerGroup className="grid grid-cols-2 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <StaggerItem
                key={stat.label}
                className={`flex flex-col items-center justify-center px-6 py-9 text-center sm:px-10 sm:py-11 ${
                  i < stats.length - 1 ? "border-r border-border" : ""
                } [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r [&:nth-child(1)]:border-b [&:nth-child(2)]:border-b sm:[&:nth-child(1)]:border-b-0 sm:[&:nth-child(2)]:border-b-0`}
              >
                <div className="text-3xl font-extrabold tabular-nums text-foreground lg:text-4xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-xs font-medium uppercase tracking-widest text-muted">
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
            <div className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-accent/50 sm:p-10">
              <div className="h-0.5 w-10 rounded-full bg-accent" />
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
                className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold tracking-wide text-accent-foreground shadow-[0_8px_30px_-8px_rgba(0,113,181,0.5)] transition-all hover:scale-[1.03] hover:gap-3 hover:shadow-[0_8px_30px_-8px_rgba(0,113,181,0.8)]"
              >
                Zu unseren Sponsoren <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </StaggerItem>
          <StaggerItem className="h-full">
            <div className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-accent/50 sm:p-10">
              <div className="h-0.5 w-10 rounded-full bg-accent" />
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
                className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold tracking-wide text-accent-foreground shadow-[0_8px_30px_-8px_rgba(0,113,181,0.5)] transition-all hover:scale-[1.03] hover:gap-3 hover:shadow-[0_8px_30px_-8px_rgba(0,113,181,0.8)]"
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
            <h2 className="mx-auto mt-3 max-w-4xl text-4xl font-extrabold tracking-normal text-balance sm:text-5xl xl:text-6xl">
              {vehicle.name}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{vehicle.tagline}</p>
          </Reveal>
          <StaggerGroup className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 items-stretch xl:grid-cols-4 xl:gap-6">
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
              src="/uploads/ert-14-26-rollout-buehne.png"
              alt="ERT 14-26 Rollout Bühne"
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
              src="/uploads/ert-14-26-sunset.webp"
              alt="ERT 14-26 im Sonnenuntergang"
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
