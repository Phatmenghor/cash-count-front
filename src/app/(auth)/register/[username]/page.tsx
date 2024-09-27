"use client"; // Ensure this component is a client component
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useParams to get the username from the URL
import Button from "../../../../components/ui/Button"; // Adjust the import path as necessary
import { FiLoader } from "react-icons/fi";
import { route } from "@/utils/constants/routed";

const Register: React.FC = () => {
  const params = useParams<{ username: string }>(); // Get the username from route parameters
  const username = params.username; // This will contain the username from the route

  // State variables for form inputs and errors
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
    router.push(`/${route.UserManagement}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Register
        </h1>
        {username && (
          <h2 className="text-lg mb-4 text-center text-gray-600">
            Welcome, {decodeURIComponent(username)}!
          </h2>
        )}

        <form className="w-full" onSubmit={handleSubmit}>
          {/* Department Select */}
          <div className="mb-4">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="px-2 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 ease-in-out"
            >
              <option value="">Select Department</option>
              <option value="hr">Human Resources</option>
              <option value="it">IT</option>
              <option value="finance">Finance</option>
            </select>
          </div>

          {/* Position Select */}
          <div className="mb-4">
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="px-2 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 ease-in-out"
            >
              <option value="">Select Position</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="intern">Intern</option>
            </select>
          </div>

          {/* Role Select */}
          <div className="mb-4">
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
              className="px-2 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 ease-in-out"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
