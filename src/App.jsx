import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import Homepage from "./components/Homepage";
import ArticleView from "./components/ArticleView";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import ArticlesList from "./components/admin/ArticlesList";
import ArticleEditor from "./components/admin/ArticleEditor";

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <Routes>
            {/* Homepage Route */}
            <Route path="/" element={<Homepage />} />

            {/* Individual News Article Route - matches /news/1, /news/2, etc. */}
            <Route path="/news/:id" element={<ArticleView />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/articles"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ArticlesList />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/articles/new"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ArticleEditor />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/articles/edit/:id"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ArticleEditor />
                  </AdminLayout>
                </AdminRoute>
              }
            />
          </Routes>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
