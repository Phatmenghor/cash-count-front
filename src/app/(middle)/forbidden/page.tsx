// src/app/forbidden/page.tsx
import React from "react";
import Link from "next/link";
import { route } from "@/constants/routed";

const ForbiddenPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="flex justify-center">
          <svg
            className="w-24 h-24 text-red-600 animate-pulse"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12C24 5.373 18.627 0 12 0zm0 22C6.478 22 2 17.522 2 12S6.478 2 12 2s10 4.478 10 10-4.478 10-10 10zm-1-14h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-red-600">403 - Forbidden</h1>
        <p className="mt-4 text-lg text-gray-700">
          You do not have permission to access this page.
        </p>
        <Link
          href={route.LOGIN}
          className="mt-6 inline-block px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default ForbiddenPage;
