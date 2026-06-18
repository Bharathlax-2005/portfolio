import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../lib/useAuth";

export default function ProtectedRoute() {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center font-mono text-sm text-muted">
        checking session…
      </div>
    );
  }

  if (status === "guest") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
