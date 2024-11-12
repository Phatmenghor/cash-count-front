/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import Pagination from "@/components/pagination/Pagination";
import Button from "@/components/custom/Button";
import Input from "@/components/custom/Input";
import { pageSizeData } from "@/constants/dataListing";
import { FiEdit, FiLoader, FiPlus } from "react-icons/fi";
import { debounce } from "@/utils/function/debounce";
import EmptyState from "@/components/emthyData/EmptyState";
import DropdownSize from "@/components/custom/DropdownSize";
import showToast from "@/components/toast/useToast";
import { PositionListModel } from "@/redux/models/position/PositionListModel";
import { PositionModel } from "@/redux/models/register/PositionModel";
import ModalCreateEditPosition from "@/components/modal/ModalCreateEditPosition";
import { PositionService } from "@/redux/service/positionService";
import { Switch } from "@/components/custom/Switch";
import { FaTimes } from "react-icons/fa";
import withAuthWrapper from "@/utils/middleWare/withAuthWrapper";
import { UserRoleEnum } from "@/constants/userRole";

const PositionPage: React.FC = () => {
  const [positionList, setPositionList] = useState<PositionListModel>({
    data: [],
    pagination: null,
  });
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const headers = ["Number", "Short name", "Full name", "Status", "Actions"];
  const listSize = positionList.pagination?.currentPage ?? 10;
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<PositionModel | null>(
    null
  );
  const [loadingUpdate, setLoadingUpdate] = useState({
    id: 0,
    loading: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData(currentPage = 1, pageSize = size) {
    const response = await PositionService.getPosition({
      pageSize,
      currentPage,
    });
    setPositionList(response);
  }

  function onPageChange(value: number) {
    fetchData(value, positionList.pagination?.pageSize ?? 10);
  }

  function handlePageSize(value: number) {
    setSize(value);
    fetchData(positionList.pagination?.currentPage, value);
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
    const response = await PositionService.getPosition({
      pageSize,
      currentPage: page,
      search,
    });
    setPositionList(response);
  }

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  }

  const handleOpenCreateModal = () => {
    setCurrentPosition(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (branch: PositionModel) => {
    setCurrentPosition(branch);
    setModalOpen(true);
  };

  const handleCreateEditBranch = async (data: {
    name: string;
    fullName: string;
    status: number;
  }) => {
    if (currentPosition) {
      updateBranch({ ...currentPosition, ...data });
    } else {
      createDepartment(data);
    }
    setModalOpen(false);
  };

  async function createDepartment(data: {
    name: string;
    fullName: string;
    status: number;
  }) {
    setLoading(true);
    const response = await PositionService.createPosition(data);
    if (response.success) {
      setPositionList((prevBranchList) => ({
        ...prevBranchList,
        data: [response.data, ...prevBranchList.data],
      }));
      showToast("Position created successfully!", "success");
    } else {
      showToast(response.data, "error");
    }
    setLoading(false);
  }

  async function updateBranch(data: PositionModel) {
    setLoading(true);
    const response = await PositionService.updatePosition(data);
    if (response.success) {
      setPositionList((prevPositionList) => ({
        ...prevPositionList,
        data: prevPositionList.data.map((position) =>
          position.id === data.id ? response.data : position
        ),
      }));
      showToast("Position updated successfully!", "success");
    } else {
      showToast(response.data, "error");
    }
    setLoading(false);
  }

  async function toggleUserStatus(position: PositionModel) {
    setLoadingUpdate({
      id: position.id,
      loading: true,
    });
    const statusUpdate = position.status === 1 ? 0 : 1;
    const response = await PositionService.updatePosition({
      ...position,
      status: statusUpdate,
    });
    if (response) {
      setPositionList((prev) => ({
        ...prev,
        data: prev.data.map((item: PositionModel) =>
          item.id == position.id
            ? { ...position, ...{ status: statusUpdate } }
            : item
        ),
      }));
      if (statusUpdate === 0) {
        showToast(
          `${position.fullName} has been deactivated successfully!`,
          "success"
        );
      } else if (statusUpdate === 1) {
        showToast(
          `${position.fullName} has been activated successfully!`,
          "success"
        );
      }
    } else {
      showToast(
        `Failed to update status for ${position.name}. Please try again.`,
        "error"
      );
    }
    setLoadingUpdate({
      id: 0,
      loading: false,
    });
  }

  const clearSearch = () => {
    setSearchTerm("");
    handleSearch("");
  };

  return (
    <div className="px-4">
      <div className="flex items-center mb-4 justify-between">
        <div className="relative rounded  max-w-md">
          <Input
            type="text"
            placeholder="Search position ..."
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
        <Button
          onClick={handleOpenCreateModal}
          className="text-white flex items-center py-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
          data-aos="fade-left"
        >
          <FiPlus size={18} />
        </Button>
      </div>

      <div className="overflow-x-auto min-h-[50vh]">
        <table data-aos="fade-up">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="border border-gray-300 px-4 py-2 text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positionList.data.length === 0 ? (
              <tr>
                <td colSpan={4} className="hover:bg-white">
                  <EmptyState message="No position available." />
                </td>
              </tr>
            ) : (
              positionList.data.map((data, index) => {
                const displayIndex = (listSize - 1) * size + index + 1;
                return (
                  <tr key={data.id} className="hover:bg-gray-200">
                    <td className="truncate">{displayIndex}</td>
                    <td className="truncate">{data.name}</td>
                    <td className="truncate">{data.fullName}</td>
                    <td className="truncate">
                      <div className="flex-1 flex items-center">
                        <Switch
                          disable={loadingUpdate.loading}
                          checked={data.status === 1}
                          onChange={() => toggleUserStatus(data)}
                        />
                        <span
                          className={`ml-2 py-[1px] px-2 rounded-full text-[10px] ${
                            data.status ? "bg-green-500" : "bg-red-500"
                          } text-white`}
                        >
                          {loadingUpdate.loading &&
                          loadingUpdate.id == data.id ? (
                            <div className="px-2">
                              <FiLoader className="animate-spin  h-4 w-4" />
                            </div>
                          ) : data.status === 1 ? (
                            "Active"
                          ) : (
                            "Inactive"
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          handleOpenEditModal(data);
                        }}
                        className="bg-blue-500 text-white px-2 p-1 rounded hover:bg-blue-600 mr-2 flex items-center"
                      >
                        <FiEdit size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {positionList.data.length > 0 && (
        <div className="flex justify-between mt-8 mb-16">
          <DropdownSize
            options={pageSizeData}
            onSelect={handlePageSize}
            label="Select Size"
          />
          <Pagination
            totalPages={positionList.pagination?.totalPages ?? 1}
            currentPage={positionList.pagination?.currentPage ?? 1}
            onPageChange={onPageChange}
          />
        </div>
      )}

      <ModalCreateEditPosition
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleCreateEditBranch}
        title={currentPosition ? "Edit Position" : "Create New Position"}
        initialData={currentPosition ? currentPosition : undefined}
        loadingButton={loading}
      />
    </div>
  );
};

export default withAuthWrapper(PositionPage, [UserRoleEnum.IT_ADMIN_USER]);
