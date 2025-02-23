// src/app/deactivate-users/page.tsx
"use client";

import UserStorage from "@/utils/localStorage/userStorage";
import { route } from "@/constants/routed";
import { UserRoleEnum } from "@/constants/userRole";
import { LoginService } from "@/redux/service/loginService";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa"; 

const DeactivateUser: React.FC = () => {
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const username = UserStorage.getUsername();
    const password = UserStorage.getPassword();

    if (username && password) {
      const response = await LoginService.loginUser({
        email: username,
        password: password,
      });

      if (response.success) {
        if (
          response.data == UserRoleEnum.IT_ADMIN_USER ||
          response.data == UserRoleEnum.OPERATION_ADMIN_USER
        ) {
          router.push(`/${route.USER_MANAGEMENT}`);
        } else {
          router.push("/cash-management");
        }
        return;
      }
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className=" flex flex-col -mt-16 items-center text-center max-w-lg">
        <FaExclamationTriangle
          size={120}
          className="text-yellow-500 animate-bounce mb-4"
        />

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Your account is Deactivated
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
