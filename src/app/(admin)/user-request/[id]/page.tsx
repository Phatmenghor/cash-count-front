"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/custom/Button";
import Input from "@/components/custom/Input";
import { UserProfile } from "@/redux/models/userManagement/UserProfileModel";
import UserManagementService from "@/redux/service/userManagementService";
import ModalConfirmation from "@/components/modal/ModalConfirmation";
import showToast from "@/components/toast/useToast";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import withAuthWrapper from "@/utils/middleWare/withAuthWrapper";
import { UserRoleEnum } from "@/constants/userRole";

const UserCompareRequest = ({ params }: { params: { id: number } }) => {
  const idUser = params.id;
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [userRequest, setUserRequest] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReject, setModalReject] = useState(false);
  const router = useRouter();
  const typeView = userRequest?.requestType != "Create-Info";

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const responseResquest = await UserManagementService.getUserRequestByID({
      id: idUser,
    });

    if (
      responseResquest.success &&
      responseResquest.data.requestType != "Create-Info"
    ) {
      const response = await UserManagementService.getUserByID({
        id: responseResquest.data.userId,
      });
      setUserInfo(response);
    }
    setUserRequest(responseResquest.data);
  }

  async function handleApprove() {
    setLoading(true);
    const response = await UserManagementService.approveRequestUser({
      id: userRequest!.id,
    });
    if (response.success) {
      showToast(response.message, "success");
      router.back();
    } else {
      showToast(response.message, "error");
    }
    setModalOpen(false);
    setLoading(false);
  }

  async function handleReject() {
    setLoading(true);
    const response = await UserManagementService.rejectRequestUser({
      id: userRequest!.id,
    });
    if (response.success) {
      showToast(response.message, "success");
      router.back();
    } else {
      showToast(response.message, "error");
    }
    setModalOpen(false);
    setLoading(false);
  }

  const handleOpenModalApprove = () => {
    setModalOpen(true);
  };

  const handleOpenModalReject = () => {
    setModalOpen(true);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="px-6">
      <h2 data-aos="fade-down" className="text-gray-700 hide mb-4">
        {typeView
          ? "Compare Information Request"
          : "New user Information Request"}
      </h2>

      <div className="flex">
        <div className="flex-1 space-y-4" data-aos="fade-right">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1 "
            >
              {typeView ? "Name Before" : "Name user"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userRequest?.name}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {typeView ? "Email Before" : "Email user"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userRequest?.email}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          <div className="flex-1" data-aos="fade-right">
            <label
              htmlFor="branch"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {typeView ? "Branch Before" : "Branch user"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userRequest?.branch.mnemonic}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {typeView ? "Branch Location Before" : "Branch Location user"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userRequest?.branch.city}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {typeView ? "Position Before" : "Position user"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userRequest?.position.fullName}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {typeView ? "Role Before" : "Role user"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userRequest?.role.name}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>
        </div>

        {typeView && (
          <div className="flex flex-col justify-between mt-6">
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
          </div>
        )}

        {typeView && (
          <div className="flex-1 space-y-4" data-aos="fade-left">
            {/* Name Field */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1 ${
                  userInfo?.name != userRequest?.name
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                Name After<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userInfo?.name}
                className={`py-1.5 w-full ${
                  userInfo?.name != userRequest?.name
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
                disabled={true}
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1 ${
                  userInfo?.email != userRequest?.email
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                Email After<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userInfo?.email}
                className={`py-1.5 w-full ${
                  userInfo?.email != userRequest?.email
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
                disabled={true}
              />
            </div>

            {/* Branch after Field */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1  ${
                  userInfo?.branch.mnemonic != userRequest?.branch.mnemonic
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                Branch After<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userInfo?.branch.mnemonic}
                className={`py-1.5 w-full ${
                  userInfo?.branch.mnemonic != userRequest?.branch.mnemonic
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
                disabled={true}
              />
            </div>

            {/* Branch Location after Field */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1  ${
                  userInfo?.branch.city != userRequest?.branch.city
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                Branch Location After
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userInfo?.branch.city}
                className={`py-1.5 w-full ${
                  userInfo?.branch.city != userRequest?.branch.city
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
                disabled={true}
              />
            </div>

            {/* Position after Field */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1  ${
                  userInfo?.position.fullName != userRequest?.position.fullName
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                Position After
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userInfo?.position.fullName}
                className={`py-1.5 w-full ${
                  userInfo?.position.fullName != userRequest?.position.fullName
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
                disabled={true}
              />
            </div>

            {/* Role after Field */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1 ${
                  userInfo?.role.name != userRequest?.role.name
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                Role After<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userInfo?.role.name}
                className={`py-1.5 w-full ${
                  userInfo?.role.name != userRequest?.role.name
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
                disabled={true}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 justify-end flex space-x-2">
        <Button onClick={handleCancel} variant="cancel" className="px-2 py-1">
          Cancel
        </Button>
        <Button
          onClick={handleOpenModalReject}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Reject
        </Button>
        <Button
          onClick={handleOpenModalApprove}
          className="py-1 px-2"
          loading={loading}
          textLoading="Waiting ..."
        >
          Approve
        </Button>
      </div>

      {/* Confirmation approve */}
      <ModalConfirmation
        isOpen={modalOpen}
        title="Confirm Approve!"
        onClose={() => setModalOpen(false)}
        onConfirm={handleApprove}
        message={`Are you sure you want to approve?`}
        loading={loading}
        textLoading="Appriving ..."
        isNotCancel={true}
      />

      {/* Confirmation Reject */}
      <ModalConfirmation
        isOpen={modalReject}
        title="Confirm Reject!"
        onClose={() => setModalReject(false)}
        onConfirm={handleReject}
        message={`Are you sure you want to reject?`}
        loading={loading}
        textLoading="Rejecting ..."
      />

      <ToastContainer />
    </div>
  );
};

export default withAuthWrapper(UserCompareRequest, [
  UserRoleEnum.IT_ADMIN_USER,
  UserRoleEnum.OPERATION_ADMIN_USER,
]);
