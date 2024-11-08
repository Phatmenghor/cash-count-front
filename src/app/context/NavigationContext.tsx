// src/context/NavigationContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

// Define the types for the context
interface NavigationContextProps {
  redirectToLogin: () => void;
  setAuthError: (error: boolean) => void; // Accept a boolean argument
}

const NavigationContext = createContext<NavigationContextProps | undefined>(
  undefined
);

export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authError, setAuthError] = useState(false); // State to track 401 errors
  const router = useRouter();

  const redirectToLogin = () => {
    router.push("/login-user");
  };

  useEffect(() => {
    if (authError) {
      redirectToLogin();
    }
  }, [authError]); // Redirect to login when authError is true

  return (
    <NavigationContext.Provider value={{ redirectToLogin, setAuthError }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextProps => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
