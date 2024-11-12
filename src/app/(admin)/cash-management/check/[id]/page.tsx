/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ModalVerify from "@/components/modal/ModalVerify";
import Button from "@/components/custom/Button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CashManagementService } from "@/redux/service/cashManagementService";
import { CashStatusEnum } from "@/redux/models/cashManagement/StatusEnum";
import showToast from "@/components/toast/useToast";
import LoadingFullPage from "@/components/loading/LoadingFullPage";
import { CashInSystemModel } from "@/redux/models/cashManagement/CashInSystemModel";
import { CashRecordDetailModel } from "@/redux/models/cashManagement/CashRecordDetailModel";
import { FaFilePdf } from "react-icons/fa";
import { UpdateRecordModel } from "@/redux/models/cashManagement/UpdateRecordParam";
import UserRoleStorage from "@/utils/localStorage/userRoleStorage";
import { UserRoleEnum } from "@/constants/userRole";
import ModalConfirmation from "@/components/modal/ModalConfirmation";
import withAuthWrapper from "@/utils/middleWare/withAuthWrapper";

const CheckCashManagementPage = ({ params }: { params: { id: number } }) => {
  const idCashRecord = params.id;
  const rolesUser = UserRoleStorage.getUserRole();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [cashInSystem, setCashInSystem] = useState<CashInSystemModel | null>(
    null
  );
  const [cashRecordDetail, setCashRecordDetail] =
    useState<CashRecordDetailModel | null>(null);
  const [remarkFromChecker, setRemarkFromChecker] = useState("");
  const [remarkFromAuthorizer, setRemarkFromAuthorizer] = useState("");
  const [modalApprove, setModalApprove] = useState(false);
  const [modalReject, setModalReject] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const responseRecord = await CashManagementService.getCashRecordById({
      id: idCashRecord,
    });
    if (responseRecord.success) {
      const item: CashRecordDetailModel = responseRecord.data;
      const responseSystem = await CashManagementService.getCashInSystemById({
        id: item.cashInSystem.id,
      });
      setCashInSystem(responseSystem);
      setRemarkFromAuthorizer(item.remarkFromAuthorizer || "");
      setRemarkFromChecker(item.remarkFromChecker || "");
    }
    setCashRecordDetail(responseRecord.data);
  }

  function checkStatus(isApprove: boolean) {
    if (!isApprove) {
      return CashStatusEnum.REJECT;
    } else if (rolesUser == UserRoleEnum.CHECKER_USER) {
      return CashStatusEnum.PROCESSING;
    } else if (rolesUser == UserRoleEnum.AUTHORIZER_USER) {
      return CashStatusEnum.APPROVED;
    } else {
      return CashStatusEnum.PENDING;
    }
  }

  const handleSaveClick = async ({ isApprove = false }) => {
    setLoading(true);

    const cashCountData: UpdateRecordModel = {
      createdBy: cashRecordDetail!.createdBy,
      checkerBy: cashRecordDetail!.checkerBy,
      approvedBy: cashRecordDetail!.approvedBy,
      referenceFile: cashRecordDetail?.referenceFile,
      cashInSystem: { id: cashInSystem!.id },
      remarkFromCreate: cashRecordDetail?.remarkFromCreate,
      status: checkStatus(isApprove),
      branch: { id: cashRecordDetail!.branch.id },
      vaultAccount: cashRecordDetail!.vaultAccount,
      nostroAccount: cashRecordDetail!.nostroAccount,
      cashInHandVaultAccount: cashRecordDetail!.cashInHandVaultAccount,
      cashInHandNostroAccount: cashRecordDetail!.cashInHandNostroAccount,
      remarkFromChecker: remarkFromChecker ? remarkFromChecker : null,
      remarkFromAuthorizer: remarkFromAuthorizer ? remarkFromAuthorizer : null,
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

  async function handleReject() {
    handleSaveClick({ isApprove: false });
    setModalReject(false);
  }

  async function handleApprove() {
    handleSaveClick({ isApprove: true });
    setModalApprove(false);
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

              {/* nostro */}
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

      {/* From Checker and Approved */}
      <div className="flex mt-6 gap-8 w-full justify-between ">
        {/* Remarks and file upload sections */}
        <div className="max-w-[45%] flex-1">
          <label className="block text-xs font-medium text-gray-700 mb-1 line1">
            Remark From Created<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="border rounded px-2 py-1.5 w-full text-xs bg-gray-100 text-gray-700">
            {cashRecordDetail?.remarkFromCreate || "No remark provided"}
          </div>
        </div>

        {/* Display Reference File with PDF Icon */}
        <div className="max-w-[45%] flex-1">
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

      <div className="flex flex-1 mt-4 gap-8 w-full justify-between">
        <div className="max-w-[45%] flex-1">
          <label className="block text-xs font-medium text-gray-700 mb-1 line1">
            Remark From Checker<span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            disabled={cashRecordDetail?.status != CashStatusEnum.PENDING}
            className="border border-gray-300 rounded px-2 py-1.5 w-full resize-none text-xs disabled:bg-gray-100 disabled:text-gray-700"
            rows={1}
            placeholder="Enter your remark here..."
            style={{ maxHeight: "100px", overflowY: "auto" }}
            value={remarkFromChecker}
            onInput={(e) => {
              const value = e.currentTarget.value;
              setRemarkFromChecker(value);
              e.currentTarget.style.height = "auto"; // Reset height to auto
              e.currentTarget.style.height = `${Math.min(
                e.currentTarget.scrollHeight,
                100
              )}px`; // Resize up to maxHeight
            }}
          ></textarea>
        </div>

        {rolesUser == UserRoleEnum.AUTHORIZER_USER && (
          <div className="max-w-[45%] flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1 line1">
              Remark From Authorizer<span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              disabled={cashRecordDetail?.status != CashStatusEnum.PROCESSING}
              className="border border-gray-300 rounded px-2 py-1.5 w-full resize-none text-xs disabled:bg-gray-100 disabled:text-gray-700"
              rows={1}
              placeholder="Enter your remark here..."
              style={{ maxHeight: "100px", overflowY: "auto" }}
              value={remarkFromAuthorizer}
              onInput={(e) => {
                const value = e.currentTarget.value;
                setRemarkFromAuthorizer(value);
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = `${Math.min(
                  e.currentTarget.scrollHeight,
                  100
                )}px`; // Resize up to maxHeight
              }}
            ></textarea>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 ">
            Authorizer By<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="border rounded px-2 py-1.5 w-full text-xs bg-gray-100 text-gray-700">
            {cashRecordDetail?.approvedBy.name}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 ">
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
      <div className="flex justify-end space-x-2 mt-6">
        <Button
          onClick={() => setModalReject(true)}
          className="py-0.5 bg-red-500 hover:bg-red-600"
        >
          Reject
        </Button>
        <Button
          onClick={() => {
            router.back();
          }}
          variant="cancel"
          className="py-0.5"
        >
          Cancel
        </Button>
        <Button onClick={() => setModalApprove(true)} className="py-0.5">
          Approve
        </Button>
      </div>
      {/* Modal for alert */}
      <ModalVerify
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Please click 'Verify' before saving."
      />
      <LoadingFullPage
        loading={loading}
        text="Updating record, please wait..."
      />

      {/* Confirmation approve */}
      <ModalConfirmation
        isOpen={modalApprove}
        title="Confirm Approve!"
        onClose={() => setModalApprove(false)}
        onConfirm={handleApprove}
        message={`Are you sure you want to approve?`}
        isNotCancel={true}
      />

      {/* Confirmation Reject */}
      <ModalConfirmation
        isOpen={modalReject}
        title="Confirm Reject!"
        onClose={() => setModalReject(false)}
        onConfirm={handleReject}
        message={`Are you sure you want to reject?`}
      />
    </div>
  );
};

export default withAuthWrapper(CheckCashManagementPage, [
  UserRoleEnum.AUTHORIZER_USER,
  UserRoleEnum.CHECKER_USER,
  UserRoleEnum.INPUTTER_USER,
]);
