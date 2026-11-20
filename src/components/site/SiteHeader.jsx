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
import { CATEGORIES, MAIN_SITE_URL } from "../../lib/content";
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
        <div className="animate-fade absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-pop)]">
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

const SiteHeader = ({ overlay = false }) => {
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
    `flex h-10 items-center rounded-full px-4 text-[14.5px] font-medium transition-colors ${
      active ? "bg-brand-fill text-[color:var(--c-on-cta)]" : "text-ink-2 hover:bg-muted hover:text-ink"
    }`;

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>

      {!overlay && <div className="h-[92px]" aria-hidden="true" />}
      <header className={`no-print fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4`}>
        <div
          className={`glass mx-auto flex h-[60px] max-w-[1180px] items-center justify-between gap-4 rounded-full pl-3 pr-2 transition-shadow duration-500 ${
            scrolled ? "shadow-[var(--shadow-card)]" : ""
          }`}
        >
          <Link to="/" className="flex shrink-0 items-center gap-2.5 rounded-full pr-2" aria-label="TCoEFS Blog home">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1.5">
              <img src="/tcoefs-logo.png" alt="" className="h-full w-auto" />
            </span>
            <span className="font-serif text-[19px] font-bold tracking-[-0.03em] text-ink">
              TCoEFS <span className="font-medium text-ink-3">Blog</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Topics">
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
              className="hidden h-11 items-center gap-2.5 rounded-full px-4 text-[14px] text-ink-2 transition-colors hover:bg-muted hover:text-ink md:flex"
              aria-label="Search stories"
            >
              <Search size={16} />
              Search
              <kbd className="ml-1 hidden rounded-md bg-muted px-1.5 py-0.5 font-sans text-[11px] text-ink-3 xl:inline">Ctrl K</kbd>
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
            <a
              href={MAIN_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary nudge ml-1 hidden !h-11 sm:inline-flex"
            >
              TCoEFS site <ArrowUpRight size={15} />
            </a>
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
            className="animate-slide-in fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-[360px] flex-col bg-surface shadow-[var(--shadow-pop)]"
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
                className="flex h-12 w-full items-center gap-2.5 rounded-full border border-line-strong px-5 text-[15px] text-ink-3"
              >
                <Search size={17} /> Search stories
              </button>
              <p className="mt-7 text-[12px] font-bold uppercase tracking-[0.14em] text-ink-3">Topics</p>
              <nav className="mt-2 flex flex-col">
                <Link to="/" onClick={() => setMenuOpen(false)} className="border-b border-line py-3.5 font-serif text-[26px] font-bold tracking-[-0.03em] text-ink">
                  Latest
                </Link>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/?topic=${c.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-line py-3.5 font-serif text-[26px] font-bold tracking-[-0.03em] text-ink"
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
