import DOMPurify from "dompurify";

export const SITE_URL = "https://blog.tcoefs-unijos.org";
export const MAIN_SITE_URL = "https://www.tcoefs-unijos.org";
export const ORG_NAME = "TETFund Centre of Excellence in Food Security";
export const ORG_SHORT = "TCoEFS";

export const CATEGORIES = [
  {
    name: "News",
    slug: "news",
    blurb:
      "Announcements, events and institutional updates from the Centre.",
  },
  {
    name: "Research",
    slug: "research",
    blurb:
      "Findings, analysis and evidence on food systems and food security.",
  },
  {
    name: "Training",
    slug: "training",
    blurb:
      "Capacity building, workshops and learning programmes for practitioners.",
  },
  {
    name: "Partnership",
    slug: "partnership",
    blurb:
      "Collaborations with government, industry and development partners.",
  },
];

export const categorySlug = (name = "") => String(name).trim().toLowerCase();

export const findCategory = (value = "") =>
  CATEGORIES.find((c) => c.slug === categorySlug(value)) || null;

/** Editorial columns added by supabase/migrations/001_editorial_fields.sql */
export const EDITORIAL_FIELDS = [
  "author",
  "author_role",
  "tags",
  "status",
  "image_caption",
];

export const isPublished = (article) =>
  !article?.status || article.status === "published";

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

const parseDate = (value) => {
  if (!value) return null;
  // Treat plain YYYY-MM-DD as a calendar date, not a UTC instant.
  const plain = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  const d = plain
    ? new Date(Number(plain[1]), Number(plain[2]) - 1, Number(plain[3]))
    : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

/** "23 March 2025" */
export const formatDate = (value, { short = false } = {}) => {
  const d = parseDate(value);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: short ? "short" : "long",
    year: "numeric",
  });
};

/** Prefer the sortable date, fall back to the stored display string. */
export const articleDate = (article, opts) =>
  formatDate(article?.published_date, opts) ||
  formatDate(article?.date, opts) ||
  article?.date ||
  "";

export const articleIsoDate = (article) => {
  const d = parseDate(article?.published_date) || parseDate(article?.date);
  if (!d) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

export const stripHtml = (html = "") =>
  String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const countWords = (html = "") => {
  const text = stripHtml(html);
  return text ? text.split(" ").length : 0;
};

/** Reading time at 220 words per minute, never below one minute. */
export const readingTime = (html = "") => {
  const minutes = Math.max(1, Math.round(countWords(html) / 220));
  return `${minutes} min read`;
};

export const slugify = (text = "") =>
  String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

export const normaliseTags = (tags) => {
  const list = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
      ? tags.split(",")
      : [];
  const seen = new Set();
  return list
    .map((t) => String(t).trim())
    .filter((t) => {
      const key = t.toLowerCase();
      if (!t || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

// ---------------------------------------------------------------------------
// Article body: sanitise, tidy and build a table of contents
// ---------------------------------------------------------------------------

const VIDEO_HOSTS = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i;

let hooked = false;
const ensureHooks = () => {
  if (hooked) return;
  hooked = true;
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName === "iframe") {
      const src = node.getAttribute("src") || "";
      if (!VIDEO_HOSTS.test(src)) node.remove();
    }
  });
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A" && node.getAttribute("href")) {
      const href = node.getAttribute("href");
      if (/^https?:\/\//i.test(href) && !href.includes("tcoefs-unijos.org")) {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    }
    if (node.tagName === "IMG") {
      node.setAttribute("loading", "lazy");
      node.setAttribute("decoding", "async");
    }
  });
};

export const sanitiseHtml = (html = "") => {
  ensureHooks();
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "target",
      "data-variant",
      "data-width",
      "data-youtube-video",
    ],
    FORBID_TAGS: ["style", "form", "input", "button"],
    FORBID_ATTR: ["style", "onerror", "onclick", "onload"],
  });
};

