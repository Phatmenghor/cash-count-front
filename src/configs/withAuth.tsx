"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/localStorage/auth";
import { route } from "@/constants/routed";
import { motion } from "framer-motion";

// Animation variants
const variants = {
  initial: { opacity: 0, y: 50 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
};

const withAuth = (WrappedComponent: React.FC) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();

    React.useEffect(() => {
      if (isAuthenticated()) {
        router.push(route.LOGIN);
      }
    }, [router]);

    // If the user is not authenticated, you can return null or a loading spinner
    if (isAuthenticated()) {
      return null;
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
