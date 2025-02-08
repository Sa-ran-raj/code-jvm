import React from "react";
import { useAuth } from "./AuthProvider";
import gog from "../assets/gog.png"

const Login = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Login to Continue</h1>
        <button
          onClick={loginWithGoogle}
          className="flex items-center bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition"
        >
          <img
            src= {gog}
            alt="Google Logo"
            className="h-6 w-6 mr-3"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
