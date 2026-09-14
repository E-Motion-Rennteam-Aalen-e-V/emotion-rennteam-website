import type { Metadata } from "next";
import Reveal from "@/components/motion/Reveal";
import HumanCreatedBadge from "@/components/HumanCreatedBadge";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung des E-Motion Rennteams Aalen gemäß § 5 TMG.",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Rechtliches</p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Impressum</h1>
      </Reveal>

      <Reveal delay={0.05} className="mt-12 max-w-2xl space-y-8 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">Angaben gemäß § 5 TMG</h2>
          <p className="mt-2">
            E-Motion Rennteam Aalen e.V.
            <br />
            Hochschule Aalen
            <br />
            Beethovenstraße 1
            <br />
            73430 Aalen
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Vertreten durch</h2>
          <p className="mt-2">Linda Mann, 1. Vorstand (Vorstand 2026)</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Website</h2>
          <p className="mt-2">
            Programmierung und Leitung: Denny Svalina, Abteilung Powertrain
            <br />
            E-Mail:{" "}
            <a
              href="mailto:denny.svalina@emotion-rennteam.de"
              className="text-accent-text underline"
            >
              denny.svalina@emotion-rennteam.de
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Kontakt</h2>
          <p className="mt-2">
            Telefon: +49 7361 5762191
            <br />
            E-Mail:{" "}
            <a href="mailto:info@emotion-rennteam.de" className="text-accent-text underline">
              info@emotion-rennteam.de
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Registereintrag</h2>
          <p className="mt-2">
            Eintragung im Vereinsregister.
            <br />
            Registergericht: Amtsgericht Ulm
            <br />
            Registernummer: VR 833
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Umsatzsteuer-ID</h2>
          <p className="mt-2">
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
            <br />
            DE304670383
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p className="mt-2">
            Linda Mann, Anschrift wie oben
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">EU-Streitschlichtung</h2>
          <p className="mt-2">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
            bereit, die unter{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-text underline"
            >
              ec.europa.eu/consumers/odr
            </a>{" "}
            erreichbar ist. Unsere E-Mail-Adresse finden Sie oben. Wir sind nicht bereit oder
            verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Haftung für Inhalte</h2>
          <p className="mt-2">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Haftung für Links</h2>
          <p className="mt-2">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
            übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber der Seiten verantwortlich.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Urheberrecht</h2>
          <p className="mt-2">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
            unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.
            Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb
            der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen
            Autors bzw. Erstellers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Bildnachweise</h2>
          <p className="mt-2">
            Sofern nicht anders gekennzeichnet, liegen die Bildrechte an den auf dieser Website
            verwendeten Fotografien und Grafiken beim E-Motion Rennteam Aalen e.V. Für Presse- und
            Sponsoring-Anfragen zur Nutzung unseres Bildmaterials wende dich bitte an die oben
            genannte Kontaktadresse.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Externe Dienste und Datenschutz</h2>
          <p className="mt-2">
            Auf einzelnen Seiten dieses Angebots (u. a. der Kontaktseite) binden wir Dienste
            externer Anbieter ein, etwa zur Darstellung einer interaktiven Karte. Details zur
            Verarbeitung personenbezogener Daten findest du in unserer{" "}
            <a href="/datenschutz" className="text-accent-text underline">
              Datenschutzerklärung
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col items-center pt-4 text-center">
          <HumanCreatedBadge className="h-24 w-24 text-muted" />
          <p className="mt-3 max-w-xs text-xs text-muted">
            Die Inhalte dieser Website werden von Menschen des E-Motion Rennteams Aalen erstellt.
          </p>
        </section>
      </Reveal>
    </div>
  );
}
