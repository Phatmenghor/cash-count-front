"use client";

import React, { useCallback, useEffect, useState } from "react";
import Button from "@/components/custom/Button";
import Input from "@/components/custom/Input";
import { UserProfile } from "@/redux/models/userManagement/UserProfileModel";
import UserManagementService from "@/redux/service/userManagementService";
import ModalConfirmation from "@/components/modal/ModalConfirmation";
import showToast from "@/components/toast/useToast";
import { useRouter } from "next/navigation";
import withAuthWrapper from "@/utils/middleWare/withAuthWrapper";
import { UserRoleEnum } from "@/constants/userRole";
import { decryptId } from "@/utils/security/crypto";

const UserCompareRequest = ({ params }: { params: { id: string } }) => {
  const idUser = params.id ? decryptId(params.id) : null;
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [userRequest, setUserRequest] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReject, setModalReject] = useState(false);
  const router = useRouter();
  const typeView = userRequest?.requestType != "Create-Info";

  const fetchData = useCallback(async () => {
    const responseResquest = await UserManagementService.getUserRequestByID({
      id: Number(idUser),
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
  }, [idUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          ? "Compare information request"
          : "New user information request"}
      </h2>

      {!typeView && (
        <div className="flex-1 space-y-4" data-aos="fade-right">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name user
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userRequest?.name}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email user
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userRequest?.email}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          {/* Branch after Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch user
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userRequest?.branch.mnemonic}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          {/* Branch after Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch type user
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userRequest?.branch.userType}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          {/* Branch Location after Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch location user
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userRequest?.branch.city}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          {/* Position after Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position user
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userRequest?.position.fullName}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>

          {/* Role after Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role user
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={userRequest?.role.name}
              className="py-1.5 w-full"
              disabled={true}
            />
          </div>
        </div>
      )}

      {typeView && (
        <div className="flex">
          <div className="flex-1 space-y-4" data-aos="fade-right">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {typeView ? "Name before" : "Name user"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userInfo?.name}
                className="py-1.5 w-full"
                disabled={true}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {typeView ? "Email before" : "Email user"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userInfo?.email}
                className="py-1.5 w-full"
                disabled={true}
              />
            </div>

            {/* Branch after Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {typeView ? "Branch before" : "Branch user"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userInfo?.branch.mnemonic}
                className="py-1.5 w-full"
                disabled={true}
              />
            </div>

            {/* Branch after Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {typeView ? "Branch type before" : "Branch type user"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userInfo?.branch.userType}
                className="py-1.5 w-full"
                disabled={true}
              />
            </div>

            {/* Branch Location after Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {typeView ? "Branch location before" : "Branch location user"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userInfo?.branch.city}
                className="py-1.5 w-full"
                disabled={true}
              />
            </div>

            {/* Position after Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {typeView ? "Position before" : "Position user"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userInfo?.position.fullName}
                className="py-1.5 w-full"
                disabled={true}
              />
            </div>

            {/* Role after Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {typeView ? "Role before" : "Role user"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userInfo?.role.name}
                className="py-1.5 w-full"
                disabled={true}
              />
            </div>
          </div>

          <div className="flex flex-col justify-between mt-6">
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
            <h2 className="justify-center text-lg px-4">{"==>"}</h2>
          </div>

          <div className="flex-1 space-y-4" data-aos="fade-left">
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1 ${
                  userInfo?.name != userRequest?.name
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                Name after
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userRequest?.name}
                // className="py-1.5 w-full"
                className={`py-1.5 w-full ${
                  userInfo?.name != userRequest?.name
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
                disabled={true}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1 ${
                  userInfo?.email != userRequest?.email
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                {typeView ? "Email Before" : "Email user"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userRequest?.email}
                className={`py-1.5 w-full ${
                  userInfo?.email != userRequest?.email
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
                disabled={true}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1  ${
                  userInfo?.branch.mnemonic != userRequest?.branch.mnemonic
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                Branch after
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userRequest?.branch.mnemonic}
                className={`py-1.5 w-full ${
                  userInfo?.branch.mnemonic != userRequest?.branch.mnemonic
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
                disabled={true}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1  ${
                  userInfo?.branch.userType != userRequest?.branch.userType
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                Branch type after
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userRequest?.branch.userType}
                className={`py-1.5 w-full ${
                  userInfo?.branch.userType != userRequest?.branch.userType
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
                disabled={true}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1  ${
                  userInfo?.branch.city != userRequest?.branch.city
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                Branch location after
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userRequest?.branch.city}
                className={`py-1.5 w-full ${
                  userInfo?.branch.city != userRequest?.branch.city
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
                disabled={true}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1  ${
                  userInfo?.position.fullName != userRequest?.position.fullName
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                Position after
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userRequest?.position.fullName}
                className={`py-1.5 w-full ${
                  userInfo?.position.fullName != userRequest?.position.fullName
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
                disabled={true}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1 ${
                  userInfo?.role.name != userRequest?.role.name
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
              >
                Role after
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={userRequest?.role.name}
                className={`py-1.5 w-full ${
                  userInfo?.role.name != userRequest?.role.name
                    ? "border-red-500 text-red-500"
                    : ""
                }`}
                disabled={true}
              />
            </div>
          </div>
        </div>
      )}

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
          textLoading="Waiting..."
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
        textLoading="Appriving..."
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
        textLoading="Rejecting..."
      />
    </div>
  );
};

export default withAuthWrapper(UserCompareRequest, [
  UserRoleEnum.IT_ADMIN_USER,
  UserRoleEnum.OPERATION_ADMIN_USER,
]);
