import { Outlet } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import AdminLayout from "./AdminLayout";

const AdminShell = () => (
  <AdminRoute>
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  </AdminRoute>
);

export default AdminShell;
