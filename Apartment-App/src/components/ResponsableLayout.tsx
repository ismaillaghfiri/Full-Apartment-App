import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBuilding, FaCalendarAlt } from "react-icons/fa";

interface ResponsableLayoutProps {
  children: React.ReactNode;
}

const ResponsableLayout: React.FC<ResponsableLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">Responsable Panel</p>
        </div>
        <nav className="mt-4">
          <Link
            to="/responsable/projects"
            className={`flex items-center px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 ${
              isActive("/responsable/projects")
                ? "bg-blue-50 text-blue-700"
                : ""
            }`}
          >
            <FaBuilding className="w-5 h-5 mr-3" />
            <span>Projects</span>
          </Link>
          <Link
            to="/responsable/visits"
            className={`flex items-center px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 ${
              isActive("/responsable/visits") ? "bg-blue-50 text-blue-700" : ""
            }`}
          >
            <FaCalendarAlt className="w-5 h-5 mr-3" />
            <span>Visits</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="py-6">
          <div className="px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsableLayout;
