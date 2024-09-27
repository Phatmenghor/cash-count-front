"use client";
// src/app/manage-users/page.tsx
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import React, { useState } from "react";

interface User {
  id: number;
  fullName: string;
  staffId: string;
  username: string;
  department: string;
  position: string;
  role: string;
  status: string;
}

const UserManagement = () => {
  // Mock user data
  const [users] = useState<User[]>([
    {
      id: 1,
      fullName: "John Doe",
      staffId: "S123",
      username: "johndoe",
      department: "HR",
      position: "Manager",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      staffId: "S124",
      username: "janesmith",
      department: "IT",
      position: "Developer",
      role: "User",
      status: "Inactive",
    },
    {
      id: 3,
      fullName: "Mike Johnson",
      staffId: "S125",
      username: "mikej",
      department: "Finance",
      position: "Accountant",
      role: "Admin",
      status: "Active",
    },
    {
      id: 4,
      fullName: "Emily Brown",
      staffId: "S126",
      username: "emilyb",
      department: "IT",
      position: "Developer",
      role: "User",
      status: "Active",
    },
    // Add more user data as needed
  ]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Filter users by search term
  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        {/* Search input */}
        <Input
          type="text"
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2"
        />
        <Button
          onClick={() => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
          }}
          className="bg-blue-500 text-white"
        >
          Add New User
        </Button>
      </div>

      {/* User Table */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Full Name</th>
            <th className="py-2 px-4">Staff ID</th>
            <th className="py-2 px-4">Username</th>
            <th className="py-2 px-4">Department</th>
            <th className="py-2 px-4">Position</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.fullName}</td>
              <td className="border px-4 py-2">{user.staffId}</td>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.department}</td>
              <td className="border px-4 py-2">{user.position}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    user.status === "Active" ? "bg-green-500" : "bg-red-500"
                  } text-white`}
                >
                  {user.status}
                </span>
              </td>
              <td className="border px-4 py-2">
                <button className="text-blue-500 mr-2">Edit</button>
                <button className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-200 px-4 py-2 rounded"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-gray-200 px-4 py-2 rounded"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
