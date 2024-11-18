import CryptoJS from "crypto-js";

// Encrypt ID using AES and return the encrypted string
export const encryptId = (id: string): string => {
  const encrypted = CryptoJS.AES.encrypt(
    id,
    process.env.NEXT_PUBLIC_SECRET_KEY || ""
  ).toString(); // Encrypt with AES
  const encoded = encodeURIComponent(encrypted); // URL-encode the encrypted string for safe transmission
  return encoded;
};

// Decrypt the encrypted and URL-encoded ID
export const decryptId = (encodedId: string): string => {
  const decoded = decodeURIComponent(encodedId); // URL-decode the encrypted string
  const bytes = CryptoJS.AES.decrypt(
    decoded,
    process.env.NEXT_PUBLIC_SECRET_KEY || ""
  ); // Decrypt with AES
  const decrypted = bytes.toString(CryptoJS.enc.Utf8); // Convert to UTF-8 string
  return decrypted;
};
