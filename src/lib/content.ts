import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Eine einzelne beschaedigte Markdown-Datei (kaputtes YAML-Frontmatter,
// liegengebliebene Git-Konflikt-Marker, halber Schreibvorgang) darf nie die
// gesamte Collection - und damit die Live-Seite fuer alle Besucher - zum
// Absturz bringen. Defekte Eintraege werden uebersprungen und geloggt statt
// den Fehler weiterzuwerfen.
function readCollection<T>(collection: string): (T & { slug: string; fileMtime?: Date })[] {
  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) return [];

  const items: (T & { slug: string; body: string; fileMtime?: Date })[] = [];
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    try {
      const abs = path.join(dir, file);
      const raw = fs.readFileSync(abs, "utf8");
      const { data, content } = matter(raw);
      let fileMtime: Date | undefined;
      try { fileMtime = fs.statSync(abs).mtime; } catch { /* ignore */ }
      items.push({
        ...(data as T),
        slug: file.replace(/\.md$/, ""),
        body: content,
        fileMtime,
      } as T & { slug: string; body: string; fileMtime?: Date });
    } catch (error) {
      console.error(`[content] Ueberspringe defekte Datei ${collection}/${file}:`, error);
    }
  }
  return items;
}

export { TEAM_DEPARTMENTS, TEAM_SEASONS, DEFAULT_SEASON, TEAM_STRUCTURE } from "@/lib/team-departments";
export { DEFAULT_TEAM_SEASON } from "@/lib/team-seasons";

export type TeamMember = {
  name: string;
  role: string;
  department: string;
  season?: string;
  order?: number;
  photo?: string;
  linkedin?: string;
  body: string;
  slug: string;
};

export type Vehicle = {
  name: string;
  year: number;
  tagline?: string;
  coverImage?: string;
  current?: boolean;
  specs?: { label: string; value: string }[];
  achievements?: string[];
  body: string;
  slug: string;
};

export type Sponsor = {
  name: string;
  tier: "Platin" | "Gold" | "Silber" | "Partner";
  logo?: string;
  website?: string;
  body: string;
  slug: string;
};

export type NewsPost = {
  title: string;
  date: string;
  excerpt?: string;
  coverImage?: string;
  body: string;
  slug: string;
  fileMtime?: Date;
};

export type Page = {
  title: string;
  heroTitle?: string;
  heroSubtitle?: string;
  stats?: { label: string; value: string }[];
  departmentDescriptions?: { label: string; value: string }[];
  address?: string;
  email?: string;
  phone?: string;
  socialMedia?: string;
  body: string;
  slug: string;
};

export type BlogPost = {
  title: string;
  date: string;
  author?: string;
  excerpt?: string;
  coverImage?: string;
  body: string;
  slug: string;
  fileMtime?: Date;
};

export type GalleryImage = {
  title: string;
  image: string;
  album: string;
  order?: number;
  slug: string;
};

export type Result = {
  title: string;
  year: number;
  event: string;
  placement?: string;
  description?: string;
  slug: string;
};

export type Position = {
  title: string;
  department?: string;
  commitment?: string;
  body: string;
  slug: string;
};

export function getTeam(): TeamMember[] {
  return readCollection<TeamMember>("team").sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99)
  );
}

export function getVehicles(): Vehicle[] {
  return readCollection<Vehicle>("vehicles").sort((a, b) => b.year - a.year);
}

export function getSponsors(): Sponsor[] {
  const tierOrder = ["Platin", "Gold", "Silber", "Partner"];
  return readCollection<Sponsor>("sponsors").sort(
    (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier)
  );
}

export function getNews(): NewsPost[] {
  return readCollection<NewsPost>("news").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return getNews().find((post) => post.slug === slug);
}

export function getPage(slug: string): Page | undefined {
  return readCollection<Page>("pages").find((page) => page.slug === slug);
}

export function getBlogPosts(): BlogPost[] {
  return readCollection<BlogPost>("blog").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getBlogPosts().find((post) => post.slug === slug);
}

const GALLERY_UPLOAD_DIRS = [
  { path: "galerie-upload", album: "Weitere Bilder" },
  { path: "FS Bofingen ERT1325", album: "FS Bofingen ERT1325" },
  { path: "Fotos Ferdiand ERT1325", album: "Fotos Ferdiand ERT1325" },
  { path: "Rollout ERT 1325", album: "Rollout ERT 1325" },
  { path: "FSAA 2026 wedp", album: "FSAA 2026" },
  { path: "FSG 2026 wedp", album: "FSG 2026" },
  { path: "Team wdp", album: "Team" },
  { path: "rollout-2026", album: "Rollout 2026" },
  { path: "single-bilder-upload", album: "Einzelbilder" },
];
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function getAutoGalleryImages(): GalleryImage[] {
  const images: GalleryImage[] = [];

  for (const dir of GALLERY_UPLOAD_DIRS) {
    const fullPath = path.join(process.cwd(), "public", "uploads", dir.path);
    if (!fs.existsSync(fullPath)) continue;

    fs.readdirSync(fullPath)
      .filter((file) => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
      .forEach((file) => {
        const title = path
          .basename(file, path.extname(file))
          .replace(/[-_]+/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .replace(/^./, (c) => c.toUpperCase());
        images.push({
          title: title || "Foto",
          image: `/uploads/${encodeURIComponent(dir.path)}/${encodeURIComponent(file)}`,
          album: dir.album,
          slug: `auto-${dir.path}-${file}`,
        });
      });
  }

  return images;
}

export function getGallery(): GalleryImage[] {
  const curated = readCollection<GalleryImage>("gallery").sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99)
  );
  const curatedImages = new Set(curated.map((img) => img.image));
  const auto = getAutoGalleryImages().filter((img) => !curatedImages.has(img.image));
  return [...curated, ...auto];
}

export function getResults(): Result[] {
  return readCollection<Result>("results").sort((a, b) => b.year - a.year);
}

export function getPositions(): Position[] {
  return readCollection<Position>("positions");
}
