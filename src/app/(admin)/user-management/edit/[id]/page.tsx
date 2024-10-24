"use client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import withAuth from "@/configs/withAuth";
import { User, usersData } from "@/constants/data";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";


const EditUser = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    router.back();
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
                ID <span className="text-red-500 ml-1">*</span>
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
                Full Name <span className="text-red-500 ml-1">*</span>
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
                Staff ID <span className="text-red-500 ml-1">*</span>
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
                Username <span className="text-red-500 ml-1">*</span>
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
                Department <span className="text-red-500 ml-1">*</span>
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
                Position <span className="text-red-500 ml-1">*</span>
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
                Role <span className="text-red-500 ml-1">*</span>
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
            <Button variant="cancel" className="py-1.5">
              Cancel
            </Button>
            <Button type="submit" className="py-1.5">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(EditUser);
