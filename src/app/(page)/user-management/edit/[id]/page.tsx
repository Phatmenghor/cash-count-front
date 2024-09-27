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

  useEffect(() => {
    const foundUser = usersData.find((user) => user.id === Number(id));
    setUser(foundUser || null);
    setLoading(false);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${user?.fullName} has been updated!`);
    router.push("/manage-users");
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <div className="bg-gray-100 rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div>
              <label
                className="block mb-1 font-semibold text-gray-700"
                htmlFor="id"
              >
                ID
              </label>
              <Input type="text" name="id" value={user.id} readOnly />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
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
                />
              </div>
              <div className="flex-1">
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
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
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
                />
              </div>
              <div className="flex-1">
                <label
                  className="block mb-1 font-semibold text-gray-700"
                  htmlFor="department"
                >
                  Department
                </label>
                <Input
                  type="text"
                  name="department"
                  value={user.department}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  className="block mb-1 font-semibold text-gray-700"
                  htmlFor="position"
                >
                  Position
                </label>
                <Input
                  type="text"
                  name="position"
                  value={user.position}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex-1">
                <label
                  className="block mb-1 font-semibold text-gray-700"
                  htmlFor="role"
                >
                  Role
                </label>
                <Input
                  type="text"
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600 transition p-2 rounded-md"
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
