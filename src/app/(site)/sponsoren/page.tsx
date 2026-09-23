import type { Metadata } from "next";
import Image from "next/image";
import { getSponsors, type Sponsor } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import SponsorForm from "@/components/SponsorForm";
import SponsorCard from "@/components/SponsorCard";

export const metadata: Metadata = {
  title: "Sponsoren",
  description:
    "Unsere Sponsoren und Partner: Unternehmen, die das E-Motion Rennteam Aalen unterstützen. Werde jetzt Sponsor.",
  alternates: { canonical: "/sponsoren" },
};

const TIERS: Sponsor["tier"][] = ["Platin", "Gold", "Silber", "Bronze", "Partner"];

export default function SponsorsPage() {
  const sponsors = getSponsors();

  return (
    <div className="container-page py-20">
      <Reveal>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Sponsoren</p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl md:text-6xl xl:text-7xl">Unsere Partner</h1>
            <p className="mt-4 max-w-2xl text-muted">
              Ohne die Unterstützung unserer Sponsoren wäre die Entwicklung unseres Fahrzeugs nicht
              möglich. Vielen Dank an alle Partner!
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:w-80 lg:w-96">
            <Image
              src="/uploads/fsb-2025-track-action.webp"
              alt="ERT 13-25 auf der Strecke bei der FS Bopfingen 2025"
              fill
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 320px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Reveal>

      {TIERS.map((tier, ti) => {
        const list = sponsors.filter((s) => s.tier === tier);
        if (list.length === 0) return null;
        return (
          <div key={tier} className="mt-14">
            <Reveal delay={ti * 0.05}>
              <h2 className="border-b border-border pb-3 text-xl font-bold">
                {tier === "Partner" ? "Partner" : `${tier}-Partner`}
              </h2>
            </Reveal>
            <StaggerGroup className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((sponsor) => (
                <StaggerItem key={sponsor.slug}>
                  <SponsorCard sponsor={sponsor} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        );
      })}

      <Reveal id="werden" className="mt-24 scroll-mt-24 rounded-2xl border border-accent/40 bg-surface p-8 sm:p-10" delay={0.1}>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Interesse an einem Sponsoring?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Werden Sie Teil unseres Erfolgs und unterstützen Sie das E-Motion Rennteam Aalen. Füllen Sie
            einfach das Formular aus – wir stellen Ihnen unsere Sponsoring-Pakete individuell vor.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-2xl">
          <SponsorForm />
        </div>
      </Reveal>
    </div>
  );
}
