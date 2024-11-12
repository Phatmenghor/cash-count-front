// components/AuthWrapper.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TokenStorage from "../localStorage/tokenStorage";
import UserRoleStorage from "../localStorage/userRoleStorage";

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRoles: string[]; // Accept an array of roles
}

const AuthWrapper = ({ children, requiredRoles }: AuthWrapperProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // To prevent render flicker

  useEffect(() => {
    const token = TokenStorage.getToken();
    const role = UserRoleStorage.getUserRole();

    // If no token, redirect to login
    if (!token) {
      router.push("/login-user");
      return;
    }

    // Handle the case when role is null
    if (!role || !requiredRoles.includes(role)) {
      router.push("/deactivate-user");
      return;
    }

    // If everything is fine, set loading to false to render children
    setLoading(false);
  }, [router, requiredRoles]);

  // Render loading state until the authentication check is complete
  if (loading) {
    return null;
  }

  // If authenticated and authorized, render the children (protected page content)
  return <>{children}</>;
};

export default AuthWrapper;
