import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CornerDownLeft, Search, X } from "lucide-react";
import { articlesApi } from "../../lib/articles";
import { articleDate, normaliseTags, stripHtml } from "../../lib/content";

const Highlight = ({ text, term }) => {
  if (!term) return text;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-gold-soft px-0.5 text-ink">{text.slice(i, i + term.length)}</mark>
      {text.slice(i + term.length)}
    </>
  );
};

/**
 * Quick search: opens with Ctrl or Cmd + K, or "/". Results update as you type.
 * Combobox pattern: focus stays in the field, arrow keys move the highlight.
 */
const SearchPalette = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const returnTo = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    returnTo.current = document.activeElement;
    setQ("");
    setActive(0);
    articlesApi.listPublished().then(({ data }) => setItems(data));
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      returnTo.current?.focus?.();
    };
  }, [open]);

  const term = q.trim();
  const results = useMemo(() => {
    if (!term) return items.slice(0, 5);
    const needle = term.toLowerCase();
    return items
      .map((a) => {
        const title = (a.title || "").toLowerCase();
        let score = 0;
        if (title.includes(needle)) score += 10;
        if ((a.excerpt || "").toLowerCase().includes(needle)) score += 4;
        if ((a.category || "").toLowerCase().includes(needle)) score += 3;
        if (normaliseTags(a.tags).join(" ").toLowerCase().includes(needle)) score += 3;
        if (!score && stripHtml(a.content).toLowerCase().includes(needle)) score += 1;
        return { a, score };
      })
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score)
      .slice(0, 8)
      .map((x) => x.a);
  }, [items, term]);

  useEffect(() => setActive(0), [term]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const go = (article) => {
    onClose();
    navigate(`/news/${article.id}`);
  };
  const seeAll = () => {
    onClose();
    navigate(term ? `/?q=${encodeURIComponent(term)}` : "/");
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(results[active]);
      else seeAll();
    } else if (e.key === "Tab") {
      e.preventDefault(); // keep focus inside the dialog
    }
  };

  return (
    <div
      className="animate-fade fixed inset-0 z-[120] flex items-start justify-center bg-black/55 p-4 pt-[10vh] backdrop-blur-[2px]"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search stories"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="animate-fade-in w-full max-w-[680px] overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-pop)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Search size={20} className="shrink-0 text-ink-3" aria-hidden="true" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `palette-opt-${active}` : undefined}
            aria-label="Search stories"
            placeholder="Search stories, topics and research"
            className="h-16 w-full bg-transparent text-[18px] text-ink outline-none placeholder:text-ink-3"
          />
          <button onClick={onClose} className="icon-btn -mr-2" aria-label="Close search">
            <X size={18} />
          </button>
        </div>

        <ul
          id="palette-results"
          ref={listRef}
          role="listbox"
          aria-label={term ? "Search results" : "Latest stories"}
          className="max-h-[52vh] overflow-y-auto p-2"
        >
          {!term && <li role="presentation" className="px-3 pb-1 pt-2 text-[12px] font-bold uppercase tracking-[0.12em] text-ink-3">Latest</li>}
          {results.map((a, i) => (
            <li key={a.id} role="presentation">
              <button
                id={`palette-opt-${i}`}
                data-idx={i}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => go(a)}
                className={`flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left transition-colors ${
                  i === active ? "bg-muted" : ""
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px] font-bold text-ink">
                    <Highlight text={a.title} term={term} />
                  </span>
                  <span className="mt-0.5 block truncate text-[13.5px] text-ink-3">
                    {a.category} · {articleDate(a, { short: true })}
                  </span>
                </span>
                <CornerDownLeft size={15} className={`shrink-0 text-ink-3 ${i === active ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
              </button>
            </li>
          ))}
          {term && results.length === 0 && (
            <li role="presentation" className="px-3 py-10 text-center text-[15px] text-ink-2">
              No stories match <strong className="text-ink">“{term}”</strong>.
            </li>
          )}
        </ul>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-muted px-5 py-3 text-[13px] text-ink-3">
          <span className="hidden gap-4 sm:flex">
            <span><kbd className="rounded border border-line-strong bg-surface px-1.5 font-sans">↑↓</kbd> move</span>
            <span><kbd className="rounded border border-line-strong bg-surface px-1.5 font-sans">↵</kbd> open</span>
            <span><kbd className="rounded border border-line-strong bg-surface px-1.5 font-sans">esc</kbd> close</span>
          </span>
          <button onClick={seeAll} className="nudge ml-auto inline-flex items-center gap-1.5 font-bold text-brand hover:underline">
            {term ? "See all results" : "Browse all stories"} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPalette;
