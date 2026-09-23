import { SITE_URL } from "@/lib/site";

type ShareButtonsProps = {
  /** Site-relative path of the page being shared, e.g. "/blog/mein-beitrag". */
  path: string;
  title: string;
  className?: string;
};

const ICON_PATHS = {
  Facebook:
    "M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.021 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.526 1.492-3.92 3.777-3.92 1.094 0 2.238.197 2.238.197v2.475h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.919 8.437-9.94z",
  LinkedIn:
    "M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.12 1 2.5 1s2.48 1.119 2.48 2.5zM.24 8.25h4.52V23H.24V8.25zM8.5 8.25h4.33v2.02h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 3 5.39 6.9V23h-4.52v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23H8.5V8.25z",
  WhatsApp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.892 6.994c-.003 5.45-4.438 9.884-9.884 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.304-1.654a11.888 11.888 0 005.685 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.481-8.413z",
  X: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
} as const;

const NETWORKS: { label: keyof typeof ICON_PATHS; buildHref: (url: string, title: string) => string }[] = [
  {
    label: "Facebook",
    buildHref: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: "LinkedIn",
    buildHref: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    label: "WhatsApp",
    buildHref: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    label: "X",
    buildHref: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

export default function ShareButtons({ path, title, className }: ShareButtonsProps) {
  const url = `${SITE_URL}${path}`;

  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-widest text-accent-text">Teilen</p>
      <div className="mt-2 flex gap-2">
        {NETWORKS.map((network) => (
          <a
            key={network.label}
            href={network.buildHref(url, title)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Auf ${network.label} teilen`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-accent transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent-text"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d={ICON_PATHS[network.label]} />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
