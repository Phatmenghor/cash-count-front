/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiEdit, FiLoader } from "react-icons/fi";
import { LuView } from "react-icons/lu";
import { AiOutlineUser } from "react-icons/ai";
import UserManagementService from "@/redux/service/userManagementService";
import DropdownSize from "@/components/custom/DropdownSize";
import {
  userManagementListModel,
  userManagementModel,
} from "@/redux/models/userManagement/UserManagementModel";
import { pageSizeData, userStatus } from "@/constants/dataListing";
import showToast from "@/components/toast/useToast";
import { debounce } from "@/utils/function/debounce";
import Input from "@/components/custom/Input";
import EmptyState from "@/components/emthyData/EmptyState";
import { Switch } from "@/components/custom/Switch";
import Pagination from "@/components/pagination/Pagination";
import FilterUser from "@/components/custom/FilterUser";
import Head from "next/head";
import { FaTimes } from "react-icons/fa";
import { UserRoleEnum } from "@/constants/userRole";
import withAuthWrapper from "@/utils/middleWare/withAuthWrapper";
import { encryptId } from "@/utils/security/crypto";

const UserManagement = () => {
  const router = useRouter();

  const [size, setSize] = useState<number>(15);
  const [userData, setUserData] = useState<userManagementListModel>({
    data: [],
    pagination: null,
  });

  const [loadingUpdate, setLoadingUpdate] = useState({
    id: 0,
    loading: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const listSize = userData.pagination?.currentPage ?? 15;

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData(currentPage = 1, pageSize = size) {
    const response = await UserManagementService.getAllUsers({
      pageSize,
      currentPage,
    });
    setUserData(response);
  }

  async function toggleUserStatus(user: userManagementModel) {
    setLoadingUpdate({
      id: user.id,
      loading: true,
    });
    const statusUpdate = user.status === 1 ? 0 : 1;
    const response = await UserManagementService.updateUserStatus({
      id: user.id,
      status: statusUpdate,
    });
    if (response) {
      setUserData((prev) => ({
        ...prev,
        data: prev.data.map((item: userManagementModel) =>
          item.id == user.id ? { ...user, ...{ status: statusUpdate } } : item
        ),
      }));
      if (statusUpdate === 0) {
        showToast(`${user.name} has been deactivated successfully!`, "success");
      } else if (statusUpdate === 1) {
        showToast(`${user.name} has been activated successfully!`, "success");
      }
    } else {
      showToast(
        `Failed to update status for ${user.name}. Please try again.`,
        "error"
      );
    }

    setLoadingUpdate({
      id: 0,
      loading: false,
    });
  }

  function handlePageSize(value: number) {
    setSize(value);
    fetchData(userData.pagination?.currentPage, value);
  }

  async function handleFilterStatus(status: number) {
    if (status == 2) {
      fetchData();
      return;
    }
    const response = await UserManagementService.getAllByBodyUsers({
      pageSize: size,
      currentPage: 1,
      status: status,
      search: searchTerm,
    });

    setUserData(response);
  }

  function onPageChange(value: number) {
    fetchData(value, userData.pagination?.pageSize ?? 15);
  }

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
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
    const response = await UserManagementService.getAllUsers({
      pageSize,
      currentPage: page,
      search,
    });
    setUserData(response);
  }

  const clearSearch = () => {
    setSearchTerm("");
    handleSearch("");
  };

  return (
    <div>
      <Head>Contact Page</Head>
      <div className="px-4">
        {/* Search and Add Record Section */}
        <div className="flex items-center mb-4 justify-between">
          <div className="relative rounded  max-w-md">
            <Input
              type="text"
              placeholder="Search user ..."
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
          <FilterUser
            options={userStatus}
            onSelect={handleFilterStatus}
            label="Select user"
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
                <th>Full name</th>
                <th>Email</th>
                <th>AD user</th>
                <th>Position</th>
                <th>Position fullname</th>
                <th>Branch</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userData.data.length === 0 ? (
                <tr>
                  <td colSpan={10} className="hover:bg-white">
                    <EmptyState
                      message="No user available."
                      icon={<AiOutlineUser size={94} />}
                    />
                  </td>
                </tr>
              ) : (
                userData.data.map((user: userManagementModel, index) => {
                  const displayIndex = (listSize - 1) * size + index + 1;
                  return (
                    <tr key={user.id}>
                      <td className="truncate">{displayIndex}</td>
                      <td className="truncate">{user.name}</td>
                      <td className="truncate">{user.email}</td>
                      <td className="truncate">{user.username}</td>
                      <td className="truncate">{user.position.name}</td>
                      <td className="truncate">{user.position.fullName}</td>
                      <td className="truncate">{user.branchMnemonic}</td>
                      <td className="truncate">{user.roles[0].name}</td>
                      <td className="truncate">
                        <div className="flex-1 flex items-center">
                          <Switch
                            disable={loadingUpdate.loading}
                            checked={user.status === 1}
                            onChange={() => toggleUserStatus(user)}
                          />
                          <span
                            className={`ml-2 py-[1px] px-2 rounded-full text-[10px] ${
                              user.status ? "bg-green-500" : "bg-red-500"
                            } text-white`}
                          >
                            {loadingUpdate.loading &&
                            loadingUpdate.id == user.id ? (
                              <div className="px-2">
                                <FiLoader className="animate-spin  h-4 w-4" />
                              </div>
                            ) : user.status === 1 ? (
                              "Active"
                            ) : (
                              "Inactive"
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="flex items-center truncate">
                        <button
                          onClick={() => {
                            const encryptedId = encryptId(user.id.toString());
                            router.push(
                              `/user-management/${encryptedId}?mode=view`
                            );
                          }}
                          className="bg-gray-300 text-white px-2 p-1 rounded hover:bg-gray-400 mr-2 flex items-center"
                        >
                          <LuView size={14} className="text-white" />
                        </button>
                        <button
                          onClick={() => {
                            const encryptedId = encryptId(user.id.toString());
                            router.push(
                              `/user-management/${encryptedId}?mode=edit`
                            );
                          }}
                          className="bg-blue-500 text-white px-2 p-1 rounded hover:bg-blue-600 mr-2 flex items-center"
                        >
                          <FiEdit size={14} className="text-white" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {userData.data.length > 0 && (
          <div className="flex justify-between mt-8 mb-16">
            <DropdownSize
              options={pageSizeData}
              onSelect={handlePageSize}
              label="Select Size"
            />
            <Pagination
              totalPages={userData.pagination?.totalPages ?? 1}
              currentPage={userData.pagination?.currentPage ?? 1}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuthWrapper(UserManagement, [
  UserRoleEnum.IT_ADMIN_USER,
  UserRoleEnum.OPERATION_ADMIN_USER,
]);
