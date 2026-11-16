import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, SearchX } from "lucide-react";
import SiteHeader from "../components/site/SiteHeader";
import SiteFooter from "../components/site/SiteFooter";
import Cover from "../components/site/Cover";
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
    return articles.filter((a) => {
      if (topic && categorySlug(a.category) !== topic.slug) return false;
      if (tag && !normaliseTags(a.tags).some((t) => t.toLowerCase() === tag.toLowerCase()))
        return false;
      if (!q) return true;
      return [a.title, a.excerpt, a.category, a.author, normaliseTags(a.tags).join(" "), stripHtml(a.content)]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q));
    });
  }, [articles, filtering, topic, query, tag]);

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
        <main className="container-page pb-8 pt-10 md:pt-14">
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
                <button onClick={() => setParams({})} className="chip hover:bg-muted">
                  Clear
                </button>
              )}
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
                  {results.slice(0, visible).map((a) => (
                    <ArticleListItem key={a.id} article={a} />
                  ))}
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
        <main>
          <section className="container-page pt-8 md:pt-12">
            <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
              {/* Lead story */}
              <article className="group lg:col-span-8">
                <Link to={`/news/${lead.id}`} className="block">
                  <Cover src={lead.card_image_url} alt="" ratio="16 / 9" eager />
                  <div className="pt-6">
                    <div className="flex items-center gap-3">
                      <Kicker category={lead.category} />
                      {lead.featured && (
                        <span className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-gold">
                          Featured
                        </span>
                      )}
                    </div>
                    <h1 className="headline mt-3 text-[34px] leading-[1.08] md:text-[48px]">
                      <span className="headline-link">{lead.title}</span>
                    </h1>
                    {lead.excerpt && (
                      <p className="mt-4 max-w-[62ch] font-serif text-[19px] leading-[1.5] text-ink-2 line-clamp-3 md:text-[21px]">
                        {lead.excerpt}
                      </p>
                    )}
                    <Meta article={lead} className="mt-4" />
                  </div>
                </Link>
              </article>

              {/* Latest rail */}
              <aside className="lg:col-span-4" aria-label="Latest stories">
                <div className="border-t-2 border-ink pt-3.5">
                  <h2 className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink">
                    Latest
                  </h2>
                </div>
                <div className="mt-5 divide-y divide-line">
                  {rail.map((a) => (
                    <div key={a.id} className="py-5 first:pt-0">
                      <ArticleRow article={a} />
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </section>

          {/* More stories */}
          {grid.length > 0 && (
            <section className="container-page pt-16 md:pt-20">
              <SectionHeading title="More stories" />
              <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {grid.slice(0, visible).map((a) => (
                  <ArticleCard key={a.id} article={a} />
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
            <div className="mt-8 grid gap-px overflow-hidden rounded-[6px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
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
            </div>
          </section>

          {/* About the Centre */}
          <section className="container-page pt-16 md:pt-24">
            <div className="grid gap-8 rounded-[6px] bg-brand-soft px-6 py-10 md:grid-cols-12 md:px-12 md:py-14">
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
            </div>
          </section>
        </main>
      )}

      <SiteFooter />
    </div>
  );
};

export default Homepage;
