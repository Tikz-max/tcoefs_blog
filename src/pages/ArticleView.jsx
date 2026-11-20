import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Copy, Link2, Mail, Printer, Quote, Share2 } from "lucide-react";
import SiteHeader from "../components/site/SiteHeader";
import SiteFooter from "../components/site/SiteFooter";
import { ArticleCard } from "../components/site/ArticleCard";
import {
  ArticleBody,
  ArticleCover,
  ArticleHeader,
} from "../components/site/ArticleDocument";
import {
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
  XIcon,
} from "../components/site/ShareIcons";
import Lightbox from "../components/site/Lightbox";
import BackToTop from "../components/site/BackToTop";
import Reveal from "../components/site/Reveal";
import LikeButton from "../components/LikeButton";
import CommentSection from "../components/CommentSection";
import { articlesApi } from "../lib/articles";
import {
  articleUrl,
  citation,
  isPublished,
  normaliseTags,
  prepareArticleHtml,
  relatedArticles,
  shareLinks,
} from "../lib/content";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const useCopy = () => {
  const [copied, setCopied] = useState(false);
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };
  return [copied, copy];
};

const ReadingProgress = ({ targetRef }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const done = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? done / total : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetRef]);

  return (
    <div className="no-print pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]" aria-hidden="true">
      <div
        className="h-full origin-left bg-brand-fill"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
};

const ShareBar = ({ article, vertical = false }) => {
  const links = shareLinks(article);
  const [copied, copy] = useCopy();
  const item =
    "flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:border-ink hover:text-ink";
  const open = { target: "_blank", rel: "noopener noreferrer" };

  return (
    <div
      className={`no-print flex ${vertical ? "flex-col" : "flex-wrap"} items-center gap-2`}
      role="group"
      aria-label="Share this story"
    >
      <a href={links.x} {...open} className={item} aria-label="Share on X" title="Share on X">
        <XIcon />
      </a>
      <a href={links.linkedin} {...open} className={item} aria-label="Share on LinkedIn" title="Share on LinkedIn">
        <LinkedInIcon />
      </a>
      <a href={links.facebook} {...open} className={item} aria-label="Share on Facebook" title="Share on Facebook">
        <FacebookIcon />
      </a>
      <a href={links.whatsapp} {...open} className={item} aria-label="Share on WhatsApp" title="Share on WhatsApp">
        <WhatsAppIcon />
      </a>
      <a href={links.email} className={item} aria-label="Share by email" title="Share by email">
        <Mail size={17} />
      </a>
      <button
        onClick={() => copy(articleUrl(article.id))}
        className={`${item} ${copied ? "!border-brand !text-brand" : ""}`}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Link copied" : "Copy link"}
      >
        {copied ? <Check size={17} /> : <Link2 size={17} />}
      </button>
      {typeof navigator !== "undefined" && navigator.share && (
        <button
          onClick={() => navigator.share({ title: article.title, url: articleUrl(article.id) }).catch(() => {})}
          className={`${item} lg:hidden`}
          aria-label="Share using your device"
          title="Share"
        >
          <Share2 size={17} />
        </button>
      )}
      <button onClick={() => window.print()} className={item} aria-label="Print" title="Print">
        <Printer size={17} />
      </button>
    </div>
  );
};

