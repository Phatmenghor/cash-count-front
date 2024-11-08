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
import { CashInSystemModel } from "@/redux/models/cashManagement/CashInSystemModel";
import { FaFilePdf } from "react-icons/fa";

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
  const [cashInSystem, setCashInSystem] = useState<CashInSystemModel | null>(
    null
  );
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

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await CashManagementService.getCashRecordById({
      id: idCashRecord,
    });
    if (response.success) {
      const responseSystem = await CashManagementService.getCashInSystemById({
        id: response.data.cashInSystem.id,
      });
      setCashInSystem(responseSystem);
    }
    setCashRecordDetail(response.data);
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

  const handleViewFile = async () => {
    const resposne = await CashManagementService.getViewPDFById({
      id: cashRecordDetail!.referenceFile.id,
    });

    if (resposne) {
      window.open(resposne, "_blank");
    } else {
      showToast("Can't view this document, Please try again later", "error");
    }
  };

  return (
    <div className="px-4">
      <div className="overflow-auto">
        {/* Table Header */}
        <table>
          <thead>
            <tr>
              <th rowSpan={2}>Description</th>
              <th colSpan={3} className="text-center">
                Vault Account
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
              <td>
                {cashRecordDetail?.cashInHandVaultAccount.usdBalance.toFixed(2)}
              </td>
              <td>
                {cashRecordDetail?.cashInHandVaultAccount.khrBalance.toFixed(2)}
              </td>
              <td>
                {cashRecordDetail?.cashInHandVaultAccount.thbBalance.toFixed(2)}
              </td>
              <td>
                {cashRecordDetail?.cashInHandNostroAccount.usdBalance.toFixed(
                  2
                )}
              </td>
              <td>
                {cashRecordDetail?.cashInHandNostroAccount.khrBalance.toFixed(
                  2
                )}
              </td>
              <td>
                {cashRecordDetail?.cashInHandNostroAccount.thbBalance.toFixed(
                  2
                )}
              </td>
            </tr>

            <tr>
              {/* vault account */}
              <td>{"Cash In System"}</td>
              <td>{cashInSystem?.vaultAccount.usdBalance.toFixed(2)}</td>
              <td>{cashInSystem?.vaultAccount.khrBalance.toFixed(2)}</td>
              <td>{cashInSystem?.vaultAccount.thbBalance.toFixed(2)}</td>

              {/* nostro account*/}
              <td>{cashInSystem?.nostroAccount.usdBalance.toFixed(2)}</td>
              <td>{cashInSystem?.nostroAccount.khrBalance.toFixed(2)}</td>
              <td>{cashInSystem?.nostroAccount.thbBalance.toFixed(2)}</td>
            </tr>

            <tr>
              <td>{"Cash Result"}</td>
              <td>{cashRecordDetail?.vaultAccount.usdBalance.toFixed(2)}</td>
              <td>{cashRecordDetail?.vaultAccount.khrBalance.toFixed(2)}</td>
              <td>{cashRecordDetail?.vaultAccount.thbBalance.toFixed(2)}</td>
              <td>{cashRecordDetail?.nostroAccount.usdBalance.toFixed(2)}</td>
              <td>{cashRecordDetail?.nostroAccount.khrBalance.toFixed(2)}</td>
              <td>{cashRecordDetail?.nostroAccount.thbBalance.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex mt-6">
        {/* Remarks and file upload sections */}
        <div className="max-w-2xl flex-1 mb-2 sm:mr-2">
          <label className="block text-xs font-medium text-gray-700 mb-1 line1">
            Remark From Created<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="border rounded px-2 py-1.5 w-full text-xs bg-gray-100 text-gray-700">
            {cashRecordDetail?.remarkFromCreate || "No remark provided"}
          </div>
        </div>

        {/* Display Reference File with PDF Icon */}
        <div className="max-w-2xl flex-1 sm:ml-4 mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1 line1">
            Reference File<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="border rounded  py-1 px-2 w-full text-xs bg-gray-100 text-gray-700 flex items-center">
            <div className="flex flex-1 items-center space-x-2">
              <FaFilePdf className="text-red-600" size={21} />
              <span>
                {cashRecordDetail?.referenceFile
                  ? cashRecordDetail?.referenceFile.fileName
                  : "No file uploaded"}
              </span>
            </div>
            {cashRecordDetail?.referenceFile && (
              <div
                className="ml-2 px-3 text-xs text-blue-700 underline cursor-pointer"
                onClick={handleViewFile}
              >
                View File
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex mt-2">
        {/* Remarks and file upload sections */}
        <div className="max-w-2xl flex-1 mb-2 sm:mr-2">
          <label className="block text-xs font-medium text-gray-700 mb-1 line1">
            Remark From Checker<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="border rounded px-2 py-1.5 w-full text-xs bg-gray-100 text-gray-700">
            {cashRecordDetail?.remarkFromChecker || "No remark from checker"}
          </div>
        </div>

        {/* Display Reference File with PDF Icon */}
        <div className="max-w-2xl flex-1 sm:ml-4 mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1 line1">
            Remark From Authorizer<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="border rounded px-2 py-1.5 w-full text-xs bg-gray-100 text-gray-700">
            {cashRecordDetail?.remarkFromAuthorizer ||
              "No remark from authorizer"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 ">
            Authorizer By<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="border rounded px-2 py-1.5 w-full text-xs bg-gray-100 text-gray-700">
            {cashRecordDetail?.approvedBy.name}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Checker By<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="border rounded px-2 py-1.5 w-full text-xs bg-gray-100 text-gray-700">
            {cashRecordDetail?.checkerBy.name}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 ">
            Created By<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="border rounded px-2 py-1.5 w-full text-xs bg-gray-100 text-gray-700">
            {cashRecordDetail?.createdBy.name}
          </div>
        </div>
      </div>
      {/* Save and Cancel Buttons */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={() => {
            router.back();
          }}
          variant="cancel"
          className="py-0.5"
        >
          Back
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

export default page;
