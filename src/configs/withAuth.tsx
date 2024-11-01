"use client";

import React, { useEffect, useState, ComponentType } from "react";
import { redirect, useRouter } from "next/navigation";
import { route } from "@/constants/routed";
import { motion } from "framer-motion";
import UserRoleStorage from "@/utils/localStorage/userRoleStorage";
import TokenStorage from "@/utils/localStorage/tokenStorage";
import LoadingFullPage from "@/components/loading/LoadingFullPage";

// Animation variants
const variants = {
  initial: { opacity: 0, y: 100 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 },
};

interface WithAuthProps {
  allowedRoles?: string[];
}

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: WithAuthProps
) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const role = UserRoleStorage.getUserRole();

    useEffect(() => {
      const token = TokenStorage.getToken();

      if (!token) {
        redirect(route.LOGIN);
        return;
      }

      if (
        options?.allowedRoles &&
        role &&
        !options.allowedRoles.includes(role)
      ) {
        redirect(route.FORBIDDEN);
        return;
      }

      setLoading(false);
      window.scrollTo(0, 0);
    }, [router, options?.allowedRoles, role]);

    if (loading) {
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
        <WrappedComponent {...(props as P)} />
      </motion.div>
    );
  };

  return AuthenticatedComponent;
};

export default withAuth;
