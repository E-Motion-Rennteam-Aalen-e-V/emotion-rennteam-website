import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSponsors, type Sponsor } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import RainCanvas from "@/components/motion/RainCanvas";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import SponsorForm from "@/components/SponsorForm";
import SponsorCard from "@/components/SponsorCard";
import ShareButtons from "@/components/ShareButtons";
import { getBreadcrumbJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "Sponsoren & Partner – Jetzt Sponsor werden",
  description:
    "Unsere Sponsoren und Partner: Unternehmen, die das E-Motion Rennteam Aalen bei Formula Student unterstützen. Jetzt Sponsor werden und sichtbar sein.",
  alternates: { canonical: "/sponsoren" },
  openGraph: {
    title: "Sponsoren & Partner – E-Motion Rennteam Aalen",
    description: "Unternehmen, die das Formula-Student-Team der Hochschule Aalen unterstützen. Jetzt Sponsor werden.",
    type: "website",
    images: [{ url: "/uploads/ert-14-26-studio.jpg", width: 1200, height: 630 }],
  },
};

const TIERS: Sponsor["tier"][] = ["Platin", "Gold", "Silber", "Bronze", "Partner"];

export default function SponsorsPage() {
  const sponsors = getSponsors();
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Sponsoren", path: "/sponsoren" },
  ]);

  return (
    <div className="container-page py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Reveal>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Sponsoren</p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl md:text-6xl xl:text-7xl">Unsere Partner</h1>
            <p className="mt-4 max-w-2xl text-muted">
              Ohne die Unterstützung unserer Sponsoren wäre die Entwicklung unseres Fahrzeugs nicht
              möglich. Vielen Dank an alle Partner!
            </p>
            <ShareButtons path="/sponsoren" title="Sponsoren – E-Motion Rennteam Aalen" className="mt-6" />
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

      <section className="relative -mx-container-page bg-gradient-to-r from-accent/15 via-accent/5 to-accent/10 py-20 mt-24">
        <RainCanvas className="absolute inset-0 h-full w-full pointer-events-none opacity-40 mix-blend-screen" />
        <div className="container-page relative z-10">
          <Reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Sponsoring</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-normal sm:text-4xl md:text-5xl">Werde unser Partner</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
              Unterstütze das E-Motion Rennteam Aalen und sei Teil einer innovativen Community rund um Formula Student Electric.
            </p>
            <Link
              href="#werden"
              className="mt-6 inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-3 text-sm font-bold uppercase tracking-wider text-accent-foreground transition-all hover:bg-accent/90 hover:gap-3"
            >
              Jetzt Kontakt aufnehmen <span aria-hidden="true" className="transition-transform">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

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
