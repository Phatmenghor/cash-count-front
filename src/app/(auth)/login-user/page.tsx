"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Button from "../../../components/custom/Button";
import Input from "../../../components/custom/Input";
import FormMessage from "../../../components/errorHandle/FormMessage";
import { LoginService } from "@/redux/service/loginService";
import { route } from "@/constants/routed";
import { UserRoleEnum } from "@/constants/userRole";
import showToast from "@/components/toast/useToast";

const LoginPage: React.FC = () => {
  const [adUsername, setAdUsername] = useState("sokrann.voem");
  const [password, setPassword] = useState("123456789");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(null);
    setPasswordError(null);

    let hasError = false;

    if (adUsername.trim().length === 0) {
      setUsernameError("AD Username must contain at least 1 character");
      hasError = true;
    }

    if (password.trim().length === 0) {
      setPasswordError("Password must contain at least 1 character");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    const response = await LoginService.loginUser({
      email: adUsername,
      password: password,
    });

    if (response.success) {
      if (
        response.data == UserRoleEnum.IT_ADMIN_USER ||
        response.data == UserRoleEnum.OPERATION_ADMIN_USER
      ) {
        router.push(`/${route.USER_MANAGEMENT}`);
      } else {
        router.push("/cash-management");
      }
      return;
    } else {
      if (response.status == 404) {
        router.push(
          `/${route.REGISTER}?name=${encodeURIComponent(adUsername)}`
        );
      }
      showToast(response.data, "error");
    }
    setLoading(false);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdUsername(e.target.value);
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

  function ontoRegister() {
    router.push(`/${route.REGISTER}?name=${encodeURIComponent("New User")}`);
  }

  return (
    <div
      data-aos="fade-up"
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
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
              AD username
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              disabled={loading}
              type="text"
              id="email"
              value={adUsername}
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
                disabled={loading}
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

        <div className="mt-4 flex justify-center">
          <p className="text-sm text-gray-600 flex">
            Don&apos;t have an account?
            <div
              onClick={ontoRegister}
              className="text-blue-500 ml-1 cursor-pointer hover:text-blue-700 transition-colors underline"
            >
              Register
            </div>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
