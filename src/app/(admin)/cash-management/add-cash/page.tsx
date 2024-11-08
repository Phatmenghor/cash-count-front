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
import LoadingFullPage from "@/components/loading/LoadingFullPage";

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

const AddCashManagementPage = () => {
  // State for cash on hand input
  const [cashOnHand, setCashOnHand] = useState<CashRow>({
    vault: { USD: 0, KHR: 0, THB: 0 },
    nostro: { USD: 0, KHR: 0, THB: 0 },
  });
  const [isVerified, setIsVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [verifyCash, setVerifyCash] = useState<VerifyCashModel | null>(null);
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
  const usdVaultResult =
    cashOnHand.vault.USD - (verifyCash?.vaultAccount.usdBalance || 0);
  const khrVaultResult =
    cashOnHand.vault.KHR - (verifyCash?.vaultAccount.khrBalance || 0);
  const thbVaultResult =
    cashOnHand.vault.THB - (verifyCash?.vaultAccount.thbBalance || 0);

  const usdNostroResult =
    cashOnHand.nostro.USD - (verifyCash?.nostroAccount.usdBalance || 0);
  const khrNostroResult =
    cashOnHand.nostro.USD - (verifyCash?.nostroAccount.khrBalance || 0);
  const thbNostroResult =
    cashOnHand.nostro.USD - (verifyCash?.nostroAccount.thbBalance || 0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await UserManagementService.fetchAllUser();
    setAllData(response);
  }

  // Handle input changes
  const handleCashOnHandChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "vault" | "nostro",
    currency: Currency
  ) => {
    const value = e.target.value;

    // Regular expression to allow valid decimal input (e.g., 0.75, 1.2412)
    const isValidMoneyInput = /^(0(\.\d{0,9})?|[1-9]\d*(\.\d{0,9})?)?$/.test(
      value
    );
    if (!isValidMoneyInput) {
      return;
    }
    // If the input is valid, parse it; otherwise, keep it as an empty string
    const numericValue = isValidMoneyInput ? value : "";
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
      setIsModalOpen(true);
    } else {
      if (!validateForm()) {
        return;
      }
      setLoading(true);
      const resPDF = await uploadPdf();
      const cashCountData: AddRecordParamModel = {
        checkerBy: { id: formData.checker!.id },
        approvedBy: { id: formData.approve!.id },
        referenceFile: resPDF,
        cashInSystem: { id: verifyCash!.id },
        remarkFromCreate: remark.length > 0 ? remark : null,
        status: CashStatusEnum.PENDING,
        vaultAccount: {
          usdBalance: usdVaultResult,
          khrBalance: khrVaultResult,
          thbBalance: thbVaultResult,
        },
        nostroAccount: {
          usdBalance: usdNostroResult,
          khrBalance: khrNostroResult,
          thbBalance: thbNostroResult,
        },
        cashInHandVaultAccount: {
          usdBalance: cashOnHand.nostro.USD,
          khrBalance: cashOnHand.nostro.KHR,
          thbBalance: cashOnHand.nostro.THB,
        },
        cashInHandNostroAccount: {
          usdBalance: cashOnHand.vault.USD,
          khrBalance: cashOnHand.vault.KHR,
          thbBalance: cashOnHand.vault.THB,
        },
      };
      const response = await CashManagementService.createCashRecord(
        cashCountData
      );
      if (response.success) {
        showToast(response.message, "success");
        router.back();
      } else {
        showToast(response.message, "error");
      }
      setLoading(false);
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

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-700 hide">Add CashRecord</h2>
        <Button
          onClick={handleVerifyClick}
          disabled={isVerified}
          className={`flex items-center py-0.5 ${
            isVerified
              ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
              : "bg-blue-500"
          }`}
        >
          <FiCheckCircle
            className={`mr-2 ${isVerified ? "opacity-50" : "animate-spin"}`}
          />
          Verify
        </Button>
      </div>
      <div className="overflow-auto">
        {/* Table Header */}
        <table>
          <thead>
            <tr>
              <th rowSpan={2}>Description</th>
              <th colSpan={3} className="text-center">
                Vault​ Account
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
                <Input
                  placeholder="0.00"
                  type="text"
                  value={cashOnHand.vault.USD === 0 ? "" : cashOnHand.vault.USD}
                  onChange={(e) => handleCashOnHandChange(e, "vault", "USD")}
                  className="rounded w-full px-1 py-[1px] -mx-1.5"
                />
              </td>
              <td>
                <Input
                  placeholder="0.00"
                  type="text"
                  value={cashOnHand.vault.KHR === 0 ? "" : cashOnHand.vault.KHR}
                  onChange={(e) => handleCashOnHandChange(e, "vault", "KHR")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
              <td>
                <Input
                  placeholder="0.00"
                  type="text"
                  value={cashOnHand.vault.THB === 0 ? "" : cashOnHand.vault.THB}
                  onChange={(e) => handleCashOnHandChange(e, "vault", "THB")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
              <td>
                <Input
                  placeholder="0.00"
                  type="text"
                  value={
                    cashOnHand.nostro.USD === 0 ? "" : cashOnHand.nostro.USD
                  }
                  onChange={(e) => handleCashOnHandChange(e, "nostro", "USD")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
              <td>
                <Input
                  placeholder="0.00"
                  type="text"
                  value={
                    cashOnHand.nostro.KHR === 0 ? "" : cashOnHand.nostro.KHR
                  }
                  onChange={(e) => handleCashOnHandChange(e, "nostro", "KHR")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
              <td>
                <Input
                  placeholder="0.00"
                  type="text"
                  value={
                    cashOnHand.nostro.THB === 0 ? "" : cashOnHand.nostro.THB
                  }
                  onChange={(e) => handleCashOnHandChange(e, "nostro", "THB")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
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
              <td>{isVerified ? usdVaultResult.toFixed(2) : "0.00"}</td>
              <td>{isVerified ? khrVaultResult.toFixed(2) : "0.00"}</td>
              <td>{isVerified ? thbVaultResult.toFixed(2) : "0.00"}</td>
              <td>{isVerified ? usdNostroResult.toFixed(2) : "0.00"}</td>
              <td>{isVerified ? khrNostroResult.toFixed(2) : "0.00"}</td>
              <td>{isVerified ? thbNostroResult.toFixed(2) : "0.00"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Remarks and file upload sections */}
      <div className="flex flex-1 mt-4 gap-8 w-full justify-between">
        <div className="max-w-[45%] flex-1">
          <label className="block mb-1 text-xs">
            Remark <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            className="border rounded px-2 py-1.5 w-full resize-none text-xs bg-gray-50 border-gray-300"
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
        <div className="max-w-[45%] flex-1">
          <label className="block mb-1 text-xs">
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
        {/* Approve By */}
        <CustomSelect
          id="approveBy"
          value={formData.approve}
          onChange={(option) => handleChange("approve", option)}
          options={allData.approve}
          label="Approve By"
          getOptionLabel={(option) => option.name}
          errorMessage={errors.approve}
          required
        />

        {/* Checker by */}
        <CustomSelect
          id="checkerBy"
          value={formData.checker}
          onChange={(option) => handleChange("checker", option)}
          options={allData.checker}
          label="Checker By"
          getOptionLabel={(option) => option.name}
          errorMessage={errors.checker}
          required
        />

        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium text-gray-700 mb-1 "
          >
            Creator by<span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            value={userData?.name}
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

      <LoadingFullPage loading={loading} text="Adding record, please wait..." />
    </div>
  );
};

export default AddCashManagementPage;
