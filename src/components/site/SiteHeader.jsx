import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  X,
} from "lucide-react";
import { CATEGORIES, MAIN_SITE_URL, ORG_NAME } from "../../lib/content";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../context/AdminContext";
import { useTheme } from "../../hooks/useTheme";
import AuthModal from "../auth/AuthModal";
import SearchPalette from "./SearchPalette";

const AccountMenu = ({ onSignIn }) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  if (!user) {
    return (
      <button onClick={onSignIn} className="icon-btn" aria-label="Sign in">
        <User size={18} />
      </button>
    );
  }

  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Account";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-brand-fill text-[13px] font-bold text-[color:var(--c-on-cta)]">
          {name.charAt(0).toUpperCase()}
        </span>
      </button>
      {open && (
        <div className="animate-fade absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-lg border border-line bg-surface shadow-[var(--shadow-pop)]">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-bold text-ink">{name}</p>
            <p className="truncate text-xs text-ink-3">{user.email}</p>
          </div>
          {isAdmin && (
            <Link to="/admin" className="flex min-h-[44px] items-center gap-2.5 px-4 text-sm text-ink hover:bg-muted">
              <LayoutDashboard size={16} className="text-ink-3" />
              Editorial desk
            </Link>
          )}
          <button
            onClick={async () => {
              await signOut();
              setOpen(false);
            }}
            className="flex min-h-[44px] w-full items-center gap-2.5 px-4 text-left text-sm text-ink hover:bg-muted"
          >
            <LogOut size={16} className="text-ink-3" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

const SiteHeader = () => {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeTopic = params.get("topic");
  const onLatest = pathname === "/" && !activeTopic && !params.get("q");

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => {
      const typing = /input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const topicClass = (active) =>
    `relative flex min-h-[44px] items-center px-1 text-[15px] font-bold transition-colors ${
      active
        ? "text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-brand"
        : "text-ink-2 hover:text-ink"
    }`;

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>

      {/* Institutional strip */}
      <div className="no-print bg-band text-white/85">
        <div className="container-page flex h-9 items-center justify-between gap-4 text-[12.5px]">
          <p className="truncate">
            <span className="hidden sm:inline">{ORG_NAME}</span>
            <span className="sm:hidden">TCoEFS</span>
            <span className="mx-2 text-white/35">|</span>
            University of Jos
          </p>
          <a
            href={MAIN_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nudge inline-flex shrink-0 items-center gap-1 font-bold text-white hover:underline"
          >
            Main website <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      <header
        className={`no-print sticky top-0 z-40 border-b bg-paper/92 backdrop-blur transition-shadow duration-300 ${
          scrolled ? "border-line shadow-[0_6px_24px_-12px_rgb(20_83_45/0.25)]" : "border-line"
        }`}
      >
        <div className="container-page flex h-[68px] items-center justify-between gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="TCoEFS Blog home">
            <img src="/tcoefs-logo.png" alt="" className="h-10 w-auto" />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-[25px] font-semibold tracking-tight text-ink">
                TCoEFS <span className="font-normal italic text-brand">Blog</span>
              </span>
              <span className="mt-1 hidden text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-3 sm:block">
                Evidence for food security
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Topics">
            <Link to="/" className={topicClass(onLatest)} aria-current={onLatest ? "page" : undefined}>
              Latest
            </Link>
            {CATEGORIES.map((c) => {
              const active = pathname === "/" && activeTopic === c.slug;
              return (
                <Link key={c.slug} to={`/?topic=${c.slug}`} className={topicClass(active)} aria-current={active ? "page" : undefined}>
                  {c.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden h-11 items-center gap-2.5 rounded-md border border-line-strong bg-surface px-3.5 text-[14px] text-ink-3 transition-colors hover:border-ink hover:text-ink md:flex"
              aria-label="Search stories"
            >
              <Search size={16} />
              Search
              <kbd className="ml-3 hidden rounded border border-line bg-muted px-1.5 py-0.5 font-sans text-[11.5px] text-ink-3 xl:inline">
                Ctrl K
              </kbd>
            </button>
            <button onClick={() => setPaletteOpen(true)} className="icon-btn md:hidden" aria-label="Search stories">
              <Search size={19} />
            </button>
            <button
              onClick={toggle}
              className="icon-btn"
              aria-label={theme === "dark" ? "Use light theme" : "Use dark theme"}
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <div className="hidden lg:block">
              <AccountMenu onSignIn={() => setAuthOpen(true)} />
            </div>
            <button onClick={() => setMenuOpen(true)} className="icon-btn lg:hidden" aria-label="Open menu">
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="lg:hidden">
          <div className="animate-fade fixed inset-0 z-50 bg-black/45" onClick={() => setMenuOpen(false)} />
          <div
            className="animate-slide-in fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-[340px] flex-col bg-surface shadow-[var(--shadow-pop)]"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex h-[68px] items-center justify-between border-b border-line px-5">
              <span className="font-serif text-2xl font-semibold">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="icon-btn" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setPaletteOpen(true);
                }}
                className="flex h-12 w-full items-center gap-2.5 rounded-md border border-line-strong px-4 text-[15px] text-ink-3"
              >
                <Search size={17} /> Search stories
              </button>
              <p className="mt-7 text-[12px] font-bold uppercase tracking-[0.14em] text-ink-3">Topics</p>
              <nav className="mt-2 flex flex-col">
                <Link to="/" onClick={() => setMenuOpen(false)} className="border-b border-line py-3.5 font-serif text-[24px] text-ink">
                  Latest
                </Link>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/?topic=${c.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-line py-3.5 font-serif text-[24px] text-ink"
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 flex flex-col text-[16px]">
                <a href={MAIN_SITE_URL} target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] items-center gap-1.5 text-ink-2">
                  Main website <ArrowUpRight size={15} />
                </a>
                <a href={`${MAIN_SITE_URL}/contact`} target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] items-center gap-1.5 text-ink-2">
                  Contact the Centre <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
            <div className="border-t border-line p-5">
              {user ? (
                <button
                  onClick={async () => {
                    await signOut();
                    setMenuOpen(false);
                  }}
                  className="btn btn-secondary w-full"
                >
                  <LogOut size={16} /> Sign out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setAuthOpen(true);
                  }}
                  className="btn btn-primary w-full"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <SearchPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default SiteHeader;
