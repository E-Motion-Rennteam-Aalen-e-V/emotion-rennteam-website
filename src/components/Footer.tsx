import Image from "next/image";
import Link from "next/link";
import SocialIcons from "@/components/SocialIcons";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="checkered-divider" />
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Image
            src="/uploads/logo.png"
            alt="E-Motion Rennteam Aalen"
            width={1000}
            height={563}
            className="h-10 w-auto"
          />
          <p className="mt-3 max-w-xs text-sm text-muted">
            FS Electric Racing Team der Hochschule Aalen.
          </p>
          <SocialIcons className="mt-4 flex gap-3" />
        </div>

        <div>
          <div className="text-sm font-semibold text-foreground">Navigation</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/formula-student" className="transition-colors hover:text-accent-text">Formula Student</Link></li>
            <li><Link href="/team" className="transition-colors hover:text-accent-text">Team</Link></li>
            <li><Link href="/fahrzeuge" className="transition-colors hover:text-accent-text">Fahrzeuge</Link></li>
            <li><Link href="/erfolge" className="transition-colors hover:text-accent-text">Chronik</Link></li>
            <li><Link href="/sponsoren" className="transition-colors hover:text-accent-text">Sponsoren</Link></li>
            <li><Link href="/mitmachen" className="transition-colors hover:text-accent-text">Mitmachen</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-foreground">Aktuelles</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/news" className="transition-colors hover:text-accent-text">News</Link></li>
            <li><Link href="/blog" className="transition-colors hover:text-accent-text">Blog</Link></li>
            <li><Link href="/galerie" className="transition-colors hover:text-accent-text">Galerie</Link></li>
            <li><Link href="/kontakt" className="transition-colors hover:text-accent-text">Kontakt</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border bg-surface-2">
        <div className="container-page py-12">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-xl font-bold text-foreground">Newsletter</h2>
            <p className="mt-1.5 text-sm text-muted">
              Updates zu Rollouts, Wettbewerben und Team-News direkt ins Postfach.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
          <span>&copy; {new Date().getFullYear()} E-Motion Rennteam Aalen</span>
          <div className="flex items-center gap-4">
            <Link href="/impressum" className="transition-colors hover:text-foreground">
              Impressum
            </Link>
            <Link href="/datenschutz" className="transition-colors hover:text-foreground">
              Datenschutz
            </Link>
          </div>
          <span>FSG | Hochschule Aalen</span>
        </div>
      </div>
    </footer>
  );
}
