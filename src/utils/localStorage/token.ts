// tokenUtils.ts

import { keyStorage } from "../constants/keyStorage";


export const setToken = (token: string, useSessionStorage: boolean = false) => {
  const storage = useSessionStorage ? sessionStorage : localStorage;
  const expiryTime = calculateExpiryTime();
  const tokenData = {
    token,
    expiry: expiryTime,
  };
  storage.setItem(keyStorage.TOKEN_KEY, JSON.stringify(tokenData));
};

export const getToken = (useSessionStorage: boolean = false): string | null => {
  const storage = useSessionStorage ? sessionStorage : localStorage;
  const tokenData = JSON.parse(storage.getItem(keyStorage.TOKEN_KEY) || "null");
  if (tokenData) {
    const { token, expiry } = tokenData;
    if (isTokenExpired(expiry)) {
      removeToken(useSessionStorage); // Remove expired token
      return null;
    }
    return token;
  }
  return null;
};

export const removeToken = (useSessionStorage: boolean = false) => {
  const storage = useSessionStorage ? sessionStorage : localStorage;
  storage.removeItem(keyStorage.TOKEN_KEY);
};

const isTokenExpired = (expiryTime: string): boolean => {
  const currentTime = Date.now();
  return currentTime > new Date(expiryTime).getTime();
};

const calculateExpiryTime = (): string => {
  const now = new Date();
  const expiry = new Date();

  // Set time to 5:30 PM today
  expiry.setHours(17, 30, 0, 0);

  // Check if current time is after 5:30 PM
  if (now > expiry) {
    // If yes, set expiry to 5:30 PM tomorrow
    expiry.setDate(expiry.getDate() + 1);
  }

  return expiry.toISOString();
};
