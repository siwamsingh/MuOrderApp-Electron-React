import React from 'react';

function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><a href='#/'>Home</a></li>
            <li><a href='#/excel'>Excel</a></li>
          </ul>
        </div>
        <div className="btn btn-ghost text-xl ">
          <svg width="50" height="50" className='rounded-full overflow-hidden shadow-md' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">

            <rect width="200" height="100" y="100" fill="#1E90FF" />

            <path d="M0,140 Q25,120 50,140 T100,140 T150,140 T200,140 V160 H0 Z" fill="#87CEEB" />
            <path d="M0,160 Q25,140 50,160 T100,160 T150,160 T200,160 V180 H0 Z" fill="#ADD8E6" />

            <rect x="70" y="90" width="60" height="20" fill="#8B4513" stroke="#654321" strokeWidth="2" />
            <rect x="72" y="80" width="56" height="10" fill="#8B4513" stroke="#654321" strokeWidth="2" />

            <rect x="97" y="40" width="6" height="50" fill="#654321" />

            <polygon points="100,40 100,80 80,80" fill="#FFFFFF" stroke="#D3D3D3" strokeWidth="2" />

            <circle cx="160" cy="40" r="20" fill="#FFD700" />
          </svg>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a href='#/'>Home</a></li>
          <li><a href='#/excel'>Excel</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <label className="flex cursor-pointer gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path
              d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <input type="checkbox" value="dark" className="toggle theme-controller" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>
      </div>
    </div>
  );
}

export default Navbar;
