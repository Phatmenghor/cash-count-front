export interface AddRecordParamModel {
  checkerBy: CheckerBy;
  approvedBy: ApprovedBy;
  referenceFile?: ReferenceFile | null;
  cashInSystem: CashInSystem;
  status: string;
  remarkFromCreate?: string | null;
  vaultAccount: VaultAccount;
  nostroAccount: NostroAccount;
}

interface CheckerBy {
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
