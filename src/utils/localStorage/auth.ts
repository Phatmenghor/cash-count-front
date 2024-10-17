import TokenUtils from "./token";

// src/utils/auth.ts
const isAuthenticated = () => {
  // Implement your logic to check if the user is authenticated
  // Example: Check for a token in local storage
  return !!TokenUtils.getToken();
};

export { isAuthenticated };
