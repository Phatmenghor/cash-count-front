"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { toast, ToastContainer } from "react-toastify";
import { User } from "../../page";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/ui/Input"; // Import your custom Input component

const EditUser = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Simulated user data
  const usersData: User[] = [
    {
      id: 1,
      fullName: "John Doe",
      staffId: "S123",
      username: "johndoe",
      department: "HR",
      position: "Manager",
      role: "Admin",
      status: true,
    },
    {
      id: 2,
      fullName: "Jane Smith",
      staffId: "S124",
      username: "janesmith",
      department: "IT",
      position: "Developer",
      role: "User",
      status: false,
    },
  ];

  const departments = ["HR", "IT", "Finance", "Sales"];
  const positions = ["Manager", "Developer", "Analyst", "Intern"];
  const roles = ["Admin", "User", "Guest"];

  useEffect(() => {
    const foundUser = usersData.find((user) => user.id === Number(id));
    setUser(foundUser || null);
    setLoading(false);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${user?.fullName} has been updated!`);
    router.push("/manage-users");
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit User</h1>
      <div className="rounded-lg bg-white shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block mb-1 font-semibold text-gray-700"
                htmlFor="id"
              >
                ID
              </label>
              <Input
                type="text"
                name="id"
                value={user.id}
                readOnly
                className="bg-gray-100 cursor-not-allowed py-1"
              />
            </div>
            <div>
              <label
                className="block mb-1 font-semibold text-gray-700"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <Input
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className="py-1"
              />
            </div>
            <div>
              <label
                className="block mb-1 font-semibold text-gray-700"
                htmlFor="staffId"
              >
                Staff ID
              </label>
              <Input
                type="text"
                name="staffId"
                value={user.staffId}
                onChange={handleChange}
                required
                placeholder="Enter staff ID"
                className="py-1"
              />
            </div>
            <div>
              <label
                className="block mb-1 font-semibold text-gray-700"
                htmlFor="username"
              >
                Username
              </label>
              <Input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
                className="py-1"
              />
            </div>
            <div>
              <label
                className="block mb-1 font-semibold text-gray-700"
                htmlFor="department"
              >
                Department
              </label>
              <select
                name="department"
                value={user.department}
                onChange={handleChange}
                required
                className="py-0.5 px-2"
              >
                <option value="" disabled>
                  Select department
                </option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block mb-1 font-semibold text-gray-700"
                htmlFor="position"
              >
                Position
              </label>
              <select
                name="position"
                value={user.position}
                onChange={handleChange}
                required
                className="py-0.5 px-2"
              >
                <option value="" disabled>
                  Select position
                </option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block mb-1 font-semibold text-gray-700"
                htmlFor="role"
              >
                Role
              </label>
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                required
                className="py-0.5 px-2"
              >
                <option value="" disabled>
                  Select role
                </option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <Button
              onClick={() => {
                router.back();
              }}
              className="bg-red-500 hover:bg-red-600 text-white rounded py-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded py-1"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
      {/* Toast message */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
};

export default EditUser;
