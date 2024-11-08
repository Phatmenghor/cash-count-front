/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import Pagination from "@/components/pagination/Pagination";
import Button from "@/components/custom/Button";
import Input from "@/components/custom/Input";
import { pageSizeData } from "@/constants/dataListing";
import { FiEdit, FiPlus } from "react-icons/fi";
import { debounce } from "@/utils/function/debounce";
import EmptyState from "@/components/emthyData/EmptyState";
import DropdownSize from "@/components/custom/DropdownSize";
import showToast from "@/components/toast/useToast";
import { PositionListModel } from "@/redux/models/position/PositionListModel";
import { PositionModel } from "@/redux/models/register/PositionModel";
import ModalCreateEditPosition from "@/components/modal/ModalCreateEditPosition";
import { PositionService } from "@/redux/service/positionService";
import { ToastContainer } from "react-toastify";

const PositionPage: React.FC = () => {
  const [positionList, setPositionList] = useState<PositionListModel>({
    data: [],
    pagination: null,
  });
  const [size, setSize] = useState<number>(15);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const headers = ["Number", "Position", "Actions"];
  const listSize = positionList.pagination?.currentPage ?? 15;
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<PositionModel | null>(
    null
  );

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
    fetchData(value, positionList.pagination?.pageSize ?? 15);
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

  const handleCreateEditBranch = async (data: { name: string }) => {
    if (currentPosition) {
      updateBranch({ ...currentPosition, ...data });
    } else {
      createDepartment(data);
    }
    setModalOpen(false);
  };

  async function createDepartment(data: { name: string }) {
    setLoading(true);
    const response = await PositionService.createPosition({
      name: data.name,
    });

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
      showToast("Failed to update position.", "error");
    }
    setLoading(false);
  }

  return (
    <div className="px-4">
      <div className="flex items-center mb-4 justify-between">
        <Input
          type="text"
          placeholder="Search position role ..."
          value={searchTerm}
          onChange={onSearch}
          className="mr-4 py-1 max-w-md"
          data-aos="fade-right"
        />
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
                <td colSpan={3} className="hover:bg-white">
                  <EmptyState message="No position available." />
                </td>
              </tr>
            ) : (
              positionList.data.map((data, index) => {
                const displayIndex = (listSize - 1) * size + index + 1;
                return (
                  <tr key={data.id} className="hover:bg-gray-200">
                    <td>{displayIndex}</td>
                    <td>{data.name}</td>
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
        title={currentPosition ? "Edit Department" : "Create New Department"}
        initialData={currentPosition ? currentPosition : undefined}
        loadingButton={loading}
      />
  
    </div>
  );
};

export default PositionPage;
