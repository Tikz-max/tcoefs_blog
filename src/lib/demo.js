// Local development only. When no Supabase credentials are configured the app
// serves the sample stories in public/blog-images/news.generated.json from
// memory, so the design can be reviewed and the editor exercised offline.
// Nothing in this file runs in a production build.

let store = null;

const toIso = (display) => {
  const d = new Date(display);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const load = async () => {
  if (store) return store;
  try {
    const res = await fetch("/blog-images/news.generated.json");
    const raw = await res.json();
    store = raw
      .map((a) => ({
        id: String(a.slug || a.id),
        title: a.title,
        excerpt: a.excerpt,
        content: (a.fullContent || "").replaceAll("/news/", "/blog-images/"),
        category: a.category || "News",
        card_image_url: (a.image || "").replace(/^\/news\//, "/blog-images/"),
        date: a.date,
        published_date: toIso(a.date),
        read_time: a.readTime,
        featured: !!a.featured,
        status: "published",
        author: "",
        author_role: "",
        tags: [],
        image_caption: "",
        created_at: toIso(a.date),
      }))
      .sort((a, b) =>
        String(b.published_date).localeCompare(String(a.published_date)),
      );
    const firstFeatured = store.findIndex((a) => a.featured);
    store.forEach((a, i) => (a.featured = i === Math.max(firstFeatured, 0)));
  } catch {
    store = [];
  }
  return store;
};

export const demoStore = {
  async all() {
    return [...(await load())];
  },
  async get(id) {
    return (await load()).find((a) => a.id === String(id)) || null;
  },
  async upsert(article) {
    const list = await load();
    const i = list.findIndex((a) => a.id === article.id);
    if (i >= 0) list[i] = { ...list[i], ...article };
    else list.unshift({ created_at: new Date().toISOString(), ...article });
    list.sort((a, b) =>
      String(b.published_date).localeCompare(String(a.published_date)),
    );
    return this.get(article.id);
  },
  async remove(id) {
    const list = await load();
    const i = list.findIndex((a) => a.id === String(id));
    if (i >= 0) list.splice(i, 1);
  },
  async feature(id, on) {
    const list = await load();
    list.forEach((a) => {
      if (a.id === String(id)) a.featured = on;
      else if (on) a.featured = false;
    });
  },
};

export const demoUser = {
  id: "demo-editor",
  email: "editor@example.org",
  user_metadata: { role: "admin", full_name: "Demo Editor" },
};
