import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useBlocker, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Eye,
  Loader2,
  PanelRight,
  Pencil,
  Star,
  X,
} from "lucide-react";
import { articlesApi, hasEditorialFields } from "../../lib/articles";
import { isDemo } from "../../lib/supabase";
import {
  CATEGORIES,
  formatDate,
  normaliseTags,
  prepareArticleHtml,
  readingTime,
  stripHtml,
} from "../../lib/content";
import { useAuth } from "../../context/AuthContext";
import ImageUpload from "./ImageUpload";
import RichTextEditor from "./RichTextEditor";
import { useToast } from "./Toast";
import {
  ArticleBody,
  ArticleCover,
  ArticleHeader,
} from "../site/ArticleDocument";

const today = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const blank = () => ({
  id: "",
  title: "",
  excerpt: "",
  content: "",
  category: "News",
  card_image_url: "",
  image_caption: "",
  published_date: today(),
  featured: false,
  status: "draft",
  author: "",
  author_role: "",
  tags: [],
});

const EXCERPT_MAX = 300;
const DRAFT_KEY = "tcoefs-editor-draft";

const Section = ({ title, children, hint }) => (
  <section className="panel p-4">
    <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink-2">{title}</h2>
    {hint && <p className="field-hint !mt-1">{hint}</p>}
    <div className="mt-3 space-y-4">{children}</div>
  </section>
);

