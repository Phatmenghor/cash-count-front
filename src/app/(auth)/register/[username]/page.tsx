"use client"; // Ensure this component is a client component
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useParams to get the username from the URL
import { FiLoader } from "react-icons/fi";
import { route } from "@/utils/constants/routed";
import Input from "@/components/ui/Input";
import FormMessage from "@/components/ui/FormMessage"; // Import the FormMessage component
import Button from "@/components/ui/Button";

const Register: React.FC = () => {
  const params = useParams<{ username: string }>(); // Get the username from route parameters
  const username = params.username; // This will contain the username from the route

  // State variables for form inputs and errors
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState(""); // New email state
  const [idCard, setIdCard] = useState(""); // New ID card state
  const [loading, setLoading] = useState(false); // New loading state

  // Error state for each field
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string>(""); // Success message state
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
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value); // Set the value of the input
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" })); // Clear the specific error
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return; // Validate the form

    setLoading(true); // Set loading state to true
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
    setLoading(false); // Reset loading state
    setSuccessMessage("Registration successful!"); // Set success message
    router.push(`/${route.DEACTIVATE_USER}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as unknown as React.FormEvent); // Call handleSubmit on Enter key press
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-xl border border-gray-200">
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
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Department
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={department}
                onChange={handleInputChange(setDepartment, "department")} // Use the updated handler
                className="py-1"
              >
                <option value="">Select Department</option>
                <option value="hr">Human Resources</option>
                <option value="it">IT</option>
                <option value="finance">Finance</option>
              </select>
              {errors.department && (
                <FormMessage message={errors.department} type="error" />
              )}
            </div>

            {/* Position Select */}
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Position
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="position"
                name="position"
                value={position}
                onChange={handleInputChange(setPosition, "position")} // Use the updated handler
                className="py-1 "
              >
                <option value="">Select Position</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
                <option value="intern">Intern</option>
              </select>
              {errors.position && (
                <FormMessage message={errors.position} type="error" />
              )}
            </div>

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
                onChange={handleInputChange(setEmail, "email")} // Use the updated handler
                className="py-1"
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
                onChange={handleInputChange(setIdCard, "idCard")} // Use the updated handler
                className="py-1"
              />
              {errors.idCard && (
                <FormMessage message={errors.idCard} type="error" />
              )}
            </div>

            {/* Role Select */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Role
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={handleInputChange(setRole, "role")} // Use the updated handler
                className="py-1 "
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              {errors.role && (
                <FormMessage message={errors.role} type="error" />
              )}
            </div>
          </div>

          {successMessage && (
            <FormMessage message={successMessage} type="success" />
          )}

          <Button
            type="submit"
            className="w-full flex items-center justify-center py-1.5"
            disabled={loading}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
