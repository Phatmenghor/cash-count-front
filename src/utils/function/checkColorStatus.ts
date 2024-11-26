import { CashStatusEnum } from "@/redux/models/cashManagement/StatusEnum";

export function getStatusColor(status: CashStatusEnum): string {
  switch (status) {
    case CashStatusEnum.PENDING:
      return "text-primary underline"; // amber for PENDING
    case CashStatusEnum.PROCESSING:
      return "text-blue-500 underline"; // blue for PROCESSING
    case CashStatusEnum.APPROVED:
      return "text-green-500 underline"; // green for APPROVED
    case CashStatusEnum.REJECT:
      return "text-red-500 underline"; // red for REJECT
    default:
      return "text-gray-400 underline"; // grey for unknown status
  }
}
