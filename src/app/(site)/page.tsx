import Link from "next/link";
import Image from "next/image";
import { getPage, getVehicles, TEAM_DEPARTMENTS } from "@/lib/content";
import HeroBackground from "@/components/motion/HeroBackground";
import HeroContent from "@/components/motion/HeroContent";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import Counter from "@/components/motion/Counter";
import ScrollScale from "@/components/motion/ScrollScale";

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

const DEPARTMENT_HIGHLIGHTS = [
  {
    icon: "🔋",
    title: "Elektrotechnik",
    description: "Batteriesystem, Leistungselektronik und Hochvolt-Sicherheit des Fahrzeugs.",
  },
  {
    icon: "🛞",
    title: "Fahrwerk",
    description: "Radaufhängung, Lenkung und Fahrdynamik-Abstimmung auf der Strecke.",
  },
  {
    icon: "🌬️",
    title: "Aerodynamik",
    description: "Abtrieb und Luftwiderstand per CFD-Simulation und Flügeldesign optimiert.",
  },
  {
    icon: "💻",
    title: "Software",
    description: "Fahrzeugsoftware, Sensorik und Datenauswertung für jede Teststrecke.",
  },
  {
    icon: "⚙️",
    title: "Powertrain",
    description: "Motoren, Getriebe und Antriebsstrang – von der Auslegung bis zum Prüfstand.",
  },
  {
    icon: "📣",
    title: "Marketing & Sponsoring",
    description: "Öffentlichkeitsarbeit, Partnerbetreuung und der Auftritt des Teams nach außen.",
  },
];

export default function Home() {
  const page = getPage("home");
  const stats = parseStats(page);
  const vehicles = getVehicles();
  const vehicle = vehicles.find((v) => v.current) ?? vehicles[0];
  const bodyParagraphs = page?.body?.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) ?? [];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <HeroBackground />
        <div className="container-page relative pb-20 pt-28 sm:pb-28 sm:pt-36">
          <HeroContent
            eyebrow="Formula Student"
            title={page?.heroTitle ?? "E-Motion Rennteam Aalen"}
            subtitle={page?.heroSubtitle ?? "Elektrisch. Ambitioniert. Aalen."}
          />
        </div>

        {vehicle?.coverImage && (
          <div className="container-page relative pb-20 sm:pb-28">
            <ScrollScale className="mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/60 bg-surface shadow-[0_40px_120px_-40px_rgba(0,113,181,0.35)] sm:aspect-[21/9]">
              <Image
                src={vehicle.coverImage}
                alt={vehicle.name}
                width={1600}
                height={900}
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="h-full w-full object-cover"
              />
            </ScrollScale>
          </div>
        )}

        <div className="relative border-t border-border/60 bg-background/40 backdrop-blur-sm">
          <StaggerGroup className="container-page grid grid-cols-2 gap-8 py-10 sm:grid-cols-3">
            {stats.map((stat) => (
              <StaggerItem key={stat.label} className="text-center sm:text-left">
                <div className="text-3xl font-extrabold text-foreground sm:text-4xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-muted">
                  {stat.label}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {bodyParagraphs.length > 0 && (
        <section className="container-page py-24">
          <Reveal>
            <div className="mx-auto max-w-3xl space-y-5 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">
                Über uns
              </p>
              {bodyParagraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={i === 0 ? "text-lg text-foreground" : "text-base text-muted"}
                >
                  {paragraph}
                </p>
              ))}
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
            <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
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
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent-text transition-all hover:gap-2 hover:underline"
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
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ein Fahrzeug, {TEAM_DEPARTMENTS.length} Fachteams
              </h2>
              <p className="mt-4 text-lg text-muted">
                Von der Konstruktion bis zum Marketing – jedes Fachteam trägt seinen Teil zum
                fertigen Rennwagen bei.
              </p>
            </div>
          </Reveal>
          <StaggerGroup className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEPARTMENT_HIGHLIGHTS.map((dept) => (
              <StaggerItem key={dept.title}>
                <div className="h-full rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/60">
                  <div className="text-2xl">{dept.icon}</div>
                  <h3 className="mt-3 font-semibold">{dept.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{dept.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1} className="mt-10 text-center">
            <Link
              href="/team"
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent-text transition-all hover:gap-2 hover:underline"
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
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
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

      <section className="container-page py-24 text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Unsere Sponsoren</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Ohne unsere Partner wäre unser Projekt nicht möglich. Lernen Sie die Unternehmen
            kennen, die uns unterstützen.
          </p>
          <Link
            href="/sponsoren"
            className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:gap-2.5"
          >
            Zu unseren Sponsoren <span aria-hidden>&rarr;</span>
          </Link>
        </Reveal>
      </section>

      <section className="border-t border-border/60 bg-surface/40 py-24 text-center">
        <div className="container-page">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Werde Teil des Teams
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              Egal ob Technik, Marketing oder Business Plan – wir suchen laufend motivierte
              Studierende, die mit uns den nächsten Boliden bauen.
            </p>
            <Link
              href="/mitmachen"
              className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:gap-2.5"
            >
              Offene Positionen ansehen <span aria-hidden>&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
