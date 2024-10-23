import keyEnv from "@/constants/env";
import { keyStorage } from "@/constants/keyStorage";
import axios from "axios";
import TokenUtils from "../localStorage/token";

// Base Axios instance (no token required)
const axiosNoAuth = axios.create({
  baseURL: keyEnv.BASE_URL,
  timeout: 400000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios instance with token (authentication required)
const axiosWithAuth = axios.create({
  baseURL: keyEnv.BASE_URL,
  timeout: 400000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adding an interceptor to include the token for requests that require authentication
axiosWithAuth.interceptors.request.use(
  (config) => {
    const token = TokenUtils.getToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("## No token found");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axiosWithAuth.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     (error) => {
// const { response } = error;
// if (response) {
//   switch (response.status) {
//     case 401:
//       console.error('Unauthorized, logging out...');
//       // Perform logout logic here
//       break;
//     case 403:
//       console.error('Forbidden: You do not have permission to access this resource.');
//       break;
//     case 404:
//       console.error('Resource not found: ', response.config.url);
//       break;
//     // Handle other status codes as needed
//     default:
//       console.error('An unexpected error occurred: ', response.data);
//       break;
//   }
// } else {
//   console.error('Network error: ', error.message);
// }
//       return Promise.reject(error);
//     }
//   );

export { axiosNoAuth, axiosWithAuth };
