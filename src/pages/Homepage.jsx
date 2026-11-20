import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, SearchX } from "lucide-react";
import SiteHeader from "../components/site/SiteHeader";
import SiteFooter from "../components/site/SiteFooter";
import Reveal from "../components/site/Reveal";
import ContourArt from "../components/site/ContourArt";
import SplitWords from "../components/site/SplitWords";
import Ticker from "../components/site/Ticker";
import {
  ArticleCard,
  ArticleFeature,
  ArticleListItem,
  ArticleRow,
} from "../components/site/ArticleCard";
import { articlesApi } from "../lib/articles";
import {
  CATEGORIES,
  MAIN_SITE_URL,
  ORG_NAME,
  articleDate,
  categorySlug,
  findCategory,
  normaliseTags,
  stripHtml,
} from "../lib/content";
import { useCountUp } from "../hooks/useCountUp";
import { useParallax } from "../hooks/useParallax";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const PAGE_SIZE = 9;

/* ------------------------------------------------------------------ Hero */

const Hero = ({ lead }) => {
  const ref = useRef(null);
  useParallax(ref);

  // Long headlines step down so they never overwhelm the photograph.
  const length = lead.title.length;
  const size =
    length > 85
      ? "clamp(2.1rem, 5vw, 4.9rem)"
      : length > 55
        ? "clamp(2.4rem, 6.2vw, 6.2rem)"
        : undefined;

  return (
    <section
      ref={ref}
      className="grain relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-band text-white"
    >
      {lead.card_image_url ? (
        <img
          src={lead.card_image_url}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="hero-image absolute inset-0 -z-20 h-full w-full object-cover"
        />
      ) : (
        <ContourArt className="absolute inset-0 -z-20 h-full w-full text-white/[0.14]" />
      )}
      {/* Green tint and legibility gradients over the photograph */}
      <div className="absolute inset-0 -z-10 bg-band/45 mix-blend-multiply" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to top, rgb(11 36 23) 3%, rgb(11 36 23 / 0.78) 34%, rgb(11 36 23 / 0.28) 68%, rgb(11 36 23 / 0.5) 100%)",
        }}
      />

      <div className="container-page relative pb-14 pt-44 md:pb-20">
        <p className="fade-up eyebrow-mono flex items-center gap-3 text-white/85" style={{ "--d": 0 }}>
          <span className="h-px w-10 bg-brand-fill" aria-hidden="true" />
          Featured story
          <span className="text-white/45" aria-hidden="true">/</span>
          {lead.category}
        </p>

        <h1 className="mt-6">
          <Link
            to={`/news/${lead.id}`}
            aria-label={lead.title}
            className="display-hero block max-w-[17ch] focus-visible:outline-white"
            style={size ? { fontSize: size, maxWidth: "20ch" } : undefined}
          >
            <SplitWords text={lead.title} as="span" />
          </Link>
        </h1>

        <div className="mt-9 grid gap-8 md:grid-cols-12 md:items-end">
          {lead.excerpt && (
            <p
              className="fade-up line-clamp-3 max-w-[56ch] font-text text-[18px] leading-[1.55] text-white/85 md:col-span-7 md:text-[21px]"
              style={{ "--d": 7 }}
            >
              {lead.excerpt}
            </p>
          )}
          <div className="fade-up flex flex-wrap items-center gap-x-6 gap-y-4 md:col-span-5 md:justify-end" style={{ "--d": 8 }}>
            <span className="mono text-[13px] text-white/70">
              {articleDate(lead, { short: true })}
              {lead.read_time ? ` / ${lead.read_time}` : ""}
            </span>
            <Link to={`/news/${lead.id}`} className="btn btn-primary nudge !h-14 !px-8 text-[16px]">
              Read the story <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className="fade-up pointer-events-none absolute bottom-6 right-6 hidden items-center gap-3 md:flex" style={{ "--d": 10 }} aria-hidden="true">
        <span className="eyebrow-mono !text-[11px] text-white/55 [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative block h-16 w-px overflow-hidden bg-white/25">
          <span className="absolute inset-x-0 top-0 h-6 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-white" />
        </span>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------- Pieces */

