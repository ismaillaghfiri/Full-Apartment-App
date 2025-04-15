import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaBuilding,
  FaUsers,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/UserContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: "/admin", icon: <FaChartBar />, label: "Dashboard" },
    { path: "/admin/projects", icon: <FaBuilding />, label: "Projects" },
    { path: "/admin/responsables", icon: <FaUsers />, label: "Responsables" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-gray-800 text-white w-64`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-700 lg:hidden"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-700 ${
                    location.pathname === item.path ? "bg-gray-700" : ""
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className={`p-4 ${isSidebarOpen ? "lg:ml-64" : ""}`}>
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-200 lg:hidden"
          >
            <FaBars />
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.username}</span>
          </div>
        </header>

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
