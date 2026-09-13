import type { Metadata } from "next";
import Link from "next/link";
import { getPage } from "@/lib/content";
import ContactForm from "@/components/ContactForm";
import ImageCarousel from "@/components/ImageCarousel";
import ContactMap from "@/components/ContactMap";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktiere das E-Motion Rennteam Aalen: Fragen, Kooperationen oder Sponsoring-Anfragen an die Hochschule Aalen.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  const page = getPage("contact");

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Kontakt</p>
        <h1 className="mt-2 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          {page?.heroTitle ?? "Kontaktiere uns"}
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          {page?.heroSubtitle ??
            "Ob Sponsoring, Presse oder allgemeine Fragen – wir freuen uns auf deine Nachricht."}
        </p>
        <p className="mt-3 text-sm text-muted">
          Du willst dich fürs Team bewerben?{" "}
          <Link href="/mitmachen#bewerbung" className="font-semibold text-accent-text hover:underline">
            Hier geht&apos;s zur Bewerbung.
          </Link>
        </p>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <Reveal direction="left">
          <div className="space-y-4">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.1} className="space-y-6 flex flex-col">
          <div className="flex-1 min-h-[400px] rounded-xl border border-border overflow-hidden shadow-lg">
            <ImageCarousel />
          </div>

          <div className="grid gap-3 grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-gradient-to-br from-surface to-surface/80 p-4 hover:border-accent/40 transition-colors duration-300">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-accent-text">Adresse</h2>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                E-Motion Rennteam<br />
                Hochschule Aalen<br />
                Beethovenstraße 1<br />
                73430 Aalen
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-gradient-to-br from-surface to-surface/80 p-4 hover:border-accent/40 transition-colors duration-300">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-accent-text">Kontakt</h2>
              <p className="mt-2 text-xs text-muted space-y-1">
                <a href="mailto:info@emotion-rennteam.de" className="block text-accent-text hover:underline">
                  info@emotion-rennteam.de
                </a>
                <a href="tel:+4973615762191" className="block text-accent-text hover:underline">
                  +49 7361 5762191
                </a>
              </p>
            </div>
          </div>

          <div className="h-64 rounded-xl border border-border overflow-hidden shadow-lg">
            <ContactMap />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
