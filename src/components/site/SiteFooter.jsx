import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight, Rss } from "lucide-react";
import { CATEGORIES, MAIN_SITE_URL, ORG_NAME } from "../../lib/content";

const Heading = ({ children }) => (
  <p className="eyebrow-mono !text-[11.5px] text-white/50">{children}</p>
);

const SiteFooter = () => (
  <footer className="no-print relative isolate mt-28 overflow-hidden bg-band text-white grain">
    <div className="aurora opacity-60" aria-hidden="true"><i /><i /><i /></div>
    <div className="container-page relative z-10 pt-20 md:pt-28">
      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="max-w-[13ch] font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.045em]">
            Evidence for a <span className="gradient-text">food-secure</span> Africa.
          </p>
          <div className="mt-10 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white p-1.5">
              <img src="/tcoefs-logo.png" alt="" className="h-full w-auto" />
            </span>
            <p className="text-[14px] leading-snug text-white/65">
              {ORG_NAME}
              <br />
              University of Jos, Plateau State, Nigeria
            </p>
          </div>
        </div>

        <nav className="md:col-span-3" aria-label="Topics">
          <Heading>Topics</Heading>
          <ul className="mt-5 space-y-3">
            <li>
              <Link to="/" className="font-serif text-[22px] font-bold tracking-[-0.03em] text-white/90 hover:text-brand-fill">Latest</Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to={`/?topic=${c.slug}`} className="font-serif text-[22px] font-bold tracking-[-0.03em] text-white/90 hover:text-brand-fill">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="md:col-span-3" aria-label="The Centre">
          <Heading>The Centre</Heading>
          <ul className="mt-5 space-y-3 text-[16px]">
            <li>
              <a href={MAIN_SITE_URL} target="_blank" rel="noopener noreferrer" className="nudge inline-flex min-h-[28px] items-center gap-1.5 text-white/85 hover:text-brand-fill">
                Main website <ArrowUpRight size={15} />
              </a>
            </li>
            <li>
              <a href={`${MAIN_SITE_URL}/contact`} target="_blank" rel="noopener noreferrer" className="nudge inline-flex min-h-[28px] items-center gap-1.5 text-white/85 hover:text-brand-fill">
                Contact <ArrowUpRight size={15} />
              </a>
            </li>
            <li>
              <a href="/rss.xml" className="inline-flex min-h-[28px] items-center gap-1.5 text-white/85 hover:text-brand-fill">
                RSS feed <Rss size={15} />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mt-20 flex flex-col gap-4 border-t border-white/12 pt-6 text-[13.5px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {ORG_NAME}</p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex min-h-[44px] items-center gap-1.5 self-start text-white/80 hover:text-white sm:self-auto"
        >
          <ArrowUp size={14} /> Back to top
        </button>
      </div>
    </div>
    <p className="wordmark relative z-10 -mb-[0.1em] select-none whitespace-nowrap text-center" aria-hidden="true">
      TCoEFS
    </p>
  </footer>
);

export default SiteFooter;
