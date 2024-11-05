"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/custom/Button";
import Input from "@/components/custom/Input";
import { UserProfile } from "@/redux/models/userManagement/UserProfileModel";
import UserManagementService from "@/redux/service/userManagementService";

const UserCompareRequest = ({ params }: { params: { id: number } }) => {
  const idUser = params.id;
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await UserManagementService.getUserByID({ id: 33 });
    setUserInfo(response);
  }

  return (
    <div className="px-6">
      <h2
        data-aos="fade-down"
        className="text-gray-700 text-3xl font-bold mb-4"
      >
        Compare Information Request
      </h2>

      <div>
        {/* Name Field */}
        <div className="flex w-full flex-1 mb-4">
          <div className="flex-1" data-aos="fade-right">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1 "
            >
              Name Before<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userInfo?.name}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          <h2 className="flex items-end justify-center text-lg px-4">
            {"==>"}
          </h2>

          {/* Name Field */}
          <div className="flex-1" data-aos="fade-left">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name After<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userInfo?.name}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="flex w-full flex-1 mb-4">
          <div className="flex-1" data-aos="fade-right">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Before<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userInfo?.email}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          <h2 className="flex items-end justify-center text-lg px-4">
            {"==>"}
          </h2>

          {/* Email Field */}
          <div className="flex-1" data-aos="fade-left">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email After<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userInfo?.email}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>
        </div>

        {/* Department before Field */}
        <div className="flex w-full flex-1 mb-4">
          <div className="flex-1" data-aos="fade-right">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department Before<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userInfo?.department.name}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          <h2 className="flex items-end justify-center text-lg px-4">
            {"==>"}
          </h2>

          {/* Department after Field */}
          <div className="flex-1" data-aos="fade-left">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department After<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userInfo?.department.name}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>
        </div>

        {/* Branch before Field */}
        <div className="flex w-full flex-1 mb-4">
          <div className="flex-1" data-aos="fade-right">
            <label
              htmlFor="branch"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Branch Before<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userInfo?.branch.mnemonic}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          <h2 className="flex items-end justify-center text-lg px-4">
            {"==>"}
          </h2>

          {/* Branch after Field */}
          <div className="flex-1" data-aos="fade-left">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Branch After<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userInfo?.branch.mnemonic}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>
        </div>

        {/* Role before Field */}
        <div className="flex w-full flex-1 mb-4">
          <div className="flex-1" data-aos="fade-right">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role Before<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userInfo?.role.name}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          <h2 className="flex items-end justify-center text-lg px-4">
            {"==>"}
          </h2>

          {/* Role after Field */}
          <div className="flex-1" data-aos="fade-left">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role After<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userInfo?.role.name}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>
        </div>

        {/* Status before Field */}
        <div className="flex w-full flex-1 mb-4">
          <div className="flex-1" data-aos="fade-right">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status User Before<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userInfo?.role.name}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          <h2 className="flex items-end justify-center text-lg px-4">
            {"==>"}
          </h2>

          {/* Role after Field */}
          <div className="flex-1" data-aos="fade-left">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status User After<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userInfo?.role.name}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 justify-end flex space-x-2">
        <Button className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
          Reject
        </Button>
        <Button
          className="py-1 px-8"
          loading={loading}
          textLoading="Waiting ..."
        >
          Approve
        </Button>
      </div>
    </div>
  );
};

export default UserCompareRequest;
