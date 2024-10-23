"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useParams to get the username from the URL
import { FiLoader } from "react-icons/fi";
import { route } from "@/constants/routed";
import Input from "@/components/ui/Input";
import FormMessage from "@/components/ui/FormMessage"; // Import the FormMessage component
import Button from "@/components/ui/Button";
import withAnimation from "@/configs/withAnimation";
import CustomSelect from "@/components/ui/CustomSelect";

const Register: React.FC = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;

  // State variables for form inputs and errors
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [idCard, setIdCard] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!department) newErrors.department = "Department is required.";
    if (!position) newErrors.position = "Position is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!idCard) newErrors.idCard = "ID Card is required.";
    if (!role) newErrors.role = "Role is required.";

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = "Invalid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false); // Reset loading state
    setSuccessMessage("Registration successful!");
    router.push(`/${route.DEACTIVATE_USER}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const departmentOptions = [
    { value: "hr", label: "Human Resources" },
    { value: "it", label: "IT" },
    { value: "finance", label: "Finance" },
  ];

  const positionOptions = [
    { value: "manager", label: "Manager" },
    { value: "staff", label: "Staff" },
    { value: "intern", label: "Intern" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-xl border border-gray-200 transition-transform duration-300 hover:scale-x-105">
        <h1 className="text-3xl font-bold mb-1 text-center text-gray-800">
          Register
        </h1>
        {username && (
          <h2 className="text-lg mb-4 text-center text-gray-600">
            Welcome, {decodeURIComponent(username)}!
          </h2>
        )}

        <form
          className="w-full"
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
        >
          {/* Container for select fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {/* Department Select */}
            <CustomSelect
              id="department"
              name="department"
              value={department}
              onChange={handleInputChange(setDepartment, "department")}
              options={departmentOptions}
              label="Department"
              errorMessage={errors.department}
              required={true}
            />

            {/* Position Select */}
            <CustomSelect
              id="position"
              name="position"
              value={position}
              onChange={handleInputChange(setPosition, "position")}
              options={positionOptions}
              label="Position"
              errorMessage={errors.position}
              required={true}
            />

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                placeholder="Enter your email"
                onChange={handleInputChange(setEmail, "email")}
                className="py-1.5"
              />
              {errors.email && (
                <FormMessage message={errors.email} type="error" />
              )}
            </div>

            {/* ID Card Input */}
            <div>
              <label
                htmlFor="idCard"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ID Card
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="text"
                id="idCard"
                value={idCard}
                placeholder="Enter your Id Card"
                onChange={handleInputChange(setIdCard, "idCard")}
                className="py-1.5"
              />
              {errors.idCard && (
                <FormMessage message={errors.idCard} type="error" />
              )}
            </div>

            {/* Role Select */}
            <CustomSelect
              id="role"
              name="role"
              value={role}
              onChange={handleInputChange(setRole, "role")}
              options={[
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
              ]}
              label="Role"
              errorMessage={errors.role}
              required={true}
            />
          </div>

          {successMessage && (
            <FormMessage message={successMessage} type="success" />
          )}

          <Button
            type="submit"
            className="w-full py-1 hover:scale-x-100"
            disabled={loading}
            textLoading="Register ..."
            scaleOnHover={false}
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default withAnimation(Register);
