import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, ExternalLink, FileText, Loader2, PenSquare, Pencil, Search, Star, Trash2 } from "lucide-react";
import { articlesApi, hasEditorialFields } from "../../lib/articles";
import { useAuth } from "../../context/AuthContext";
import { CATEGORIES, articleDate, categorySlug, isPublished } from "../../lib/content";
import Cover from "../site/Cover";
import { useToast } from "./Toast";

const ArticlesList = () => {
  const toast = useToast();
  const { user } = useAuth();
  const [editorial, setEditorial] = useState(false);
  const [articles, setArticles] = useState(null);
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("all");
  const [status, setStatus] = useState("all");
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await articlesApi.listAll();
    if (error) toast("Stories could not be loaded.", "error");
    setArticles(data);
  }, [toast]);

  useEffect(() => {
    load();
    hasEditorialFields().then(setEditorial);
  }, [load]);

  const duplicate = async (a) => {
    const id = await articlesApi.nextId();
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const { error } = await articlesApi.create(
      {
        ...a,
        id,
        title: `Copy of ${a.title}`,
        status: "draft",
        featured: false,
        published_date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      },
      user?.id,
    );
    if (error) return toast(error.message || "Could not duplicate the story.", "error");
    toast("Draft copy created.");
    load();
  };

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (articles || []).filter((a) => {
      if (topic !== "all" && categorySlug(a.category) !== topic) return false;
      if (status === "published" && !isPublished(a)) return false;
      if (status === "draft" && isPublished(a)) return false;
      return !term || `${a.title} ${a.excerpt} ${a.author || ""}`.toLowerCase().includes(term);
    });
  }, [articles, q, topic, status]);

  const toggleLead = async (a) => {
    const { error } = await articlesApi.setFeatured(a.id, !a.featured);
    if (error) return toast(error.message || "Could not update the lead story.", "error");
    toast(a.featured ? "Removed as lead story." : "Set as lead story.");
    load();
  };

  const remove = async () => {
    setBusy(true);
    const { error } = await articlesApi.remove(confirm.id);
    setBusy(false);
    if (error) return toast(error.message || "Could not delete the story.", "error");
    toast("Story deleted.");
    setConfirm(null);
    load();
  };

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker !text-ink-3">Editorial desk</p>
          <h1 className="headline mt-2 text-[34px] md:text-[42px]">Stories</h1>
        </div>
        <Link to="/admin/articles/new" className="btn btn-primary"><PenSquare size={16} /> New story</Link>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stories" aria-label="Search stories" className="field pl-9" />
        </div>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Filter by topic" className="field sm:w-44">
          <option value="all">All topics</option>
          {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className="field sm:w-40">
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      <div className="panel mt-5 overflow-hidden">
        {!articles ? (
          <div className="space-y-px">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-[84px] !rounded-none" />)}</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={30} className="mx-auto text-ink-3" />
            <p className="mt-3 font-semibold text-ink">{articles.length ? "No stories match" : "No stories yet"}</p>
            <p className="mt-1 text-[14px] text-ink-2">{articles.length ? "Try changing the search or filters." : "Create your first story to get started."}</p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((a) => (
              <li key={a.id} className="flex items-center gap-4 p-4 hover:bg-muted/60">
                <Cover src={a.card_image_url} alt="" ratio="4 / 3" zoom={false} className="hidden w-[88px] shrink-0 sm:block" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`chip !h-5 !px-2 !text-[11.5px] ${isPublished(a) ? "!border-brand/40 !text-brand" : ""}`}>
                      {isPublished(a) ? "Published" : "Draft"}
                    </span>
                    {a.featured && (
                      <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold uppercase tracking-wider text-gold">
                        <Star size={12} fill="currentColor" /> Lead
                      </span>
                    )}
                  </div>
                  <Link to={`/admin/articles/edit/${a.id}`} className="mt-1.5 block truncate text-[16px] font-semibold text-ink hover:text-brand">
                    {a.title || "Untitled story"}
                  </Link>
                  <p className="mt-0.5 text-[12.5px] text-ink-3">
                    {a.category} · {articleDate(a, { short: true })}{a.author ? ` · ${a.author}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button onClick={() => toggleLead(a)} className="icon-btn" title={a.featured ? "Remove as lead story" : "Make lead story"} aria-label={a.featured ? "Remove as lead story" : "Make lead story"}>
                    <Star size={17} className={a.featured ? "text-gold" : ""} fill={a.featured ? "currentColor" : "none"} />
                  </button>
                  {isPublished(a) && (
                    <a href={`/news/${a.id}`} target="_blank" rel="noopener noreferrer" className="icon-btn hidden sm:flex" title="View live" aria-label="View live">
                      <ExternalLink size={17} />
                    </a>
                  )}
                  {editorial && (
                    <button onClick={() => duplicate(a)} className="icon-btn hidden sm:flex" title="Duplicate as draft" aria-label="Duplicate as draft">
                      <Copy size={17} />
                    </button>
                  )}
                  <Link to={`/admin/articles/edit/${a.id}`} className="icon-btn" title="Edit" aria-label="Edit"><Pencil size={17} /></Link>
                  <button onClick={() => setConfirm(a)} className="icon-btn hover:!text-danger" title="Delete" aria-label="Delete"><Trash2 size={17} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {confirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="alertdialog" aria-modal="true" onClick={() => !busy && setConfirm(null)}>
          <div className="animate-fade-in w-full max-w-md rounded-xl bg-surface p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-2xl font-semibold">Delete this story?</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
              <strong className="text-ink">{confirm.title}</strong> will be permanently removed and its link will stop working. This cannot be undone.
            </p>
            {confirm.featured && <p className="mt-3 rounded-md bg-gold-soft p-3 text-[13.5px] text-ink">This is the current lead story. The newest story will lead instead.</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setConfirm(null)} disabled={busy} className="btn btn-secondary">Cancel</button>
              <button onClick={remove} disabled={busy} className="btn btn-danger">
                {busy && <Loader2 size={15} className="animate-spin" />} Delete story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;
