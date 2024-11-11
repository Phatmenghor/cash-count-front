// utils/UserStorage.js

import { keyStorage } from "@/constants/keyStorage"; // Ensure the keyStorage constants are created

class UserStorage {
  /**
   * Save the username to local storage.
   * @param {string} username - The username to be stored.
   */
  static setUsername(username: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(keyStorage.USERNAME_KEY, username);
    }
  }

  /**
   * Get the username from local storage.
   * @returns {string|null} - The stored username or null if not found.
   */
  static getUsername() {
    if (typeof window !== "undefined") {
      return localStorage.getItem(keyStorage.USERNAME_KEY) || null;
    }
    return null; // Return null if not in the browser environment
  }

  /**
   * Remove the username from local storage.
   */
  static removeUsername() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(keyStorage.USERNAME_KEY);
    }
  }

  /**
   * Save the password to local storage.
   * @param {string} password - The password to be stored.
   */
  static setPassword(password: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(keyStorage.PASSWORD_KEY, password);
    }
  }

  /**
   * Get the password from local storage.
   * @returns {string|null} - The stored password or null if not found.
   */
  static getPassword() {
    if (typeof window !== "undefined") {
      return localStorage.getItem(keyStorage.PASSWORD_KEY) || null;
    }
    return null; // Return null if not in the browser environment
  }

  /**
   * Remove the password from local storage.
   */
  static removePassword() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(keyStorage.PASSWORD_KEY);
    }
  }
}

export default UserStorage;
