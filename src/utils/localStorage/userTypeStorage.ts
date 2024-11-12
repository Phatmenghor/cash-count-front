// utils/UserStorage.js

import { keyStorage } from "@/constants/keyStorage"; // Ensure the keyStorage constants are created

class UserTypeStorage {
  static setUserType(type: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(keyStorage.USER_TYPE_KEY, type);
    }
  }

  static getUserType() {
    if (typeof window !== "undefined") {
      return localStorage.getItem(keyStorage.USER_TYPE_KEY) || null;
    }
    return null; // Return null if not in the browser environment
  }

  static removeUserType() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(keyStorage.USER_TYPE_KEY);
    }
  }
}

export default UserTypeStorage;