const BigStat = ({ value, label, animate = true }) => {
  const [ref, counted] = useCountUp(value);
  return (
    <div className="border-t border-ink pt-5">
      <p
        ref={ref}
        className="font-serif text-[clamp(3.6rem,8vw,7.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] tabular-nums text-ink"
      >
        {animate ? counted : value}
      </p>
      <p className="eyebrow-mono mt-4 text-ink-3">{label}</p>
    </div>
  );
};

const SectionHead = ({ number, title, action }) => (
  <div className="flex items-end justify-between gap-6 border-t border-ink pt-5">
    <div className="flex items-baseline gap-5">
      <span className="mono text-[13px] text-ink-3" aria-hidden="true">{number}</span>
      <h2 className="display-lg !text-[clamp(2rem,4.4vw,3.8rem)]">{title}</h2>
    </div>
    {action}
  </div>
);

const HomeSkeleton = () => (
  <div className="min-h-screen bg-band" aria-busy="true" aria-label="Loading stories">
    <div className="container-page flex min-h-[80vh] flex-col justify-end pb-20">
      <div className="skeleton !bg-white/10 h-4 w-40" />
      <div className="skeleton !bg-white/10 mt-6 h-16 w-3/4" />
      <div className="skeleton !bg-white/10 mt-4 h-16 w-1/2" />
    </div>
  </div>
);

/* ------------------------------------------------------------- Page */

