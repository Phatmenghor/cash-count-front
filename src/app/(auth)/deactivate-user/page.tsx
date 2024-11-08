// src/app/deactivate-users/page.tsx
"use client";
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa"; // Alert icon

const DeactivateUser: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className=" flex flex-col -mt-16 items-center text-center max-w-lg">
        <FaExclamationTriangle
          size={120}
          className="text-yellow-500 animate-bounce mb-4"
        />

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Your Account is Deactivated
        </h1>

        <p className="text-lg text-gray-600 ">
          You are currently waiting for admin approval.
        </p>

        <p className="text-md text-gray-500 mb-4">
          Please check back later or contact support for further assistance.
        </p>

        <p className="text-md text-gray-400">Thank you for your patience!</p>
      </div>
    </div>
  );
};

export default DeactivateUser;
