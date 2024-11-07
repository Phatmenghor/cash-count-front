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
  const [currentDepartment, setCurrentDepartment] =
    useState<DepartmentModel | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData(currentPage = 1, pageSize = size) {
    const response = await DepartmentService.getDepartment({
      pageSize,
      currentPage,
    });
    setDepartmentList(response);
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
    const response = await DepartmentService.getDepartment({
      pageSize,
      currentPage: page,
      search,
    });
    setDepartmentList(response);
  }

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  }

  const handleOpenCreateModal = () => {
    setCurrentDepartment(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (branch: DepartmentModel) => {
    setCurrentDepartment(branch);
    setModalOpen(true);
  };

  const handleCreateEditBranch = async (data: {
    code: string;
    name: string;
  }) => {
    if (currentDepartment) {
      updateBranch({ ...currentDepartment, ...data });
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
      showToast(response.data, "error");
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
    <div className="px-4">
      <div className="flex items-center mb-4 justify-between">
        <Input
          type="text"
          placeholder="Search Department ..."
          value={searchTerm}
          onChange={onSearch}
          className="mr-4 py-1 max-w-md"
          data-aos="fade-right"
        />
        <Button
          onClick={handleOpenCreateModal}
          data-aos="fade-left"
          className="text-white flex items-center py-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
        >
          <FiPlus size={18} />
          <span className="ml-1">Add Department</span>
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
            {departmentList.data.length === 0 ? (
              <tr>
                <td colSpan={4} className="hover:bg-white">
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
          options={pageSizeData}
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
        title={currentDepartment ? "Edit Department" : "Create New Department"}
        initialData={currentDepartment ? currentDepartment : undefined}
        loadingButton={loading}
      />
    </div>
  );
};

export default DepartmentPage;
