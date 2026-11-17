import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const siteUrl = "https://blog.tcoefs-unijos.org";
const fallbackNews = JSON.parse(
  readFileSync(new URL("../public/blog-images/news.generated.json", import.meta.url), "utf8"),
);
const env = globalThis.process?.env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const xml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const absolute = (url) =>
  !url ? "" : /^https?:\/\//.test(url) ? url : `${siteUrl}${url.startsWith("/") ? "" : "/"}${url}`;

const rfc822 = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
};

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=86400");

  let articles = [];
  if (supabase) {
    const query = (withStatus) => {
      let q = supabase
        .from("articles")
        .select("id, title, excerpt, category, card_image_url, published_date, date")
        .order("published_date", { ascending: false })
        .limit(50);
      if (withStatus) q = q.neq("status", "draft");
      return q;
    };
    let { data, error } = await query(true);
    if (error) ({ data, error } = await query(false));
    if (!error) articles = data || [];
  }
  if (!articles.length) {
    articles = fallbackNews.map((a) => ({
      id: a.slug || a.id,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      card_image_url: a.image,
      published_date: a.date,
    }));
  }

  const items = articles
    .map((a) => {
      const link = `${siteUrl}/news/${encodeURIComponent(a.id)}`;
      const image = absolute(a.card_image_url);
      return `    <item>
      <title>${xml(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${rfc822(a.published_date || a.date)}</pubDate>
      <category>${xml(a.category)}</category>
      <description>${xml(a.excerpt)}</description>${image ? `\n      <enclosure url="${xml(image)}" type="image/jpeg" length="0" />` : ""}
    </item>`;
    })
    .join("\n");

  return res.status(200).end(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TCoEFS Blog</title>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>News, research and training updates from the TETFund Centre of Excellence in Food Security, University of Jos.</description>
    <language>en-NG</language>
${items}
  </channel>
</rss>`);
}
