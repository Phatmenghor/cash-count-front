import { keyStorage } from "@/constants/keyStorage";

// utils/tokenUtils.ts
interface TokenData {
  token: string;
  expiry: string;
}

class TokenStorage {
  public static setToken(token: string): void {
    const expiryTime = this.calculateExpiryTime();
    const tokenData: TokenData = { token, expiry: expiryTime };
    if (typeof window !== "undefined") {
      localStorage.setItem(keyStorage.TOKEN_KEY, JSON.stringify(tokenData));
    }
  }

  public static getToken(): string | null {
    if (typeof window !== "undefined") {
      const tokenData = localStorage.getItem(keyStorage.TOKEN_KEY);
      if (tokenData) {
        const { token, expiry }: TokenData = JSON.parse(tokenData);
        if (this.isTokenExpired(expiry)) {
          this.removeToken();
          return null;
        }
        return token;
      }
    }
    return null;
  }

  public static removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(keyStorage.TOKEN_KEY);
    }
  }

  private static isTokenExpired(expiryTime: string): boolean {
    const currentTime = Date.now();
    return currentTime > new Date(expiryTime).getTime();
  }

  private static calculateExpiryTime(): string {
    const now = new Date();
    const expiry = new Date();
    expiry.setHours(17, 30, 0, 0); // Set expiry time to 5:30 PM today

    if (now > expiry) {
      expiry.setDate(expiry.getDate() + 1);
    }

    return expiry.toISOString();
  }
}

export default TokenStorage;
