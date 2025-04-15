import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const ResponsableSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#1a1f2b] text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold">Responsable Panel</h2>
      </div>
      <nav className="flex-1 py-4">
        <Link
          to="/responsable"
          className={`flex items-center px-6 py-3 text-sm ${
            isActive("/responsable") && !isActive("/responsable/")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <FaHome className="w-5 h-5 mr-3" />
          Dashboard
        </Link>
        <Link
          to="/responsable/projects"
          className={`flex items-center px-6 py-3 text-sm ${
            isActive("/responsable/projects")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <FaBuilding className="w-5 h-5 mr-3" />
          Projects
        </Link>
        <Link
          to="/responsable/visits"
          className={`flex items-center px-6 py-3 text-sm ${
            isActive("/responsable/visits")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <FaCalendarAlt className="w-5 h-5 mr-3" />
          Visits
        </Link>
      </nav>
      <div className="border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-4 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ResponsableSidebar;