const TableOfContents = ({ headings }) => {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setActive(seen[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="In this story" className="no-print">
      <p className="kicker !text-ink-3">In this story</p>
      <ol className="mt-4 border-l border-line">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`-ml-px block border-l-2 py-1.5 text-[13.5px] leading-snug transition-colors ${
                h.level === 3 ? "pl-7" : "pl-4"
              } ${
                active === h.id
                  ? "border-brand font-semibold text-ink"
                  : "border-transparent text-ink-3 hover:text-ink"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

const CiteBox = ({ article }) => {
  const text = citation(article);
  const [copied, copy] = useCopy();
  return (
    <section className="rounded-[6px] border border-line bg-surface p-5 md:p-6" aria-label="Cite this story">
      <div className="flex items-center justify-between gap-4">
        <p className="kicker !text-ink-2 flex items-center gap-2">
          <Quote size={14} /> Cite this story
        </p>
        <button onClick={() => copy(text)} className="btn btn-ghost btn-sm no-print">
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-3 break-words text-[14px] leading-[1.6] text-ink-2">{text}</p>
    </section>
  );
};

const ArticleSkeleton = () => (
  <div className="container-page pt-12" aria-busy="true" aria-label="Loading story">
    <div className="mx-auto max-w-[720px]">
      <div className="skeleton h-3 w-28" />
      <div className="skeleton mt-8 h-12 w-full" />
      <div className="skeleton mt-3 h-12 w-4/5" />
      <div className="skeleton mt-8 h-5 w-full" />
      <div className="skeleton mt-2 h-5 w-2/3" />
      <div className="skeleton mt-10 aspect-[16/9] w-full" />
    </div>
  </div>
);

const ArticleView = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [all, setAll] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | missing
  const bodyRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);
  const [anchorCopied, setAnchorCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    window.scrollTo({ top: 0 });
    (async () => {
      const [{ data }, list] = await Promise.all([
        articlesApi.get(id),
        articlesApi.listPublished(),
      ]);
      if (cancelled) return;
      if (!data || !isPublished(data)) {
        setState("missing");
        return;
      }
      setArticle(data);
      setAll(list.data);
      setState("ready");
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useDocumentMeta(article?.title, article?.excerpt);

  const prepared = useMemo(
    () => prepareArticleHtml(article?.content || ""),
    [article?.content],
  );
  const related = useMemo(
    () => (article ? relatedArticles(article, all, 3) : []),
    [article, all],
  );

  const position = article ? all.findIndex((a) => a.id === article.id) : -1;
  const newer = position > 0 ? all[position - 1] : null;
  const older = position >= 0 && position < all.length - 1 ? all[position + 1] : null;

  const onBodyClick = (e) => {
    const anchor = e.target.closest?.(".heading-anchor");
    if (anchor) {
      e.preventDefault();
      const id = anchor.getAttribute("href").slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
      navigator.clipboard?.writeText(`${articleUrl(article.id)}#${id}`).then(() => {
        setAnchorCopied(true);
        setTimeout(() => setAnchorCopied(false), 2000);
      }).catch(() => {});
      return;
    }
    const img = e.target.closest?.("img");
    if (img && bodyRef.current?.contains(img)) {
      const imgs = [...bodyRef.current.querySelectorAll(".prose-article img")];
      setLightbox({
        index: Math.max(0, imgs.indexOf(img)),
        items: imgs.map((el) => ({
          src: el.currentSrc || el.src,
          alt: el.alt || "",
          caption: el.closest("figure")?.querySelector("figcaption")?.textContent || el.alt || "",
        })),
      });
    }
  };

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <ArticleSkeleton />
      </div>
    );
  }

  if (state === "missing") {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <main id="main" tabIndex={-1} className="container-page py-28 text-center focus:outline-none">
          <p className="kicker">Page not found</p>
          <h1 className="headline mt-4 text-4xl md:text-5xl">
            This story is not available
          </h1>
          <p className="mx-auto mt-4 max-w-md text-ink-2">
            It may have been moved or unpublished. The latest stories are on the
            front page.
          </p>
          <Link to="/" className="btn btn-primary mt-8">
            <ArrowLeft size={16} /> Back to the blog
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const tags = normaliseTags(article.tags);
  const showToc = prepared.headings.length >= 2;
  const gallery = Array.isArray(article.images) ? article.images.slice(1) : [];

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-paper">
      <div className="aurora -z-10 !h-[760px] opacity-50" aria-hidden="true"><i /><i /><i /></div>
      <ReadingProgress targetRef={bodyRef} />
      <SiteHeader />

      <main id="main" tabIndex={-1} className="reader container-page pt-8 focus:outline-none md:pt-12">
        <article className="grid gap-x-10 lg:grid-cols-[52px_minmax(0,720px)_minmax(0,1fr)]">
          <div className="lg:col-span-3">
            <ArticleHeader article={article} />
            <div className="mt-5 lg:hidden">
              <ShareBar article={article} />
            </div>
          </div>

          {article.card_image_url && (
            <div className="mt-10 lg:col-span-3 lg:mt-14">
              <ArticleCover article={article} />
            </div>
          )}

          <aside className="hidden lg:col-start-1 lg:row-start-3 lg:block">
            <div className="sticky top-28 pt-12">
              <ShareBar article={article} vertical />
            </div>
          </aside>

          <div ref={bodyRef} onClick={onBodyClick} className="min-w-0 pt-9 lg:col-start-2 lg:row-start-3 lg:pt-12">
            <ArticleBody html={prepared.html} fallback={article.excerpt} />

            {gallery.length > 0 && (
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {gallery.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${article.title}, image ${i + 2}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-[4px] object-cover"
                  />
                ))}
              </div>
            )}

            {tags.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center gap-2">
                <span className="kicker mr-1 !text-ink-3">Tags</span>
                {tags.map((t) => (
                  <Link key={t} to={`/?tag=${encodeURIComponent(t)}`} className="chip hover:bg-muted">
                    {t}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <div className="no-print flex items-center gap-3">
                <LikeButton postId={article.id} />
                <span className="text-[13.5px] text-ink-3">Found this useful?</span>
              </div>
              <div className="lg:hidden">
                <ShareBar article={article} />
              </div>
            </div>

            <div className="mt-8">
              <CiteBox article={article} />
            </div>

            <div className="no-print mt-12">
              <CommentSection postId={article.id} />
            </div>
          </div>

          <aside className="hidden lg:col-start-3 lg:row-start-3 lg:block">
            {showToc && (
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pl-6 pt-12 xl:pl-12">
                <TableOfContents headings={prepared.headings} />
              </div>
            )}
          </aside>
        </article>

        {(newer || older) && (
          <Reveal as="nav" aria-label="More from the Centre" className="no-print mt-20 grid gap-4 md:grid-cols-2">
            {older ? (
              <Link to={`/news/${older.id}`} className="group rounded-md border border-line bg-surface p-6 transition-shadow hover:shadow-[var(--shadow-card)]">
                <p className="nudge flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-[0.12em] text-ink-3"><ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Previous story</p>
                <p className="headline mt-3 line-clamp-2 text-[24px] leading-[1.15]">{older.title}</p>
              </Link>
            ) : <span />}
            {newer && (
              <Link to={`/news/${newer.id}`} className="group rounded-md border border-line bg-surface p-6 text-left transition-shadow hover:shadow-[var(--shadow-card)] md:text-right">
                <p className="nudge flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-[0.12em] text-ink-3 md:justify-end">Next story <ArrowRight size={14} /></p>
                <p className="headline mt-3 line-clamp-2 text-[24px] leading-[1.15]">{newer.title}</p>
              </Link>
            )}
          </Reveal>
        )}

        {related.length > 0 && (
          <section className="no-print pt-20 md:pt-24" aria-label="Related stories">
            <div className="section-rule">
              <h2 className="font-serif text-[26px] font-semibold tracking-tight md:text-[30px]">
                Keep reading
              </h2>
              <Link to="/" className="text-[13.5px] font-semibold text-brand hover:underline">
                All stories
              </Link>
            </div>
            <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a, i) => (
                <Reveal key={a.id} index={i}>
                  <ArticleCard article={a} showExcerpt={false} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
      <BackToTop />
      {anchorCopied && (
        <div role="status" className="animate-fade-in fixed bottom-20 left-1/2 z-[140] -translate-x-1/2 rounded-md bg-ink px-4 py-2.5 text-[14px] font-bold text-paper shadow-[var(--shadow-pop)]">
          Section link copied
        </div>
      )}
      {lightbox && (
        <Lightbox
          items={lightbox.items}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onIndex={(i) => setLightbox((l) => ({ ...l, index: i }))}
        />
      )}
    </div>
  );
};

export default ArticleView;
