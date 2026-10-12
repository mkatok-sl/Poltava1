/**
 * Renders the page to static HTML after `vite build`, so search engines and the first
 * paint get the full content before JavaScript runs.
 *
 * Environment (all optional):
 *   PRERENDER_BASE  folder the site is served from, e.g. "/repository" (GitHub Actions sets it)
 *   SITE_URL        absolute URL of the site, e.g. "https://user.github.io/repository";
 *                   enables <link rel="canonical">, og:url, robots.txt sitemap and sitemap.xml
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const serverDir = path.join(root, "dist-server");

const normalizeBase = (value) => {
  const trimmed = (value ?? "").trim().replace(/\/+$/, "");
  if (!trimmed || trimmed === "/") return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const base = normalizeBase(process.env.PRERENDER_BASE);
const siteUrl = (process.env.SITE_URL ?? "").trim().replace(/\/+$/, "");

const entry = (await fs.readdir(serverDir)).find((f) => /^entry-server\.(m?js)$/.test(f));
if (!entry) throw new Error("dist-server/entry-server.js not found; run `npm run build:server` first");
const { render } = await import(pathToFileURL(path.join(serverDir, entry)).href);

const indexPath = path.join(dist, "index.html");
let html = await fs.readFile(indexPath, "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error('index.html is missing <div id="root"></div>');

const appHtml = render(base);
html = html.replace('<div id="root"></div>', `<div id="root" data-prerendered="true" data-base="${base}">${appHtml}</div>`);

// Preload the two faces that carry the Ukrainian headline and body text
const assets = await fs.readdir(path.join(dist, "assets"));
const preload = [/^cormorant-sc-cyrillic-600-normal.*\.woff2$/, /^lora-cyrillic-400-normal.*\.woff2$/]
  .map((re) => assets.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="./assets/${f}" as="font" type="font/woff2" crossorigin />`);

const headExtra = [...preload];
if (siteUrl) {
  headExtra.push(`<link rel="canonical" href="${siteUrl}/" />`, `<meta property="og:url" content="${siteUrl}/" />`);
}
html = html.replace("<!--head-extra-->", headExtra.join("\n    "));

await fs.writeFile(indexPath, html);
// GitHub Pages serves 404.html for unknown paths, which turns /vorskla or /persha-liha into
// working deep links. The router reads the path and scrolls to the section.
await fs.writeFile(path.join(dist, "404.html"), html);
await fs.writeFile(path.join(dist, ".nojekyll"), "");

const today = new Date().toISOString().slice(0, 10);
await fs.writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n${siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : ""}`);
if (siteUrl) {
  await fs.writeFile(
    path.join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><lastmod>${today}</lastmod><changefreq>hourly</changefreq></url>\n</urlset>\n`,
  );
}

await fs.rm(serverDir, { recursive: true, force: true });
console.log(`Prerendered ${(appHtml.length / 1024).toFixed(0)} KB of HTML for base "${base || "/"}"${siteUrl ? ` (${siteUrl})` : ""}`);
