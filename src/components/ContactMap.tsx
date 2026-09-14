export default function ContactMap() {
  return (
    <div className="h-full w-full rounded-xl border border-border overflow-hidden bg-gradient-to-br from-surface to-surface/50">
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=10.066986083984377%2C48.83573802624698%2C10.085487365722656%2C48.84925856749898&amp;layer=mapnik&amp;marker=48.8425%2C10.0763"
        title="Standort des E-Motion Rennteams — Hochschule Aalen, Beethovenstraße 1, 73430 Aalen"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
