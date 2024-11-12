"use client";
import ModalVerify from "@/components/modal/ModalVerify";
import Button from "@/components/custom/Button";
import Input from "@/components/custom/Input";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  CashManagementService,
  SubmissionData,
} from "@/redux/service/cashManagementService";
import CustomSelect from "@/components/custom/CustomSelect";
import { UserListByInputterModel } from "@/redux/models/userManagement/UserListByInputterModel";
import UserManagementService from "@/redux/service/userManagementService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CashStatusEnum } from "@/redux/models/cashManagement/StatusEnum";
import showToast from "@/components/toast/useToast";
import LoadingFullPage from "@/components/loading/LoadingFullPage";
import { CashInSystemModel } from "@/redux/models/cashManagement/CashInSystemModel";
import { CashRecordDetailModel } from "@/redux/models/cashManagement/CashRecordDetailModel";
import { FaCloudUploadAlt } from "react-icons/fa";
import { UpdateRecordModel } from "@/redux/models/cashManagement/UpdateRecordParam";
import { MdOutlineClear } from "react-icons/md";
import { UserRoleEnum } from "@/constants/userRole";
import withAuthWrapper from "@/utils/middleWare/withAuthWrapper";

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
  approve: Partial<UserListByInputterModel> | null;
  checker: Partial<UserListByInputterModel> | null;
}

