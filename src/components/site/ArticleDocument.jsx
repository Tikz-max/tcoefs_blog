import { Link } from "react-router-dom";
import Cover from "./Cover";
import Reveal from "./Reveal";
import { Kicker } from "./ArticleCard";
import { articleDate, categorySlug } from "../../lib/content";

const Field = ({ label, children }) => (
  <div className="min-w-0">
    <dt className="eyebrow-mono !text-[11px] text-ink-3">{label}</dt>
    <dd className="mt-2 text-[15.5px] font-medium leading-snug text-ink">{children}</dd>
  </div>
);

/** Magazine headline block: breadcrumb, label, oversized title, standfirst, byline. */
export const ArticleHeader = ({ article, linked = true }) => {
  const author = article.author?.trim();
  const slug = categorySlug(article.category);
  const Crumb = linked ? Link : "span";

  return (
    <header>
      <nav className="no-print mono flex items-center gap-2 text-[12.5px] text-ink-3" aria-label="Breadcrumb">
        <Crumb {...(linked ? { to: "/" } : {})} className="hover:text-ink hover:underline">Blog</Crumb>
        <span aria-hidden="true">/</span>
        <Crumb {...(linked ? { to: `/?topic=${slug}` } : {})} className="hover:text-ink hover:underline">
          {article.category}
        </Crumb>
      </nav>

      <div className="mt-10">
        <Kicker category={article.category} />
      </div>
      <h1 className="display-xl mt-5 max-w-[19ch] !text-[clamp(2.4rem,6.2vw,5.8rem)] !leading-[0.98]">
        {article.title || "Untitled story"}
      </h1>
      {article.excerpt && (
        <p className="mt-8 max-w-[46ch] font-text text-[clamp(20px,2.1vw,27px)] italic leading-[1.4] text-ink-2">
          {article.excerpt}
        </p>
      )}

      <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-ink py-6 sm:grid-cols-4">
        <Field label="By">
          {author || "TCoEFS"}
          {author && article.author_role && <span className="block text-[13.5px] font-normal text-ink-3">{article.author_role}</span>}
        </Field>
        <Field label="Published">
          <time dateTime={article.published_date || undefined}>{articleDate(article)}</time>
        </Field>
        <Field label="Topic">{article.category}</Field>
        <Field label="Reading time">{article.read_time || "—"}</Field>
      </dl>
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
          label={article.category}
        />
      </Reveal>
      {article.image_caption && (
        <figcaption className="mono mt-3 max-w-[70ch] border-l-2 border-brand-fill pl-3 text-[12.5px] leading-normal text-ink-3">
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
