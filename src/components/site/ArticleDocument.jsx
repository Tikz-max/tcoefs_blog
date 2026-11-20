import { Link } from "react-router-dom";
import Cover from "./Cover";
import Reveal from "./Reveal";
import { Kicker } from "./ArticleCard";
import { articleDate, categorySlug } from "../../lib/content";

/** Story headline block: breadcrumb, topic, oversized title, standfirst, byline. */
export const ArticleHeader = ({ article, linked = true }) => {
  const author = article.author?.trim();
  const slug = categorySlug(article.category);
  const Crumb = linked ? Link : "span";

  return (
    <header>
      <nav className="no-print flex items-center gap-2 text-[13.5px] text-ink-3" aria-label="Breadcrumb">
        <Crumb {...(linked ? { to: "/" } : {})} className="hover:text-ink hover:underline">Blog</Crumb>
        <span aria-hidden="true">/</span>
        <Crumb {...(linked ? { to: `/?topic=${slug}` } : {})} className="hover:text-ink hover:underline">
          {article.category}
        </Crumb>
      </nav>

      <div className="mt-8">
        <Kicker category={article.category} />
      </div>
      <h1 className="display-xl mt-5 max-w-[20ch] !text-[clamp(2.4rem,5.8vw,5.4rem)] !leading-[0.98]">
        {article.title || "Untitled story"}
      </h1>
      {article.excerpt && (
        <p className="mt-7 max-w-[52ch] text-[clamp(19px,1.9vw,24px)] leading-[1.5] text-ink-2">{article.excerpt}</p>
      )}

      <div className="glass mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-[28px] p-4 pr-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1.5">
            {author ? (
              <span className="font-serif text-lg font-bold text-[#06210f]">{author.charAt(0).toUpperCase()}</span>
            ) : (
              <img src="/tcoefs-logo.png" alt="" className="h-full w-auto" />
            )}
          </span>
          <div className="min-w-0 leading-snug">
            <p className="text-[15.5px] font-medium text-ink">{author || "TCoEFS"}</p>
            {author && article.author_role && <p className="text-[13.5px] text-ink-3">{article.author_role}</p>}
          </div>
        </div>
        <p className="text-[14.5px] text-ink-2">
          <time dateTime={article.published_date || undefined}>{articleDate(article)}</time>
        </p>
        {article.read_time && <p className="text-[14.5px] text-ink-2">{article.read_time}</p>}
      </div>
    </header>
  );
};

export const ArticleCover = ({ article }) =>
  article.card_image_url ? (
    <figure>
      <Reveal className="reveal-mask">
        <Cover
          src={article.card_image_url}
          alt={article.image_caption || article.title || ""}
          ratio="16 / 8"
          zoom={false}
          eager
          rounded="rounded-[32px]"
          label={article.category}
        />
      </Reveal>
      {article.image_caption && (
        <figcaption className="mt-3 max-w-[70ch] border-l-2 border-brand-fill pl-3 text-[13.5px] leading-normal text-ink-3">
          {article.image_caption}
        </figcaption>
      )}
    </figure>
  ) : null;

export const ArticleBody = ({ html, fallback }) =>
  html ? (
    <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <div className="prose-article">
      <p>{fallback}</p>
    </div>
  );
