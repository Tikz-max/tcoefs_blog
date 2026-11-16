import { Link } from "react-router-dom";
import Cover from "./Cover";
import { Kicker } from "./ArticleCard";
import { articleDate, categorySlug } from "../../lib/content";

/** Headline block: breadcrumb, kicker, title, standfirst and byline. */
export const ArticleHeader = ({ article, linked = true }) => {
  const author = article.author?.trim();
  const slug = categorySlug(article.category);
  const Crumb = linked ? Link : "span";

  return (
    <header>
      <nav className="meta no-print flex items-center gap-2" aria-label="Breadcrumb">
        <Crumb {...(linked ? { to: "/" } : {})} className="hover:text-ink hover:underline">
          Blog
        </Crumb>
        <span aria-hidden="true">/</span>
        <Crumb
          {...(linked ? { to: `/?topic=${slug}` } : {})}
          className="hover:text-ink hover:underline"
        >
          {article.category}
        </Crumb>
      </nav>

      <div className="mt-6">
        <Kicker category={article.category} />
      </div>
      <h1 className="headline mt-4 text-[36px] leading-[1.07] md:text-[52px]">
        {article.title || "Untitled story"}
      </h1>
      {article.excerpt && (
        <p className="mt-5 font-serif text-[21px] leading-[1.45] text-ink-2 md:text-[24px]">
          {article.excerpt}
        </p>
      )}

      <div className="mt-7 flex items-center gap-3.5 border-y border-line py-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-surface">
          {author ? (
            <span className="font-serif text-lg font-semibold text-brand">
              {author.charAt(0).toUpperCase()}
            </span>
          ) : (
            <img src="/tcoefs-logo.png" alt="" className="h-7 w-auto" />
          )}
        </span>
        <div className="min-w-0 text-[14px] leading-snug">
          <p className="font-semibold text-ink">
            {author || "TCoEFS"}
            {author && article.author_role && (
              <span className="font-normal text-ink-3">, {article.author_role}</span>
            )}
          </p>
          <p className="meta mt-0.5 flex flex-wrap gap-x-2">
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
        </div>
      </div>
    </header>
  );
};

export const ArticleCover = ({ article }) =>
  article.card_image_url ? (
    <figure>
      <Cover
        src={article.card_image_url}
        alt={article.image_caption || article.title || ""}
        ratio="16 / 9"
        zoom={false}
        eager
      />
      {article.image_caption && (
        <figcaption className="mt-2.5 border-l-2 border-gold pl-3 text-[13.5px] leading-normal text-ink-3">
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
