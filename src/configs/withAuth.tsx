/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { route } from "@/constants/routed";
import { motion } from "framer-motion";
import LoadingFullPage from "@/components/centerLoading/LoadingFullPage";
import UserRoleStorage from "@/utils/localStorage/userRoleStorage";
import TokenStorage from "@/utils/localStorage/tokenStorage";

// Animation variants
const variants = {
  initial: { opacity: 0, y: 100 }, // Start from below
  enter: { opacity: 1, y: 0 }, // Move to original position
  exit: { opacity: 0, y: -100 }, // Exit upwards
};

interface WithAuthProps {
  allowedRoles?: string[]; // Optional
}

const withAuth = (
  WrappedComponent: React.FC<WithAuthProps>,
  options?: WithAuthProps
) => {
  const AuthenticatedComponent: React.FC<WithAuthProps> = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const role = UserRoleStorage.getUserRole();

    useEffect(() => {
      if (!TokenStorage.getToken()) {
        router.push(route.LOGIN);
      } else {
        if (
          options?.allowedRoles &&
          role &&
          !options.allowedRoles.includes(role)
        ) {
          router.push(route.FORBIDDEN);
        }
      }
      window.scrollTo(0, 0);
      setLoading(false);
    }, [router, options?.allowedRoles, role]);

    if (
      !role ||
      (options?.allowedRoles && !options.allowedRoles.includes(role)) ||
      loading
    ) {
      return <LoadingFullPage />;
    }

    return (
      <motion.div
        initial="initial"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.5 }}
      >
        <WrappedComponent {...props} />
      </motion.div>
    );
  };

  return AuthenticatedComponent;
};

export default withAuth;
