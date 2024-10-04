import { keyStorage } from "../constants/keyStorage";

// src/utils/auth.ts
const isAuthenticated = () => {
  // Implement your logic to check if the user is authenticated
  // Example: Check for a token in local storage
  return !!localStorage.getItem(keyStorage.TOKEN_KEY);
};

export { isAuthenticated };
