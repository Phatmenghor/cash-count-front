// src/app/manage-users/page.tsx
"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import ConfirmationDialog from "@/components/modal/ConfirmationDialog";
import { toast } from "react-toastify";
import { Switch } from "@/components/ui/Switch";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { route } from "@/utils/constants/routed";
import Input from "@/components/ui/Input";

export interface User {
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
  const router = useRouter();

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
    toast.success(`${user.fullName} has been ${statusMessage}!`, {
      autoClose: 900, // Set duration here
    });
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Search and Add Record Section */}
      <div className="flex items-center mb-4 justify-between">
        <Input
          type="text"
          placeholder="Search by SR Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-4 py-1"
        />
        <Button
          onClick={() => {
            // Implement add record functionality here
            toast.info("Add Record feature coming soon!");
            // Optionally redirect to the add record page
            // router.push(`/${route.AddRecord}`);
          }}
          className="text-white flex items-center py-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
        >
          <FiPlus size={18} />
          <span className="ml-1">Add Record</span>
        </Button>
      </div>

      {/* User List Table */}
      <div className="overflow-auto">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Staff ID</th>
              <th>Username</th>
              <th>Department</th>
              <th>Position</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.staffId}</td>
                <td>{user.username}</td>
                <td>{user.department}</td>
                <td>{user.position}</td>
                <td>{user.role}</td>
                <td>
                  <div className="flex-1 flex items-center ">
                    <Switch
                      checked={user.status}
                      onChange={() => toggleUserStatus(user)}
                    />
                    <span
                      className={`ml-2 px-2 py-[1.5px]  rounded-full text-[10px] ${
                        user.status ? "bg-green-500" : "bg-red-500"
                      } text-white`}
                    >
                      {user.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>
                <td className=" flex items-center">
                  <button
                    onClick={() => {
                      // Implement edit functionality here
                      router.push(
                        `/${route.USER_MANAGEMENT}/${route.EDIT}/${user.id}`
                      );
                    }}
                    className="bg-blue-500 text-white px-2 p-1 rounded hover:bg-blue-600 mr-2 flex items-center"
                  >
                    <FiEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="bg-red-500 text-white px-2 p-1 rounded hover:bg-red-600 flex items-center"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Confirm Delete!" // Title added
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete ${userToDelete?.fullName}?`}
      />
    </div>
  );
};

export default UserManagement;
