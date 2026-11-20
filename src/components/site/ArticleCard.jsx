import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Cover from "./Cover";
import { articleDate, categorySlug } from "../../lib/content";

const dot = {
  news: "bg-cat-news",
  research: "bg-cat-research",
  training: "bg-cat-training",
  partnership: "bg-cat-partnership",
};

/** Mono label with a coloured dot for the topic. */
export const Kicker = ({ category, className = "" }) => (
  <span className={`kicker inline-flex items-center gap-2 !text-ink-2 ${className}`}>
    <span className={`h-2 w-2 rounded-full ${dot[categorySlug(category)] || "bg-ink-3"}`} aria-hidden="true" />
    {category}
  </span>
);

export const Meta = ({ article, className = "" }) => (
  <p className={`mono flex flex-wrap items-center gap-x-2 text-[12.5px] text-ink-3 ${className}`}>
    <time dateTime={article.published_date || undefined}>{articleDate(article, { short: true })}</time>
    {article.read_time && (
      <>
        <span aria-hidden="true">/</span>
        <span>{article.read_time}</span>
      </>
    )}
  </p>
);

const Index = ({ n }) =>
  n != null ? (
    <span className="mono text-[12px] text-ink-3" aria-hidden="true">
      {String(n).padStart(2, "0")}
    </span>
  ) : null;

/** Standard tile: image, label, headline, summary. */
export const ArticleCard = ({ article, showExcerpt = true, index }) => (
  <article className="tile h-full">
    <Link to={`/news/${article.id}`} className="group flex h-full flex-col">
      <Cover src={article.card_image_url} alt="" ratio="4 / 3" label={article.category} />
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center justify-between">
          <Kicker category={article.category} />
          <Index n={index} />
        </div>
        <h3 className="headline mt-3.5 text-[26px] leading-[1.08] md:text-[29px]">
          <span className="tile-title">{article.title}</span>
        </h3>
        {showExcerpt && article.excerpt && (
          <p className="mt-3 line-clamp-3 font-text text-[16.5px] leading-[1.55] text-ink-2">{article.excerpt}</p>
        )}
        <Meta article={article} className="mt-auto pt-5" />
      </div>
    </Link>
  </article>
);

/** Large feature tile for asymmetric grids. */
export const ArticleFeature = ({ article, index }) => (
  <article className="tile h-full">
    <Link to={`/news/${article.id}`} className="group flex h-full flex-col">
      <Cover src={article.card_image_url} alt="" ratio="5 / 4" label={article.category} />
      <div className="pt-6">
        <div className="flex items-center justify-between">
          <Kicker category={article.category} />
          <Index n={index} />
        </div>
        <h3 className="headline display-lg mt-4 !text-[clamp(30px,3.6vw,52px)] leading-[1.02]">
          <span className="tile-title">{article.title}</span>
        </h3>
        {article.excerpt && (
          <p className="mt-4 line-clamp-3 max-w-[58ch] font-text text-[18px] leading-[1.55] text-ink-2">{article.excerpt}</p>
        )}
        <Meta article={article} className="mt-5" />
      </div>
    </Link>
  </article>
);

/** Compact horizontal tile for the side column. */
export const ArticleRow = ({ article, index }) => (
  <article className="tile">
    <Link to={`/news/${article.id}`} className="group grid grid-cols-[minmax(0,1fr)_120px] gap-5 sm:grid-cols-[minmax(0,1fr)_150px]">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <Index n={index} />
          <Kicker category={article.category} />
        </div>
        <h3 className="headline mt-3 line-clamp-4 text-[21px] leading-[1.14] md:text-[23px]">
          <span className="tile-title">{article.title}</span>
        </h3>
        <Meta article={article} className="mt-3" />
      </div>
      <Cover src={article.card_image_url} alt="" ratio="4 / 5" label="" className="self-start" />
    </Link>
  </article>
);

/** Wide row for topic and search results. */
export const ArticleListItem = ({ article, index }) => (
  <article className="tile border-t border-line py-8 first:border-t-0 first:pt-0">
    <Link to={`/news/${article.id}`} className="group grid gap-6 sm:grid-cols-[minmax(0,1fr)_300px] sm:gap-10">
      <div className="order-2 flex min-w-0 flex-col sm:order-1">
        <div className="flex items-center gap-3">
          <Index n={index} />
          <Kicker category={article.category} />
        </div>
        <h3 className="headline mt-4 text-[30px] leading-[1.04] md:text-[40px]">
          <span className="tile-title">{article.title}</span>
        </h3>
        {article.excerpt && (
          <p className="mt-4 line-clamp-3 max-w-[60ch] font-text text-[17.5px] leading-[1.55] text-ink-2">{article.excerpt}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-5">
          <Meta article={article} />
          <ArrowUpRight size={20} className="text-ink-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
        </div>
      </div>
      <Cover src={article.card_image_url} alt="" label={article.category} ratio="4 / 3" className="order-1 sm:order-2" />
    </Link>
  </article>
);
