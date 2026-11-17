import { Suspense, lazy } from "react";
import { Outlet, RouterProvider, ScrollRestoration, createBrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import Homepage from "./pages/Homepage";

// Readers never download the editor: admin screens and stories load on demand.
const ArticleView = lazy(() => import("./pages/ArticleView"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminShell = lazy(() => import("./components/admin/AdminShell"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const ArticlesList = lazy(() => import("./components/admin/ArticlesList"));
const ArticleEditor = lazy(() => import("./components/admin/ArticleEditor"));

const Loading = () => (
  <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
    <img src="/tcoefs-logo.png" alt="" className="h-16 w-auto animate-pulse opacity-70" />
  </div>
);

const Root = () => {
  const { pathname } = useLocation();
  return (
    <Suspense fallback={<Loading />}>
      <div key={pathname} className="page-enter">
        <Outlet />
      </div>
      <ScrollRestoration getKey={(location) => location.pathname + location.search} />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/news/:id", element: <ArticleView /> },
      {
        path: "/admin",
        element: <AdminShell />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "articles", element: <ArticlesList /> },
          { path: "articles/new", element: <ArticleEditor key="new" /> },
          { path: "articles/edit/:id", element: <ArticleEditor /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <RouterProvider router={router} />
      </AdminProvider>
    </AuthProvider>
  );
}
