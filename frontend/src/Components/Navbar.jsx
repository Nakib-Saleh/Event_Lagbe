import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../Provider/AuthContext";
import { useTheme } from "../Provider/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import logos from "../assets/EVENT.png";

const Navbar = () => {
  const { user, userRole, logOut } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  
  const handleLogOut = () => {
    logOut();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navEnd = (
    <>
      {user ? (
        <div className="navbar-end">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle mr-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <FaSun className="h-5 w-5 text-yellow-500" />
            ) : (
              <FaMoon className="h-5 w-5 text-gray-600" />
            )}
          </button>
          
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={user?.profilePictureUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white dark:bg-gray-800 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <li>
                <a className="justify-between text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  {userRole || "User"}
                </a>
              </li>
              <li>
                <Link to={`/${userRole}Dashboard`} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
              </li>
              <li>
                <a onClick={handleLogOut} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="navbar-end gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <FaSun className="h-5 w-5 text-yellow-500" />
            ) : (
              <FaMoon className="h-5 w-5 text-gray-600" />
            )}
          </button>
          
          <Link to="/login" className="btn bg-red-500 hover:bg-red-600 text-white border-0">
            Login
          </Link>
          <Link to="/register" className="btn bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 border-0">
            Register
          </Link>
        </div>
      )}
    </>
  );

  const list = (
    <>
      <li>
        <Link 
          to="/" 
          className={`${isActive("/") ? "bg-red-500 text-white rounded-md" : "text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"} transition-colors duration-200`}
        >
          Home
        </Link>
      </li>
      {user && (
        <li>
          <Link 
            to="/Connect" 
            className={`${isActive("/Connect") ? "bg-red-500 text-white rounded-md" : "text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"} transition-colors duration-200`}
          >
            Connect
          </Link>
        </li>
      )}
      <li>
        <Link 
          to="/events" 
          className={`${isActive("/events") ? "bg-red-500 text-white rounded-md" : "text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"} transition-colors duration-200`}
        >
          Explore Events
        </Link>
      </li>
      {user && (userRole === "organization" || userRole === "organizer") && (
        <li>
          <Link 
            to="/add-event" 
            className={`${isActive("/add-event") ? "bg-red-500 text-white rounded-md" : "text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"} transition-colors duration-200`}
          >
            Add Event
          </Link>
        </li>
      )}
    </>
  );
  
  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-900 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white dark:bg-gray-800 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              {list}
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost text-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
            <img src={logos} alt="Event Lagbe" className="h-12" />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-6">{list}</ul>
        </div>
        {navEnd}
      </div>
    </div>
  );
};

export default Navbar;
