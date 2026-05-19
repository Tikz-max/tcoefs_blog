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

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function absoluteUrl(url) {
  if (!url) return `${siteUrl}/tcoefs-logo.png`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${siteUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

function mapFallbackArticle(article) {
  return {
    id: String(article.id),
    title: article.title,
    excerpt: article.excerpt,
    content: article.fullContent,
    category: article.category,
    date: article.date,
    read_time: article.readTime,
    published_date: article.published_date || article.date,
    card_image_url: article.image,
  };
}

function pageHtml(article, currentUrl) {
  const title = article.title || "TCoEFS Blog";
  const description = article.excerpt || stripHtml(article.content || "");
  const image = absoluteUrl(article.card_image_url || article.image_url);
  const published = article.published_date || article.created_at || "";
  const content = article.content || article.excerpt || "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} | TCoEFS Blog</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${escapeHtml(currentUrl)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${escapeHtml(currentUrl)}" />
    <meta property="og:site_name" content="TCoEFS Blog" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${escapeHtml(title)}" />
    <meta property="twitter:description" content="${escapeHtml(description)}" />
    <meta property="twitter:image" content="${escapeHtml(image)}" />
    ${published ? `<meta property="article:published_time" content="${escapeHtml(published)}" />` : ""}
    ${article.category ? `<meta property="article:section" content="${escapeHtml(article.category)}" />` : ""}
    <style>
      :root { color-scheme: light; }
      body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #203326; background: #f6faf7; }
      .wrap { max-width: 920px; margin: 0 auto; padding: 32px 20px 64px; }
      .card { background: #fff; border: 1px solid #d9e8e0; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(32,51,38,.08); }
      .hero { padding: 32px 28px; }
      .kicker { text-transform: uppercase; letter-spacing: .12em; font-size: 12px; color: #5b6f61; margin-bottom: 12px; }
      h1 { margin: 0 0 14px; font-size: clamp(2rem, 5vw, 3.6rem); line-height: 1.05; }
      .meta { color: #5b6f61; font-size: 14px; margin-bottom: 18px; }
      .excerpt { font-size: 18px; color: #3d5144; max-width: 65ch; }
      .image { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; background: #e8f2ed; }
      .content { padding: 8px 28px 36px; font-size: 18px; }
      .content img { max-width: 100%; height: auto; border-radius: 14px; }
      .content a { color: #2d5a2d; }
      .back { display: inline-block; margin-top: 24px; color: #2d5a2d; text-decoration: none; font-weight: 600; }
      .footer { margin-top: 18px; color: #5b6f61; font-size: 13px; }
    </style>
    ${article.content ? `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description,
      image,
      url: currentUrl,
      datePublished: published || undefined,
      author: { "@type": "Organization", name: "TCoEFS" },
      publisher: { "@type": "Organization", name: "TCoEFS", logo: { "@type": "ImageObject", url: `${siteUrl}/tcoefs-logo.png` } },
    })}</script>` : ""}
  </head>
  <body>
    <main class="wrap">
      <article class="card">
        <div class="hero">
          <div class="kicker">${escapeHtml(article.category || "News")}</div>
          <h1>${escapeHtml(title)}</h1>
          <div class="meta">${escapeHtml(article.date || "")}${article.read_time ? ` · ${escapeHtml(article.read_time)}` : ""}</div>
          <p class="excerpt">${escapeHtml(description)}</p>
        </div>
        ${article.card_image_url ? `<img class="image" src="${escapeHtml(image)}" alt="${escapeHtml(title)}" />` : ""}
        <div class="content">${content}</div>
      </article>
      <a class="back" href="${siteUrl}">Back to TCoEFS Blog</a>
      <div class="footer">This page is rendered server-side for social previews and search engines.</div>
    </main>
  </body>
</html>`;
}

export default async function handler(req, res) {
  const articleId = req.query.id;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");

  if (!articleId) {
    res.status(400);
    return res.end("Missing article id");
  }

  if (!supabase) {
    res.status(500);
    return res.end("Server configuration error");
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", articleId)
    .maybeSingle();

  if (error) {
    res.status(500);
    return res.end("Failed to load article");
  }

  const fallback = fallbackNews.find(
    (item) => String(item.id) === String(articleId) || item.slug === articleId,
  );

  if (!data && !fallback) {
    res.status(404);
    return res.end(`<!doctype html><html><head><meta name="robots" content="noindex, nofollow"><title>Article not found</title></head><body><h1>Article not found</h1></body></html>`);
  }

  const currentUrl = `${siteUrl}/news/${encodeURIComponent(articleId)}`;
  return res.status(200).end(pageHtml(data || mapFallbackArticle(fallback), currentUrl));
}
