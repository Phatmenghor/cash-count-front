import { statusUser } from "@/components/custom/FilterUser";
import { CashStatusEnum } from "@/redux/models/cashManagement/StatusEnum";

export const menuNavbar = [
  { label: "Branch", href: "/branch" },
  { label: "Department", href: "/department" },
  { label: "Position", href: "/position" },
];

export const pageSizeData = [5, 10, 15, 20, 50, 100];

export const statusCashData: CashStatusEnum[] = [
  CashStatusEnum.PENDING,
  CashStatusEnum.PROCESSING,
  CashStatusEnum.APPROVED,
  CashStatusEnum.REJECT,
  CashStatusEnum.ALL,
];

export const userStatus: statusUser[] = [
  { id: 1, status: 2, name: "All User" },
  { id: 2, status: 1, name: "Active" },
  { id: 3, status: 0, name: "Inactive" },
];

export const headersReport: string[] = [
  "No",
  "Date",
  "Branch",
  "Type of txn",
  "CASH_USD",
  "CASH_KHR",
  "CASH_THB",
  "System_USD",
  "System_KHR",
  "System_THB",
  "Varian_USD",
  "Varian_KHR",
  "Varian_THB",
  "Status",
  "Remark",
  "Cash custodian",
  "Checkd by",
  "Approved by",
];
