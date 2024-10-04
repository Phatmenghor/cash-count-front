// src/app/unauthorized-records/page.tsx
"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import ConfirmationDialog from "@/components/modal/ConfirmationDialog";
import Input from "@/components/ui/Input";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { route } from "@/utils/constants/routed";
// import { useRouter } from "next/navigation";

const recordsData = [
  {
    srNumber: "2024080003",
    reconcileDate: "8/31/2024",
    branch: "ASL",
    txnType: "Unauthorized Type 1",
    cashCustodian: "Ouk Makara",
    checker: "Mao Kimhong",
    approver: "Hong Sokviet",
    status: "Processing",
  },
  {
    srNumber: "2024080004",
    reconcileDate: "8/31/2024",
    branch: "ASL",
    txnType: "Unauthorized Type 2",
    cashCustodian: "Ouk Makara",
    checker: "Mao Kimhong",
    approver: "Hong Sokviet",
    status: "Processing",
  },
];

interface Record {
  srNumber: string;
  reconcileDate: string;
  branch: string;
  txnType: string;
  cashCustodian: string;
  checker: string;
  approver: string;
  status: string;
}

const CashRecords = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<Record | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleDeleteRecord = (record: Record) => {
    setRecordToDelete(record);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      toast.success(`Record ${recordToDelete.srNumber} has been deleted!`);
      setRecordToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const filteredRecords = recordsData.filter((record) =>
    record.srNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addCashNew = () => {
    router.push(`${route.CASH_RECORDS}/add`);
  };

  return (
    <div className="2xl:container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Unauthorized Records</h1>

      {/* Search and Add Record Section */}
      <div className="flex items-center mb-4 justify-between whitespace-nowrap">
        <Input
          type="text"
          placeholder="Search by SR Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="py-1 mr-4"
        />
        <Button onClick={addCashNew} className="flex items-center">
          <FiPlus size={18} />
          <span className="ml-1 py-1">Add Record</span>
        </Button>
      </div>

      {/* Records List Table */}
      <div className="overflow-auto">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>SR Number</th>
              <th>Reconcile Date</th>
              <th>Branch</th>
              <th>Txn Type</th>
              <th>Cash Custodian</th>
              <th>Checker</th>
              <th>Approver</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td>{index + 1}</td>
                <td>{record.srNumber}</td>
                <td>{record.reconcileDate}</td>
                <td>{record.branch}</td>
                <td>{record.txnType}</td>
                <td>{record.cashCustodian}</td>
                <td>{record.checker}</td>
                <td>{record.approver}</td>
                <td>{record.status}</td>
                <td className="flex">
                  <button
                    onClick={() => {
                      /* Handle Edit Routing */

                      router.push(`/${route.CASH_RECORDS}/2`);
                    }}
                    className="bg-blue-500 text-white px-2 p-1 rounded hover:bg-blue-600 mr-2 flex items-center"
                  >
                    <FiEdit size={15} />
                  </button>
                  <button
                    onClick={() => handleDeleteRecord(record)}
                    className="bg-red-500 text-white px-2 p-1 rounded hover:bg-red-600 flex items-center mr-2"
                  >
                    <FiTrash2 size={15} />
                  </button>
                  <Button
                    onClick={() => router.push(`/${route.CASH_RECORDS}/add`)}
                    className="px-2 p-[1px]"
                  >
                    Check
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Confirm Delete!"
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete record ${recordToDelete?.srNumber}?`}
      />
    </div>
  );
};

export default CashRecords;
