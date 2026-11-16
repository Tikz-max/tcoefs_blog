import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PenSquare,
  Sun,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { ToastProvider } from "./Toast";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/articles", label: "Stories", icon: FileText },
];

const AdminLayout = ({ children }) => {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const link = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2.5 text-[14.5px] font-medium transition-colors ${
      isActive ? "bg-brand-soft text-brand" : "text-ink-2 hover:bg-muted hover:text-ink"
    }`;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-line px-5">
        <Link to="/admin" className="flex items-center gap-2.5">
          <img src="/tcoefs-logo.png" alt="" className="h-8 w-auto" />
          <span className="leading-none">
            <span className="block font-serif text-[17px] font-semibold text-ink">Editorial desk</span>
            <span className="mt-0.5 block text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink-3">TCoEFS Blog</span>
          </span>
        </Link>
        <button onClick={() => setOpen(false)} className="icon-btn lg:hidden" aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <div className="p-4">
        <Link to="/admin/articles/new" onClick={() => setOpen(false)} className="btn btn-primary w-full">
          <PenSquare size={16} /> New story
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Admin">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={link}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[14.5px] font-medium text-ink-2 hover:bg-muted hover:text-ink">
          <ArrowUpRight size={18} /> View blog
        </a>
      </nav>

      <div className="border-t border-line p-4">
        <p className="truncate text-[13px] font-semibold text-ink">{user?.user_metadata?.full_name || user?.email?.split("@")[0]}</p>
        <p className="truncate text-[12px] text-ink-3">{user?.email}</p>
        <div className="mt-3 flex gap-2">
          <button onClick={toggle} className="btn btn-secondary btn-sm flex-1">
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
            className="btn btn-secondary btn-sm flex-1"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-paper">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-line bg-surface lg:block">{sidebar}</aside>

        {open && (
          <div className="lg:hidden">
            <div className="animate-fade fixed inset-0 z-50 bg-black/45" onClick={() => setOpen(false)} />
            <aside className="animate-slide-in fixed inset-y-0 left-0 z-50 w-[272px] bg-surface shadow-pop" style={{ animationName: "none" }}>
              {sidebar}
            </aside>
          </div>
        )}

        <div className="lg:pl-[248px]">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface px-4 lg:hidden">
            <button onClick={() => setOpen(true)} className="icon-btn" aria-label="Open menu">
              <Menu size={20} />
            </button>
            <span className="font-serif text-[17px] font-semibold">Editorial desk</span>
          </header>
          <main>{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default AdminLayout;