/**
 * Prepare stored HTML for display.
 * Returns the cleaned HTML and the list of section headings (h2/h3) with ids.
 */
export const prepareArticleHtml = (html = "") => {
  if (!html) return { html: "", headings: [] };
  const clean = sanitiseHtml(html);
  const doc = new DOMParser().parseFromString(
    `<div id="root">${clean}</div>`,
    "text/html",
  );
  const root = doc.getElementById("root");
  const headings = [];
  const used = new Set();

  // Legacy posts carry utility classes and empty layout wrappers from the old
  // editor. Keep only the classes the design system defines.
  const KEEP = new Set(["lead", "pull-quote", "callout", "video-embed"]);
  root.querySelectorAll("[class]").forEach((el) => {
    const kept = [...el.classList].filter((c) => KEEP.has(c));
    if (kept.length) el.className = kept.join(" ");
    else el.removeAttribute("class");
  });
  for (let pass = 0; pass < 3; pass += 1) {
    root.querySelectorAll("div, span, section").forEach((el) => {
      if (!el.textContent.trim() && !el.querySelector("img, iframe, video, table, hr")) el.remove();
    });
  }

  // Older posts used <h1> inside the body; the page already has one.
  root.querySelectorAll("h1").forEach((h1) => {
    const h2 = doc.createElement("h2");
    h2.innerHTML = h1.innerHTML;
    h1.replaceWith(h2);
  });

  root.querySelectorAll("h2, h3").forEach((el) => {
    const text = el.textContent.trim();
    if (!text) return;
    let id = slugify(text) || "section";
    let n = 2;
    while (used.has(id)) id = `${slugify(text)}-${n++}`;
    used.add(id);
    el.id = id;
    headings.push({ id, text, level: el.tagName === "H2" ? 2 : 3 });
  });

  // Wide tables scroll inside their own container on small screens.
  root.querySelectorAll("table").forEach((table) => {
    if (table.parentElement?.classList.contains("table-scroll")) return;
    const wrap = doc.createElement("div");
    wrap.className = "table-scroll";
    table.replaceWith(wrap);
    wrap.appendChild(table);
  });

  // Remove empty paragraphs left behind by pasted documents.
  root.querySelectorAll("p").forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector("img, iframe, br")) p.remove();
  });

  return { html: root.innerHTML, headings };
};

// ---------------------------------------------------------------------------
// Sharing and citation
// ---------------------------------------------------------------------------

export const articleUrl = (id) => `${SITE_URL}/news/${encodeURIComponent(id)}`;

export const shareLinks = (article) => {
  const url = encodeURIComponent(articleUrl(article.id));
  const title = encodeURIComponent(article.title || "");
  return {
    x: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    whatsapp: `https://wa.me/?text=${title}%20${url}`,
    email: `mailto:?subject=${title}&body=${url}`,
  };
};

/** Suggested citation in a plain author-date style. */
export const citation = (article) => {
  const author = article.author?.trim() || ORG_SHORT;
  const d = parseDate(article.published_date) || parseDate(article.date);
  const when = d
    ? `${d.getFullYear()}, ${d.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}`
    : "n.d.";
  return `${author} (${when}). ${article.title}. ${ORG_SHORT} Blog, ${ORG_NAME}, University of Jos. ${articleUrl(article.id)}`;
};

/** Rank other posts by shared category and tags, newest first. */
export const relatedArticles = (article, all, limit = 3) => {
  const tags = new Set(normaliseTags(article.tags).map((t) => t.toLowerCase()));
  return all
    .filter((a) => a.id !== article.id)
    .map((a, index) => {
      let score = 0;
      if (categorySlug(a.category) === categorySlug(article.category)) score += 2;
      normaliseTags(a.tags).forEach((t) => {
        if (tags.has(t.toLowerCase())) score += 1;
      });
      return { a, score, index };
    })
    .sort((x, y) => y.score - x.score || x.index - y.index)
    .slice(0, limit)
    .map((x) => x.a);
};
