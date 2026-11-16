import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import Homepage from "./pages/Homepage";
import ArticleView from "./pages/ArticleView";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import ArticlesList from "./components/admin/ArticlesList";
import ArticleEditor from "./components/admin/ArticleEditor";

const AdminShell = () => (
  <AdminRoute>
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  </AdminRoute>
);

const router = createBrowserRouter([
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
  { path: "*", element: <Homepage /> },
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