const CheckCashManagementPage = ({ params }: { params: { id: number } }) => {
  const idCashRecord = params.id;
  const [cashOnHand, setCashOnHand] = useState<CashRow>({
    vault: { USD: 0, KHR: 0, THB: 0 },
    nostro: { USD: 0, KHR: 0, THB: 0 },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [cashInSystem, setCashInSystem] = useState<CashInSystemModel | null>(
    null
  );
  const [fileName, setFileName] = useState("No file chosen");
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
  const usdVaultResult =
    cashOnHand.vault.USD - (cashInSystem?.vaultAccount.usdBalance || 0);
  const khrVaultResult =
    cashOnHand.vault.KHR - (cashInSystem?.vaultAccount.khrBalance || 0);
  const thbVaultResult =
    cashOnHand.vault.THB - (cashInSystem?.vaultAccount.thbBalance || 0);

  const usdNostroResult =
    cashOnHand.nostro.USD - (cashInSystem?.nostroAccount.usdBalance || 0);
  const khrNostroResult =
    cashOnHand.nostro.USD - (cashInSystem?.nostroAccount.khrBalance || 0);
  const thbNostroResult =
    cashOnHand.nostro.USD - (cashInSystem?.nostroAccount.thbBalance || 0);

  const fetchData = useCallback(async () => {
    try {
      const responseRecord = await CashManagementService.getCashRecordById({
        id: idCashRecord,
      });

      if (responseRecord.success) {
        const item = responseRecord.data;

        const responseSystem = await CashManagementService.getCashInSystemById({
          id: item.cashInSystem.id,
        });

        setCashOnHand({
          vault: {
            KHR: item.cashInHandVaultAccount.khrBalance,
            USD: item.cashInHandVaultAccount.usdBalance,
            THB: item.cashInHandVaultAccount.thbBalance,
          },
          nostro: {
            KHR: item.cashInHandNostroAccount.khrBalance,
            USD: item.cashInHandNostroAccount.usdBalance,
            THB: item.cashInHandNostroAccount.thbBalance,
          },
        });

        setFormData({
          approve: item.approvedBy,
          checker: item.checkerBy,
        });

        if (item.referenceFile) {
          setFileName(item.referenceFile.fileName);
        }

        setRemark(item.remarkFromCreate);
        setCashInSystem(responseSystem);
      }

      setCashRecordDetail(responseRecord.data);

      const response = await UserManagementService.fetchAllUser();
      setAllData(response);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [idCashRecord]);

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input changes
  const handleCashOnHandChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "vault" | "nostro",
    currency: Currency
  ) => {
    const value = e.target.value;

    // Regular expression to allow valid decimal input (e.g., 0.75, 1.2412)
    const isValidMoneyInput = /^(0(\.\d{0,2})?|[1-9]\d*(\.\d{0,2})?)?$/.test(
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

  const handleSaveClick = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const resPDF = await uploadPdf();

    const cashCountData: UpdateRecordModel = {
      checkerBy: { id: formData.checker?.id || 0 },
      approvedBy: { id: formData.approve?.id || 0 },
      createdBy: { id: cashRecordDetail!.createdBy.id },
      referenceFile:
        fileName == "No file chosen"
          ? null
          : {
              id: resPDF ? resPDF : cashRecordDetail!.referenceFile.id,
            },
      cashInSystem: { id: cashInSystem!.id },
      remarkFromCreate: remark ? remark : null,
      status: CashStatusEnum.PENDING,
      branch: { id: cashRecordDetail!.branch.id },
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

    const response = await CashManagementService.updateCashRecord(
      cashRecordDetail!.id,
      cashCountData
    );
    if (response.success) {
      showToast(response.message, "success");
      router.back();
    } else {
      showToast(response.message, "error");
    }
    setLoading(false);
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
        return resposne.data.id;
      } else {
        return null;
      }
    }
    return null;
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setFile(file);
      setFileName(file.name);
    }
  };

  const handleChange = (
    key: keyof typeof formData,
    option: Partial<UserListByInputterModel> | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: option,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };

  function clearPdf() {
    setFile(null);
    setFileName("No file chosen");
  }

  return (
    <div className="px-4">
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
                  value={cashOnHand.vault.USD}
                  onChange={(e) => handleCashOnHandChange(e, "vault", "USD")}
                  className="rounded w-full px-1 py-[1px] -mx-1.5"
                />
              </td>
              <td>
                <Input
                  placeholder="0.00"
                  type="text"
                  value={cashOnHand.vault.KHR}
                  onChange={(e) => handleCashOnHandChange(e, "vault", "KHR")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
              <td>
                <Input
                  placeholder="0.00"
                  type="text"
                  value={cashOnHand.vault.THB}
                  onChange={(e) => handleCashOnHandChange(e, "vault", "THB")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
              <td>
                <Input
                  placeholder="0.00"
                  type="text"
                  value={cashOnHand.nostro.USD}
                  onChange={(e) => handleCashOnHandChange(e, "nostro", "USD")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
              <td>
                <Input
                  placeholder="0.00"
                  type="text"
                  value={cashOnHand.nostro.KHR}
                  onChange={(e) => handleCashOnHandChange(e, "nostro", "KHR")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
              <td>
                <Input
                  placeholder="0.00"
                  type="text"
                  value={cashOnHand.nostro.THB}
                  onChange={(e) => handleCashOnHandChange(e, "nostro", "THB")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
            </tr>

            <tr>
              {/* vault account */}
              <td>{"Cash In System"}</td>
              <td>{cashInSystem?.vaultAccount.usdBalance.toFixed(2)}</td>
              <td>{cashInSystem?.vaultAccount.khrBalance.toFixed(2)}</td>
              <td>{cashInSystem?.vaultAccount.thbBalance.toFixed(2)}</td>

              {/* nostro */}
              <td>{cashInSystem?.nostroAccount.usdBalance.toFixed(2)}</td>
              <td>{cashInSystem?.nostroAccount.khrBalance.toFixed(2)}</td>
              <td>{cashInSystem?.nostroAccount.thbBalance.toFixed(2)}</td>
            </tr>

            <tr>
              <td>{"Cash Result"}</td>
              <td>{usdVaultResult.toFixed(2)}</td>
              <td>{khrVaultResult.toFixed(2)}</td>
              <td>{thbVaultResult.toFixed(2)}</td>
              <td>{usdNostroResult.toFixed(2)}</td>
              <td>{khrNostroResult.toFixed(2)}</td>
              <td>{thbNostroResult.toFixed(2)}</td>
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

        <div className="max-w-[45%] flex-1">
          <label className="block mb-1 text-xs">
            Remark <span className="text-red-500 ml-1">*</span>
          </label>

          <input
            type="file"
            accept="application/pdf"
            id="fileInput"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Container for file input and view more button */}
          <div className="flex justify-between items-center bg-gray-50 rounded px-2 py-1 border  ">
            {/* File upload label */}
            <label
              htmlFor="fileInput"
              className="flex items-center text-xs space-x-2 cursor-pointer"
            >
              <FaCloudUploadAlt className="text-xl text-gray-700" />
              <span className="text-gray-700">{fileName}</span>
            </label>

            {/* View More button on the right side */}

            {fileName != "No file chosen" && (
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={clearPdf}
                  className="flex items-center text-xs underline hover:text-gray-600 text-gray-500 hover:underline"
                >
                  <MdOutlineClear className="text-lg" />
                </button>
              </div>
            )}
          </div>
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
          getOptionLabel={(option) => option.name || ""}
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
          getOptionLabel={(option) => option.name || ""}
          errorMessage={errors.checker}
          required
        />

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1 "
          >
            Creator by<span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            value={userData?.name}
            className="py-1 w-full "
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

export default withAuthWrapper(CheckCashManagementPage, [
  UserRoleEnum.INPUTTER_USER,
]);
