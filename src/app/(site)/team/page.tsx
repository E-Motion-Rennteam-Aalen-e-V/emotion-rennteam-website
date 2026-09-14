import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getTeam,
  TEAM_DEPARTMENTS,
  TEAM_STRUCTURE,
  TEAM_SEASONS,
  DEFAULT_TEAM_SEASON,
} from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Das Team hinter dem E-Motion Rennteam Aalen: Studierende aus allen Fachbereichen, die gemeinsam einen Formula-Student-Electric-Rennwagen entwickeln.",
  alternates: { canonical: "/team" },
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

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Team</p>
        <h1 className="mt-2 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">{heading}</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Über 50 Studierende verschiedenster Fachrichtungen entwickeln, fertigen und testen
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
                      <StaggerGroup className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {members.map((member) => (
                          <StaggerItem key={member.slug}>
                            <div className="group h-full rounded-xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_0_30px_-10px_rgba(0,113,181,0.35)]">
                              <div className="aspect-square overflow-hidden rounded-lg bg-surface-2">
                                {member.photo ? (
                                  <Image
                                    src={member.photo}
                                    alt={member.name}
                                    width={300}
                                    height={300}
                                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted">
                                    <svg
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      className="h-9 w-9 opacity-50"
                                    >
                                      <circle cx="12" cy="8" r="4" />
                                      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                                    </svg>
                                    <span className="text-xs font-medium uppercase tracking-wide">
                                      Bild folgt
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="mt-4 flex items-center justify-between">
                                <h4 className="font-sans font-semibold leading-normal">{member.name}</h4>
                                {member.linkedin && /^https:\/\/(www\.)?linkedin\.com\//.test(member.linkedin) && (
                                  <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${member.name} auf LinkedIn (öffnet in neuem Tab)`}
                                    className="text-muted transition-colors hover:text-accent-text"
                                  >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                                      <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.12 1 2.5 1s2.48 1.119 2.48 2.5zM.24 8.25h4.52V23H.24V8.25zM8.5 8.25h4.33v2.02h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 3 5.39 6.9V23h-4.52v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23H8.5V8.25z" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                              <p className="text-sm text-accent-text">{member.role}</p>
                              {member.body && (
                                <p className="mt-2 text-sm text-muted">{member.body}</p>
                              )}
                            </div>
                          </StaggerItem>
                        ))}
                      </StaggerGroup>
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
  );
}
