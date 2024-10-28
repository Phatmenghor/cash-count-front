import { PaginationModel } from "../global/PaginationModel";
import { DepartmentModel } from "../register/DepartmentModel";

export interface DepartmentListModel {
  data: DepartmentModel[];
  pagination: PaginationModel | null;
}
