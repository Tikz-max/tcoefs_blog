import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { auth } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const AdminContext = createContext();

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}

export function AdminProvider({ children }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const adminStatus = await auth.isAdmin();
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  const value = {
    isAdmin,
    loading,
    checkAdminStatus,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
