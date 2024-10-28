/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import Pagination from "@/components/pagination/Pagination";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import withAuth from "@/configs/withAuth";
import { pageSize } from "@/constants/dataListing";
import { BranchListModel } from "@/redux/models/branch/BranchListModel";
import { BranchService } from "@/redux/service/branchService";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import throttle from "lodash/throttle";
import { debounce } from "@/utils/function/debounce";

const BranchPage: React.FC = () => {
  const [branchList, setBranchList] = useState<BranchListModel>({
    data: [],
    pagination: null,
  });
  const [size, setSize] = useState("15");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const headers = ["Number", "Mnemonic", "Branch Code", "City", "Actions"];

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData(page = 1, pageSize = size) {
    const response = await BranchService.getBranch({
      pageSize: pageSize,
      currentPage: page,
    });
    setBranchList({
      data: response.data,
      pagination: response.pagination,
    });
  }

  const haha = throttle((name: string) => {
    console.log("## ==HELE", name);
  }, 2000);

  function onPageChange(value: number) {
    fetchData(value, branchList.pagination?.pageSize ?? "15");
  }

  function handlePageSize(value: string) {
    setSize(value);
    fetchData(branchList.pagination?.currentPage, value);
  }

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (query) {
        console.log("### ==== haha", query);
      }
    }),
    []
  );

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Branch List</h1>

      {/* Search and Add Record Section */}
      <div className="flex items-center mb-4 justify-between">
        <Input
          type="text"
          placeholder="Search Branch ..."
          value={searchTerm}
          onChange={onSearch}
          className="mr-4 py-1"
        />
        <Button
          onClick={() => {}}
          className="text-white flex items-center py-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
        >
          <FiPlus size={18} />
          <span className="ml-1">Add Record</span>
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
            {branchList.data.map((branch, index) => (
              <tr key={branch.id} className="hover:bg-gray-200">
                <td>{index + 1}</td>
                <td>{branch.mnemonic}</td>
                <td>{branch.branchCode}</td>
                <td>{branch.city}</td>
                <td className="flex items-center">
                  <button
                    onClick={() => {}}
                    className="bg-blue-500 text-white px-2 p-1 rounded hover:bg-blue-600 mr-2 flex items-center"
                  >
                    <FiEdit size={14} />
                  </button>
                  <button
                    onClick={() => {}}
                    className="bg-red-500 text-white px-2 p-1 rounded hover:bg-red-600 flex items-center"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && (
        <div className="flex justify-between mt-8">
          <Dropdown
            options={pageSize}
            onSelect={handlePageSize}
            label="15"
            isSize={true}
          />
          <Pagination
            totalPages={branchList.pagination?.totalPages ?? 1}
            currentPage={branchList.pagination?.currentPage ?? 1}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default withAuth(BranchPage);
