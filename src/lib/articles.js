import { supabase, isDemo } from "./supabase";
import { demoStore } from "./demo";
import { EDITORIAL_FIELDS, isPublished, normaliseTags } from "./content";

const CORE_FIELDS = [
  "id",
  "title",
  "excerpt",
  "content",
  "category",
  "card_image_url",
  "date",
  "published_date",
  "read_time",
  "featured",
];

// The editorial columns (author, tags, draft status, image caption) are an
// optional migration. Detect them once so the app works before and after it.
let capsPromise = null;
export const hasEditorialFields = () => {
  if (isDemo) return Promise.resolve(true);
  if (!capsPromise) {
    capsPromise = supabase
      .from("articles")
      .select(EDITORIAL_FIELDS.join(","))
      .limit(1)
      .then(({ error }) => !error)
      .catch(() => false);
  }
  return capsPromise;
};

const toPayload = async (article) => {
  const fields = (await hasEditorialFields())
    ? [...CORE_FIELDS, ...EDITORIAL_FIELDS]
    : CORE_FIELDS;
  const payload = {};
  fields.forEach((key) => {
    if (article[key] !== undefined) payload[key] = article[key];
  });
  if ("tags" in payload) payload.tags = normaliseTags(payload.tags);
  return payload;
};

const fetchAll = async () => {
  if (isDemo) return { data: await demoStore.all(), error: null };
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(500);
  return { data: data || [], error };
};

export const articlesApi = {
  /** Everything, including drafts. Admin use. */
  async listAll() {
    return fetchAll();
  },

  /** Published stories only. Public use. */
  async listPublished() {
    const { data, error } = await fetchAll();
    return { data: data.filter(isPublished), error };
  },

  async get(id) {
    if (isDemo) return { data: await demoStore.get(id), error: null };
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return { data, error };
  },

  /** Next free id in the existing "news12" sequence. */
  async nextId() {
    const { data } = await fetchAll();
    const max = data.reduce((m, a) => {
      const match = /^news(\d+)$/.exec(String(a.id));
      return match ? Math.max(m, Number(match[1])) : m;
    }, 0);
    return `news${Math.max(max, data.length) + 1}`;
  },

  async create(article, userId) {
    const payload = await toPayload(article);
    if (isDemo) return { data: await demoStore.upsert(payload), error: null };
    const { data, error } = await supabase
      .from("articles")
      .insert({ ...payload, created_by: userId, updated_by: userId })
      .select();
    if (!error && payload.featured) await this.clearOtherFeatured(payload.id);
    return { data: data?.[0] || null, error };
  },

  async update(id, article, userId) {
    const payload = await toPayload({ ...article, id });
    if (isDemo) {
      if (payload.featured) await demoStore.feature(id, true);
      return { data: await demoStore.upsert(payload), error: null };
    }
    const { data, error } = await supabase
      .from("articles")
      .update({ ...payload, updated_by: userId })
      .eq("id", id)
      .select();
    if (!error && payload.featured) await this.clearOtherFeatured(id);
    return { data: data?.[0] || null, error };
  },

  async remove(id) {
    if (isDemo) {
      await demoStore.remove(id);
      return { error: null };
    }
    const { error } = await supabase.from("articles").delete().eq("id", id);
    return { error };
  },

  /** Only one story leads the homepage at a time. */
  async clearOtherFeatured(id) {
    if (isDemo) return;
    await supabase
      .from("articles")
      .update({ featured: false })
      .eq("featured", true)
      .neq("id", id);
  },

  async setFeatured(id, on) {
    if (isDemo) {
      await demoStore.feature(id, on);
      return { error: null };
    }
    const { error } = await supabase
      .from("articles")
      .update({ featured: on })
      .eq("id", id);
    if (!error && on) await this.clearOtherFeatured(id);
    return { error };
  },
};
