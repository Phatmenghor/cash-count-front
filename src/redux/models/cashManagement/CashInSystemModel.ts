export interface CashInSystemModel {
  id: number;
  vaultAccount: VaultAccount;
  nostroAccount: NostroAccount;
  branch: Branch;
  createdDate: string;
  updatedDate: string;
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

interface Branch {
  id: number;
  branchCode: string;
  mnemonic: string;
  city: string;
}
