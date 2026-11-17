import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Search, SearchX } from "lucide-react";
import SiteHeader from "../components/site/SiteHeader";
import SiteFooter from "../components/site/SiteFooter";
import Cover from "../components/site/Cover";
import Reveal from "../components/site/Reveal";
import ContourArt from "../components/site/ContourArt";
import { useCountUp } from "../hooks/useCountUp";
import {
  ArticleCard,
  ArticleListItem,
  ArticleRow,
  Kicker,
  Meta,
} from "../components/site/ArticleCard";
import { articlesApi } from "../lib/articles";
import {
  CATEGORIES,
  MAIN_SITE_URL,
  ORG_NAME,
  categorySlug,
  findCategory,
  normaliseTags,
  stripHtml,
} from "../lib/content";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const PAGE_SIZE = 9;

const Stat = ({ value, label, animate = true }) => {
  const [ref, counted] = useCountUp(value);
  const n = animate ? counted : value;
  return (
    <div>
      <p ref={ref} className="font-serif text-[40px] font-semibold leading-none tabular-nums text-white md:text-[52px]">
        {n}
      </p>
      <p className="mt-2 text-[13px] font-bold uppercase tracking-[0.12em] text-white/65">{label}</p>
    </div>
  );
};

const HomeSkeleton = () => (
  <div className="container-page pt-10" aria-busy="true" aria-label="Loading stories">
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="skeleton aspect-[16/9] w-full" />
        <div className="skeleton mt-6 h-3 w-24" />
        <div className="skeleton mt-4 h-10 w-11/12" />
        <div className="skeleton mt-3 h-10 w-2/3" />
      </div>
      <div className="space-y-7 lg:col-span-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="flex-1">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton mt-3 h-5 w-full" />
              <div className="skeleton mt-2 h-5 w-3/4" />
            </div>
            <div className="skeleton h-[84px] w-[84px]" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SectionHeading = ({ title, action }) => (
  <div className="section-rule">
    <h2 className="font-serif text-[26px] font-semibold tracking-tight text-ink md:text-[30px]">
      {title}
    </h2>
    {action}
  </div>
);

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

  useDocumentMeta(
    topic ? topic.name : query ? `Search: ${query}` : tag ? tag : null,
    topic?.blurb,
  );

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
      if (tag && !normaliseTags(a.tags).some((t) => t.toLowerCase() === tag.toLowerCase()))
        return false;
      if (!q) return true;
      return [a.title, a.excerpt, a.category, a.author, normaliseTags(a.tags).join(" "), stripHtml(a.content)]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q));
    });
  }, [articles, filtering, topic, query, tag, sort]);

  const lead = articles.find((a) => a.featured) || articles[0];
  const rest = articles.filter((a) => a.id !== lead?.id);
  const rail = rest.slice(0, 4);
  const grid = rest.slice(4);

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      {loading ? (
        <HomeSkeleton />
      ) : failed ? (
        <div className="container-page py-28 text-center">
          <h1 className="headline text-3xl">Stories could not be loaded</h1>
          <p className="mx-auto mt-3 max-w-md text-ink-2">
            Please check your connection and try again in a moment.
          </p>
          <button onClick={() => window.location.reload()} className="btn btn-primary mt-6">
            Try again
          </button>
        </div>
      ) : filtering ? (
        /* ------------------------------ Archive ------------------------------ */
        <main id="main" tabIndex={-1} className="container-page pb-8 pt-10 focus:outline-none md:pt-14">
          <nav className="meta flex items-center gap-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink hover:underline">
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink-2">
              {topic ? topic.name : tag ? "Tag" : "Search"}
            </span>
          </nav>

          <header className="mt-4 max-w-3xl border-b-2 border-ink pb-8">
            <h1 className="headline text-[40px] leading-[1.08] md:text-[56px]">
              {topic && !query && !tag
                ? topic.name
                : tag && !query
                  ? tag
                  : `Results for “${query}”`}
            </h1>
            {topic && !query && (
              <p className="mt-4 font-serif text-[20px] leading-[1.5] text-ink-2">
                {topic.blurb}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="meta mr-1">
                {results.length} {results.length === 1 ? "story" : "stories"}
              </span>
              {query && topic && <span className="chip">{topic.name}</span>}
              {(query || tag) && (
                <button onClick={() => setParams({})} className="chip min-h-[44px] hover:bg-muted">
                  Clear
                </button>
              )}
              <label className="ml-auto flex items-center gap-2 text-[14px] text-ink-3">
                Sort
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="field !h-11 !w-auto !py-0 pr-9">
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </label>
            </div>
          </header>

          <div className="grid gap-12 pt-9 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {results.length === 0 ? (
                <div className="py-14 text-center lg:text-left">
                  <SearchX size={36} className="mx-auto text-ink-3 lg:mx-0" />
                  <h2 className="headline mt-4 text-2xl">No stories found</h2>
                  <p className="mt-2 text-ink-2">
                    Try a different search term, or browse the latest stories.
                  </p>
                  <Link to="/" className="btn btn-secondary mt-6">
                    Browse latest
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-5">
                    {results.slice(0, visible).map((a, i) => (
                      <Reveal key={a.id} index={i % 3}>
                        <ArticleListItem article={a} />
                      </Reveal>
                    ))}
                  </div>
                  {results.length > visible && (
                    <div className="pt-9 text-center">
                      <button
                        onClick={() => setVisible((v) => v + PAGE_SIZE)}
                        className="btn btn-secondary"
                      >
                        Show more stories
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <aside className="lg:col-span-4 lg:pl-6">
              <div className="lg:sticky lg:top-28">
                <p className="kicker !text-ink-3">Browse by topic</p>
                <ul className="mt-3">
                  {CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <Link
                        to={`/?topic=${c.slug}`}
                        className={`flex items-center justify-between border-b border-line py-3 font-serif text-[19px] hover:text-brand ${
                          topic?.slug === c.slug ? "text-brand" : "text-ink"
                        }`}
                      >
                        {c.name}
                        <span className="font-sans text-[13px] tabular-nums text-ink-3">
                          {counts[c.slug] || 0}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </main>
      ) : articles.length === 0 ? (
        <div className="container-page py-28 text-center">
          <h1 className="headline text-3xl">Stories are on their way</h1>
          <p className="mt-3 text-ink-2">Please check back soon.</p>
        </div>
      ) : (
        /* ----------------------------- Front page ---------------------------- */
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {/* Masthead */}
          <section className="relative overflow-hidden bg-band text-white">
            <ContourArt className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.09]" />
            <div className="container-page relative grid gap-x-12 gap-y-9 pb-36 pt-14 md:pb-40 md:pt-20 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="page-enter text-[12.5px] font-bold uppercase tracking-[0.14em] text-white/70">
                  TCoEFS Blog
                </p>
                <h1 className="headline page-enter mt-5 max-w-[16ch] text-[46px] leading-[1.02] text-white md:text-[76px]" style={{ animationDelay: "80ms" }}>
                  Evidence and stories for a <span className="whitespace-nowrap">food-secure</span> Africa
                </h1>
              </div>
              <div className="lg:col-span-4 lg:pt-10">
                <p className="text-[18px] leading-[1.6] text-white/85">
                  Research, training and partnership updates from the {ORG_NAME},
                  University of Jos.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = new FormData(e.currentTarget).get("q")?.toString().trim();
                    if (q) setParams({ q });
                  }}
                  className="mt-6 flex items-center gap-2 rounded-md bg-white p-1.5 pl-4"
                  role="search"
                >
                  <Search size={18} className="shrink-0 text-ink-3" aria-hidden="true" />
                  <input
                    name="q"
                    placeholder="Search stories"
                    aria-label="Search stories"
                    className="h-10 w-full bg-transparent text-[16px] text-[#14532d] outline-none placeholder:text-[#566474]"
                  />
                  <button type="submit" className="btn btn-primary btn-sm shrink-0">Search</button>
                </form>
              </div>

              <div className="grid grid-cols-3 gap-6 border-t border-white/15 pt-8 lg:col-span-12 lg:max-w-[640px]">
                <Stat value={articles.length} label="Stories" />
                <Stat value={CATEGORIES.length} label="Topics" />
                <Stat animate={false} value={Math.min(...articles.map((a) => Number(String(a.published_date || a.date).slice(0, 4))).filter(Boolean))} label="Publishing since" />
              </div>

              <ul className="flex flex-wrap gap-2.5 lg:col-span-12" aria-label="Browse by topic">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to={`/?topic=${c.slug}`}
                      className="inline-flex min-h-[44px] items-center gap-2.5 rounded-md border border-white/30 px-4 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
                    >
                      {c.name}
                      <span className="text-[13px] font-normal tabular-nums text-white/65">
                        {counts[c.slug] || 0}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Lead story overlaps the masthead */}
          <section className="container-page relative z-10 -mt-24 md:-mt-28">
            <div className="grid gap-6 lg:grid-cols-12">
              <Reveal as="article" className="group overflow-hidden rounded-md border border-line bg-surface shadow-[var(--shadow-card)] lg:col-span-8">
                <Link to={`/news/${lead.id}`} className="block">
                  <Cover src={lead.card_image_url} alt="" ratio="16 / 9" eager rounded="rounded-none" />
                  <div className="p-6 md:p-9">
                    <div className="flex items-center gap-3">
                      <Kicker category={lead.category} />
                      {lead.featured && (
                        <span className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-gold">
                          Featured
                        </span>
                      )}
                    </div>
                    <h2 className="headline mt-3 text-[32px] leading-[1.08] md:text-[46px]">
                      <span className="headline-link">{lead.title}</span>
                    </h2>
                    {lead.excerpt && (
                      <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.6] text-ink-2 line-clamp-3 md:text-[18px]">
                        {lead.excerpt}
                      </p>
                    )}
                    <Meta article={lead} className="mt-5" />
                  </div>
                </Link>
              </Reveal>

              <Reveal
                as="aside"
                index={2}
                className="rounded-md border border-line bg-surface p-6 shadow-[var(--shadow-card)] lg:col-span-4"
                aria-label="Latest stories"
              >
                <h2 className="border-b-2 border-ink pb-3 text-[12.5px] font-bold uppercase tracking-[0.14em] text-ink">
                  Latest
                </h2>
                <div className="divide-y divide-line">
                  {rail.map((a) => (
                    <div key={a.id} className="py-5 last:pb-0">
                      <ArticleRow article={a} />
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* More stories */}
          {grid.length > 0 && (
            <section className="container-page pt-16 md:pt-20">
              <SectionHeading title="More stories" />
              <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {grid.slice(0, visible).map((a, i) => (
                  <Reveal key={a.id} index={i % 3}>
                    <ArticleCard article={a} />
                  </Reveal>
                ))}
              </div>
              {grid.length > visible && (
                <div className="pt-12 text-center">
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="btn btn-secondary"
                  >
                    Show more stories
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Topics */}
          <section className="container-page pt-16 md:pt-24">
            <SectionHeading title="Explore by topic" />
            <Reveal className="mt-8 grid gap-px overflow-hidden rounded-[6px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to={`/?topic=${c.slug}`}
                  className="group flex min-h-[190px] flex-col bg-surface p-6 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center justify-between">
                    <Kicker category={c.name} />
                    <span className="meta tabular-nums">
                      {counts[c.slug] || 0}{" "}
                      {(counts[c.slug] || 0) === 1 ? "story" : "stories"}
                    </span>
                  </div>
                  <h3 className="headline mt-4 text-[26px] leading-tight">{c.name}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.55] text-ink-2">{c.blurb}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13.5px] font-semibold text-brand">
                    Browse
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              ))}
            </Reveal>
          </section>

          {/* About the Centre */}
          <section className="container-page pt-16 md:pt-24">
            <Reveal className="grid gap-8 rounded-[6px] bg-brand-soft px-6 py-10 md:grid-cols-12 md:px-12 md:py-14">
              <div className="md:col-span-8">
                <p className="kicker">About the Centre</p>
                <p className="headline mt-4 text-[26px] leading-[1.25] md:text-[34px]">
                  The {ORG_NAME} at the University of Jos works to strengthen
                  food systems through research, training and partnership.
                </p>
              </div>
              <div className="flex items-end md:col-span-4 md:justify-end">
                <a
                  href={MAIN_SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Visit the main website <ArrowUpRight size={16} />
                </a>
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
