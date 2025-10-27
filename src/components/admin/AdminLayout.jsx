import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Logo from "../common/Logo";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Articles",
      path: "/admin/articles",
      icon: FileText,
    },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Global CSS for layout */}
      <style>{`
        .admin-layout-container {
          display: flex;
          min-height: 100vh;
          background-color: #f2f8f5;
        }

        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 256px;
          background: white;
          border-right: 1px solid #d9e8e0;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
          z-index: 50;
          transform: translateX(-100%);
          transition: all 300ms ease-in-out;
        }

        .admin-sidebar.open {
          transform: translateX(0);
        }

        .admin-sidebar.collapsed {
          width: 72px;
        }

        .admin-content-wrapper {
          flex: 1;
          min-height: 100vh;
          margin-left: 0;
          transition: margin-left 300ms ease-in-out;
        }

        /* Desktop: Always show sidebar and offset content */
        @media (min-width: 1024px) {
          .admin-sidebar {
            transform: translateX(0) !important;
          }

          .admin-content-wrapper {
            margin-left: 256px;
          }

          .admin-sidebar.collapsed ~ .admin-content-wrapper {
            margin-left: 72px;
          }
        }

        /* Mobile overlay */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 40;
        }

        @media (min-width: 1024px) {
          .sidebar-overlay {
            display: none;
          }
        }
      `}</style>

      <div className="admin-layout-container">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`admin-sidebar ${sidebarOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}
        >
          <div className="flex flex-col h-full">
            {/* Collapse Button - Desktop Only - At Top */}
            <div className="hidden lg:flex items-center justify-end py-3 px-4 border-b border-sage-light/50 flex-shrink-0">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-sage-light rounded-lg transition-quick text-secondary hover:text-primary"
                aria-label={
                  sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Logo/Header */}
            <div className="h-20 border-b border-sage-light flex items-center justify-between px-6 flex-shrink-0 mb-6">
              {!sidebarCollapsed ? (
                <Link to="/" className="flex items-center gap-3 flex-1">
                  <Logo size="sm" />
                  <span className="font-bold text-primary text-xl">
                    TCoEFS Admin
                  </span>
                </Link>
              ) : (
                <div className="w-full flex justify-center">
                  <Logo size="sm" />
                </div>
              )}
              {/* Mobile close button - only visible on mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-sage-light rounded-lg transition-quick ml-2"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-quick font-medium ${
                      active
                        ? "bg-accent text-white shadow-sm"
                        : "text-primary hover:bg-sage-light"
                    } ${sidebarCollapsed ? "justify-center" : ""}`}
                    title={sidebarCollapsed ? item.name : ""}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>

            {/* User Info & Sign Out */}
            <div className="p-5 border-t border-sage-light bg-white flex-shrink-0">
              {!sidebarCollapsed && (
                <div className="mb-4 px-1">
                  <p className="text-xs text-secondary font-medium uppercase tracking-wider mb-1.5">
                    Signed in as
                  </p>
                  <p className="text-sm text-primary font-semibold truncate">
                    {user?.email}
                  </p>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary hover:bg-red-50 hover:text-red-600 transition-quick font-medium ${
                  sidebarCollapsed ? "justify-center" : ""
                }`}
                title={sidebarCollapsed ? "Sign Out" : ""}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Sign Out</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="admin-content-wrapper">
          {/* Mobile Header with Hamburger */}
          <header className="lg:hidden h-20 bg-white border-b border-sage-light flex items-center justify-between px-6 sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-sage-light rounded-lg transition-quick"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-primary" />
            </button>
            <h1 className="text-xl font-bold text-primary">TCoEFS Admin</h1>
            <div className="w-10"></div>
          </header>

          {/* Main Content */}
          <main className="bg-background min-h-screen">{children}</main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
