"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";
import ModalConfirmation from "../modal/ModalConfirmation";
import Button from "../ui/Button";
import { useRouter, usePathname } from "next/navigation";
import { route } from "@/constants/routed";

const Navbar: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fullName = "Phat Menghor";
  const pathname = usePathname();
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const handleLogout = () => {
    console.log("User logged out");
    setIsDialogOpen(false);
    router.push("/login");
  };

  const isActiveRoute = (href: string) => currentPath === href;

  const navLinks = [
    { href: "/user-management", label: "Manage Users" },
    { href: "/login", label: "Login" },
    {
      href: `/${route.REGISTER}/${encodeURIComponent("new user")}`,
      label: "Register",
    },
    { href: `/${route.CASH_RECORDS}`, label: "Cash Records" },
  ];

  return (
    <nav className="bg-gray-700 text-white fixed top-0 w-full left-0 right-0 z-50 shadow-md px-4 py-2">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold whitespace-nowrap overflow-hidden overflow-ellipsis">
          Case count
        </h1>
        <div className="flex items-center space-x-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative group"
              prefetch={true}
            >
              <span
                className={`whitespace-nowrap overflow-hidden overflow-ellipsis ${
                  isActiveRoute(href) ? "text-white" : "text-gray-300"
                }`}
              >
                {label}
              </span>
              <span
                className={`absolute left-0 right-0 bottom-0 h-0.5 bg-gray-300 scale-x-0 transition-transform duration-300 ease-in-out ${
                  isActiveRoute(href)
                    ? "scale-x-100"
                    : "group-hover:scale-x-100"
                }`}
              ></span>
            </Link>
          ))}
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center space-x-2 ml-auto py-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
          >
            <span className="text-white">{fullName}</span>
            <FaSignOutAlt title="Logout" />
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ModalConfirmation
        isOpen={isDialogOpen}
        title="Confirm Logout!"
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleLogout}
        message={`Are you sure you want to log out, ${fullName}?`}
      />
    </nav>
  );
};

export default Navbar;
