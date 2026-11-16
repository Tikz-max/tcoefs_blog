import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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

const AccountMenu = ({ onSignIn }) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
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

  const name =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Account";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-brand-fill text-[13px] font-semibold text-white"
        aria-label="Account menu"
        aria-expanded={open}
      >
        {name.charAt(0).toUpperCase()}
      </button>
      {open && (
        <div className="animate-fade absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-lg border border-line bg-surface shadow-pop">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            <p className="truncate text-xs text-ink-3">{user.email}</p>
          </div>
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-muted"
            >
              <LayoutDashboard size={16} className="text-ink-3" />
              Editorial desk
            </Link>
          )}
          <button
            onClick={async () => {
              await signOut();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-ink hover:bg-muted"
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
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [query, setQuery] = useState(params.get("q") || "");
  const inputRef = useRef(null);
  const { pathname } = useLocation();
  const activeTopic = params.get("topic");
  const onLatest = pathname === "/" && !activeTopic && !params.get("q");

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
      if (e.key === "/" && !/input|textarea/i.test(e.target.tagName) && !e.target.isContentEditable) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : "/");
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const topicClass = (slug) => {
    const active = slug === null || (pathname === "/" && activeTopic === slug);
    return `relative py-2 text-[14.5px] font-medium transition-colors ${
      active
        ? "text-ink after:absolute after:inset-x-0 after:-bottom-[15px] after:h-[2px] after:bg-brand"
        : "text-ink-2 hover:text-ink"
    }`;
  };

  return (
    <>
      {/* Institutional strip */}
      <div className="no-print bg-band text-white/80">
        <div className="container-page flex h-9 items-center justify-between gap-4 text-[12px]">
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
            className="inline-flex shrink-0 items-center gap-1 font-medium text-white hover:underline"
          >
            Main website
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      {/* Masthead */}
      <header className="no-print sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
        <div className="container-page flex h-[68px] items-center justify-between gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="TCoEFS Blog home">
            <img src="/tcoefs-logo.png" alt="" className="h-10 w-auto" />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-[22px] font-semibold tracking-tight text-ink">
                TCoEFS <span className="font-normal italic text-brand">Blog</span>
              </span>
              <span className="mt-1 hidden text-[10.5px] font-medium uppercase tracking-[0.14em] text-ink-3 sm:block">
                Evidence for food security
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Topics">
            <Link to="/" className={topicClass(onLatest ? null : "latest")}>
              Latest
            </Link>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to={`/?topic=${c.slug}`} className={topicClass(c.slug)}>
                {c.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="icon-btn"
              aria-label="Search stories"
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>
            <button
              onClick={toggle}
              className="icon-btn"
              aria-label={theme === "dark" ? "Use light theme" : "Use dark theme"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="hidden pl-1 lg:block">
              <AccountMenu onSignIn={() => setAuthOpen(true)} />
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              className="icon-btn lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Search drawer */}
        {searchOpen && (
          <div className="animate-fade border-t border-line bg-surface">
            <form onSubmit={submitSearch} className="container-page flex items-center gap-3 py-4">
              <Search size={20} className="shrink-0 text-ink-3" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search stories, topics and research"
                aria-label="Search stories"
                className="h-11 w-full bg-transparent font-serif text-[22px] text-ink outline-none placeholder:text-ink-3"
              />
              <button type="submit" className="btn btn-primary shrink-0">
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden">
          <div
            className="animate-fade fixed inset-0 z-50 bg-black/45"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="animate-slide-in fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-[340px] flex-col bg-surface shadow-pop"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex h-[68px] items-center justify-between border-b border-line px-5">
              <span className="font-serif text-xl font-semibold">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="icon-btn" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <form onSubmit={submitSearch} className="relative mb-6">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search stories"
                  className="field pl-9"
                />
              </form>
              <p className="kicker !text-ink-3">Topics</p>
              <nav className="mt-2 flex flex-col">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-line py-3.5 font-serif text-[21px] text-ink"
                >
                  Latest
                </Link>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/?topic=${c.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-line py-3.5 font-serif text-[21px] text-ink"
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-1 text-[15px]">
                <a
                  href={MAIN_SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 py-2 text-ink-2"
                >
                  Main website <ArrowUpRight size={15} />
                </a>
                <a
                  href={`${MAIN_SITE_URL}/contact`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 py-2 text-ink-2"
                >
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

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default SiteHeader;
