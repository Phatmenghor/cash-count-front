// utils/UserRoleStorage.js

import { keyStorage } from "@/constants/keyStorage";
import { UserRoleEnum } from "@/constants/userRole";

class UserRoleStorage {
  /**
   * Save the user role to local storage.
   * @param {string} role - The role to be stored.
   */
  static setUserRole(role: UserRoleEnum) {
    if (typeof window !== "undefined") {
      localStorage.setItem(keyStorage.USER_ROLE_KEY, role);
    }
  }

  /**
   * Get the user role from local storage.
   * @returns {string|null} - The stored user role or null if not found.
   */
  static getUserRole() {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem(keyStorage.USER_ROLE_KEY);
      return role as UserRoleEnum | null; // Ensures it's either a valid role or null
    }
    return null;
  }

  /**
   * Remove the user role from local storage.
   */
  static removeUserRole() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(keyStorage.USER_ROLE_KEY);
    }
  }
}

export default UserRoleStorage;
