import type React from "react";
import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import CookieConsent from "@/components/CookieConsent";
import MetaPixel from "@/components/MetaPixel";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { getOrganizationJsonLdScript, getWebSiteJsonLd } from "@/lib/structuredData";
import { DEVICE_BOOTSTRAP_SCRIPT } from "@/lib/device";

const airstrike = localFont({
  src: "../fonts/airstrike.ttf",
  variable: "--font-heading",
  display: "swap",
});

const lato = localFont({
  src: "../fonts/LatoSemibold.ttf",
  variable: "--font-body",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const OG_IMAGE = {
  url: "/uploads/ert-14-26-studio.jpg",
  alt: "ERT 14-26 – Formula Student Electric Rennwagen des E-Motion Rennteams Aalen",
  width: 1200,
  height: 630,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "E-Motion Rennteam Aalen | Formula Student Electric",
    template: "%s | E-Motion Rennteam Aalen",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "E-Motion Rennteam Aalen",
    "Formula Student Electric",
    "Formula Student Germany",
    "Elektro Rennwagen",
    "Hochschule Aalen",
    "FSG",
    "FSE",
    "Studierenden Rennteam",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "E-Motion Rennteam Aalen | Formula Student Electric",
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: "de_DE",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Motion Rennteam Aalen | Formula Student Electric",
    description: SITE_DESCRIPTION,
    images: ["/uploads/ert-14-26-studio.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${airstrike.variable} ${lato.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script dangerouslySetInnerHTML={{ __html: DEVICE_BOOTSTRAP_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getOrganizationJsonLdScript() }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebSiteJsonLd()) }}
        />
        <MotionProvider>{children}</MotionProvider>
        <CookieConsent />
        <MetaPixel />
      </body>
    </html>
  );
}
