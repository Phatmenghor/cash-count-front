"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import FormMessage from "../../../components/ui/FormMessage";
import { LoginService } from "@/redux/service/loginService";
import { route } from "@/constants/routed";
import withAnimation from "@/configs/withAnimation";
import { UserRole } from "@/constants/userRole";

const LoginPage: React.FC = () => {
  // const [email, setEmail] = useState("phat.menghor");
  const [email, setEmail] = useState("sokrann.voem");
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

    if (hasError) return;

    setLoading(true);
    const response = await LoginService.loginUser({
      email: email,
      password: password,
    });
    if (response === UserRole.IT_ADMIN_USER || UserRole.OPERATION_ADMIN_USER) {
      router.push(`/${route.USER_MANAGEMENT}`);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (usernameError) {
      setUsernameError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError(null);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:scale-x-105">
        <h1 className="text-3xl font-bold text-center mb-1">Welcome Back!</h1>
        <h2 className="text-lg text-center text-gray-600 mb-6">
          Login to your account
        </h2>

        <form onSubmit={handleLogin} className="">
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
            className={`w-full py-1.5`}
            loading={loading}
            textLoading="Logging in..."
            scaleOnHover={false}
          >
            Login
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 ">
            Don&apos;t have an account?{" "}
            <a
              href={`/${route.REGISTER}?name=${encodeURIComponent("New User")}`}
              className="text-blue-500 hover:text-blue-700 transition-colors underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default withAnimation(LoginPage);
