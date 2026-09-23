import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

type ArticleInput = {
  title: string;
  description?: string;
  path: string;
  date: string;
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
    dateModified: article.date,
    image: article.coverImage ? [`${SITE_URL}${article.coverImage}`] : undefined,
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
    },
    memberOf: {
      "@type": "Organization",
      name: "Formula Student Germany",
    },
  };
  return JSON.stringify(organizationJsonLd);
}
