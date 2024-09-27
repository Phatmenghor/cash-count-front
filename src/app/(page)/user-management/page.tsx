// src/app/manage-users/page.tsx
"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import ConfirmationDialog from "@/components/ui/Modal";
import { toast } from "react-toastify";
import { Switch } from "@/components/ui/switch";

interface User {
  id: number;
  fullName: string;
  staffId: string;
  username: string;
  department: string;
  position: string;
  role: string;
  status: boolean; // Changed to boolean for the switch
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      fullName: "John Doe",
      staffId: "S123",
      username: "johndoe",
      department: "HR",
      position: "Manager",
      role: "Admin",
      status: true, // true for Active
    },
    {
      id: 2,
      fullName: "Jane Smith",
      staffId: "S124",
      username: "janesmith",
      department: "IT",
      position: "Developer",
      role: "User",
      status: false, // false for Inactive
    },
  ]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      toast.success(`${userToDelete.fullName} has been deleted!`);
      setUserToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const toggleUserStatus = (user: User) => {
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, status: !u.status } : u
    );
    setUsers(updatedUsers);
    const statusMessage = user.status ? "deactivated" : "activated";
    toast.success(`${user.fullName} has been ${statusMessage}!`);
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Search and Add User Section */}
      <div className="flex items-center mb-4 justify-between">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 flex-grow mr-4 max-w-md"
        />
        <Button
          onClick={() => {
            // Implement add user functionality here
            toast.info("Add User feature coming soon!");
          }}
          className="bg-blue-500 text-white"
        >
          Add User
        </Button>
      </div>

      {/* User List Table */}
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
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.fullName}</td>
              <td className="border px-4 py-2">{user.staffId}</td>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.department}</td>
              <td className="border px-4 py-2">{user.position}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4  py-2">
                <div className="flex-1 flex items-center bg-red-700">
                  <Switch
                    checked={user.status}
                    onChange={() => toggleUserStatus(user)}
                  />
                  <span
                    className={`ml-2 px-2   rounded-full text-xs ${
                      user.status ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {user.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </td>
              <td className="border px-4 py-2">
                <Button className="text-blue-500 mr-2">Edit</Button>
                <Button
                  className="text-red-500"
                  onClick={() => handleDeleteUser(user)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete ${userToDelete?.fullName}?`}
      />
    </div>
  );
};

export default UserManagement;
