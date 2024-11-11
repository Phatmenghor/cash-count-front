/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { AllDataType } from "@/app/(auth)/register/type";
import Button from "@/components/custom/Button";
import CustomSelect from "@/components/custom/CustomSelect";
import Input from "@/components/custom/Input";
import FormMessage from "@/components/errorHandle/FormMessage";
import { BranchModel } from "@/redux/models/register/BranchModel";
import { PositionModel } from "@/redux/models/register/PositionModel";
import { RoleModel } from "@/redux/models/register/RoleModel";
import { UserProfile } from "@/redux/models/userManagement/UserProfileModel";
import { RegisterService } from "@/redux/service/registerService";
import UserManagementService, {
  updateUserInfo,
} from "@/redux/service/userManagementService";
import { useRouter, useSearchParams } from "next/navigation";
import showToast from "@/components/toast/useToast";
import LoadingFullPage from "@/components/loading/LoadingFullPage";

interface FormDataType {
  name: string;
  position: PositionModel | null;
  role: RoleModel | null;
  branch: BranchModel | null;
}

const EditUserManagement = ({ params }: { params: { id: number } }) => {
  const idUser = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeTypeEdit = searchParams.get("mode") === "edit";
  const [moveToEdit, setMoveToEdit] = useState(false);
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    position: null,
    role: null,
    branch: null,
  });
  const [allData, setAllData] = useState<AllDataType>({
    roles: null,
    branches: null,
    positions: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await UserManagementService.getUserByID({
      id: idUser,
    });
    setFormData({
      name: response.name,
      branch: response.branch,
      position: response?.position,
      role: response.role,
    });
    if (modeTypeEdit) {
      const response = await RegisterService.fetchAllData();
      setAllData(response);
    }
    setUserInfo(response);
  }

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
    setLoading(true);
    setMoveToEdit(true);
    const response = await RegisterService.fetchAllData();
    setAllData(response);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || loading) return;
    setLoading(true);
    const profileData: updateUserInfo = {
      name: formData.name,
      branchId: formData.branch!.id,
      positionId: formData.position!.id,
      roleId: formData.role!.id,
    };
    const response = await UserManagementService.updateUserById(
      userInfo!.id,
      profileData
    );

    if (response) {
      showToast(
        "Your update has been successfully submitted. Please wait for admin approval.",
        "warning"
      );
      router.back();
    } else {
      showToast("Failed to update profile user. Please try again", "error");
    }
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const { position, branch, role, name } = formData;
    if (!position) newErrors.position = "Position is required.";
    if (!branch) newErrors.branch = "Branch is required.";
    if (!role) newErrors.role = "Role is required.";
    if (!name) newErrors.usernameAD = "Your name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function onCancel() {
    if (modeTypeEdit) {
      router.back();
      return;
    }
    setMoveToEdit(false);
  }

  return (
    <div className="px-6">
      {(modeTypeEdit || moveToEdit) && (
        <h2 data-aos="fade-right" className="text-gray-700 hide mb-4">
          Update User Information
        </h2>
      )}

      {!(modeTypeEdit || moveToEdit) && (
        <h2 data-aos="fade-right" className="text-gray-700 hide mb-4">
          User Information
        </h2>
      )}

      {(modeTypeEdit || moveToEdit) && (
        <form data-aos="fade-up" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 ">
            {/* UserName */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-gray-700 mb-1"
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

            {/* Branch */}
            <CustomSelect
              id="branch"
              value={formData.branch}
              onChange={(option) => handleChange("branch", option)}
              options={allData.branches}
              label="Branch"
              getOptionLabel={(option) => option?.mnemonic}
              errorMessage={errors.branch}
              required
              buttonClassName="py-1.5"
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
              buttonClassName="py-1.5"
            />
          </div>

          <div className="mt-8 justify-end flex space-x-4">
            <Button
              type="button"
              variant="cancel"
              onClick={onCancel}
              className="py-1 px-4"
            >
              Cancel
            </Button>
            <Button className="py-1 px-4" type="button" onClick={handleSubmit}>
              Update
            </Button>
          </div>
        </form>
      )}

      {!(modeTypeEdit || moveToEdit) && (
        <div data-aos="fade-up">
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
                value={userInfo?.name}
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
                value={userInfo?.username}
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
                value={userInfo?.email}
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
                value={userInfo?.position.name}
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
                value={userInfo?.department.name}
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
                value={userInfo?.branch.mnemonic}
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
                value={userInfo?.role.name}
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
                value={userInfo?.branch.mnemonic}
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
                value={userInfo?.branch.city}
                className="py-1.5"
                disabled={true}
              />
            </div>
          </div>
          <div className="mt-8 justify-end flex space-x-2">
            <Button
              variant="cancel"
              onClick={() => router.back()}
              className="py-1"
            >
              Cancel
            </Button>
            <Button onClick={onClickEdit} className="py-1">
              Want Update ?
            </Button>
          </div>
        </div>
      )}

      <LoadingFullPage loading={loading} />
    </div>
  );
};

export default EditUserManagement;
