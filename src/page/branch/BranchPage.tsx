"use client";
import React, { useCallback, useEffect, useState } from "react";
import Pagination from "@/components/pagination/Pagination";
import Button from "@/components/custom/Button";
import Input from "@/components/custom/Input";
import { pageSize } from "@/constants/dataListing";
import { BranchListModel } from "@/redux/models/branch/BranchListModel";
import { BranchService } from "@/redux/service/branchService";
import { FiEdit, FiPlus } from "react-icons/fi";
import { debounce } from "@/utils/function/debounce";
import EmptyState from "@/components/emthyData/EmptyState";
import DropdownSize from "@/components/custom/DropdownSize";
import ModalCreateEditBranch from "@/components/modal/ModalCreateEditBranch";
import { BranchModel } from "@/redux/models/register/BranchModel";
import showToast from "@/components/toast/useToast";
import FullPageSkeleton from "@/components/loading/FullPageSkeleton";

const BranchPage: React.FC = () => {
  const [branchList, setBranchList] = useState<BranchListModel>({
    data: [],
    pagination: null,
  });
  const [size, setSize] = useState<number>(15);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const headers = ["Number", "Mnemonic", "Branch Code", "City", "Actions"];
  const listSize = branchList.pagination?.currentPage ?? 15;
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Set initial loading state to true
  const [loadingFirst, setLoadingFirst] = useState(true);
  const [currentBranch, setCurrentBranch] = useState<BranchModel | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData(currentPage = 1, pageSize = size) {
    setLoadingFirst(true);
    const response = await BranchService.getBranch({
      pageSize,
      currentPage,
    });
    setBranchList({
      data: response.data,
      pagination: response.pagination,
    });
    setLoadingFirst(false);
  }

  function onPageChange(value: number) {
    fetchData(value, branchList.pagination?.pageSize ?? 15);
  }

  function handlePageSize(value: number) {
    setSize(value);
    fetchData(branchList.pagination?.currentPage, value);
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
    setBranchList({
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

  const handleOpenEditModal = (branch: BranchModel) => {
    setCurrentBranch(branch);
    setModalOpen(true);
  };

  const handleCreateEditBranch = async (data: {
    branchCode: string;
    mnemonic: string;
    city: string;
  }) => {
    if (currentBranch) {
      updateBranch({ ...currentBranch, ...data });
    } else {
      createBranch(data);
    }

    setModalOpen(false);
  };

  async function createBranch(data: {
    branchCode: string;
    mnemonic: string;
    city: string;
  }) {
    setLoading(true);
    const response = await BranchService.createBranch({
      branchCode: data.branchCode,
      city: data.city,
      mnemonic: data.mnemonic,
    });

    if (response.success) {
      setBranchList((prevBranchList) => ({
        ...prevBranchList,
        data: [response.data, ...prevBranchList.data],
      }));
      showToast("Branch created successfully!", "success");
    } else {
      showToast(response.data, "error");
    }
    setLoading(false);
  }

  async function updateBranch(data: BranchModel) {
    setLoading(true);
    const response = await BranchService.updateBranch(data);

    if (response.success) {
      setBranchList((prevBranchList) => ({
        ...prevBranchList,
        data: prevBranchList.data.map((branch) =>
          branch.id === data.id ? response.data : branch
        ),
      }));
      showToast("Branch updated successfully!", "success");
    } else {
      showToast("Failed to update branch.", "error", 7000);
    }
    setLoading(false);
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center mb-4 justify-between">
        <Input
          type="text"
          placeholder="Search Branch ..."
          value={searchTerm}
          onChange={onSearch}
          className="mr-4 py-1"
        />
        <Button
          onClick={handleOpenCreateModal}
          className="text-white flex items-center py-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
        >
          <FiPlus size={18} />
          <span className="ml-1">Add Branch</span>
        </Button>
      </div>

      <div className="overflow-x-auto min-h-[50vh]">
        {loadingFirst ? (
          <FullPageSkeleton />
        ) : branchList.data.length === 0 ? (
          <EmptyState message="No branch available." />
        ) : (
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
              {branchList.data.map((branch, index) => {
                const displayIndex = (listSize - 1) * size + index + 1;
                return (
                  <tr key={branch.id} className="hover:bg-gray-200">
                    <td>{displayIndex}</td>
                    <td>{branch.mnemonic}</td>
                    <td>{branch.branchCode}</td>
                    <td>{branch.city}</td>
                    <td>
                      <button
                        onClick={() => {
                          handleOpenEditModal(branch);
                        }}
                        className="bg-blue-500 text-white px-2 p-1 rounded hover:bg-blue-600 mr-2 flex items-center"
                      >
                        <FiEdit size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between mt-8 mb-16">
        <DropdownSize
          options={pageSize}
          onSelect={handlePageSize}
          label="Select Size"
        />
        {branchList.data.length > 0 && (
          <Pagination
            totalPages={branchList.pagination?.totalPages ?? 1}
            currentPage={branchList.pagination?.currentPage ?? 1}
            onPageChange={onPageChange}
          />
        )}
      </div>

      <ModalCreateEditBranch
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleCreateEditBranch}
        title={currentBranch ? "Edit Branch" : "Create New Branch"}
        initialData={currentBranch ? currentBranch : undefined}
        loadingButton={loading}
      />
    </div>
  );
};

export default BranchPage;
