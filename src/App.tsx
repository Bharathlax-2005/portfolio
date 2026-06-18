import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminProfile from "./pages/admin/AdminProfile";
import ProtectedRoute from "./components/admin/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
