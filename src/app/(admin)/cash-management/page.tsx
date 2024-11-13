/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Input from "@/components/custom/Input";
import { pageSizeData, statusCashData } from "@/constants/dataListing";
import { debounce } from "@/utils/function/debounce";
import EmptyState from "@/components/emthyData/EmptyState";
import { LuView } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Button from "@/components/custom/Button";
import { CashManagementService } from "@/redux/service/cashManagementService";
import {
  CashRecordListModel,
  CashRecordModel,
} from "@/redux/models/cashManagement/CashRecordModel";
import { convertDate } from "@/utils/date/convertDate";
import { CashStatusEnum } from "@/redux/models/cashManagement/StatusEnum";
import dynamic from "next/dynamic";
import { UserRoleEnum } from "@/constants/userRole";
import UserRoleStorage from "@/utils/localStorage/userRoleStorage";
import { getStatusColor } from "@/utils/function/checkColorStatus";
import { FiPlus } from "react-icons/fi";
import FilterStatusCash from "@/components/custom/FilterStatusCash";
import UserTypeStorage from "@/utils/localStorage/userTypeStorage";
import withAuthWrapper from "@/utils/middleWare/withAuthWrapper";

const DropdownSize = dynamic(() => import("@/components/custom/DropdownSize"));
const Pagination = dynamic(() => import("@/components/pagination/Pagination"));

