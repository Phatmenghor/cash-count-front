"use client";

import React from "react";
// import withAuth from "@/configs/withAuth";
// import { UserRole } from "@/constants/userRole";
import dynamic from "next/dynamic";

// const PositionPage = withAuth(
//   dynamic(() => import("@/page/position/PositionPage"), {
//     ssr: false,
//   }),
//   { allowedRoles: [UserRole.AUTHORIZER_USER, UserRole.IT_ADMIN_USER] }
// );

const UserRequestPage = dynamic(() => import("@/page/userManagement/UserRequestPage"), {
  ssr: false,
});

const page = () => {
  return <UserRequestPage />;
};

export default page;
