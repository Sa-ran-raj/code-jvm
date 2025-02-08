import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import gog from "../assets/gog.png"

const WomenEmpowermentLoginSignup = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="relative h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
      <div className="text-center text-white z-10 space-y-4">
        <h1 className="text-5xl font-extrabold mb-4">Women Empowerment</h1>
        <p className="text-lg mb-6">
          Empowering women is the key to a better world. Together, we can make a difference.
        </p>
      </div>

      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-4">
        <button
          onClick={loginWithGoogle}
          className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg flex items-center space-x-2"
        >
          <img
            src={gog}
            alt="Google logo"
            className="h-5 w-5"
          />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default WomenEmpowermentLoginSignup;
