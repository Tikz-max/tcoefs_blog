import { Link, Navigate } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../context/AdminContext";

const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  if (authLoading || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-brand" />
          <p className="mt-3 text-sm text-ink-2">Verifying access…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6">
        <div className="panel max-w-md p-8 text-center">
          <ShieldAlert size={32} className="mx-auto text-ink-3" />
          <h1 className="headline mt-4 text-2xl">Access restricted</h1>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
            Your account does not have permission to use the editorial desk.
          </p>
          <Link to="/" className="btn btn-primary mt-6">Return to the blog</Link>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
