import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { SITE_URL } from "@/lib/site";
import { getBlogPosts, getNews } from "@/lib/content";

function getPageMtime(routePath: string): Date {
  const segments = routePath.replace(/^\//, "").split("/");
  const filePath = path.join(process.cwd(), "src", "app", "(site)", ...segments, "page.tsx");
  try {
    return fs.statSync(filePath).mtime;
  } catch {
    return new Date();
  }
}

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/team", priority: 0.8, changeFrequency: "monthly" },
  { path: "/fahrzeuge", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sponsoren", priority: 0.7, changeFrequency: "monthly" },
  { path: "/formula-student", priority: 0.6, changeFrequency: "yearly" },
  { path: "/galerie", priority: 0.5, changeFrequency: "monthly" },
  { path: "/mediakit", priority: 0.4, changeFrequency: "yearly" },
  { path: "/erfolge", priority: 0.6, changeFrequency: "monthly" },
  { path: "/mitmachen", priority: 0.7, changeFrequency: "monthly" },
  { path: "/news", priority: 0.6, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/kontakt", priority: 0.5, changeFrequency: "yearly" },
  { path: "/impressum", priority: 0.2, changeFrequency: "yearly" },
  { path: "/datenschutz", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: getPageMtime(route.path || "/"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const newsEntries = getNews().map((post) => ({
    url: `${SITE_URL}/news/${post.slug}`,
    lastModified: post.fileMtime ?? new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  const blogEntries = getBlogPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.fileMtime ?? new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...staticEntries, ...newsEntries, ...blogEntries];
}
