import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, PenSquare, Star } from "lucide-react";
import { articlesApi } from "../../lib/articles";
import { CATEGORIES, articleDate, categorySlug, isPublished } from "../../lib/content";
import { useAuth } from "../../context/AuthContext";

const Stat = ({ label, value, note }) => (
  <div className="panel p-5">
    <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink-3">{label}</p>
    <p className="mt-2 font-serif text-[40px] font-semibold leading-none tabular-nums text-ink">{value}</p>
    {note && <p className="mt-2 text-[13px] text-ink-3">{note}</p>}
  </div>
);

const StatusChip = ({ article }) => (
  <span className={`chip !h-6 ${isPublished(article) ? "!border-brand/40 !text-brand" : ""}`}>
    {isPublished(article) ? "Published" : "Draft"}
  </span>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    articlesApi.listAll().then(({ data }) => setArticles(data));
  }, []);

  const stats = useMemo(() => {
    const list = articles || [];
    const published = list.filter(isPublished);
    const byTopic = CATEGORIES.map((c) => ({
      ...c,
      count: published.filter((a) => categorySlug(a.category) === c.slug).length,
    }));
    return {
      total: list.length,
      published: published.length,
      drafts: list.length - published.length,
      lead: list.find((a) => a.featured),
      recent: list.slice(0, 6),
      byTopic,
      max: Math.max(1, ...byTopic.map((t) => t.count)),
    };
  }, [articles]);

  const name = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "";

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker !text-ink-3">Editorial desk</p>
          <h1 className="headline mt-2 text-[34px] md:text-[42px]">Welcome back{name ? `, ${name}` : ""}</h1>
        </div>
        <Link to="/admin/articles/new" className="btn btn-primary"><PenSquare size={16} /> New story</Link>
      </div>

      {!articles ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton h-[124px]" />)}
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="Total stories" value={stats.total} />
            <Stat label="Published" value={stats.published} note="Visible to readers" />
            <Stat label="Drafts" value={stats.drafts} note={stats.drafts ? "Waiting to be published" : "Nothing pending"} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="panel">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="font-serif text-xl font-semibold">Recent stories</h2>
                <Link to="/admin/articles" className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-brand hover:underline">
                  All stories <ArrowRight size={14} />
                </Link>
              </div>
              {stats.recent.length === 0 ? (
                <div className="p-10 text-center">
                  <FileText size={28} className="mx-auto text-ink-3" />
                  <p className="mt-3 text-ink-2">No stories yet. Write the first one.</p>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {stats.recent.map((a) => (
                    <li key={a.id}>
                      <Link to={`/admin/articles/edit/${a.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-semibold text-ink">{a.title}</p>
                          <p className="mt-0.5 text-[12.5px] text-ink-3">{a.category} · {articleDate(a, { short: true })}</p>
                        </div>
                        <StatusChip article={a} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="space-y-6">
              <section className="panel p-5">
                <h2 className="flex items-center gap-2 font-serif text-xl font-semibold"><Star size={16} className="text-gold" /> Lead story</h2>
                {stats.lead ? (
                  <Link to={`/admin/articles/edit/${stats.lead.id}`} className="group mt-3 block">
                    <p className="text-[15px] font-semibold leading-snug text-ink group-hover:text-brand">{stats.lead.title}</p>
                    <p className="mt-1 text-[12.5px] text-ink-3">{articleDate(stats.lead)}</p>
                  </Link>
                ) : (
                  <p className="mt-2 text-[14px] text-ink-2">No lead story is set, so the newest story leads the homepage.</p>
                )}
              </section>

              <section className="panel p-5">
                <h2 className="font-serif text-xl font-semibold">Published by topic</h2>
                <ul className="mt-4 space-y-3.5">
                  {stats.byTopic.map((t) => (
                    <li key={t.slug}>
                      <div className="flex justify-between text-[13.5px]">
                        <span className="font-medium text-ink">{t.name}</span>
                        <span className="tabular-nums text-ink-3">{t.count}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-brand-fill" style={{ width: `${(t.count / stats.max) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
