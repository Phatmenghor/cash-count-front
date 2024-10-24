import TokenStorage from "./tokenStorage";

// src/utils/auth.ts
const isAuthenticated = () => {
  // Implement your logic to check if the user is authenticated
  // Example: Check for a token in local storage
  return !!TokenStorage.getToken();
};

export const clearLocalStorage = (): void => {
  localStorage.clear();
};

export { isAuthenticated };
