"use client";
import ModalVerify from "@/components/modal/ModalVerify";
import Button from "@/components/custom/Button";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { CashManagementService } from "@/redux/service/cashManagementService";
import showToast from "@/components/toast/useToast";
import { CashRecordDetailModel } from "@/redux/models/cashManagement/CashRecordDetailModel";
import { CashInSystemModel } from "@/redux/models/cashManagement/CashInSystemModel";
import { FaFilePdf } from "react-icons/fa";
import withAuthWrapper from "@/utils/middleWare/withAuthWrapper";
import { UserRoleEnum } from "@/constants/userRole";
import { decryptId } from "@/utils/security/crypto";
import NotedCash from "@/components/noted/NotedCash";
import { formatNumberWithTwoDecimals } from "@/utils/function/convertMoney";

const ViewCashRecordPage = ({ params }: { params: { id: string } }) => {
  const idCashRecord = params.id ? decryptId(params.id) : null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [cashRecordDetail, setCashRecordDetail] =
    useState<CashRecordDetailModel | null>(null);
  const [cashInSystem, setCashInSystem] = useState<CashInSystemModel | null>(
    null
  );

  const fetchData = useCallback(async () => {
    const response = await CashManagementService.getCashRecordById({
      id: Number(idCashRecord),
    });
    if (response.success) {
      const responseSystem = await CashManagementService.getCashInSystemById({
        id: response.data.cashInSystem.id,
      });
      setCashInSystem(responseSystem);
    }
    setCashRecordDetail(response.data);
  }, [idCashRecord]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
                Vault account
              </th>
              <th colSpan={3} className="text-center">
                Nostro account
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
                {formatNumberWithTwoDecimals(
                  cashRecordDetail?.cashInHandVaultAccount.usdBalance
                )}
              </td>
              <td>
                {formatNumberWithTwoDecimals(
                  cashRecordDetail?.cashInHandVaultAccount.khrBalance
                )}
              </td>
              <td>
                {formatNumberWithTwoDecimals(
                  cashRecordDetail?.cashInHandVaultAccount.thbBalance
                )}
              </td>
              <td>
                {formatNumberWithTwoDecimals(
                  cashRecordDetail?.cashInHandNostroAccount.usdBalance
                )}
              </td>
              <td>
                {formatNumberWithTwoDecimals(
                  cashRecordDetail?.cashInHandNostroAccount.khrBalance
                )}
              </td>
              <td>
                {formatNumberWithTwoDecimals(
                  cashRecordDetail?.cashInHandNostroAccount.thbBalance
                )}
              </td>
            </tr>

            <tr>
              {/* vault account */}
              <td>{"Cash in system"}</td>
              <td>
                {formatNumberWithTwoDecimals(
                  cashInSystem?.vaultAccount.usdBalance
                )}
              </td>
              <td>
                {formatNumberWithTwoDecimals(
                  cashInSystem?.vaultAccount.khrBalance
                )}
              </td>
              <td>
                {formatNumberWithTwoDecimals(
                  cashInSystem?.vaultAccount.thbBalance
                )}
              </td>

              {/* nostro account*/}
              <td>
                {formatNumberWithTwoDecimals(
                  cashInSystem?.nostroAccount.usdBalance
                )}
              </td>
              <td>
                {formatNumberWithTwoDecimals(
                  cashInSystem?.nostroAccount.khrBalance
                )}
              </td>
              <td>
                {formatNumberWithTwoDecimals(
                  cashInSystem?.nostroAccount.thbBalance
                )}
              </td>
            </tr>

            <tr>
              <td>{"Cash result"}</td>
              <td
                className={`${
                  cashRecordDetail?.vaultAccount.usdBalance == 0
                    ? ""
                    : "text-red-700"
                }`}
              >
                {formatNumberWithTwoDecimals(
                  cashRecordDetail?.vaultAccount.usdBalance
                )}
              </td>
              <td
                className={`${
                  cashRecordDetail?.vaultAccount.khrBalance == 0
                    ? ""
                    : "text-red-700"
                }`}
              >
                {formatNumberWithTwoDecimals(
                  cashRecordDetail?.vaultAccount.khrBalance
                )}
              </td>
              <td
                className={`${
                  cashRecordDetail?.vaultAccount.thbBalance == 0
                    ? ""
                    : "text-red-700"
                }`}
              >
                {formatNumberWithTwoDecimals(
                  cashRecordDetail?.vaultAccount.thbBalance
                )}
              </td>
              <td
                className={`${
                  cashRecordDetail?.nostroAccount.usdBalance == 0
                    ? ""
                    : "text-red-700"
                }`}
              >
                {formatNumberWithTwoDecimals(
                  cashRecordDetail?.nostroAccount.usdBalance
                )}
              </td>
              <td
                className={`${
                  cashRecordDetail?.nostroAccount.khrBalance == 0
                    ? ""
                    : "text-red-700"
                }`}
              >
                {formatNumberWithTwoDecimals(
                  cashRecordDetail?.nostroAccount.khrBalance
                )}
              </td>
              <td
                className={`${
                  cashRecordDetail?.nostroAccount.thbBalance == 0
                    ? ""
                    : "text-red-700"
                }`}
              >
                {formatNumberWithTwoDecimals(
                  cashRecordDetail?.nostroAccount.thbBalance
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex space-x-4 mt-6 justify-between">
        {/* Remarks and file upload sections */}
        <div className="max-w-xl min-w-48 flex-1 mb-2 sm:mr-2">
          <label className="block text-xs font-medium text-gray-700 mb-1 line1">
            Remark from created<span className="text-red-500 ml-1">*</span>
          </label>
          <div
            style={{
              maxHeight: "100px",
              overflowY: "auto",
            }}
            className="border rounded px-2 py-1.5 w-full text-xs bg-gray-100 text-gray-700 whitespace-normal break-words"
          >
            {cashRecordDetail?.remarkFromCreate || "No remark"}
          </div>
        </div>

        {/* Display Reference File with PDF Icon */}
        <div className="max-w-xl min-w-48 flex-1 sm:ml-4 mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1 line1">
            Reference file<span className="text-red-500 ml-1">*</span>
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

      <div className="flex space-x-4 mt-2 justify-between">
        {/* Remarks and file upload sections */}
        <div className="max-w-xl  min-w-48 flex-1 mb-2 sm:mr-2">
          <label className="block text-xs font-medium text-gray-700 mb-1 line1">
            Remark from checker<span className="text-red-500 ml-1">*</span>
          </label>
          <div
            style={{
              maxHeight: "100px",
              overflowY: "auto",
            }}
            className="border rounded px-2 py-1.5 w-full text-xs bg-gray-100 text-gray-700 whitespace-normal break-words"
          >
            {cashRecordDetail?.remarkFromChecker || "No remark from checker"}
          </div>
        </div>

        {/* Display Reference File with PDF Icon */}
        <div className="max-w-xl min-w-48 flex-1 sm:ml-4 mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1 line1">
            Remark from authorizer<span className="text-red-500 ml-1">*</span>
          </label>
          <div
            style={{
              maxHeight: "100px",
              overflowY: "auto",
            }}
            className="border rounded px-2 py-1.5 w-full text-xs bg-gray-100 text-gray-700 whitespace-normal break-words"
          >
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
      <NotedCash />
      {/* Modal for alert */}
      <ModalVerify
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Please click 'Verify' before saving."
      />
    </div>
  );
};

export default withAuthWrapper(ViewCashRecordPage, [
  UserRoleEnum.AUTHORIZER_USER,
  UserRoleEnum.CHECKER_USER,
  UserRoleEnum.INPUTTER_USER,
  UserRoleEnum.SHOW_ALL,
]);
