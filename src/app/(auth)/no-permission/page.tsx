// pages/no-permission.tsx
"use client";

import React from "react";
import { FaLock } from "react-icons/fa"; // Lock icon from react-icons

const NoPermission: React.FC = () => {
  return (
    <div
      data-aos="fade-up"
      className="flex flex-col items-center justify-center h-screen bg-gray-50"
    >
      <div className="mb-8 animate-bounce">
        <FaLock className="text-red-500" size={80} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600 mb-6">
        You do not have permission to view this page.
      </p>
      <button
        className="px-6 py-3 bg-red-500 text-white text-lg rounded-lg hover:bg-red-600 transition duration-300"
        onClick={() => (window.location.href = "/login-user")}
      >
        Go to Login
      </button>
    </div>
  );
};

export default NoPermission;
