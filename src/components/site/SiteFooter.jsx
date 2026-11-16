import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { CATEGORIES, MAIN_SITE_URL, ORG_NAME } from "../../lib/content";

const SiteFooter = () => (
  <footer className="no-print mt-24 bg-band text-white">
    <div className="container-page py-14 md:py-16">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1.5">
              <img src="/tcoefs-logo.png" alt="" className="h-full w-auto" />
            </span>
            <span className="font-serif text-2xl font-semibold tracking-tight">
              TCoEFS <span className="font-normal italic text-white/70">Blog</span>
            </span>
          </div>
          <p className="mt-5 max-w-md font-serif text-[19px] leading-[1.5] text-white/80">
            Advancing food security through innovative research, strategic
            partnerships and sustainable agricultural solutions for a resilient
            Africa.
          </p>
          <p className="mt-5 text-[13px] leading-relaxed text-white/55">
            {ORG_NAME}
            <br />
            University of Jos, Plateau State, Nigeria
          </p>
        </div>

        <nav className="md:col-span-3" aria-label="Topics">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/50">
            Topics
          </p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li>
              <Link to="/" className="text-white/85 hover:text-white hover:underline">
                Latest stories
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/?topic=${c.slug}`}
                  className="text-white/85 hover:text-white hover:underline"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="md:col-span-3" aria-label="The Centre">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/50">
            The Centre
          </p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li>
              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white/85 hover:text-white hover:underline"
              >
                Main website <ArrowUpRight size={14} />
              </a>
            </li>
            <li>
              <a
                href={`${MAIN_SITE_URL}/contact`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white/85 hover:text-white hover:underline"
              >
                Contact <ArrowUpRight size={14} />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-white/12 pt-6 text-[13px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {ORG_NAME}. All rights reserved.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-1.5 self-start font-medium text-white/80 hover:text-white sm:self-auto"
        >
          <ArrowUp size={14} /> Back to top
        </button>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