const TagInput = ({ value, onChange, disabled }) => {
  const [draft, setDraft] = useState("");
  const tags = normaliseTags(value);
  const add = (raw) => {
    const next = normaliseTags([...tags, ...String(raw).split(",")]);
    onChange(next);
    setDraft("");
  };
  return (
    <div className={`field !h-auto flex flex-wrap items-center gap-1.5 !p-2 ${disabled ? "opacity-50" : ""}`}>
      {tags.map((t) => (
        <span key={t} className="chip !h-6 !bg-muted">
          {t}
          <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={`Remove ${t}`} disabled={disabled}>
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        disabled={disabled}
        onChange={(e) => (e.target.value.endsWith(",") ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (draft.trim()) add(draft);
          } else if (e.key === "Backspace" && !draft && tags.length) {
            onChange(tags.slice(0, -1));
          }
        }}
        onBlur={() => draft.trim() && add(draft)}
        placeholder={tags.length ? "" : "Add a tag and press Enter"}
        className="min-w-[120px] flex-1 bg-transparent text-[14px] outline-none"
        aria-label="Add tag"
      />
    </div>
  );
};

const PreviewModal = ({ form, onClose }) => {
  const prepared = useMemo(() => prepareArticleHtml(form.content), [form.content]);
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const preview = {
    ...form,
    id: form.id || "preview",
    read_time: readingTime(form.content),
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-paper" role="dialog" aria-modal="true" aria-label="Story preview">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-surface px-4">
        <p className="text-[14px] font-semibold text-ink">
          Preview <span className="ml-2 font-normal text-ink-3">This is how readers will see the story.</span>
        </p>
        <button onClick={onClose} className="btn btn-secondary btn-sm">
          <Pencil size={14} /> Back to editing
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="container-page py-10">
          <div className="mx-auto max-w-[720px]">
            <ArticleHeader article={preview} linked={false} />
            <div className="mt-8">
              <ArticleCover article={preview} />
            </div>
            <div className="pt-10">
              <ArticleBody html={prepared.html} fallback="No body text yet." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticleEditor = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editorial, setEditorial] = useState(true);
  const [savedAt, setSavedAt] = useState(null);
  const loadedStatus = useRef("draft");
  const titleRef = useRef(null);

  useEffect(() => {
    hasEditorialFields().then(setEditorial);
  }, []);

  // Load an existing story, or offer to restore an unsaved new one.
  useEffect(() => {
    if (!isEdit) {
      try {
        const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
        if (saved && (saved.title || saved.content)) {
          setForm({ ...blank(), ...saved });
          setDirty(true);
          toast("Restored your unsaved draft.");
        }
      } catch {
        /* ignore corrupt draft */
      }
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await articlesApi.get(id);
      if (cancelled) return;
      if (error || !data) {
        toast("That story could not be loaded.", "error");
        navigate("/admin/articles", { replace: true });
        return;
      }
      loadedStatus.current = data.status || "published";
      setForm({ ...blank(), ...data, tags: normaliseTags(data.tags), status: data.status || "published", image_caption: data.image_caption || "" });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Keep new, unsaved work safe in the browser.
  useEffect(() => {
    if (isEdit || !dirty) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      } catch {
        /* storage full or unavailable */
      }
    }, 800);
    return () => clearTimeout(t);
  }, [form, dirty, isEdit]);

  // Warn before losing changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname);

  const set = useCallback((field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setDirty(true);
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }, []);

  // Let the headline box grow with its text.
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [form.title, loading]);

  const handleBody = useCallback((html) => set("content", html), [set]);

  const words = stripHtml(form.content).split(" ").filter(Boolean).length;

  const validate = (publishing) => {
    const next = {};
    if (!form.title.trim()) next.title = "Add a headline.";
    if (publishing) {
      if (!form.excerpt.trim()) next.excerpt = "Add a short summary for the cards and search results.";
      if (!stripHtml(form.content)) next.content = "The story has no body text yet.";
      if (!form.card_image_url) next.card_image_url = "Add a cover image.";
      if (!form.published_date) next.published_date = "Choose a publication date.";
    }
    setErrors(next);
    if (Object.keys(next).length) {
      toast(Object.values(next)[0], "error");
      return false;
    }
    return true;
  };

  const save = async (status) => {
    const publishing = status === "published";
    if (!validate(publishing)) return;
    setSaving(true);

    const payload = {
      ...form,
      status,
      tags: normaliseTags(form.tags),
      date: formatDate(form.published_date),
      read_time: readingTime(form.content),
      excerpt: form.excerpt.trim(),
      title: form.title.trim(),
    };
    // Without the editorial migration there is no draft state: save as live.
    if (!editorial) delete payload.status;

    try {
      let result;
      if (isEdit) {
        result = await articlesApi.update(id, payload, user?.id);
      } else {
        payload.id = await articlesApi.nextId();
        result = await articlesApi.create(payload, user?.id);
      }
      if (result.error) throw new Error(result.error.message || "The story could not be saved.");
      if (!result.data) throw new Error("Saving was blocked. Check that your account has admin permission.");

      setDirty(false);
      setSavedAt(new Date());
      loadedStatus.current = status;
      if (!isEdit) {
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
      }
      toast(publishing ? "Story published." : "Draft saved.");
      if (!isEdit) {
        // Wait a tick so the unsaved-changes guard sees the clean state.
        setTimeout(() => navigate(`/admin/articles/edit/${result.data.id}`, { replace: true }), 0);
      } else {
        setForm((f) => ({ ...f, ...result.data, tags: normaliseTags(result.data.tags), status }));
      }
    } catch (err) {
      toast(err.message || "The story could not be saved.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-brand" />
      </div>
    );
  }

  const live = form.status === "published";
  const err = (k) => errors[k] && <p role="alert" className="mt-1.5 text-[12.5px] text-danger">{errors[k]}</p>;

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-24 pt-5 md:px-8">
      {/* Top bar */}
      <div className="sticky top-0 z-30 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <Link to="/admin/articles" className="btn btn-ghost btn-sm -ml-2">
          <ArrowLeft size={15} /> Stories
        </Link>
        <span className={`chip !h-6 ${live ? "!border-brand !text-brand" : ""}`}>
          {live ? "Published" : "Draft"}
        </span>
        <span className="hidden text-[12.5px] text-ink-3 sm:inline">
          {saving ? "Saving…" : dirty ? "Unsaved changes" : savedAt ? `Saved ${savedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : ""}
        </span>
        <span className="flex-1" />
        <button onClick={() => setPanelOpen(true)} className="btn btn-secondary btn-sm lg:hidden">
          <PanelRight size={15} /> Details
        </button>
        <button onClick={() => setPreviewOpen(true)} className="btn btn-secondary btn-sm">
          <Eye size={15} /> Preview
        </button>
        {live && isEdit && (
          <a href={`/news/${form.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm hidden sm:inline-flex">
            <ExternalLink size={15} /> View live
          </a>
        )}
        {editorial && (
          <button onClick={() => save("draft")} disabled={saving} className="btn btn-secondary btn-sm">
            {live ? "Unpublish" : "Save draft"}
          </button>
        )}
        <button onClick={() => save("published")} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          {live || !editorial ? "Save changes" : "Publish"}
        </button>
      </div>

      {!editorial && !isDemo && (
        <p className="mb-6 rounded-lg border border-line bg-gold-soft p-3.5 text-[13.5px] leading-relaxed text-ink">
          Drafts, authors, tags and image captions need a one-off database update. Run{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 text-[12.5px]">supabase/migrations/001_editorial_fields.sql</code>{" "}
          in the Supabase SQL editor. Until then every save publishes the story.
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Writing surface */}
        <div className="min-w-0">
          <label htmlFor="headline" className="sr-only">Headline</label>
          <textarea
            id="headline"
            ref={titleRef}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            rows={1}
            placeholder="Headline"
            className="headline w-full resize-none bg-transparent text-[34px] leading-[1.1] outline-none placeholder:text-ink-3/60 md:text-[46px]"
          />
          {err("title")}

          <div className="mt-3">
            <label htmlFor="summary" className="field-label">Summary</label>
            <textarea
              id="summary"
              value={form.excerpt}
              maxLength={EXCERPT_MAX}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={4}
              placeholder="One or two sentences. Shown under the headline, on cards and in search results."
              className="field font-serif !text-[18px]"
            />
            <div className="mt-1 flex justify-between">
              <span>{err("excerpt")}</span>
              <span className="text-[12px] tabular-nums text-ink-3">{form.excerpt.length}/{EXCERPT_MAX}</span>
            </div>
          </div>

          <div className="mt-6">
            <RichTextEditor value={form.content} onChange={handleBody} />
            {err("content")}
          </div>
        </div>

        {/* Details */}
        <div
          className={`${panelOpen ? "fixed inset-0 z-[80] flex justify-end bg-black/45 lg:static lg:z-auto lg:block lg:bg-transparent" : "hidden lg:block"}`}
          onClick={() => setPanelOpen(false)}
        >
          <aside
            className="h-full w-[min(92vw,360px)] space-y-4 overflow-y-auto bg-paper p-4 lg:sticky lg:top-24 lg:h-auto lg:max-h-[calc(100vh-7rem)] lg:w-auto lg:bg-transparent lg:p-0 lg:pr-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between lg:hidden">
              <p className="font-serif text-lg font-semibold">Story details</p>
              <button onClick={() => setPanelOpen(false)} className="icon-btn" aria-label="Close"><X size={18} /></button>
            </div>

            <Section title="Cover image">
              <ImageUpload
                existingImage={form.card_image_url}
                onUploadComplete={(r) => set("card_image_url", r?.url || "")}
              />
              {err("card_image_url")}
              <div>
                <label htmlFor="cap" className="field-label">Cover caption</label>
                <input id="cap" className="field" value={form.image_caption || ""} disabled={!editorial} onChange={(e) => set("image_caption", e.target.value)} placeholder="Description and photo credit" />
              </div>
            </Section>

            <Section title="Publishing">
              <div>
                <label htmlFor="cat" className="field-label">Topic</label>
                <select id="cat" className="field" value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="pub" className="field-label">Publication date</label>
                <input id="pub" type="date" className="field" value={form.published_date || ""} onChange={(e) => set("published_date", e.target.value)} />
                {err("published_date")}
              </div>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--color-brand-fill)]" />
                <span>
                  <span className="flex items-center gap-1.5 text-[14px] font-semibold text-ink"><Star size={14} className="text-gold" /> Lead story</span>
                  <span className="field-hint !mt-0.5 block">Shown large at the top of the homepage. Only one story leads at a time.</span>
                </span>
              </label>
            </Section>

            <Section title="Byline" hint={editorial ? undefined : "Available after the database update."}>
              <div>
                <label htmlFor="au" className="field-label">Author</label>
                <input id="au" className="field" value={form.author || ""} disabled={!editorial} onChange={(e) => set("author", e.target.value)} placeholder="Defaults to TCoEFS" />
              </div>
              <div>
                <label htmlFor="ar" className="field-label">Role or affiliation</label>
                <input id="ar" className="field" value={form.author_role || ""} disabled={!editorial} onChange={(e) => set("author_role", e.target.value)} placeholder="e.g. Research Fellow" />
              </div>
            </Section>

            <Section title="Tags" hint="Help readers find related stories.">
              <TagInput value={form.tags} onChange={(t) => set("tags", t)} disabled={!editorial} />
            </Section>

            <p className="px-1 text-[12.5px] leading-relaxed text-ink-3">
              {words} words · {readingTime(form.content)}. The reading time is worked out automatically.
            </p>
          </aside>
        </div>
      </div>

      {previewOpen && <PreviewModal form={form} onClose={() => setPreviewOpen(false)} />}

      {blocker.state === "blocked" && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4" role="alertdialog" aria-modal="true">
          <div className="animate-fade-in w-full max-w-md rounded-xl bg-surface p-6 shadow-pop">
            <h2 className="font-serif text-2xl font-semibold">Leave without saving?</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">You have changes that have not been saved. If you leave now they will be lost.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => blocker.reset()} className="btn btn-secondary">Keep editing</button>
              <button onClick={() => { setDirty(false); setTimeout(() => blocker.proceed(), 0); }} className="btn btn-danger">Leave</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleEditor;
