import type { NextConfig } from "next";

// A strict, hash/nonce-based script-src isn't viable here without switching
// every page to dynamic rendering: Next.js injects its own per-page inline
// bootstrap script (RSC/hydration payload), which differs per page and per
// build, so it can't be allowlisted by a static hash, and nonces require
// forgoing static generation site-wide (per Next's own CSP docs). This site
// is almost entirely statically generated, so that trade isn't worth it for
// a defense-in-depth header — this follows Next's documented "Without
// Nonces" baseline CSP instead: https://nextjs.org/docs/app/guides/content-security-policy
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  // React/framer-motion set inline `style` attributes at render time, so
  // style-src needs 'unsafe-inline' too. CSS injection is a much
  // lower-severity risk than script injection.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  // ContactMap creates a blob: iframe to render the Leaflet map locally
  // without loading external scripts into the main document.
  "frame-src blob:",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
  // Isolates the browsing context so other origins can't hold a reference
  // to this page's window (blocks some cross-origin timing/spectre-style
  // attacks) without affecting same-origin navigation or the CMS/API.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Nothing here needs to be embedded by or fetched from another origin.
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Uploaded photos are immutable-cached at the edge for a year (see the
    // /uploads header rule below); let the image-optimizer cache its
    // resized/re-encoded variants just as long instead of the 60s default,
    // so repeat visits never re-run the optimizer for the same source+size.
    minimumCacheTTL: 31536000,
  },
  // Pulls in only the framer-motion submodules actually referenced per file
  // instead of the whole package, shrinking the client JS bundle shipped
  // for pages that only use a couple of its features (Reveal, Stagger, ...).
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Content photos under /uploads are content-addressed by filename
        // (a changed photo gets a new name), so it's safe to let browsers
        // and CDNs cache them for a long time instead of revalidating on
        // every visit.
        source: "/uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Belt-and-suspenders alongside robots.txt: a disallow rule alone
        // doesn't stop a search engine from indexing a URL it finds linked
        // elsewhere, just from crawling it. This header blocks indexing
        // outright for the admin CMS, which has no business in search results.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
