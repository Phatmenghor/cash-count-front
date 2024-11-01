"use client";

import React from "react";
// import withAuth from "@/configs/withAuth";
// import { UserRole } from "@/constants/userRole";
import dynamic from "next/dynamic";

// const DepartmentPage = withAuth(
//   dynamic(() => import("@/page/department/DepartmentPage"), {
//     ssr: false,
//   }),
//   { allowedRoles: [UserRole.AUTHORIZER_USER, UserRole.IT_ADMIN_USER] }
// );

const DepartmentPage = dynamic(
  () => import("@/page/department/DepartmentPage"),
  {
    ssr: false,
  }
);

const page = () => {
  return <DepartmentPage />;
};

export default page;
