import type { Metadata } from "next";
import Reveal from "@/components/motion/Reveal";
import MediaKitRequestForm from "@/components/MediaKitRequestForm";

export const metadata: Metadata = {
  title: "Mediakit – Pressefotos & Logos anfragen",
  description:
    "Presse- und Medienmaterial des E-Motion Rennteams Aalen: Fahrzeug- und Teamfotos, Logos und Videos für Presse, Partner und Sponsoren.",
  alternates: { canonical: "/mediakit" },
  openGraph: {
    title: "Mediakit – E-Motion Rennteam Aalen",
    description: "Pressefotos, Fahrzeugbilder und Logos des Formula-Student-Teams der Hochschule Aalen anfragen.",
    type: "website",
    images: [{ url: "/uploads/ert-14-26-studio.jpg", width: 1200, height: 630 }],
  },
};

export default function MediaKitPage() {
  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Mediakit</p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl md:text-6xl">
          Bild- und Videomaterial anfragen
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Für Präsentationen, Pressemitteilungen oder eure eigene Website: Sagt uns, welches
          Material ihr braucht – wir stellen es passend zusammen.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-14 max-w-2xl">
        <MediaKitRequestForm />
      </Reveal>
    </div>
  );
}
