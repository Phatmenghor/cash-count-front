/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import Pagination from "@/components/pagination/Pagination";
import Input from "@/components/custom/Input";
import { pageSizeData } from "@/constants/dataListing";
import { debounce } from "@/utils/function/debounce";
import EmptyState from "@/components/emthyData/EmptyState";
import DropdownSize from "@/components/custom/DropdownSize";
import showToast from "@/components/toast/useToast";
import UserManagementService from "@/redux/service/userManagementService";
import { LuView } from "react-icons/lu";
import { AiOutlineUser } from "react-icons/ai";
import {
  userRequestListModel,
  UserRequestModel,
} from "@/redux/models/userManagement/UserRequestModel";
import ModalConfirmation from "@/components/modal/ModalConfirmation";
import { useRouter } from "next/navigation";

const UserRequestPage: React.FC = () => {
  const [userRequestList, setUserRequestList] = useState<userRequestListModel>({
    data: [],
    pagination: null,
  });
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReject, setModalReject] = useState(false);
  const [size, setSize] = useState<number>(15);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const listSize = userRequestList.pagination?.currentPage ?? 15;
  const [dataUser, setDataUser] = useState<UserRequestModel | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData(currentPage = 1, pageSize = size) {
    const response = await UserManagementService.getUserRequest({
      pageSize,
      currentPage,
    });
    setUserRequestList(response);
  }

  function onPageChange(value: number) {
    fetchData(value, userRequestList.pagination?.pageSize ?? 15);
  }

  function handlePageSize(value: number) {
    setSize(value);
    fetchData(userRequestList.pagination?.currentPage, value);
  }

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (query && query.length > 0) {
        fetchSearch({ search: query });
      } else {
        fetchData();
      }
    }),
    [size]
  );

  async function fetchSearch({ page = 1, pageSize = size, search = "" }) {
    const response = await UserManagementService.getUserRequest({
      pageSize,
      currentPage: page,
      search,
    });
    setUserRequestList(response);
  }

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  }

  const handleOpenModalApprove = (user: UserRequestModel) => {
    setDataUser(user);
    setModalOpen(true);
  };

  const handleOpenModalReject = (user: UserRequestModel) => {
    setDataUser(user);
    setModalOpen(true);
  };

  async function handleApprove() {
    const response = await UserManagementService.approveRequestUser({
      id: dataUser!.id,
    });
    if (response.success) {
      setUserRequestList((prevList) => ({
        ...prevList,
        data: prevList.data.filter((request) => request.id !== dataUser?.id),
      }));
      if (userRequestList.data.length === 1) {
        fetchData();
      }
      showToast(response.message, "success");
    } else {
      showToast(response.message, "error");
    }
    setModalOpen(false);
  }

  async function handleReject() {
    const response = await UserManagementService.rejectRequestUser({
      id: dataUser!.id,
    });
    if (response.success) {
      setUserRequestList((prevList) => ({
        ...prevList,
        data: prevList.data.filter((request) => request.id !== dataUser?.id),
      }));
      if (userRequestList.data.length === 1) {
        fetchData();
      }
      showToast(response.message, "success");
    } else {
      showToast(response.message, "error");
    }
    setModalOpen(false);
  }

  return (
    <div className="px-4">
      {/* Search and Add Record Section */}
      <div className="flex items-center mb-4 justify-between">
        <Input
          type="text"
          placeholder="Search user request ..."
          value={searchTerm}
          onChange={onSearch}
          className="mr-4 py-1 max-w-md"
          data-aos="fade-right"
        />
      </div>

      {/* User List Table */}
      <div className="overflow-auto min-h-[70vh]">
        <table
          data-aos="fade-up"
          className="min-w-full border-collapse border border-gray-300"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>AD User</th>
              <th>Status</th>
              <th>Position</th>
              <th>Branch</th>
              <th>Department</th>
              <th>Role</th>

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userRequestList.data.length === 0 ? (
              <tr>
                <td colSpan={10} className="hover:bg-white">
                  <EmptyState
                    message="No user request available."
                    icon={<AiOutlineUser size={94} />}
                  />
                </td>
              </tr>
            ) : (
              userRequestList.data.map((user: UserRequestModel, index) => {
                const displayIndex = (listSize - 1) * size + index + 1;
                return (
                  <tr key={user.id}>
                    <td className="truncate">{displayIndex}</td>
                    <td className="truncate">
                      {user.firstName + user.lastName}
                    </td>
                    <td className="truncate">{user.email}</td>
                    <td className="truncate">{user.username}</td>
                    <td className="truncate">
                      <span
                        className={`underline py-1.5 text-[14px] ${
                          user.status ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {user.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="truncate">{user.position.name}</td>
                    <td className="truncate">{user.branch.mnemonic}</td>
                    <td className="truncate">{user.department.name}</td>
                    <td className="truncate">{user.role.name}</td>
                    <td className="flex items-center truncate">
                      <button
                        onClick={() => router.push(`/user-request/${user.id}`)}
                        className="bg-gray-300 text-white px-2 p-1 rounded hover:bg-gray-400 mr-2 flex items-center"
                      >
                        <LuView size={14} className="text-white" />
                      </button>
                      <button
                        onClick={() => handleOpenModalReject(user)}
                        className="bg-red-500 text-white px-2 p-1 rounded hover:bg-red-600 mr-2 flex items-center"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleOpenModalApprove(user)}
                        className="bg-blue-500 text-white px-2 p-1 rounded hover:bg-blue-600 mr-2 flex items-center"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {userRequestList.data.length > 0 && (
        <div className="flex justify-between mt-8 mb-16">
          <DropdownSize
            options={pageSizeData}
            onSelect={handlePageSize}
            label="Select Size"
          />

          <Pagination
            totalPages={userRequestList.pagination?.totalPages ?? 1}
            currentPage={userRequestList.pagination?.currentPage ?? 1}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* Confirmation approve */}
      <ModalConfirmation
        isOpen={modalOpen}
        title="Confirm Approve!"
        onClose={() => setModalOpen(false)}
        onConfirm={handleApprove}
        message={`Are you sure you want to approve?`}
        isNotCancel={true}
      />

      {/* Confirmation Reject */}
      <ModalConfirmation
        isOpen={modalReject}
        title="Confirm Reject!"
        onClose={() => setModalReject(false)}
        onConfirm={handleReject}
        message={`Are you sure you want to reject?`}
      />
    </div>
  );
};

export default UserRequestPage;
