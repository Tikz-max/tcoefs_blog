import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const siteUrl = "https://blog.tcoefs-unijos.org";
const fallbackNews = JSON.parse(
  readFileSync(new URL("../public/blog-images/news.generated.json", import.meta.url), "utf8"),
);
const env = globalThis.process?.env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const supabaseAnonKey =
  env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");

  if (!supabase) {
    res.status(500);
    return res.end("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"></urlset>");
  }

  const { data, error } = await supabase
    .from("articles")
    .select("id, updated_at, published_date")
    .order("published_date", { ascending: false });

  if (error) {
    res.status(500);
    return res.end("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"></urlset>");
  }

  const urls = [
    `${siteUrl}/`,
    ...(data || []).map((article) => `${siteUrl}/news/${encodeURIComponent(article.id)}`),
    ...fallbackNews.map((article) => `${siteUrl}/news/${encodeURIComponent(article.id)}`),
  ];

  const uniqueUrls = [...new Set(urls)];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls
  .map((url) => `  <url><loc>${url}</loc></url>`)
  .join("\n")}
</urlset>`;

  return res.status(200).end(xml);
}
