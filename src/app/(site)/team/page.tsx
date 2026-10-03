import type { Metadata } from "next";
import Link from "next/link";
import {
  getTeam,
  TEAM_DEPARTMENTS,
  TEAM_STRUCTURE,
  TEAM_SEASONS,
  DEFAULT_TEAM_SEASON,
} from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import RainCanvas from "@/components/motion/RainCanvas";
import TeamContent from "@/components/TeamContent";
import { getBreadcrumbJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "Unser Team – Studierende & Fachbereiche",
  description:
    "Das Team des E-Motion Rennteams Aalen: über 50 Studierende aus allen Fachbereichen der Hochschule Aalen entwickeln gemeinsam einen Formula-Student-Electric-Rennwagen.",
  alternates: { canonical: "/team" },
  openGraph: {
    title: "Unser Team – E-Motion Rennteam Aalen",
    description: "Über 50 Studierende aus allen Fachbereichen der Hochschule Aalen, die gemeinsam einen FSE-Rennwagen bauen.",
    type: "website",
    images: [{ url: "/uploads/ert-14-26-studio.jpg", width: 1200, height: 630 }],
  },
};

const TEAM_DESCRIPTIONS: Record<string, string> = {
  Board:
    "Koordiniert das Gesamtprojekt, die Wettbewerbsplanung und die Zusammenarbeit aller Fachteams.",
  Workshop:
    "Betreibt und organisiert die Werkstatt – Maschinen, Material und Fertigungsprozesse für den Fahrzeugbau.",
  "Chassis and Ergonomics":
    "Verantwortlich für Monocoque, Karosserie und die ergonomische Integration des Fahrers ins Fahrzeug.",
  Electrics:
    "Entwickelt Batteriesystem, Leistungselektronik und sorgt für die Hochvolt-Sicherheit des Fahrzeugs.",
  Powertrain:
    "Konzipiert und baut Motoren, Getriebe und den Antriebsstrang des Fahrzeugs.",
  Aerodynamics:
    "Optimiert Abtrieb und Luftwiderstand mit CFD-Simulationen und dem Design der Flügelelemente.",
  "Suspension and Steering Systems":
    "Zuständig für Radaufhängung, Lenkung, Dämpfung und die Fahrdynamik-Abstimmung auf der Strecke.",
  Driverless:
    "Baut die Fahrzeugsoftware, Sensorik und das autonome Fahrmodul für die Driverless-Disziplin.",
  "Vehicle Performance":
    "Simuliert und optimiert das Fahrverhalten und die Gesamtabstimmung des Fahrzeugs.",
  "Media and Marketing":
    "Kümmert sich um Öffentlichkeitsarbeit, Social Media und den Außenauftritt des Teams.",
  "Business Plan / Statistics":
    "Entwickelt das Geschäftskonzept und die strategische Ausrichtung des Teams für den Business-Plan-Wettbewerb.",
  Sponsoring:
    "Betreut bestehende Sponsoren und akquiriert neue Partnerschaften für das Team.",
  "Event Management":
    "Plant und organisiert Team-Events, Rollout und die Teilnahme an Wettbewerben.",
  Finance:
    "Verantwortlich für Budgetplanung, Controlling und die finanzielle Steuerung des Teams.",
};

const SHOW_TEAM_MEMBERS = true;

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ season?: string }>;
}) {
  const requestedSeason = (await searchParams).season;
  const season = TEAM_SEASONS.includes(requestedSeason as (typeof TEAM_SEASONS)[number])
    ? (requestedSeason as (typeof TEAM_SEASONS)[number])
    : DEFAULT_TEAM_SEASON;

  const allTeam = SHOW_TEAM_MEMBERS ? getTeam() : [];
  const team = allTeam.filter((member) => (member.season ?? DEFAULT_TEAM_SEASON) === season);

  const heading = season.startsWith("ERT-") ? `Die Köpfe hinter dem ${season}` : season;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Team", path: "/team" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="relative bg-surface/50 py-20">
        <RainCanvas className="absolute inset-0 h-full w-full pointer-events-none opacity-50 mix-blend-screen" />
        <div className="container-page relative z-10">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Team</p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl md:text-6xl xl:text-7xl">{heading}</h1>
            <p className="mt-4 max-w-2xl text-muted">
              Über 50 Studierende verschiedener Fachrichtungen entwickeln, fertigen und testen
              gemeinsam unseren elektrischen Rennwagen – organisiert in {TEAM_DEPARTMENTS.length} Fachteams.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {TEAM_SEASONS.map((s) => {
                const active = s === season;
                return (
                  <Link
                    key={s}
                    href={s === DEFAULT_TEAM_SEASON ? "/team" : `/team?season=${encodeURIComponent(s)}`}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border text-foreground hover:border-accent hover:bg-surface"
                    }`}
                  >
                    {s}
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-page py-20">

      {team.length === 0 ? (
        <Reveal delay={0.05}>
          <div className="mt-14 rounded-2xl border border-border bg-surface/50 p-10 text-center">
            <p className="text-muted">
              Für die Saison <span className="font-semibold text-foreground">{season}</span> sind
              noch keine Mitglieder hinterlegt.
            </p>
          </div>
        </Reveal>
      ) : (
      <div className="mt-14 space-y-20">
        {TEAM_STRUCTURE.map((group, gi) => (
          <div key={group.category}>
            <Reveal delay={gi * 0.05}>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-accent-text">
                {group.category}
              </h2>
            </Reveal>
            <div className="mt-6 space-y-14">
              {group.departments.map((department, di) => {
                const members = team.filter((member) => member.department === department);
                return (
                  <Reveal key={department} delay={di * 0.03}>
                    <div className="overflow-hidden rounded-2xl border border-border bg-surface/50">
                      <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
                        <div>
                          <h3 className="text-xl font-bold">{department}</h3>
                          {TEAM_DESCRIPTIONS[department] && (
                            <p className="mt-1.5 max-w-xl text-sm text-muted">
                              {TEAM_DESCRIPTIONS[department]}
                            </p>
                          )}
                        </div>
                        <span className="whitespace-nowrap rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-text">
                          {members.length} {members.length === 1 ? "Mitglied" : "Mitglieder"}
                        </span>
                      </div>

                      {members.length === 0 ? (
                        <p className="mt-6 text-sm text-muted">
                          Team wird noch aufgebaut –{" "}
                          <a href="/mitmachen" className="text-accent-text underline">
                            hier mitmachen
                          </a>
                          .
                        </p>
                      ) : (
                      <div className="mt-6">
                        <TeamContent members={members} teamDescriptions={TEAM_DESCRIPTIONS} />
                      </div>
                      )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      )}
      </div>
    </>
  );
}
