import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Cover from "./Cover";
import ContourArt from "./ContourArt";
import { articleDate, categorySlug } from "../../lib/content";

const dot = {
  news: "bg-cat-news",
  research: "bg-cat-research",
  training: "bg-cat-training",
  partnership: "bg-cat-partnership",
};

/** Small pill with a coloured dot for the topic. */
export const Kicker = ({ category, className = "", onImage = false }) => (
  <span
    className={`inline-flex h-7 items-center gap-2 rounded-full px-3 font-serif text-[12px] font-medium tracking-[0.04em] ${
      onImage ? "bg-black/45 text-white backdrop-blur-md" : "bg-muted text-ink-2"
    } ${className}`}
  >
    <span className={`h-2 w-2 rounded-full ${dot[categorySlug(category)] || "bg-ink-3"}`} aria-hidden="true" />
    {category}
  </span>
);

export const Meta = ({ article, className = "", light = false }) => (
  <p className={`flex flex-wrap items-center gap-x-2 text-[13.5px] ${light ? "text-white/75" : "text-ink-3"} ${className}`}>
    <time dateTime={article.published_date || undefined}>{articleDate(article, { short: true })}</time>
    {article.read_time && (
      <>
        <span aria-hidden="true">·</span>
        <span>{article.read_time}</span>
      </>
    )}
  </p>
);

/** Standard card: photo on top, label, headline, summary. */
export const ArticleCard = ({ article, showExcerpt = true }) => (
  <article className="h-full">
    <Link to={`/news/${article.id}`} className="tile glass-solid lift group flex h-full flex-col rounded-[28px] p-3">
      <Cover src={article.card_image_url} alt="" ratio="4 / 3" label={article.category} />
      <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
        <div>
          <Kicker category={article.category} />
        </div>
        <h3 className="headline mt-4 text-[24px] leading-[1.1]">{article.title}</h3>
        {showExcerpt && article.excerpt && (
          <p className="mt-3 line-clamp-3 text-[15.5px] leading-[1.55] text-ink-2">{article.excerpt}</p>
        )}
        <Meta article={article} className="mt-auto pt-5" />
      </div>
    </Link>
  </article>
);

/** Photo tile with a cinematic overlay (bento grid). */
const PhotoTile = ({ article, className = "", big = false, eager = false }) => {
  const [failed, setFailed] = useState(false);
  const has = article.card_image_url && !failed;
  return (
    <Link
      to={`/news/${article.id}`}
      className={`tile bento-tile lift group flex flex-col justify-end ${has ? "" : "glass-solid"} ${className}`}
    >
      {has ? (
        <img
          src={article.card_image_url}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className="tile-img"
        />
      ) : (
        <>
          <div className="absolute inset-0 -z-20" style={{ background: "linear-gradient(135deg,#0f9f6e,#0a5c43 45%,#082016)" }} />
          <ContourArt className="absolute inset-0 -z-10 h-full w-full text-white/[0.16]" />
        </>
      )}
      <span className="tile-shade" aria-hidden="true" />
      <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:translate-x-2" aria-hidden="true">
        <ArrowUpRight size={20} />
      </span>
      <div className={big ? "p-7 md:p-9" : "p-6"}>
        <Kicker category={article.category} onImage />
        <h3
          className={`headline mt-4 !text-white ${
            big ? "text-[clamp(28px,3.2vw,46px)] leading-[1.02]" : "line-clamp-4 text-[21px] leading-[1.1] md:text-[22px]"
          }`}
        >
          {article.title}
        </h3>
        {big && article.excerpt && (
          <p className="mt-4 line-clamp-2 max-w-[56ch] text-[17px] leading-[1.5] text-white/80">{article.excerpt}</p>
        )}
        <Meta article={article} light className="mt-4" />
      </div>
    </Link>
  );
};
export const ArticleBentoLead = (props) => <PhotoTile big eager {...props} />;
export const ArticleBentoPhoto = PhotoTile;

/** Glass text tile for the bento grid: no photo, the words lead. */
export const ArticleBentoText = ({ article, className = "" }) => (
  <Link to={`/news/${article.id}`} className={`tile glass lift group flex flex-col overflow-hidden rounded-[28px] p-7 ${className}`}>
    <div className="flex items-center justify-between">
      <Kicker category={article.category} />
      <ArrowUpRight size={20} className="text-ink-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
    </div>
    <h3 className="headline mt-5 line-clamp-3 text-[24px] leading-[1.08]">{article.title}</h3>
    {article.excerpt && <p className="mt-3 line-clamp-2 text-[15px] leading-[1.5] text-ink-2">{article.excerpt}</p>}
    <Meta article={article} className="mt-auto pt-5" />
  </Link>
);

/** Wide card for topic and search results. */
export const ArticleListItem = ({ article }) => (
  <article>
    <Link to={`/news/${article.id}`} className="tile glass-solid lift group grid gap-6 rounded-[28px] p-3 sm:grid-cols-[minmax(0,1fr)_300px]">
      <div className="order-2 flex min-w-0 flex-col px-3 pb-3 sm:order-1 sm:py-4 sm:pl-5">
        <div>
          <Kicker category={article.category} />
        </div>
        <h3 className="headline mt-4 text-[28px] leading-[1.06] md:text-[36px]">{article.title}</h3>
        {article.excerpt && <p className="mt-4 line-clamp-3 max-w-[60ch] text-[16.5px] leading-[1.6] text-ink-2">{article.excerpt}</p>}
        <div className="mt-auto flex items-center justify-between pt-5">
          <Meta article={article} />
          <ArrowUpRight size={20} className="text-ink-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
        </div>
      </div>
      <Cover src={article.card_image_url} alt="" label={article.category} ratio="4 / 3" className="order-1 sm:order-2" />
    </Link>
  </article>
);
