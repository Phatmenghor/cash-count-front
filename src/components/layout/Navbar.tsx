/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import ModalConfirmation from "../modal/ModalConfirmation";
import Button from "../custom/Button";
import { useRouter } from "next/navigation";
import { route } from "@/constants/routed";
import showToast from "../toast/useToast";
import { clearLocalStorage } from "@/utils/localStorage/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import UserManagementService from "@/redux/service/userManagementService";

const Navbar: React.FC = React.memo(() => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    dispatch(UserManagementService.getUserByToken());
  }

  const handleLogout = () => {
    showToast("You have successfully logged out.", "success");
    clearLocalStorage();
    setIsDialogOpen(false);
    router.push(`/${route.LOGIN}`);
  };

  return (
    <nav className="top-0 w-full left-0 right-0 z-50 fixed">
      <div className="bg-gray-700 container text-white   shadow-md px-4 py-2">
        <div className=" mx-auto flex justify-between items-center">
          <div className="flex gap-2">
            <h1 className="text-xl font-bold whitespace-nowrap overflow-hidden overflow-ellipsis">
              Cash Management
            </h1>
          </div>
          <div className="flex items-center">
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
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
