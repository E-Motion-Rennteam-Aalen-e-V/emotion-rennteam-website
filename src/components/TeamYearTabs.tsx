"use client";

import { useState } from "react";
import Image from "next/image";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import type { TeamMember } from "@/lib/content";
import { TEAM_SEASONS, DEFAULT_SEASON } from "@/lib/team-departments";

interface Props {
  allMembers: TeamMember[];
  departments: readonly string[];
  descriptions: Record<string, string>;
  departmentImages: Record<string, string>;
}

export default function TeamYearTabs({ allMembers, departments, descriptions, departmentImages }: Props) {
  const [activeSeason, setActiveSeason] = useState<string>(DEFAULT_SEASON);

  const seasonMembers = allMembers.filter(
    (m) => (m.season || DEFAULT_SEASON) === activeSeason
  );

  // Only show seasons that actually have members
  const availableSeasons = TEAM_SEASONS.filter((s) =>
    allMembers.some((m) => (m.season || DEFAULT_SEASON) === s)
  );

  return (
    <div>
      {availableSeasons.length > 1 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {availableSeasons.map((season) => (
            <button
              key={season}
              onClick={() => setActiveSeason(season)}
              className={`rounded-full border px-5 py-1.5 text-sm font-semibold transition-colors duration-200 ${
                activeSeason === season
                  ? "border-accent bg-accent text-white"
                  : "border-border text-foreground hover:border-accent/60 hover:text-accent-text"
              }`}
            >
              {season}
            </button>
          ))}
        </div>
      )}

      <div className="mt-14 space-y-14">
        {departments.map((department) => {
          const members = seasonMembers.filter((m) => m.department === department);
          if (members.length === 0) return null;
          const banner = departmentImages[department];
          return (
            <div key={`${activeSeason}-${department}`} className="overflow-hidden rounded-2xl border border-border bg-surface/50">
              {banner && (
                <div className="relative h-64 w-full overflow-hidden sm:h-80">
                  <Image
                    src={banner}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(min-width: 1024px) 1024px, 100vw"
                    className="scale-110 object-cover object-top blur-2xl brightness-50"
                  />
                  <Image
                    src={banner}
                    alt={`Team ${department}`}
                    fill
                    sizes="(min-width: 1024px) 1024px, 100vw"
                    className="object-contain"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-6 sm:p-8">
                    <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{department}</h2>
                  </div>
                </div>
              )}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
                  <div>
                    {!banner && <h2 className="text-xl font-bold">{department}</h2>}
                    {descriptions[department] && (
                      <p className="mt-1.5 max-w-xl text-sm text-muted">{descriptions[department]}</p>
                    )}
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-text">
                    {members.length} {members.length === 1 ? "Mitglied" : "Mitglieder"}
                  </span>
                </div>

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
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9 opacity-50">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                              </svg>
                              <span className="text-xs font-medium uppercase tracking-wide">Bild folgt</span>
                            </div>
                          )}
                        </div>
                        <h3 className="mt-4 font-semibold">{member.name}</h3>
                        <p className="text-sm text-accent-text">{member.role}</p>
                        {member.body && <p className="mt-2 text-sm text-muted">{member.body}</p>}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </div>
          );
        })}

        {departments.every((d) => seasonMembers.filter((m) => m.department === d).length === 0) && (
          <p className="text-sm text-muted">Keine Mitglieder für diese Saison eingetragen.</p>
        )}
      </div>
    </div>
  );
}
