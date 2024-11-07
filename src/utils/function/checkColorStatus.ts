import { CashStatusEnum } from "@/redux/models/cashManagement/StatusEnum";

export function getStatusColor(status: CashStatusEnum): string {
  switch (status) {
    case CashStatusEnum.PENDING:
      return "text-amber-500"; // amber for PENDING
    case CashStatusEnum.PROCESSING:
      return "text-blue-500"; // blue for PROCESSING
    case CashStatusEnum.APPROVED:
      return "text-green-500"; // green for APPROVED
    case CashStatusEnum.REJECT:
      return "text-red-500"; // red for REJECT
    default:
      return "text-gray-400"; // grey for unknown status
  }
}
