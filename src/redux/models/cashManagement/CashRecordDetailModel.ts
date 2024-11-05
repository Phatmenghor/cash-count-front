export interface CashRecordDetailModel {
  id: number;
  srNumber: string;
  status: string;
  vaultAccount: VaultAccount;
  nostroAccount: NostroAccount;
  createdDate: string;
  updatedDate: string;
  referenceFile: ReferenceFile;
  remarkFromCreate: string;
  remarkFromChecker: any;
  remarkFromAuthorizer: any;
  checkerDate: any;
  authorizerDate: any;
  branch: Branch;
  createdBy: CreatedBy;
  cashInSystem: CashInSystem;
  checkerBy: CheckerBy;
  approvedBy: ApprovedBy;
}

interface VaultAccount {
  accountType: string;
  usdBalance: number;
  khrBalance: number;
  thbBalance: number;
}

interface NostroAccount {
  accountType: string;
  usdBalance: number;
  khrBalance: number;
  thbBalance: number;
}

interface ReferenceFile {
  id: number;
  fileName: string;
  uniqueFileName: string;
  filePath: string;
}

interface Branch {
  id: number;
  branchCode: string;
  mnemonic: string;
  city: string;
  userType: any;
}

interface CreatedBy {
  id: number;
  name: string;
  roleId: number;
  branchId: number;
}

interface CashInSystem {
  id: number;
}

interface CheckerBy {
  id: number;
  name: string;
  roleId: number;
  branchId: number;
}

interface ApprovedBy {
  id: number;
  name: string;
  roleId: number;
  branchId: number;
}
