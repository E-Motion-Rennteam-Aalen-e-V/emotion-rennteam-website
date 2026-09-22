export default function ContactMap() {
  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Hochschule+Aalen+Beethovenstra%C3%9Fe+1+73430+Aalen";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-surface">
      {/* Stylized grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.5,
        }}
      />
      {/* Radial glow at center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Decorative streets */}
      <svg
        className="absolute inset-0 h-full w-full text-border"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {/* Horizontal streets */}
        <line x1="0" y1="110" x2="400" y2="110" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
        <line x1="0" y1="190" x2="400" y2="190" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
        <line x1="0" y1="240" x2="400" y2="240" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
        {/* Vertical streets */}
        <line x1="130" y1="0" x2="130" y2="300" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
        <line x1="260" y1="0" x2="260" y2="300" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
        <line x1="60" y1="0" x2="60" y2="300" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
        {/* Diagonal road */}
        <line x1="260" y1="110" x2="400" y2="0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.25" />
        {/* Block fills */}
        <rect x="135" y="115" width="60" height="40" rx="4" fill="currentColor" opacity="0.06" />
        <rect x="65" y="115" width="60" height="40" rx="4" fill="currentColor" opacity="0.06" />
        <rect x="135" y="50" width="120" height="55" rx="4" fill="currentColor" opacity="0.06" />
        <rect x="265" y="115" width="80" height="70" rx="4" fill="currentColor" opacity="0.06" />
        {/* Pin dot */}
        <circle cx="200" cy="150" r="5" fill="var(--color-accent)" />
        <circle cx="200" cy="150" r="12" fill="var(--color-accent)" opacity="0.2" />
        <circle cx="200" cy="150" r="20" fill="var(--color-accent)" opacity="0.1" />
      </svg>

      {/* Address card */}
      <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-64">
        <div className="rounded-xl border border-border/80 bg-background/90 p-4 shadow-xl backdrop-blur-md">
          {/* Pin icon */}
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm">
              📍
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-text">
              Standort
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug">
            Hochschule Aalen
          </p>
          <p className="mt-0.5 text-xs text-muted">
            Beethovenstraße 1<br />
            73430 Aalen
          </p>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground transition-all hover:gap-2.5"
          >
            In Google Maps öffnen <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
