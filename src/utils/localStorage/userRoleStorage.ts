// utils/UserRoleStorage.js

import { keyStorage } from "@/constants/keyStorage";
import { UserRole } from "@/constants/userRole";

class UserRoleStorage {
  /**
   * Save the user role to local storage.
   * @param {string} role - The role to be stored.
   */
  static setUserRole(role: UserRole) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(keyStorage.USER_ROLE_KEY, role);
    }
  }

  /**
   * Get the user role from local storage.
   * @returns {string|null} - The stored user role or null if not found.
   */
  static getUserRole() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(keyStorage.USER_ROLE_KEY) || null;
    }
    return null; // Return null if not in the browser environment
  }

  /**
   * Remove the user role from local storage.
   */
  static removeUserRole() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(keyStorage.USER_ROLE_KEY);
    }
  }
}

export default UserRoleStorage;