const CashManagementPage: React.FC = () => {
  const [cashRecordList, setCashRecordList] = useState<CashRecordListModel>({
    data: [],
    pagination: null,
  });
  const router = useRouter();
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const listSize = cashRecordList.pagination?.currentPage ?? 10;

  useEffect(() => {
    fetchData({});
  }, []);

  async function fetchData({
    currentPage = 1,
    pageSize = size,
    srNumber = "",
    status = "",
  }) {
    let response = await CashManagementService.getCashRecordList({
      pageSize,
      currentPage,
      srNumber,
      status,
    });
    if (response.data.length == 0) {
      response = await CashManagementService.getCashRecordList({
        pageSize: pageSize,
        currentPage: 1,
      });
    }
    setCashRecordList(response);
  }

  async function fetchDataByStatus({
    currentPage = 1,
    pageSize = size,
    srNumber = "",
    status = "",
  }) {
    const response = await CashManagementService.getCashRecordList({
      pageSize,
      currentPage,
      srNumber,
      status,
    });
    setCashRecordList(response);
  }

  function onPageChange(value: number) {
    fetchData({
      currentPage: value,
      pageSize: cashRecordList.pagination?.pageSize ?? 15,
    });
  }

  function handlePageSize(value: number) {
    setSize(value);
    fetchData({
      currentPage: cashRecordList.pagination?.currentPage,
      pageSize: value,
    });
  }

  function handleFilterStatus(status: string) {
    if (status == CashStatusEnum.ALL) {
      setStatusFilter("");
      fetchDataByStatus({});
      return;
    }
    setStatusFilter(status);
    fetchDataByStatus({
      currentPage: cashRecordList.pagination?.currentPage,
      status: status,
      srNumber: searchTerm,
    });
  }

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (query && query.length > 0) {
        fetchDataByStatus({ srNumber: query, status: statusFilter });
      } else {
        fetchData({});
      }
    }),
    [size]
  );

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  }

  function onViewCash(id: number) {
    router.prefetch(`/cash-management/view-cash-record/${id}`);
    router.push(`/cash-management/view-cash-record/${id}`);
  }

  function onEditCash(id: number) {
    router.prefetch(`/cash-management/${id}`);
    router.push(`/cash-management/${id}`);
  }

  function onCheckCash(id: number) {
    router.prefetch(`/cash-management/check/${id}`);
    router.push(`/cash-management/check/${id}`);
  }

  return (
    <div className="px-4">
      {/* Search and Add Record Section */}
      <div className="flex items-center mb-4 justify-between">
        <Input
          type="text"
          placeholder="Search by Sr number..."
          value={searchTerm}
          onChange={onSearch}
          className="mr-4 py-1 max-w-md"
          data-aos="fade-right"
        />

        <div className="flex space-x-2">
          <FilterStatusCash
            options={statusCashData}
            onSelect={handleFilterStatus}
            label="Select Status"
          />

          {UserRoleStorage.getUserRole() == UserRoleEnum.INPUTTER_USER && (
            <Button
              data-aos="fade-left"
              onClick={() => router.push("/cash-management/add-cash")}
              className="text-white flex items-center py-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
            >
              <FiPlus size={18} />
            </Button>
          )}
        </div>
      </div>

      {/* User List Table */}
      <div className="overflow-auto min-h-[50vh]">
        <table
          data-aos="fade-up"
          className="min-w-full border-collapse border border-gray-300"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Sr Number</th>
              <th>Branch</th>
              <th>City</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Checker By</th>
              <th>Approve By</th>
              <th>Created date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cashRecordList.data.length === 0 ? (
              <tr>
                <td colSpan={10} className="hover:bg-white">
                  <EmptyState message="No cash available." />
                </td>
              </tr>
            ) : (
              cashRecordList.data.map((cash: CashRecordModel, index) => {
                const displayIndex = (listSize - 1) * size + index + 1;
                return (
                  <tr key={cash.id}>
                    <td className="truncate">{displayIndex}</td>
                    <td className="truncate">{cash.srNumber}</td>
                    <td className="truncate">{cash.branch.mnemonic}</td>
                    <td className="truncate">{cash.branch.city}</td>
                    <td
                      className={`truncate ${getStatusColor(
                        cash.status as CashStatusEnum
                      )}`}
                    >
                      {cash.status}
                    </td>
                    <td className="truncate">{cash.createdBy.name}</td>
                    <td className="truncate">{cash.checkerBy.name}</td>
                    <td className="truncate">{cash.approvedBy.name}</td>
                    <td className="truncate">
                      {convertDate(cash.createdDate)}
                    </td>
                    <td className="flex items-center truncate space-x-2">
                      <button
                        onClick={() => onViewCash(cash.id)}
                        className="bg-gray-300 text-white px-2 p-1 rounded hover:bg-gray-400 mr-2 flex items-center"
                      >
                        <LuView size={14} className="text-white" />
                      </button>
                      {cash.status == CashStatusEnum.PROCESSING &&
                        UserRoleStorage.getUserRole() ==
                          UserRoleEnum.AUTHORIZER_USER &&
                        UserTypeStorage.getUserType() != "HO" && (
                          <button
                            onClick={() => onCheckCash(cash.id)}
                            className="bg-blue-500 text-white px-2 p-1 rounded hover:bg-blue-600 flex items-center"
                          >
                            Check
                          </button>
                        )}

                      {cash.status == CashStatusEnum.PENDING &&
                        UserRoleStorage.getUserRole() ==
                          UserRoleEnum.CHECKER_USER &&
                        UserTypeStorage.getUserType() != "HO" && (
                          <button
                            onClick={() => onCheckCash(cash.id)}
                            className="bg-blue-500 text-white px-2 p-1 rounded hover:bg-blue-600 flex items-center"
                          >
                            Check
                          </button>
                        )}

                      {(cash.status == CashStatusEnum.REJECT ||
                        cash.status == CashStatusEnum.PENDING) &&
                        UserRoleStorage.getUserRole() ==
                          UserRoleEnum.INPUTTER_USER &&
                        UserTypeStorage.getUserType() != "HO" && (
                          <button
                            onClick={() => onEditCash(cash.id)}
                            className="bg-blue-500 text-white px-2 p-1 rounded hover:bg-blue-600 mr-2 flex items-center"
                          >
                            Edit
                          </button>
                        )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {cashRecordList.data.length > 0 && (
        <div className="flex justify-between mt-8 mb-16">
          <DropdownSize
            options={pageSizeData}
            onSelect={handlePageSize}
            label="Select Size"
          />

          <Pagination
            totalPages={cashRecordList.pagination?.totalPages ?? 1}
            currentPage={cashRecordList.pagination?.currentPage ?? 1}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default withAuthWrapper(CashManagementPage, [
  UserRoleEnum.CHECKER_USER,
  UserRoleEnum.INPUTTER_USER,
  UserRoleEnum.AUTHORIZER_USER,
  UserRoleEnum.SHOW_ALL,
]);
