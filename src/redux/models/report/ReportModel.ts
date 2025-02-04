export interface ReportModel {
  no: number;
  date: string;
  branch: string;
  typeOfTxn: string;
  cashUsd: number;
  cashKhr: number;
  cashThb: number;
  systemUsd: number;
  systemKhr: number;
  systemThb: number;
  varianUsd: number;
  varianKhr: number;
  varianThb: number;
  status: string;
  remark: string;
  cashCustodian: string;
  checkedBy: string;
  approvedBy: string;
}

export interface ReportFullModel {
  data: ReportModel[];
  pageNumber: number;
  totalRecords: number;
  pageSize: number;
}
