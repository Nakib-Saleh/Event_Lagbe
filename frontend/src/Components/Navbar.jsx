import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Provider/AuthContext";
import logos from "../assets/EVENT.png";

const Navbar = () => {
  const { user, userRole, logOut } = useContext(AuthContext);
  const handleLogOut = () => {
    logOut();
  };

  const navEnd = (
    <>
      {user ? (
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  {userRole || "User"}
                </a>
              </li>
              <li>
                <Link to={`/${userRole}Dashboard`}>Profile</Link>
              </li>
              <li>
                <a onClick={handleLogOut}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="navbar-end gap-2">
          <Link to="/login" className="btn bg-red-500 text-white">
            Login
          </Link>
          <Link to="/register" className="btn">
            Register
          </Link>
        </div>
      )}
    </>
  );

  const list = (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/">Events</Link>
      </li>
      <li>
        <Link to="/">All events</Link>
      </li>
    </>
  );
  return (
    <div className="bg-base-100 shadow-lg rounded-md">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {list}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">
            <img src={logos} alt="Event Lagbe" className="h-12 " />
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{list}</ul>
        </div>
        {navEnd}
      </div>
    </div>
  );
};

export default Navbar;
