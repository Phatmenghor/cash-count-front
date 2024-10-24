// tokenUtils.ts

import { keyStorage } from "../../constants/keyStorage";

class TokenStorage {
  private static calculateExpiryTime(): string {
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
  }

  public static setToken(token: string): void {
    const expiryTime = this.calculateExpiryTime();
    const tokenData = JSON.stringify({ token, expiry: expiryTime });
    localStorage.setItem(keyStorage.TOKEN_KEY, tokenData);
  }

  public static getToken(): string | null {
    const tokenData = localStorage.getItem(keyStorage.TOKEN_KEY);
    if (tokenData) {
      const { token, expiry } = JSON.parse(tokenData);
      if (this.isTokenExpired(expiry)) {
        this.removeToken(); // Remove expired token
        return null;
      }
      return token;
    }
    return null;
  }

  public static removeToken(): void {
    localStorage.removeItem(keyStorage.TOKEN_KEY);
  }

  private static isTokenExpired(expiryTime: string): boolean {
    const currentTime = Date.now();
    return currentTime > new Date(expiryTime).getTime();
  }
}

export default TokenStorage;
