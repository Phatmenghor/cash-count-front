"use client";
import ModalVerify from "@/components/modal/ModalVerify";
import Button from "@/components/custom/Button";
import Input from "@/components/custom/Input";
import withAuth from "@/configs/withAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { VerifyCashModel } from "@/redux/models/cashManagement/VerifyCashModel";
import {
  CashManagementService,
  SubmissionData,
} from "@/redux/service/cashManagementService";
import CustomSelect from "@/components/custom/CustomSelect";
import { UserListByInputterModel } from "@/redux/models/userManagement/UserListByInputterModel";
import UserManagementService from "@/redux/service/userManagementService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FileResponseModel } from "@/redux/models/cashManagement/FileResponseModel";
import { CashStatusEnum } from "@/redux/models/cashManagement/StatusEnum";
import { AddRecordParamModel } from "@/redux/models/cashManagement/AddRecordParamModel";
import showToast from "@/components/toast/useToast";
import { CashRecordDetailModel } from "@/redux/models/cashManagement/CashRecordDetailModel";

type Currency = "USD" | "KHR" | "THB";

interface CashRow {
  vault: Record<Currency, number>;
  nostro: Record<Currency, number>;
}

interface AllUserType {
  approve: UserListByInputterModel[] | null;
  checker: UserListByInputterModel[] | null;
}

interface FormDataType {
  approve: UserListByInputterModel | null;
  checker: UserListByInputterModel | null;
}

