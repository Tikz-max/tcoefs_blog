import { Link } from "react-router-dom";
import Cover from "./Cover";
import { articleDate, categorySlug } from "../../lib/content";

export const Kicker = ({ category, className = "" }) => (
  <span className={`kicker ${className}`} data-cat={categorySlug(category)}>
    {category}
  </span>
);

export const Meta = ({ article, className = "" }) => (
  <p className={`meta flex flex-wrap items-center gap-x-2 ${className}`}>
    <time dateTime={article.published_date || undefined}>
      {articleDate(article)}
    </time>
    {article.read_time && (
      <>
        <span aria-hidden="true">·</span>
        <span>{article.read_time}</span>
      </>
    )}
  </p>
);

/** Standard grid card: image, kicker, headline, summary, date. */
export const ArticleCard = ({ article, showExcerpt = true }) => (
  <article className="group">
    <Link to={`/news/${article.id}`} className="block">
      <Cover src={article.card_image_url} alt="" />
      <div className="pt-4">
        <Kicker category={article.category} />
        <h3 className="headline mt-2.5 text-[22px] leading-[1.22] line-clamp-3">
          <span className="headline-link">{article.title}</span>
        </h3>
        {showExcerpt && article.excerpt && (
          <p className="mt-2.5 text-[15px] leading-[1.55] text-ink-2 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <Meta article={article} className="mt-3" />
      </div>
    </Link>
  </article>
);

/** Compact row used in the "Latest" rail. */
export const ArticleRow = ({ article }) => (
  <article className="group">
    <Link to={`/news/${article.id}`} className="flex gap-4">
      <div className="min-w-0 flex-1">
        <Kicker category={article.category} />
        <h3 className="headline mt-2 text-[18px] leading-[1.25] line-clamp-3">
          <span className="headline-link">{article.title}</span>
        </h3>
        <Meta article={article} className="mt-2" />
      </div>
      <Cover
        src={article.card_image_url}
        alt=""
        ratio="1 / 1"
        className="w-[84px] shrink-0 self-start"
      />
    </Link>
  </article>
);

/** Wide list item used on topic and search result pages. */
export const ArticleListItem = ({ article }) => (
  <article className="group border-b border-line py-7 first:pt-0">
    <Link
      to={`/news/${article.id}`}
      className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_240px] sm:gap-8"
    >
      <div className="order-2 min-w-0 sm:order-1">
        <Kicker category={article.category} />
        <h3 className="headline mt-2.5 text-[24px] leading-[1.2] md:text-[27px]">
          <span className="headline-link">{article.title}</span>
        </h3>
        {article.excerpt && (
          <p className="mt-3 text-[15.5px] leading-[1.6] text-ink-2 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <Meta article={article} className="mt-3.5" />
      </div>
      <Cover
        src={article.card_image_url}
        alt=""
        className="order-1 sm:order-2"
      />
    </Link>
  </article>
);
