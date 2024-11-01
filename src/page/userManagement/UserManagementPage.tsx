// components/UserManagement.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { toast } from "react-toastify";
import ModalConfirmation from "../../components/modal/ModalConfirmation";
import { User } from "@/constants/data";
import Input from "../../components/custom/Input";
import Button from "../../components/custom/Button";
import CenteredLoading from "../../components/loading/CenteredLoading";
import EmptyState from "../../components/emthyData/EmptyState";
import { Switch } from "../../components/custom/Switch";
import Pagination from "../../components/pagination/Pagination";

const UserManagement = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUsers, setCurrentUsers] = useState<User[]>(users);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    setLoading(true);
    // Fetch users from an API or data source
    // setUsers(fetchedUsers);
    // Update total pages based on fetched users
    // setTotalPages(Math.ceil(fetchedUsers.length / usersPerPage));
    setLoading(false);
  }, []);

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

  const handleAddUser = () => {
    toast.info("Add Record feature coming soon!");
    // Optionally redirect to the add record page
    // router.push('/add'); // Update with your add user route
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Search and Add Record Section */}
      <div className="flex items-center mb-4 justify-between">
        <Input
          type="text"
          placeholder="Search by Full Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-4 py-1"
        />
        <Button
          onClick={handleAddUser}
          className="text-white flex items-center py-1"
        >
          <FiPlus size={18} />
          <span className="ml-1">Add Record</span>
        </Button>
      </div>

      {/* User List Table */}
      <div className="overflow-auto min-h-[50vh] flex-1">
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
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  <CenteredLoading />
                </td>
              </tr>
            ) : currentUsers.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <EmptyState
                    message="No user available."
                    icon={<AiOutlineUser size={64} />}
                  />
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.staffId}</td>
                  <td>{user.username}</td>
                  <td>{user.department}</td>
                  <td>{user.position}</td>
                  <td>{user.role}</td>
                  <td>
                    <div className="flex-1 flex items-center">
                      <Switch
                        checked={user.status}
                        onChange={() => toggleUserStatus(user)}
                      />
                      <span
                        className={`ml-2 px-2 rounded-full text-[10px] ${
                          user.status ? "bg-green-500" : "bg-red-500"
                        } text-white`}
                      >
                        {user.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="flex items-center">
                    <button
                      onClick={() =>
                        router.push(`/user-management/edit/${user.id}`)
                      }
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      {!loading && (
        <div className="flex justify-center mt-4">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Confirmation Dialog */}
      <ModalConfirmation
        isOpen={isDeleteDialogOpen}
        title="Confirm Delete!"
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete ${userToDelete?.fullName}?`}
      />
    </div>
  );
};

export default UserManagement;
