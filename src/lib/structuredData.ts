import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

const SOCIAL_URLS = [
  "https://www.instagram.com/e_motion_rennteam",
  "https://www.linkedin.com/company/e-motion-rennteam/",
  "https://github.com/E-Motion-Rennteam-Aalen-e-V",
];

type ArticleInput = {
  title: string;
  description?: string;
  path: string;
  date: string;
  dateModified?: string;
  author?: string;
  coverImage?: string;
};

export function getArticleJsonLd(article: ArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description ?? SITE_DESCRIPTION,
    url: `${SITE_URL}${article.path}`,
    datePublished: article.date,
    dateModified: article.dateModified ?? article.date,
    image: article.coverImage ? [`${SITE_URL}${article.coverImage}`] : [`${SITE_URL}/uploads/ert-14-26-studio.jpg`],
    author: {
      "@type": article.author ? "Person" : "Organization",
      name: article.author ?? SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/uploads/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${article.path}`,
    },
  };
}

type BreadcrumbItem = { name: string; path: string };

export function getBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "de-DE",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/news?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Serialized once here (not just built) so next.config.ts can hash the exact
 * same string for the CSP script-src allowlist — the inline <script> in
 * layout.tsx must match byte-for-byte or the browser blocks it.
 */
export function getOrganizationJsonLdScript(): string {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: SITE_NAME,
    alternateName: "E-Motion Rennteam",
    url: SITE_URL,
    logo: `${SITE_URL}/uploads/logo.png`,
    image: `${SITE_URL}/uploads/ert-14-26-studio.jpg`,
    description: SITE_DESCRIPTION,
    sport: "Motorsport",
    email: "info@emotion-rennteam.de",
    telephone: "+49-7361-5762191",
    sameAs: SOCIAL_URLS,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Beethovenstraße 1",
      postalCode: "73430",
      addressLocality: "Aalen",
      addressCountry: "DE",
    },
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Hochschule Aalen",
      url: "https://www.hs-aalen.de",
    },
    memberOf: {
      "@type": "Organization",
      name: "Formula Student Germany",
      url: "https://www.formulastudent.de",
    },
  };
  return JSON.stringify(organizationJsonLd);
}
