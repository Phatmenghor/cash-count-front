"use client"; // Ensure this component is a client component
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useParams to get the username from the URL
import Button from "../../../../components/ui/Button"; // Adjust the import path as necessary
import { FiLoader } from "react-icons/fi";
import { route } from "@/utils/constants/routed";
import Input from "@/components/ui/Input";

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
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
    router.push(`/${route.DEACTIVATE_USER}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Register
        </h1>
        {username && (
          <h2 className="text-lg mb-4 text-center text-gray-600">
            Welcome, {decodeURIComponent(username)}!
          </h2>
        )}

        <form className="w-full" onSubmit={handleSubmit}>
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
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="py-1"
              >
                <option value="">Select Department</option>
                <option value="hr">Human Resources</option>
                <option value="it">IT</option>
                <option value="finance">Finance</option>
              </select>
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
                onChange={(e) => setPosition(e.target.value)}
                required
                className="py-1 "
              >
                <option value="">Select Position</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
                <option value="intern">Intern</option>
              </select>
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
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-1"
              />
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
                onChange={(e) => setIdCard(e.target.value)}
                required
                className="py-1"
              />
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
                onChange={(e) => setRole(e.target.value)}
                required
                className="py-1 "
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center py-1"
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
