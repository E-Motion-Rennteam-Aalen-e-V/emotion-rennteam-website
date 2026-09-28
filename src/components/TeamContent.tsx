'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { TeamMember } from '@/lib/content';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
import MemberModal from '@/components/MemberModal';

interface TeamContentProps {
  members: TeamMember[];
  teamDescriptions: Record<string, string>;
}

export default function TeamContent({ members, teamDescriptions }: TeamContentProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <>
      <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => {
          const isExecutive = ['ceo', 'cto', 'cfo'].includes(member.roleLevel || '');

          return (
            <StaggerItem key={member.slug}>
              <button
                onClick={() => {
                  if (isExecutive) {
                    setSelectedMember(member);
                  }
                }}
                type="button"
                className={`group relative h-full w-full rounded-xl border border-border bg-surface p-5 text-left transition-all duration-300 ${
                  isExecutive
                    ? 'cursor-pointer ring-2 ring-accent/40 hover:-translate-y-1 hover:border-accent/60 hover:ring-accent/80 hover:shadow-[0_0_40px_-10px_rgba(0,113,181,0.5)]'
                    : 'hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_0_30px_-10px_rgba(0,113,181,0.35)]'
                }`}
              >
                {/* Executive Badge */}
                {isExecutive && (
                  <div className="absolute right-3 top-3 z-10 rounded-full bg-accent/20 px-2.5 py-1 text-xs font-semibold text-accent">
                    Executive
                  </div>
                )}

                {/* Photo */}
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
                      <span className="text-xs font-medium uppercase tracking-wide">Bild folgt</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="mt-4 flex items-center justify-between gap-2">
                  <h4 className="font-sans font-semibold leading-normal">{member.name}</h4>
                  {member.linkedin && /^https:\/\/(www\.)?linkedin\.com\//.test(member.linkedin) && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${member.name} auf LinkedIn (öffnet in neuem Tab)`}
                      className="text-accent transition-colors hover:text-accent-text"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.12 1 2.5 1s2.48 1.119 2.48 2.5zM.24 8.25h4.52V23H.24V8.25zM8.5 8.25h4.33v2.02h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 3 5.39 6.9V23h-4.52v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23H8.5V8.25z" />
                      </svg>
                    </a>
                  )}
                </div>
                <p className="text-sm text-accent-text">{member.role}</p>
                {member.body && <p className="mt-2 text-sm text-muted">{member.body}</p>}
              </button>
            </StaggerItem>
          );
        })}
      </StaggerGroup>

      {/* Modal */}
      <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </>
  );
}
