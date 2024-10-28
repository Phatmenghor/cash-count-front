/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import Pagination from "@/components/pagination/Pagination";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import withAuth from "@/configs/withAuth";
import { pageSize } from "@/constants/dataListing";
import { BranchListModel } from "@/redux/models/branch/BranchListModel";
import { BranchService } from "@/redux/service/branchService";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { debounce } from "@/utils/function/debounce";
import EmptyState from "@/components/emthyData/EmptyState";
import DropdownSize from "@/components/ui/DropdownSize";
import ModalCreateEditBranch from "@/components/modal/ModalCreateEditBranch";
import { BranchModel } from "@/redux/models/register/BranchModel";
import { useRouter } from "next/navigation";
import showToast from "@/components/toast/useToast";
import ModalConfirmation from "@/components/modal/ModalConfirmation";
import { DepartmentService } from "@/redux/service/departmentService";
import { DepartmentListModel } from "@/redux/models/department/DepartmentListModel";
import { DepartmentModel } from "@/redux/models/register/DepartmentModel";
import ModalCreateEditDepartment from "@/components/modal/ModalCreateEditDepartment";

const DepartmentPage: React.FC = () => {
  const [departmentList, setDepartmentList] = useState<DepartmentListModel>({
    data: [],
    pagination: null,
  });
  const [size, setSize] = useState<number>(15);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const headers = ["Number", "Deaprtment", "Branch Code", "Actions"];
  const listSize = departmentList.pagination?.currentPage ?? 15;
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<DepartmentModel | null>(
    null
  );

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData(currentPage = 1, pageSize = size) {
    const response = await DepartmentService.getDepartment({
      pageSize,
      currentPage,
    });
    setDepartmentList({
      data: response.data,
      pagination: response.pagination,
    });
  }

  function onPageChange(value: number) {
    fetchData(value, departmentList.pagination?.pageSize ?? 15);
  }

  function handlePageSize(value: number) {
    setSize(value);
    fetchData(departmentList.pagination?.currentPage, value);
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
    const response = await BranchService.getBranch({
      pageSize,
      currentPage: page,
      search,
    });
    setDepartmentList({
      data: response.data,
      pagination: response.pagination,
    });
  }

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  }

  const handleOpenCreateModal = () => {
    setCurrentBranch(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (branch: DepartmentModel) => {
    setCurrentBranch(branch);
    setModalOpen(true);
  };

  const handleCreateEditBranch = async (data: {
    code: string;
    name: string;
  }) => {
    if (currentBranch) {
      updateBranch({ ...currentBranch, ...data });
    } else {
      createDepartment(data);
    }
    setModalOpen(false);
  };

  async function createDepartment(data: { code: string; name: string }) {
    setLoading(true);
    const response = await DepartmentService.createDepartment({
      name: data.name,
      code: data.code,
    });

    if (response.success) {
      setDepartmentList((prevBranchList) => ({
        ...prevBranchList,
        data: [response.data, ...prevBranchList.data],
      }));
      showToast("Department created successfully!", "success");
    } else {
      showToast(response.data, "error", 7000);
    }
    setLoading(false);
  }

  async function updateBranch(data: DepartmentModel) {
    setLoading(true);
    const response = await DepartmentService.updateDepartment(data);

    if (response.success) {
      setDepartmentList((prevBranchList) => ({
        ...prevBranchList,
        data: prevBranchList.data.map((branch) =>
          branch.id === data.id ? response.data : branch
        ),
      }));
      showToast("Department updated successfully!", "success");
    } else {
      showToast("Failed to update department.", "error");
    }
    setLoading(false);
  }

  return (
    <div className="container mx-auto px-4 pt-4">
      <h1 className="text-2xl font-bold mb-4">Department List</h1>

      <div className="flex items-center mb-4 justify-between">
        <Input
          type="text"
          placeholder="Search Department ..."
          value={searchTerm}
          onChange={onSearch}
          className="mr-4 py-1"
        />
        <Button
          onClick={handleOpenCreateModal}
          className="text-white flex items-center py-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
        >
          <FiPlus size={18} />
          <span className="ml-1">Add Department</span>
        </Button>
      </div>

      <div className="overflow-x-auto min-h-[50vh]">
        <table className="min-w-full bg-white border border-gray-200">
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
            {departmentList.data.length === 0 ? (
              <tr>
                <td colSpan={9} className="hover:bg-white">
                  <EmptyState message="No department available." />
                </td>
              </tr>
            ) : (
              departmentList.data.map((data, index) => {
                const displayIndex = (listSize - 1) * size + index + 1;
                return (
                  <tr key={data.id} className="hover:bg-gray-200">
                    <td>{displayIndex}</td>
                    <td>{data.name}</td>
                    <td>{data.code}</td>
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

      <div className="flex justify-between mt-8 mb-16">
        <DropdownSize
          options={pageSize}
          onSelect={handlePageSize}
          label="Select Size"
        />
        {departmentList.data.length > 0 && (
          <Pagination
            totalPages={departmentList.pagination?.totalPages ?? 1}
            currentPage={departmentList.pagination?.currentPage ?? 1}
            onPageChange={onPageChange}
          />
        )}
      </div>

      <ModalCreateEditDepartment
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleCreateEditBranch}
        title={currentBranch ? "Edit Department" : "Create New Department"}
        initialData={currentBranch ? currentBranch : undefined}
        loadingButton={loading}
      />
    </div>
  );
};

export default withAuth(DepartmentPage);
