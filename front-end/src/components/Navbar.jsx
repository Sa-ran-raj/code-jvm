import { useState } from "react";
import React from "react";
import { useAuth } from "./AuthProvider";


const Navbar = () => {
  const { user, loginWithGoogle, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/home" className="text-xl font-bold text-purple-800">
              WomenEmpowerment
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/home" className="text-gray-700 hover:text-purple-600">Home</a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Display User Profile Pic & Name */}
                <img
  src={"https://cdn-icons-png.flaticon.com/128/1144/1144760.png"}
  alt="Profile"
  className="h-8 w-8 rounded-full border"
/>

                <span className="text-gray-700 font-medium">{user.name}</span>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-purple-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Login with Google
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <a href="/home" className="block py-2 text-gray-700 hover:text-purple-600">Home</a>
            
            {user ? (
              <div className="flex flex-col items-center space-y-2">
                <img src={user.profilePic} alt="Profile" className="h-10 w-10 rounded-full border" />
                <span className="text-gray-700 font-medium">{user.name}</span>
                <button
                  onClick={logout}
                  className="block py-2 text-gray-700 hover:text-purple-600 w-full text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="block py-2 text-gray-700 hover:text-purple-600 w-full text-left"
              >
                Login with Google
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
