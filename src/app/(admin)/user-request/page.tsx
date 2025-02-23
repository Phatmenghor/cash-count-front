/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import Pagination from "@/components/pagination/Pagination";
import Input from "@/components/custom/Input";
import { pageSizeData } from "@/constants/dataListing";
import { debounce } from "@/utils/function/debounce";
import EmptyState from "@/components/emthyData/EmptyState";
import DropdownSize from "@/components/custom/DropdownSize";
import UserManagementService from "@/redux/service/userManagementService";
import { LuView } from "react-icons/lu";
import { AiOutlineUser } from "react-icons/ai";
import {
  userRequestListModel,
  UserRequestModel,
} from "@/redux/models/userManagement/UserRequestModel";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import withAuthWrapper from "@/utils/middleWare/withAuthWrapper";
import { UserRoleEnum } from "@/constants/userRole";
import { encryptId } from "@/utils/security/crypto";

const UserRequestPage: React.FC = () => {
  const [userRequestList, setUserRequestList] = useState<userRequestListModel>({
    data: [],
    pagination: null,
  });
  const router = useRouter();
  const [size, setSize] = useState<number>(15);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const listSize = userRequestList.pagination?.currentPage ?? 15;

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

  const clearSearch = () => {
    setSearchTerm("");
    handleSearch("");
  };

  return (
    <div className="px-4">
      {/* Search and Add Record Section */}
      <div className="relative rounded  max-w-md mb-4">
        <Input
          type="text"
          placeholder="Search user request..."
          value={searchTerm}
          onChange={onSearch}
          className="mr-4 py-1 pr-8"
          data-aos="fade-right"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            <FaTimes /> {/* Clear icon */}
          </button>
        )}
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
                          user.status === 1 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {user.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="truncate">{user.position.name}</td>
                    <td className="truncate">{user.branch.mnemonic}</td>
                    <td className="truncate">{user.role.name}</td>
                    <td className="flex items-center truncate">
                      <button
                        onClick={() => {
                          const encryptedId = encryptId(user.id.toString());
                          router.push(`/user-request/${encryptedId}`);
                        }}
                        className="bg-gray-400 text-white px-2 p-1 rounded hover:bg-gray-500 mr-2 flex items-center"
                      >
                        <LuView size={14} className="text-white" />
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
    </div>
  );
};

export default withAuthWrapper(UserRequestPage, [
  UserRoleEnum.IT_ADMIN_USER,
  UserRoleEnum.OPERATION_ADMIN_USER,
]);
