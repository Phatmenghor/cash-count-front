"use client";
// src/components/Navbar.tsx
import React, { useState } from "react";
import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa"; // Login icon
import ConfirmationDialog from "../ui/ConfirmationDialog";
import Button from "../ui/Button";
import { route } from "@/utils/constants/routed";

const Navbar: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fullName = "Phat Menghor";

  const handleLogout = () => {
    // Your logout logic here (e.g., clear user session)
    console.log("User logged out");
    setIsDialogOpen(false); // Close dialog after logout
  };

  return (
    <nav className="bg-gray-800 text-white fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <h1 className="text-xl font-bold">My App</h1>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/user-management" className="hover:underline">
            Manage Users
          </Link>
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <Link
            href={`/${route.register}/${encodeURIComponent("new user")}`}
            className="hover:underline"
          >
            Register
          </Link>
          {/* User and Logout Section */}
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center space-x-2 ml-auto cursor-pointer hover:text-gray-400"
          >
            <span className="text-white">{fullName}</span>{" "}
            {/* Replace 'User' with the actual username */}
            <FaSignOutAlt
              // Open the confirmation dialog
              title="Logout"
            />
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Confirm Logout!" // Title added
        onClose={() => setIsDialogOpen(false)} // Close dialog
        onConfirm={handleLogout} // Handle logout confirmation
        message={`Are you sure you want to log out, ${fullName}?`} // Corrected line
      />
    </nav>
  );
};

export default Navbar;
