import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
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
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-gray-900 text-white">
      <div className="flex flex-col h-full">
        {/* Logo and Title */}
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">Responsable Panel</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* <Link
            to="/responsable"
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive("/responsable") && !isActive("/responsable/")
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {/* <FaHome className="w-5 h-5 mr-3" /> */}
            {/* <span>Dashboard</span> */}
          {/* </Link> */} 

          <Link
            to="/responsable/projects"
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive("/responsable/projects")
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <FaBuilding size={20} />
            <span className="ml-3">Projects</span>
          </Link>

          <Link
            to="/responsable/visits"
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive("/responsable/visits")
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <FaCalendarAlt size={20} /> 
            <span className="ml-3">Visits</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaSignOutAlt size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ResponsableSidebar;
