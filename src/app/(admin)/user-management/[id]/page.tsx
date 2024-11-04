"use client";

import React from "react";
// import withAuth from "@/configs/withAuth";
// import { UserRole } from "@/constants/userRole";
import dynamic from "next/dynamic";

// const UserManagementPage = withAuth(
//   dynamic(() => import("@/page/userManagement/UserManagementPage"), {
//     ssr: false,
//   }),
//   { allowedRoles: [UserRole.AUTHORIZER_USER, UserRole.IT_ADMIN_USER] }
// );

const EditUserInfoPage = dynamic(
  () => import("@/page/userManagement/EditUserManagement"),
  {
    ssr: false,
  }
);

const page = ({ params }: { params: { id: number } }) => {
  return <EditUserInfoPage params={params} />;
};

export default page;
