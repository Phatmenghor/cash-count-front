"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import loading icon from react-icons
import Button from "../../../components/ui/Button"; // Adjust the import path as necessary
import Input from "../../../components/ui/Input"; // Adjust the import path as necessary
import FormMessage from "../../../components/ui/FormMessage"; // Import the FormMessage component
import { LoginService } from "@/redux/actions/loginService";
import TokenUtils from "@/utils/localStorage/token";
import { route } from "@/constants/routed";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("sokrann@gmail.com");
  const [password, setPassword] = useState("123456789");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // New loading state
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error messages
    setUsernameError(null);
    setPasswordError(null);

    let hasError = false;

    if (email.trim().length === 0) {
      setUsernameError("Username must contain at least 1 character");
      hasError = true;
    }

    if (password.trim().length === 0) {
      setPasswordError("Password must contain at least 1 character");
      hasError = true;
    }

    if (hasError) return; // Stop if there are validation errors

    setLoading(true); // Set loading state to true
    const response = await LoginService.loginUser({
      email: email,
      password: password,
    });
    if (response) {
      router.push(`/${route.CASH_RECORDS}`);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (usernameError) {
      setUsernameError(null); // Clear error message if user starts typing
    }
  };

  console.log("### haha", TokenUtils.getToken());

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError(null); // Clear error message if user starts typing
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggle the visibility state
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin(e as unknown as React.FormEvent); // Call handleLogin on Enter key press
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-1">Welcome Back!</h1>
        <h2 className="text-lg text-center text-gray-600 mb-6">
          Login to your account
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Email
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              type="text"
              id="email"
              value={email}
              onChange={handleUsernameChange} // Use new handler
              placeholder="Enter your email"
              className="mt-1 w-full py-2 px-4"
              onKeyDown={handleKeyPress}
            />
            {usernameError && (
              <FormMessage message={usernameError} type="error" />
            )}
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <Input
                type={passwordVisible ? "text" : "password"} // Toggle input type between text and password
                id="password"
                value={password}
                onChange={handlePasswordChange} // Use new handler
                placeholder="Enter your password"
                className="mt-1 w-full py-2 px-4"
                autoComplete="new-password"
                onKeyDown={handleKeyPress}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 z-10 pr-3 flex items-center text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {passwordError && (
              <FormMessage message={passwordError} type="error" />
            )}
          </div>

          <Button
            type="submit"
            className={`w-full flex items-center justify-center py-1.5`}
            loading={loading}
            textLoading="Logging in..."
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
