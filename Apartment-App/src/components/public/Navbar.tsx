// import { Link } from "react-router-dom";
import dariLogo from "../../assets/images/dari-logo.png";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className=" mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img src={dariLogo} alt="Dari Logo" className="h-12" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/projects" className="text-gray-700 hover:text-blue-600">
              Projects
            </Link>
            <Link
              to="/categories"
              className="text-gray-700 hover:text-blue-600"
            >
              Categories
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600">
              Contact Us
            </Link>
          </div>
          {isLoggedIn ? (
            <Link
              to="/login"
              className="text-red-600 hover:text-red-700 flex items-center gap-2"
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log out
            </Link>
          ) : (
            // <li className="nav-item">
            //   <button onClick={handleLogout} className="nav-link logout-btn">
            //     Logout
            //   </button>
            // </li>
            <>
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
