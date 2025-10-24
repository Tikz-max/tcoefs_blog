import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../context/AdminContext";
import { Loader2 } from "lucide-react";

const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  // Show loading state while checking authentication
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
          <p className="text-primary text-lg">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect to home if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6 py-12">
          <div className="bg-white rounded-lg border border-sage-light p-8">
            <h1 className="text-2xl font-bold text-primary mb-4">
              Access Denied
            </h1>
            <p className="text-secondary mb-6">
              You don't have permission to access the admin panel.
            </p>
            <a
              href="/"
              className="inline-block bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark transition-quick"
            >
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  // User is admin, render the protected route
  return children;
};

export default AdminRoute;
