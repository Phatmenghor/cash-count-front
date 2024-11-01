"use client";

import React from "react";
// import withAuth from "@/configs/withAuth";
// import { UserRole } from "@/constants/userRole";
import dynamic from "next/dynamic";

// const BranchPage = withAuth(
//   dynamic(() => import("@/page/branch/BranchPage"), {
//     ssr: false,
//   }),
//   { allowedRoles: [UserRole.AUTHORIZER_USER, UserRole.IT_ADMIN_USER] }
// );

const BranchPage = dynamic(() => import("@/page/branch/BranchPage"), {
  ssr: false,
});

const page = () => {
  return <BranchPage />;
};

export default page;
