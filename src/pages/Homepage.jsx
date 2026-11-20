import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Search, SearchX } from "lucide-react";
import SiteHeader from "../components/site/SiteHeader";
import SiteFooter from "../components/site/SiteFooter";
import Reveal from "../components/site/Reveal";
import ContourArt from "../components/site/ContourArt";
import SplitWords from "../components/site/SplitWords";
import Cover from "../components/site/Cover";
import {
  ArticleBentoLead,
  ArticleBentoPhoto,
  ArticleBentoText,
  ArticleListItem,
  Kicker,
  Meta,
} from "../components/site/ArticleCard";
import { articlesApi } from "../lib/articles";
import {
  CATEGORIES,
  MAIN_SITE_URL,
  categorySlug,
  findCategory,
  normaliseTags,
  stripHtml,
} from "../lib/content";
import { useCountUp } from "../hooks/useCountUp";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const PAGE_SIZE = 9;

/* ------------------------------------------------------------ Hero */

const FloatingStory = ({ article, className, rotate }) => (
  <Link
    to={`/news/${article.id}`}
    className={`glass lift group absolute hidden w-[250px] rounded-[26px] p-3 xl:block ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <Cover src={article.card_image_url} alt="" ratio="16 / 10" label={article.category} rounded="rounded-[18px]" />
    <p className="mt-3 line-clamp-2 px-1 font-serif text-[15.5px] font-bold leading-[1.2] tracking-[-0.02em] text-white">
      {article.title}
    </p>
    <p className="mb-1 mt-1.5 px-1 text-[12.5px] text-white/60">{article.category}</p>
  </Link>
);

const Hero = ({ lead, floating, counts, onSearch }) => (
  <section className="grain relative isolate overflow-hidden bg-band text-white">
    <div className="aurora" aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
    <ContourArt className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.05]" />

    {floating[0] && <FloatingStory article={floating[0]} className="left-[2.5%] top-[60%] animate-float" rotate={-4} />}
    {floating[1] && <FloatingStory article={floating[1]} className="right-[2.5%] top-[57%] animate-float [animation-delay:-3s]" rotate={3} />}

    <div className="container-page relative flex min-h-[88svh] flex-col items-center justify-center pb-24 pt-36 text-center">
      {lead && (
        <Link
          to={`/news/${lead.id}`}
          className="fade-up glass nudge inline-flex max-w-full items-center gap-3 rounded-full py-2 pl-3 pr-4 text-[13.5px] text-white/90"
          style={{ "--d": 0 }}
        >
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-fill opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-fill" />
          </span>
          <span className="truncate">
            <span className="font-medium text-white">New:</span> {lead.title}
          </span>
          <ArrowRight size={14} className="shrink-0" />
        </Link>
      )}

      <h1 className="display-hero mt-9 max-w-[19ch]" aria-label="Evidence and stories for a food-secure Africa">
        <SplitWords text="Evidence and stories for a" />{" "}
        <SplitWords text="food-secure" wordClass="gradient-text" start={5} />{" "}
        <SplitWords text="Africa" start={6} />
      </h1>

      <p className="fade-up mt-8 max-w-[58ch] text-[19px] leading-[1.55] text-white/75 md:text-[21px]" style={{ "--d": 8 }}>
        Research, training and partnership updates from the TETFund Centre of Excellence in Food Security, University of Jos.
      </p>

      <form onSubmit={onSearch} role="search" className="fade-up glass mt-10 flex w-full max-w-[580px] items-center gap-2 rounded-full p-2 pl-6" style={{ "--d": 9 }}>
        <Search size={19} className="shrink-0 text-white/60" aria-hidden="true" />
        <input
          name="q"
          placeholder="Search stories"
          aria-label="Search stories"
          className="h-12 w-full bg-transparent text-[16px] text-white outline-none placeholder:text-white/50"
        />
        <button type="submit" className="btn btn-primary !h-12 !px-7 text-[15px]">Search</button>
      </form>

      <ul className="fade-up mt-8 flex flex-wrap justify-center gap-2.5" style={{ "--d": 10 }} aria-label="Browse by topic">
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link
              to={`/?topic=${c.slug}`}
              className="glass inline-flex min-h-[44px] items-center gap-2.5 rounded-full px-5 text-[14.5px] font-medium text-white transition-colors hover:bg-white/15"
            >
              {c.name}
              <span className="text-[12.5px] tabular-nums text-white/55">{counts[c.slug] || 0}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ------------------------------------------------------------- Bits */

const StatTile = ({ value }) => {
  const [ref, n] = useCountUp(value);
  return (
    <div
      className="bento-tile flex min-h-[220px] flex-col justify-between p-7 text-[color:var(--c-on-cta)]"
      style={{ background: "linear-gradient(135deg, #b6f23a 0%, #34d399 100%)" }}
    >
      <ContourArt className="absolute inset-0 -z-10 h-full w-full text-black/[0.08]" />
      <p className="font-serif text-[13px] font-medium uppercase tracking-[0.14em]">Library</p>
      <div>
        <p ref={ref} className="font-serif text-[clamp(4.5rem,8vw,7rem)] font-bold leading-[0.9] tracking-[-0.05em] tabular-nums">{n}</p>
        <p className="mt-2 text-[17px] font-medium">Stories published</p>
      </div>
    </div>
  );
};

const SectionHead = ({ title, action }) => (
  <div className="flex items-end justify-between gap-6">
    <h2 className="display-lg !text-[clamp(1.9rem,3.6vw,3.2rem)]">{title}</h2>
    {action}
  </div>
);

const Rail = ({ items }) => {
  const ref = useRef(null);
  const by = (dir) => ref.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  return (
    <div>
      <div className="mb-5 flex justify-end gap-2">
        <button onClick={() => by(-1)} className="icon-btn glass-solid !h-12 !w-12" aria-label="Scroll back"><ChevronLeft size={20} /></button>
        <button onClick={() => by(1)} className="icon-btn glass-solid !h-12 !w-12" aria-label="Scroll forward"><ChevronRight size={20} /></button>
      </div>
      <div ref={ref} className="hscroll -mx-5 px-5 md:-mx-8 md:px-8" tabIndex={0} aria-label="More stories">
        {items.map((a) => (
          <ArticleBentoPhoto key={a.id} article={a} className="h-[440px] w-[300px] sm:w-[340px]" />
        ))}
      </div>
    </div>
  );
};

const HomeSkeleton = () => (
  <div className="relative min-h-screen overflow-hidden bg-band" aria-busy="true" aria-label="Loading stories">
    <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
    <div className="container-page relative flex min-h-[80vh] flex-col items-center justify-center gap-5">
      <div className="skeleton !bg-white/10 h-8 w-64 !rounded-full" />
      <div className="skeleton !bg-white/10 h-20 w-full max-w-[860px]" />
      <div className="skeleton !bg-white/10 h-20 w-2/3 max-w-[560px]" />
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
  const [textStory, photoA, photoB, ...more] = rest;

  const onSearch = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim();
    if (q) setParams({ q });
  };

  const front = !loading && !failed && !filtering && articles.length > 0;

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader overlay={front} />

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
        <main id="main" tabIndex={-1} className="container-page pb-8 pt-8 focus:outline-none md:pt-14">
          <nav className="flex items-center gap-2 text-[13.5px] text-ink-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink hover:underline">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink-2">{topic ? topic.name : tag ? "Tag" : "Search"}</span>
          </nav>

          <header className="relative mt-6 overflow-hidden rounded-[36px] border border-line bg-band px-7 py-14 text-white md:px-14 md:py-20">
            <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
            <div className="relative">
              <h1 className="display-xl !text-[clamp(2.8rem,8vw,7rem)]">
                <span className="gradient-text">
                  {topic && !query && !tag ? topic.name : tag && !query ? tag : `“${query}”`}
                </span>
              </h1>
              {topic && !query && <p className="mt-5 max-w-[50ch] text-[20px] leading-[1.5] text-white/75">{topic.blurb}</p>}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="glass rounded-full px-4 py-2 text-[13.5px] text-white/85">
                  {results.length} {results.length === 1 ? "story" : "stories"}
                </span>
                {query && topic && <span className="glass rounded-full px-4 py-2 text-[13.5px] text-white/85">{topic.name}</span>}
                {(query || tag) && (
                  <button onClick={() => setParams({})} className="glass min-h-[44px] rounded-full px-5 text-[13.5px] text-white hover:bg-white/15">Clear</button>
                )}
                <label className="ml-auto flex items-center gap-2 text-[13.5px] text-white/70">
                  Sort
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="field !h-11 !w-auto !bg-white/10 !py-0 pr-9 !text-white">
                    <option value="newest" className="text-black">Newest first</option>
                    <option value="oldest" className="text-black">Oldest first</option>
                  </select>
                </label>
              </div>
            </div>
          </header>

          <div className="grid gap-12 pt-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              {results.length === 0 ? (
                <div className="glass-solid rounded-[28px] p-12 text-center">
                  <SearchX size={36} className="mx-auto text-ink-3" />
                  <h2 className="display-lg mt-5">No stories found</h2>
                  <p className="mt-3 text-ink-2">Try a different search term, or browse the latest stories.</p>
                  <Link to="/" className="btn btn-primary mt-7">Browse latest</Link>
                </div>
              ) : (
                <>
                  {results.slice(0, visible).map((a, i) => (
                    <Reveal key={a.id} index={i % 3}>
                      <ArticleListItem article={a} />
                    </Reveal>
                  ))}
                  {results.length > visible && (
                    <div className="pt-4">
                      <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn glass !h-12 !px-8 text-ink">Show more stories</button>
                    </div>
                  )}
                </>
              )}
            </div>
            <aside className="lg:col-span-4">
              <div className="glass-solid rounded-[28px] p-6 lg:sticky lg:top-28">
                <p className="eyebrow-mono text-ink-3">Browse by topic</p>
                <ul className="mt-4">
                  {CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <Link
                        to={`/?topic=${c.slug}`}
                        className={`flex items-center justify-between border-b border-line py-4 font-serif text-[22px] font-bold tracking-[-0.03em] last:border-0 hover:text-brand ${
                          topic?.slug === c.slug ? "text-brand" : "text-ink"
                        }`}
                      >
                        {c.name}
                        <span className="rounded-full bg-muted px-3 py-1 font-sans text-[12.5px] font-normal text-ink-3">{counts[c.slug] || 0}</span>
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
          <Hero lead={lead} floating={[photoA, photoB]} counts={counts} onSearch={onSearch} />

          {/* Bento: lead story as a cinematic photo tile */}
          <section className="container-page -mt-10 pb-8 md:-mt-14">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[310px_310px]">
              <Reveal className="md:col-span-2 lg:row-span-2">
                <ArticleBentoLead article={lead} className="h-full min-h-[480px]" />
              </Reveal>
              <Reveal index={1}><StatTile value={articles.length} /></Reveal>
              {textStory && (
                <Reveal index={2} className="lg:h-full">
                  <ArticleBentoText article={textStory} className="h-full" />
                </Reveal>
              )}
              {photoA && (
                <Reveal index={3} className="lg:h-full">
                  <ArticleBentoPhoto article={photoA} className="h-full min-h-[260px]" />
                </Reveal>
              )}
              {photoB && (
                <Reveal index={4} className="lg:h-full">
                  <ArticleBentoPhoto article={photoB} className="h-full min-h-[260px]" />
                </Reveal>
              )}
            </div>
          </section>

          {/* More stories: horizontal photo rail */}
          {more.length > 0 && (
            <section className="container-page pt-20 md:pt-28">
              <SectionHead title="More stories" />
              <Reveal className="mt-8">
                <Rail items={more} />
              </Reveal>
            </section>
          )}

          {/* Topics */}
          <section className="container-page pt-20 md:pt-28">
            <SectionHead title="Explore by topic" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((c, i) => (
                <Reveal key={c.slug} index={i}>
                  <Link
                    to={`/?topic=${c.slug}`}
                    className="glass-solid lift group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-[28px] p-7"
                  >
                    <span className="mb-auto flex items-center justify-between">
                      <Kicker category={c.name} />
                      <span className="text-[13.5px] tabular-nums text-ink-3">{counts[c.slug] || 0} {(counts[c.slug] || 0) === 1 ? "story" : "stories"}</span>
                    </span>
                    <span className="display-lg mt-10 !text-[clamp(2rem,3vw,2.8rem)]">{c.name}</span>
                    <span className="mt-3 text-[15px] leading-[1.5] text-ink-2">{c.blurb}</span>
                    <span className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-brand-fill text-[color:var(--c-on-cta)] opacity-0 transition-all duration-300 group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0" aria-hidden="true">
                      <ArrowUpRight size={20} />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Closing */}
          <section className="container-page pt-20 md:pt-28">
            <Reveal className="grain relative isolate overflow-hidden rounded-[36px] border border-line bg-band px-7 py-16 text-white md:px-16 md:py-24">
              <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
              <div className="relative grid gap-10 md:grid-cols-12 md:items-end">
                <div className="md:col-span-8">
                  <p className="eyebrow-mono text-white/60">About the Centre</p>
                  <p className="display-lg mt-5 !text-[clamp(1.9rem,4vw,3.6rem)]">
                    Strengthening food systems through <span className="gradient-text">research, training and partnership.</span>
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