const page = ({ params }: { params: { id: number } }) => {
  const idCashRecord = params.id;
  const [cashOnHand, setCashOnHand] = useState<CashRow>({
    vault: { USD: 0, KHR: 0, THB: 0 },
    nostro: { USD: 0, KHR: 0, THB: 0 },
  });
  const [isVerified, setIsVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [verifyCash, setVerifyCash] = useState<VerifyCashModel | null>(null);
  const [cashRecordDetail, setCashRecordDetail] =
    useState<CashRecordDetailModel | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [remark, setRemark] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [allData, setAllData] = useState<AllUserType>({
    approve: null,
    checker: null,
  });
  const [formData, setFormData] = useState<FormDataType>({
    approve: null,
    checker: null,
  });
  const { userData } = useSelector((state: RootState) => state.user);

  console.log("### ==idCashRecord", idCashRecord);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await CashManagementService.getCashRecordById({
      id: idCashRecord,
    });
    setCashRecordDetail(response);
  }

  // Handle input changes
  const handleCashOnHandChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "vault" | "nostro",
    currency: Currency
  ) => {
    let value = e.target.value;

    // Regular expression to allow valid decimal input (e.g., 0.75, 1.2412)
    const isValidMoneyInput = /^(0(\.\d{0,9})?|[1-9]\d*(\.\d{0,9})?)?$/.test(
      value
    );

    console.log("Is valid money input:", isValidMoneyInput);
    if (!isValidMoneyInput) {
      return;
    }

    // If the input is valid, parse it; otherwise, keep it as an empty string
    const numericValue = isValidMoneyInput ? value : "";

    // Update state
    setCashOnHand((prev) => {
      const newState = {
        ...prev,
        [type]: { ...prev[type], [currency]: numericValue },
      };
      return newState;
    });
  };

  const handleVerifyClick = async () => {
    setIsVerified(true);
    const resposne = await CashManagementService.getVerifyRecord();
    setVerifyCash(resposne);
  };

  const handleSaveClick = async () => {
    if (!isVerified) {
      setIsModalOpen(true); // Open modal if not verified
    } else {
      const resPDF = await uploadPdf();

      if (!validateForm()) {
        return;
      }

      const cashCountData: AddRecordParamModel = {
        checkerBy: { id: formData.checker!.id },
        approvedBy: { id: formData.approve!.id },
        referenceFile: resPDF,
        cashInSystem: { id: verifyCash!.id },
        remarkFromCreate: remark.length > 0 ? remark : null,
        status: CashStatusEnum.PENDING,
        vaultAccount: {
          usdBalance: cashOnHand.vault.USD,
          khrBalance: cashOnHand.vault.KHR,
          thbBalance: cashOnHand.vault.THB,
        },
        nostroAccount: {
          usdBalance: cashOnHand.nostro.USD,
          khrBalance: cashOnHand.nostro.KHR,
          thbBalance: cashOnHand.nostro.THB,
        },
      };

      const response = await CashManagementService.createCashRecord(
        cashCountData
      );

      if (response.success) {
        showToast(response.message, "success");
        router.back();
      } else {
        showToast(response.message, "error", 6000);
      }

      console.log("### ==cashCountData", cashCountData);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const { approve, checker } = formData;

    if (!approve || !approve.id) {
      newErrors.approve = "Approve by is required.";
    }
    if (!checker || !checker.id) {
      newErrors.checker = "Checker by is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function uploadPdf() {
    if (file) {
      const data: SubmissionData = {
        file,
      };
      const resposne = await CashManagementService.uploadFileRecord(data);
      if (resposne.success) {
        return {
          id: resposne.data.id,
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setFile(file);
    }
  };

  const handleChange = (key: keyof typeof formData, option: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: option,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };

  console.log("### ==response", cashRecordDetail);

  return (
    <div className="mx-1 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-700 text-2xl font-bold hide">
          View CashRecord
        </h2>
        <Button
          onClick={handleVerifyClick}
          disabled={isVerified}
          className={`flex items-center py-0.5 ${
            isVerified
              ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
              : "bg-blue-500"
          }`}
        >
          Edit
        </Button>
      </div>
      <div className="overflow-auto">
        {/* Table Header */}
        <table>
          <thead>
            <tr>
              <th rowSpan={2}>Description</th>
              <th colSpan={3} className="text-center">
                Vault
              </th>
              <th colSpan={3} className="text-center">
                Nostro Account
              </th>
            </tr>
            <tr>
              <th>USD</th>
              <th>KHR</th>
              <th>THB</th>
              <th>USD</th>
              <th>KHR</th>
              <th>THB</th>
            </tr>
          </thead>
          <tbody>
            {/* Cash On Hand (Editable) */}
            <tr>
              <td>{"Cash on hand"}</td>
              <td>{cashRecordDetail?.vaultAccount.usdBalance}</td>
              <td>{cashRecordDetail?.vaultAccount.khrBalance}</td>
              <td>{cashRecordDetail?.vaultAccount.thbBalance}</td>
              <td>{cashRecordDetail?.nostroAccount.usdBalance}</td>
              <td>{cashRecordDetail?.nostroAccount.khrBalance}</td>
              <td>{cashRecordDetail?.nostroAccount.thbBalance}</td>
            </tr>

            <tr>
              {/* vault account */}
              <td>{"Cash In System"}</td>
              <td>
                {isVerified
                  ? verifyCash?.vaultAccount.usdBalance.toFixed(2)
                  : "0.00"}
              </td>
              <td>
                {isVerified
                  ? verifyCash?.vaultAccount.khrBalance.toFixed(2)
                  : "0.00"}
              </td>
              <td>
                {isVerified
                  ? verifyCash?.vaultAccount.thbBalance.toFixed(2)
                  : "0.00"}
              </td>

              {/* nostro */}
              <td>
                {isVerified
                  ? verifyCash?.nostroAccount.usdBalance.toFixed(2)
                  : "0.00"}
              </td>
              <td>
                {isVerified
                  ? verifyCash?.nostroAccount.khrBalance.toFixed(2)
                  : "0.00"}
              </td>
              <td>
                {isVerified
                  ? verifyCash?.nostroAccount.thbBalance.toFixed(2)
                  : "0.00"}
              </td>
            </tr>

            <tr>
              <td>{"Cash Result"}</td>
              <td>
                {isVerified
                  ? (
                      cashOnHand.vault.USD -
                      (verifyCash?.vaultAccount.usdBalance || 0)
                    ).toFixed(2)
                  : "0.00"}
              </td>
              <td>
                {isVerified
                  ? (
                      cashOnHand.vault.KHR -
                      (verifyCash?.vaultAccount.khrBalance || 0)
                    ).toFixed(2)
                  : "0.00"}
              </td>
              <td>
                {isVerified
                  ? (
                      cashOnHand.vault.THB -
                      (verifyCash?.vaultAccount.thbBalance || 0)
                    ).toFixed(2)
                  : "0.00"}
              </td>
              <td>
                {isVerified
                  ? (
                      cashOnHand.nostro.USD -
                      (verifyCash?.nostroAccount.usdBalance || 0)
                    ).toFixed(2)
                  : "0.00"}
              </td>
              <td>
                {isVerified
                  ? (
                      cashOnHand.nostro.KHR -
                      (verifyCash?.nostroAccount.khrBalance || 0)
                    ).toFixed(2)
                  : "0.00"}
              </td>
              <td>
                {isVerified
                  ? (
                      cashOnHand.nostro.THB -
                      (verifyCash?.nostroAccount.thbBalance || 0)
                    ).toFixed(2)
                  : "0.00"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Remarks and file upload sections */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-start">
        <div className="max-w-2xl flex-1 mb-2 sm:mr-2">
          <label className="block mb-1 text-sm">
            Remark <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            className="border rounded px-2 py-1.5 w-full resize-none text-xs"
            rows={1}
            placeholder="Enter your remark here..."
            style={{ maxHeight: "100px", overflowY: "auto" }}
            value={remark}
            onInput={(e) => {
              const value = e.currentTarget.value;
              setRemark(value);
              e.currentTarget.style.height = "auto"; // Reset height to auto
              e.currentTarget.style.height = `${Math.min(
                e.currentTarget.scrollHeight,
                100
              )}px`; // Resize up to maxHeight
            }}
          ></textarea>
        </div>

        {/* Upload PDF File */}
        <div className="flex-1 sm:ml-4">
          <label className="block mb-1 text-sm">
            Reference File <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            type="file"
            className="rounded px-1 w-full max-w-full py-1 text-xs"
            accept="application/pdf"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Approvals section */}
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">
            Approve by<span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            value={cashRecordDetail?.approvedBy.name}
            className="py-1 w-full"
            disabled={true}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">
            Checker by<span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            value={cashRecordDetail?.checkerBy.name}
            className="py-1 w-full"
            disabled={true}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">
            Creator by<span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            value={cashRecordDetail?.createdBy.name}
            className="py-1 w-full"
            disabled={true}
          />
        </div>
      </div>
      {/* Save and Cancel Buttons */}
      <div className="flex justify-end space-x-2 mt-6">
        <Button
          onClick={() => {
            router.back();
          }}
          variant="cancel"
          className="py-1"
        >
          Cancel
        </Button>
        <Button onClick={handleSaveClick} className="py-1">
          Save
        </Button>
      </div>
      {/* Modal for alert */}
      <ModalVerify
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Please click 'Verify' before saving."
      />
    </div>
  );
};

export default withAuth(page);
