// src/hocs/withAuth.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/localStorage/auth";
import { route } from "@/utils/constants/routed";

const withAuth = (WrappedComponent: React.FC) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();

    React.useEffect(() => {
      if (!isAuthenticated()) {
        // Redirect to the login page if not authenticated
        router.push(route.LOGIN);
      }
    }, [router]);

    // If the user is not authenticated, you can return null or a loading spinner
    if (!isAuthenticated()) {
      return null; // Optionally, you can return a loading spinner or a message
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