const Homepage = () => {
  const [params, setParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sort, setSort] = useState("newest");

  const topic = findCategory(params.get("topic") || "");
  const query = (params.get("q") || "").trim();
  const tag = (params.get("tag") || "").trim();
  const filtering = !!(topic || query || tag);

  useDocumentMeta(topic ? topic.name : query ? `Search: ${query}` : tag ? tag : null, topic?.blurb);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await articlesApi.listPublished();
      if (cancelled) return;
      setArticles(data);
      setFailed(!!error && data.length === 0);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setVisible(PAGE_SIZE);
    window.scrollTo({ top: 0 });
  }, [topic?.slug, query, tag]);

  const counts = useMemo(() => {
    const map = {};
    articles.forEach((a) => {
      const slug = categorySlug(a.category);
      map[slug] = (map[slug] || 0) + 1;
    });
    return map;
  }, [articles]);

  const results = useMemo(() => {
    if (!filtering) return [];
    const q = query.toLowerCase();
    const list = sort === "oldest" ? [...articles].reverse() : articles;
    return list.filter((a) => {
      if (topic && categorySlug(a.category) !== topic.slug) return false;
      if (tag && !normaliseTags(a.tags).some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      if (!q) return true;
      return [a.title, a.excerpt, a.category, a.author, normaliseTags(a.tags).join(" "), stripHtml(a.content)]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q));
    });
  }, [articles, filtering, topic, query, tag, sort]);

  const lead = articles.find((a) => a.featured) || articles[0];
  const rest = articles.filter((a) => a.id !== lead?.id);
  const [first, second, third, fourth, ...more] = rest;
  const since = useMemo(() => {
    const years = articles
      .map((a) => Number(String(a.published_date || a.date).slice(0, 4)))
      .filter(Boolean);
    return years.length ? Math.min(...years) : new Date().getFullYear();
  }, [articles]);

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader overlay={!loading && !failed && !filtering && articles.length > 0} />

      {loading ? (
        <HomeSkeleton />
      ) : failed ? (
        <div className="container-page py-40 text-center">
          <h1 className="display-lg">Stories could not be loaded</h1>
          <p className="mx-auto mt-4 max-w-md text-ink-2">Please check your connection and try again in a moment.</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary mt-8">Try again</button>
        </div>
      ) : filtering ? (
        /* ------------------------------ Archive ------------------------------ */
        <main id="main" tabIndex={-1} className="container-page pb-8 pt-14 focus:outline-none md:pt-20">
          <nav className="mono flex items-center gap-2 text-[12.5px] text-ink-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink hover:underline">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink-2">{topic ? topic.name : tag ? "Tag" : "Search"}</span>
          </nav>

          <header className="mt-6 border-b border-ink pb-10">
            <h1 className="display-xl !text-[clamp(2.8rem,9vw,8rem)]">
              {topic && !query && !tag ? topic.name : tag && !query ? tag : `“${query}”`}
            </h1>
            {topic && !query && (
              <p className="mt-5 max-w-[48ch] font-text text-[22px] italic leading-[1.4] text-ink-2">{topic.blurb}</p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="mono mr-1 text-[13px] text-ink-3">
                {results.length} {results.length === 1 ? "story" : "stories"}
              </span>
              {query && topic && <span className="chip">{topic.name}</span>}
              {(query || tag) && (
                <button onClick={() => setParams({})} className="chip min-h-[44px] hover:bg-muted">Clear</button>
              )}
              <label className="mono ml-auto flex items-center gap-2 text-[13px] text-ink-3">
                Sort
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="field !h-11 !w-auto !py-0 pr-9">
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </label>
            </div>
          </header>

          <div className="grid gap-14 pt-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {results.length === 0 ? (
                <div className="py-14">
                  <SearchX size={36} className="text-ink-3" />
                  <h2 className="display-lg mt-5">No stories found</h2>
                  <p className="mt-3 text-ink-2">Try a different search term, or browse the latest stories.</p>
                  <Link to="/" className="btn btn-primary mt-7">Browse latest</Link>
                </div>
              ) : (
                <>
                  {results.slice(0, visible).map((a, i) => (
                    <Reveal key={a.id}>
                      <ArticleListItem article={a} index={i + 1} />
                    </Reveal>
                  ))}
                  {results.length > visible && (
                    <div className="pt-10">
                      <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn btn-secondary border border-ink">
                        Show more stories
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <aside className="lg:col-span-4 lg:pl-8">
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow-mono text-ink-3">Browse by topic</p>
                <ul className="mt-4">
                  {CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <Link
                        to={`/?topic=${c.slug}`}
                        className={`flex items-baseline justify-between border-b border-line py-4 font-serif text-[26px] font-bold hover:text-brand ${
                          topic?.slug === c.slug ? "text-brand" : "text-ink"
                        }`}
                      >
                        {c.name}
                        <span className="mono text-[13px] font-normal text-ink-3">{counts[c.slug] || 0}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </main>
      ) : articles.length === 0 ? (
        <div className="container-page py-40 text-center">
          <h1 className="display-lg">Stories are on their way</h1>
          <p className="mt-4 text-ink-2">Please check back soon.</p>
        </div>
      ) : (
        /* ----------------------------- Front page ---------------------------- */
        <main id="main" tabIndex={-1} className="focus:outline-none">
          <Hero lead={lead} />
          <Ticker items={articles.slice(0, 10)} />

          {/* Manifesto */}
          <section className="container-page py-24 md:py-40">
            <div className="grid gap-10 md:grid-cols-12">
              <p className="eyebrow-mono text-ink-3 md:col-span-3 md:pt-4">About this blog</p>
              <Reveal className="md:col-span-9">
                <p className="display-lg !font-bold !text-[clamp(1.9rem,4.1vw,3.8rem)] !leading-[1.08]">
                  Stories, research and training updates from the {ORG_NAME} at the University of
                  Jos:{" "}
                  <em className="font-medium text-brand">evidence, in plain language, for a food-secure Africa.</em>
                </p>
              </Reveal>
            </div>
            <div className="mt-20 grid gap-10 sm:grid-cols-3 md:mt-28">
              <Reveal><BigStat value={articles.length} label="Stories published" /></Reveal>
              <Reveal index={1}><BigStat value={CATEGORIES.length} label="Topics covered" /></Reveal>
              <Reveal index={2}><BigStat value={since} label="Publishing since" animate={false} /></Reveal>
            </div>
          </section>

          {/* Latest: asymmetric editorial grid */}
          <section className="container-page pb-8 md:pb-16">
            <SectionHead
              number="01"
              title="Latest"
              action={
                <Link to="/?topic=news" className="nudge hidden items-center gap-1.5 pb-2 font-mono text-[13px] uppercase tracking-[0.12em] text-ink-2 hover:text-ink sm:inline-flex">
                  Browse topics <ArrowRight size={14} />
                </Link>
              }
            />

            {first && (
              <div className="mt-12 grid gap-x-12 gap-y-14 lg:grid-cols-12">
                <Reveal className="lg:col-span-7">
                  <ArticleFeature article={first} index={1} />
                </Reveal>
                <div className="flex flex-col gap-12 lg:col-span-5 lg:border-l lg:border-line lg:pl-12">
                  {second && (
                    <Reveal index={1}>
                      <ArticleRow article={second} index={2} />
                    </Reveal>
                  )}
                  {third && (
                    <Reveal index={2} className="border-t border-line pt-12">
                      <ArticleRow article={third} index={3} />
                    </Reveal>
                  )}
                  {fourth && (
                    <Reveal index={3} className="border-t border-line pt-12">
                      <ArticleRow article={fourth} index={4} />
                    </Reveal>
                  )}
                </div>
              </div>
            )}

            {more.length > 0 && (
              <>
                <div className="mt-20 grid gap-x-10 gap-y-16 border-t border-line pt-14 sm:grid-cols-2 lg:grid-cols-3">
                  {more.slice(0, visible - 3 > 0 ? visible - 3 : 6).map((a, i) => (
                    <Reveal key={a.id} index={i % 3}>
                      <ArticleCard article={a} index={i + 5} />
                    </Reveal>
                  ))}
                </div>
                {more.length > (visible - 3 > 0 ? visible - 3 : 6) && (
                  <div className="pt-14 text-center">
                    <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn btn-secondary border border-ink !h-12 !px-8">
                      Show more stories
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Topics */}
          <section className="overflow-hidden pt-20 md:pt-32">
            <div className="container-page">
              <SectionHead number="02" title="Topics" />
              <ul className="mt-10 border-t border-ink">
                {CATEGORIES.map((c, i) => (
                  <li key={c.slug}>
                    <Link
                      to={`/?topic=${c.slug}`}
                      className="row-link grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-4 border-b border-line py-7 md:grid-cols-[72px_minmax(0,1fr)_minmax(0,320px)_auto] md:py-10"
                    >
                      <span className="mono text-[13px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                      <span className="display-xl !text-[clamp(2.3rem,6.4vw,6rem)] !leading-[0.95]">{c.name}</span>
                      <span className="hidden text-[15px] leading-[1.45] opacity-70 md:block">{c.blurb}</span>
                      <span className="mono flex items-center gap-3 text-[13px] opacity-80">
                        {counts[c.slug] || 0}
                        <ArrowUpRight size={22} aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Closing */}
          <section className="container-page pt-24 md:pt-36">
            <Reveal className="grain relative overflow-hidden bg-band px-7 py-16 text-white md:px-16 md:py-24">
              <ContourArt className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.09]" />
              <div className="relative grid gap-10 md:grid-cols-12 md:items-end">
                <div className="md:col-span-8">
                  <p className="eyebrow-mono text-white/60">About the Centre</p>
                  <p className="display-lg mt-5 !text-[clamp(1.9rem,4vw,3.6rem)]">
                    Strengthening food systems through{" "}
                    <em className="font-medium text-brand-fill">research, training and partnership.</em>
                  </p>
                </div>
                <div className="md:col-span-4 md:text-right">
                  <a href={MAIN_SITE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary nudge !h-14 !px-8 text-[16px]">
                    Visit the main website <ArrowUpRight size={18} />
                  </a>
                </div>
              </div>
            </Reveal>
          </section>
        </main>
      )}

      <SiteFooter />
    </div>
  );
};

export default Homepage;
