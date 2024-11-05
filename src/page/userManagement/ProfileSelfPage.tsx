/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { AllDataType } from "@/app/(auth)/register/type";
import Button from "@/components/custom/Button";
import CustomSelect from "@/components/custom/CustomSelect";
import Input from "@/components/custom/Input";
import FormMessage from "@/components/errorHandle/FormMessage";
import { BranchModel } from "@/redux/models/register/BranchModel";
import { DepartmentModel } from "@/redux/models/register/DepartmentModel";
import { PositionModel } from "@/redux/models/register/PositionModel";
import { RoleModel } from "@/redux/models/register/RoleModel";
import { UserProfile } from "@/redux/models/userManagement/UserProfileModel";
import { RegisterService } from "@/redux/service/registerService";
import UserManagementService from "@/redux/service/userManagementService";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface FormDataType {
  name: string;
  email: string;
  otp: string;
  department: DepartmentModel | null;
  position: PositionModel | null;
  role: RoleModel | null;
  branch: BranchModel | null;
}

const ProfileSelfPage = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const [moveToEdit, setMoveToEdit] = useState(false);
  const [verifyOTP, setVerifyOTP] = useState(false);
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoadingEdit, setLoadingEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    otp: "",
    name: "",
    department: null,
    position: null,
    role: null,
    branch: null,
  });
  const [allData, setAllData] = useState<AllDataType>({
    roles: null,
    branches: null,
    positions: null,
    departments: null,
  });

  const handleChange = (key: keyof typeof formData, option: unknown) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: option,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  async function onClickEdit() {
    setLoadingEdit(true);
    setMoveToEdit(true);
    const response = await RegisterService.fetchAllData();
    setAllData(response);

    if (userData) {
      setFormData({
        otp: "",
        email: userData.email,
        name: userData.name,
        branch: userData.branch,
        department: userData.department,
        position: userData.position,
        role: userData.role,
      });
    }
    setLoadingEdit(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || loading) return;
    setLoading(true);
    const response = await UserManagementService.updateUserById({
      id: userInfo!.id,
      info: {
        name: formData.name,
        branchId: formData.branch!.id,
        departmentId: formData.department!.id,
        positionId: formData.position!.id,
        roleId: formData.role!.id,
      },
    });
  };

  function verifyCodeOTP() {
    setVerifyOTP(true);
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const { department, position, branch, role, name } = formData;
    if (!department) newErrors.department = "Department is required.";
    if (!position) newErrors.position = "Position is required.";
    if (!branch) newErrors.branch = "Branch is required.";
    if (!role) newErrors.role = "Role is required.";
    if (!name) newErrors.usernameAD = "Your name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="px-6">
      <div className="flex justify-between">
        <h2 className="text-gray-700 text-3xl font-bold mb-4 hide">
          {moveToEdit ? "Edit User Profile" : "User Profile"}
        </h2>

        {!moveToEdit && (
          <Button
            onClick={onClickEdit}
            className="px-8 h-8"
            loading={isLoadingEdit}
            textLoading="Waiting ..."
          >
            Edit
          </Button>
        )}
      </div>

      {moveToEdit ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 ">
            {/* UserName */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                placeholder="Enter your name"
                onChange={handleInputChange}
                className="py-1.5"
              />
              {errors.name && (
                <FormMessage message={errors.name} type="error" />
              )}
            </div>

            {/* Department */}
            <CustomSelect
              id="department"
              value={formData.department}
              onChange={(option) => handleChange("department", option)}
              options={allData.departments}
              label="Department"
              getOptionLabel={(option) => option?.name}
              errorMessage={errors.branch}
              required
            />

            {/* Branch */}
            <CustomSelect
              id="branch"
              value={formData.branch}
              onChange={(option) => handleChange("branch", option)}
              options={allData.branches}
              label="Branch"
              getOptionLabel={(option) => option?.city}
              errorMessage={errors.branch}
              required
            />

            {/* Role */}
            <CustomSelect
              id="role"
              value={formData.role}
              onChange={(option) => handleChange("role", option)}
              options={allData.roles}
              label="Role"
              getOptionLabel={(option) => option?.name}
              errorMessage={errors.role}
              required
            />

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                placeholder="Enter your name"
                onChange={handleInputChange}
                className="py-1.5"
              />
              {errors.name && (
                <FormMessage message={errors.email} type="error" />
              )}
            </div>

            {/* Verify OTP */}

            {verifyOTP && (
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Verify OTP <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  type="tel"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  placeholder="Enter your otp"
                  onChange={handleInputChange}
                  className="py-1.5"
                />
                {errors.name && (
                  <FormMessage message={errors.name} type="error" />
                )}
              </div>
            )}
          </div>

          {formData.email != userData?.email ? (
            <div className="mt-8 justify-end flex space-x-4">
              <Button
                type="button"
                variant="cancel"
                onClick={() => setMoveToEdit(false)}
                className="py-1 px-4"
              >
                Cancel
              </Button>
              <Button
                className="py-1 px-4"
                type="button"
                loading={isLoadingEdit}
                textLoading="Updating ..."
                onClick={verifyCodeOTP}
              >
                Verify OTP
              </Button>
            </div>
          ) : (
            <div className="mt-8 justify-end flex space-x-4">
              <Button
                type="button"
                variant="cancel"
                onClick={() => setMoveToEdit(false)}
                className="py-1 px-4"
              >
                Cancel
              </Button>
              <Button
                className="py-1 px-4"
                type="button"
                loading={isLoadingEdit}
                textLoading="Updating ..."
                onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
          )}
        </form>
      ) : (
        // View Information
        <div>
          <div className="grid grid-cols-2 gap-4">
            {/* UserName */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userData?.name}
                className="py-1.5 w-full"
                disabled={true}
              />
            </div>

            {/* AD User */}
            <div>
              <label
                htmlFor="adUsername"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                AD Username<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userData?.username}
                className="py-1.5 w-full"
                disabled={true}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userData?.email}
                className="py-1.5"
                disabled={true}
              />
            </div>

            {/* Position */}
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Position<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userData?.position.name}
                className="py-1.5"
                disabled={true}
              />
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Department<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userData?.department.name}
                className="py-1.5"
                disabled={true}
              />
            </div>

            {/* Branch */}
            <div>
              <label
                htmlFor="branch"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Branch<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userData?.branch.mnemonic}
                className="py-1.5"
                disabled={true}
              />
            </div>

            {/* Mnemonic */}
            <div>
              <label
                htmlFor="mnemonic"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mnemonic<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userData?.branch.mnemonic}
                className="py-1.5"
                disabled={true}
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="roleName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userData?.role.name}
                className="py-1.5"
                disabled={true}
              />
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userData?.branch.city}
                className="py-1.5"
                disabled={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelfPage;
