export interface UpdateRecordModel {
  checkerBy: CheckerBy;
  approvedBy: ApprovedBy;
  createdBy: CreatedBy;
  referenceFile?: ReferenceFile | null;
  cashInSystem: CashInSystem;
  status: string;
  remarkFromCreate?: string | null;
  branch: Branch;
  vaultAccount: VaultAccount;
  nostroAccount: NostroAccount;
  cashInHandVaultAccount: VaultAccount;
  cashInHandNostroAccount: NostroAccount;
  remarkFromAuthorizer?: string | null;
  remarkFromChecker?: string | null;
}

interface CheckerBy {
  id: number;
}

interface CreatedBy {
  id: number;
}

interface ApprovedBy {
  id: number;
}

interface ReferenceFile {
  id: number;
}

interface CashInSystem {
  id: number;
}

interface VaultAccount {
  usdBalance: number;
  khrBalance: number;
  thbBalance: number;
}

interface NostroAccount {
  usdBalance: number;
  khrBalance: number;
  thbBalance: number;
}

interface Branch {
  id: number;
}
