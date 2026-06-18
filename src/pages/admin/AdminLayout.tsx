import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Award, UserCog, LogOut } from "lucide-react";
import { api } from "../../lib/api";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban, end: false },
  { to: "/admin/certificates", label: "Certificates", icon: Award, end: false },
  { to: "/admin/profile", label: "Profile & content", icon: UserCog, end: false },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await api("/api/auth/logout", { method: "POST" });
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-paper">
      <aside className="w-60 border-r border-line flex flex-col shrink-0">
        <div className="px-5 py-6 border-b border-line">
          <span className="data-caption">// admin</span>
          <p className="mt-2 font-display font-semibold">Content dashboard</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-ink text-paper" : "text-ink/80 hover:bg-mist"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-line">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-mist transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
          <a href="/" className="block mt-2 text-xs text-muted hover:text-ink px-3">
            ← Back to live site
          </a>
        </div>
      </aside>
      <main className="flex-1 px-8 py-8 max-w-4xl">
        <Outlet />
      </main>
    </div>
  );
}
