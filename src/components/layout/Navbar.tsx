/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";
import ModalConfirmation from "../modal/ModalConfirmation";
import Button from "../custom/Button";
import { useRouter, usePathname } from "next/navigation";
import { route } from "@/constants/routed";
import showToast from "../toast/useToast";
import { clearLocalStorage } from "@/utils/localStorage/auth";
import { UserRole } from "@/constants/userRole";
import UserRoleStorage from "@/utils/localStorage/userRoleStorage";
import Dropdown, { MenuOption } from "../custom/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { menuNavbar } from "@/constants/dataListing";
import UserService from "@/redux/service/userService";

const Navbar: React.FC = React.memo(() => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState(pathname);
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    fetchData();
    const role = UserRoleStorage.getUserRole();
    if (role && Object.values(UserRole).includes(role as UserRole)) {
      setUserRole(role as UserRole);
    } else {
      setUserRole(null);
    }
  }, []);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  function fetchData() {
    dispatch(UserService.getUserData());
  }

  const handleLogout = () => {
    showToast("You have successfully logged out.", "success");
    clearLocalStorage();
    setIsDialogOpen(false);
    router.push(`/${route.LOGIN}`);
  };

  const isActiveRoute = (href: string) => currentPath === href;

  const navLinks = useMemo(() => {
    if (userRole) {
      return [
        ...(userRole === UserRole.IT_ADMIN_USER ||
        userRole === UserRole.OPERATION_ADMIN_USER
          ? [{ href: `/${route.USER_MANAGEMENT}`, label: "User Management" }]
          : []),
        ...(userRole !== UserRole.IT_ADMIN_USER &&
        userRole !== UserRole.OPERATION_ADMIN_USER
          ? [{ href: `/${route.CASH_RECORDS}`, label: "Cash Record" }]
          : []),
      ];
    }
    return [];
  }, [userRole]);

  const handlePositionSelect = (option: MenuOption) => {
    router.push(option.href);
  };

  return (
    <nav className="bg-gray-700 text-white fixed top-0 w-full left-0 right-0 z-50 shadow-md px-4 py-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-2">
          <h1 className="text-xl font-bold whitespace-nowrap overflow-hidden overflow-ellipsis">
            Cash Management
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {userRole === UserRole.IT_ADMIN_USER && (
            <Dropdown
              options={menuNavbar}
              onSelect={handlePositionSelect}
              label="Menu"
            />
          )}

          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative group"
              prefetch={true}
              aria-label={label}
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
            aria-label="Logout"
          >
            <span className="text-white">{userData?.name ?? ""}</span>
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
        message={`Are you sure you want to log out, ${userData?.name ?? ""}?`}
      />
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
