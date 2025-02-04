"use client";
import { axiosWithAuth } from "@/utils/api/axios";
import React, { useState } from "react";
import { DateRangePicker } from "@/components/custom/DateRangePicker";
import { headersReport, statusCashData } from "@/constants/dataListing";
import FilterStatusCash from "@/components/custom/FilterStatusCash";
import Input from "@/components/custom/Input";
import { FaEye, FaFileExcel } from "react-icons/fa";
import Button from "@/components/custom/Button";
import { CashStatusEnum } from "@/redux/models/cashManagement/StatusEnum";
import FormMessage from "@/components/errorHandle/FormMessage";
import { ReportService } from "@/redux/service/reportService";
import { ReportFullModel } from "@/redux/models/report/ReportModel";
import EmptyState from "@/components/emthyData/EmptyState";
import LoadingFullPage from "@/components/loading/LoadingFullPage";
import showToast from "@/components/toast/useToast";
import { UserRoleEnum } from "@/constants/userRole";
import withAuthWrapper from "@/utils/middleWare/withAuthWrapper";
import { formatNumberWithTwoDecimals } from "@/utils/function/convertMoney";
import Pagination from "@/components/pagination/Pagination";
import { useRouter } from "next/navigation";

function CashReportPage() {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [selectedEndDate, setSelectedEndDate] = useState<string>("");
  const [status, SetStatus] = useState<string>(CashStatusEnum.ALL);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const [dataListingPreview, setDataListingPreview] =
    useState<ReportFullModel | null>(null);

  // Handle date change from DateRangePicker or text input
  const handleDateChange = (date: string) => {
    setSelectedDate(date); // Update state with new date
  };

  const handleDownload = async (selectedDate: string) => {
    setLoading(true);

    try {
      const response = await axiosWithAuth.get("/api/report/generate-excel", {
        params: {
          fromDate: selectedDate,
          toDate: selectedDate,
        },
        responseType: "arraybuffer",
      });

      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "CashCountReport.xlsx";
      link.click(); // Trigger the download
    } catch (err) {
      console.error(err);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedDate) newErrors.selectedDate = "From date is required.";
    if (!selectedEndDate) newErrors.selectedEndDate = "To date is required.";
    if (!status) newErrors.status = "Status is required.";

    if (
      selectedDate &&
      selectedEndDate &&
      new Date(selectedEndDate) < new Date(selectedDate)
    ) {
      newErrors.selectedEndDate = "To date must be later than from date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleFilterStatus(status: string) {
    SetStatus(status);
  }

  async function getDataReportPreview() {
    if (!validateForm() || loading) return;
    setErrors({});
    setLoading(true);
    const resposne = await ReportService.getAllReport({
      fromDate: selectedDate,
      toDate: selectedEndDate,
      status: status == CashStatusEnum.ALL ? "" : status,
    });
    console.log("@@@ resposne", resposne);
    setDataListingPreview(resposne);
    setLoading(false);
    setOpenPreview(true);
  }

  async function getGenerateExcel() {
    if (!validateForm() || loading) return;
    setErrors({});
    setLoading(true);
    try {
      const file = await ReportService.getDownloadReport({
        fromDate: selectedDate,
        toDate: selectedEndDate,
        status: status == CashStatusEnum.ALL ? "" : status,
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "CashCountReport.xlsx";
      link.click();
      setLoading(false);
      showToast("Generate Report to excel successfully!", "success");
    } catch {
      setLoading(false);
      showToast("Failed to generate report. Please try again.", "error");
    }
  }

  async function onPageChange(page: number) {
    const resposne = await ReportService.getAllReport({
      fromDate: selectedDate,
      toDate: selectedEndDate,
      status: status == CashStatusEnum.ALL ? "" : status,
      pageNumber: page,
    });
    setDataListingPreview(resposne);
  }

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 data-aos="fade-right" className="text-gray-700 hide">
          Cash Report
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDownload(selectedDate || "");
        }}
      >
        <div className="flex  justify-between">
          <div className="flex space-x-4" data-aos="fade-right">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                From date<span className="text-red-500 ml-1">*</span>
              </label>
              <DateRangePicker
                initialDate={selectedDate}
                onDateChange={handleDateChange}
              />
              {errors.selectedDate && (
                <FormMessage message={errors.selectedDate} type="error" />
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                To date<span className="text-red-500 ml-1">*</span>
              </label>
              <DateRangePicker
                initialDate={selectedEndDate}
                onDateChange={setSelectedEndDate}
              />
              {errors.selectedEndDate && (
                <FormMessage message={errors.selectedEndDate} type="error" />
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                From date (YYYY-MM-DD)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="text"
                value={selectedDate}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const regex =
                    /^(?:\d{0,4}|\d{0,4}-\d{0,2}|\d{0,4}-\d{0,2}-\d{0,2})$/;

                  // Allow typing in the input field, validate on change
                  if (regex.test(inputValue)) {
                    setSelectedDate(inputValue);
                  }
                }}
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                className="border border-gray-300 px-2 py-1.5 w-[200px]"
              />
              {errors.selectedDate && (
                <FormMessage message={errors.selectedDate} type="error" />
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                To date (YYYY-MM-DD)<span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="text"
                value={selectedEndDate}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const regex =
                    /^(?:\d{0,4}|\d{0,4}-\d{0,2}|\d{0,4}-\d{0,2}-\d{0,2})$/;

                  if (regex.test(inputValue)) {
                    setSelectedEndDate(inputValue);
                  }
                }}
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                className="border border-gray-300 px-2 py-1.5 w-[200px]"
              />
              {errors.selectedEndDate && (
                <FormMessage message={errors.selectedEndDate} type="error" />
              )}
            </div>
          </div>
          <div data-aos="fade-left">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              status<span className="text-red-500 ml-1">*</span>
            </label>
            <FilterStatusCash
              options={statusCashData}
              onSelect={handleFilterStatus}
              label="Select Status"
              className="py-[7px]"
            />
            {errors.status && (
              <FormMessage message={errors.status} type="error" />
            )}
          </div>
        </div>

        <div
          data-aos="fade-up"
          className="flex space-x-4 justify-center mt-4 mb-4"
        >
          {/* Preview Button */}
          <Button
            onClick={getDataReportPreview}
            className="flex items-center py-1"
          >
            <FaEye className="mr-2" size={16} />
            Preview
          </Button>

          {/* Generate Excel Button */}
          <Button onClick={getGenerateExcel} className="flex items-center py-1">
            <FaFileExcel className="mr-2 " size={16} />
            Generate Excel
          </Button>
        </div>
      </form>

      {openPreview && (
        <>
          {dataListingPreview?.data?.length === 0 ? (
            <div>
              <EmptyState message="No report available." />
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto min-h-[50vh]">
                <table data-aos="fade-up">
                  <thead className="bg-gray-100">
                    <tr>
                      {headersReport.map((header, index) => (
                        <th
                          key={header + index.toString()}
                          className="border border-gray-300 px-4 py-2 text-left"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataListingPreview?.data?.map((report) => {
                      return (
                        <tr key={report.no} className="hover:bg-gray-200">
                          <td className="truncate">{report.no}</td>
                          <td className="truncate">{report.date}</td>
                          <td className="truncate">{report.branch}</td>
                          <td className="truncate">{report.typeOfTxn}</td>
                          <td className="truncate">
                            {formatNumberWithTwoDecimals(report.cashUsd)}
                          </td>
                          <td className="truncate">
                            {formatNumberWithTwoDecimals(report.cashKhr)}
                          </td>
                          <td className="truncate">
                            {formatNumberWithTwoDecimals(report.cashThb)}
                          </td>
                          <td className="truncate">
                            {formatNumberWithTwoDecimals(report.systemUsd)}
                          </td>
                          <td className="truncate">
                            {formatNumberWithTwoDecimals(report.systemKhr)}
                          </td>
                          <td className="truncate">
                            {formatNumberWithTwoDecimals(report.systemThb)}
                          </td>
                          <td className="truncate">
                            {formatNumberWithTwoDecimals(report.varianUsd)}
                          </td>
                          <td className="truncate">
                            {formatNumberWithTwoDecimals(report.varianKhr)}
                          </td>
                          <td className="truncate">
                            {formatNumberWithTwoDecimals(report.varianThb)}
                          </td>
                          <td className="truncate">{report.status}</td>
                          <td className="truncate">{report.remark}</td>
                          <td className="truncate">{report.cashCustodian}</td>
                          <td className="truncate">{report.checkedBy}</td>
                          <td className="truncate">{report.approvedBy}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {dataListingPreview?.data && dataListingPreview.data.length > 0 && (
        <div className="flex justify-end mt-8 mb-16">
          <Pagination
            totalPages={Math.ceil((dataListingPreview?.totalRecords ?? 1) / 15)}
            currentPage={dataListingPreview?.pageNumber ?? 1}
            onPageChange={(value) => {
              router.push(`/cash-report?page=${value}`);
              onPageChange(value);
            }}
          />
        </div>
      )}
      <LoadingFullPage loading={loading} />
    </div>
  );
}

export default withAuthWrapper(CashReportPage, [
  UserRoleEnum.CHECKER_USER,
  UserRoleEnum.INPUTTER_USER,
  UserRoleEnum.AUTHORIZER_USER,
  UserRoleEnum.SHOW_ALL,
]);
