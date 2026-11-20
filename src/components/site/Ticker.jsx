import { Link } from "react-router-dom";

/** Endless headline strip. Pauses on hover, static under reduced motion. */
const Ticker = ({ items }) => {
  if (!items?.length) return null;
  const row = (suffix) =>
    items.map((a) => (
      <Link
        key={`${a.id}-${suffix}`}
        to={`/news/${a.id}`}
        tabIndex={suffix === "b" ? -1 : 0}
        aria-hidden={suffix === "b" ? "true" : undefined}
        className="group flex shrink-0 items-center gap-5 px-6 py-4 text-[15px] font-semibold text-band"
      >
        <span className="eyebrow-mono !text-[11px] opacity-70">{a.category}</span>
        <span className="font-serif text-[19px] font-bold italic tracking-[-0.01em] group-hover:underline">
          {a.title}
        </span>
        <span aria-hidden="true" className="text-[18px] opacity-60">✦</span>
      </Link>
    ));
  return (
    <div className="no-print overflow-hidden bg-brand-fill" aria-label="Latest headlines">
      <div className="ticker">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
};

export default Ticker;
