// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://caseirinhos.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/nossa-historia", changefreq: "monthly", priority: "0.7" },
  { path: "/cardapio", changefreq: "weekly", priority: "0.9" },
  { path: "/montar-pedido", changefreq: "weekly", priority: "0.9" },
  { path: "/galeria", changefreq: "monthly", priority: "0.7" },
  { path: "/contato", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/links", changefreq: "monthly", priority: "0.5" },
];

async function fetchBlogEntries(): Promise<SitemapEntry[]> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/blog_posts?select=slug,updated_at&published=eq.true`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as { slug: string; updated_at?: string }[];
    return rows
      .filter((r) => r.slug)
      .map((r) => ({
        path: `/blog/${r.slug}`,
        lastmod: r.updated_at ? new Date(r.updated_at).toISOString().slice(0, 10) : undefined,
        changefreq: "monthly" as const,
        priority: "0.6",
      }));
  } catch {
    return [];
  }
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

const run = async () => {
  const entries = [...staticEntries, ...(await fetchBlogEntries())];
  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
  console.log(`sitemap.xml written (${entries.length} entries)`);
};

run();
