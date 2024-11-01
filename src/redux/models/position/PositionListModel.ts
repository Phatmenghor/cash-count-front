import { PaginationModel } from "../global/PaginationModel";
import { PositionModel } from "../register/PositionModel";

export interface PositionListModel {
  data: PositionModel[];
  pagination: PaginationModel | null;
}
