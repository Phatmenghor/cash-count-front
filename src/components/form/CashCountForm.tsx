// src/app/cash-count/CashCountForm.tsx
import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface CashCountData {
  cashOnHand: number;
  cashInSystem: number;
  cashVariance: number;
  remark: string;
  referenceFile: File | null;
  attachFile: File | null;
  lineManager: string;
  approvedBy: string;
  checkedBy: string;
  cashCustodian: string;
}

interface CashCountFormProps {
  initialData?: CashCountData; // Optional prop for initial data when editing
}

const CashCountForm: React.FC<CashCountFormProps> = ({ initialData }) => {
  const [cashCountData, setCashCountData] = useState<CashCountData>({
    cashOnHand: initialData?.cashOnHand || 0,
    cashInSystem: initialData?.cashInSystem || 0,
    cashVariance: initialData?.cashVariance || 0,
    remark: initialData?.remark || "",
    referenceFile: null,
    attachFile: null,
    lineManager: initialData?.lineManager || "",
    approvedBy: initialData?.approvedBy || "",
    checkedBy: initialData?.checkedBy || "",
    cashCustodian: initialData?.cashCustodian || "",
  });

  const handleInputChange = (
    field: keyof CashCountData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      e.target.type === "file" ? e.target.files?.[0] || null : e.target.value;
    setCashCountData({ ...cashCountData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      initialData ? "Updating Cash Count" : "Adding New Cash Count",
      cashCountData
    );
    // Here you can add logic to save the cash count data (e.g., API call)
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1">Cash On Hand</label>
          <Input
            type="number"
            value={cashCountData.cashOnHand}
            onChange={(e) => handleInputChange("cashOnHand", e)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Cash In System</label>
          <Input
            type="number"
            value={cashCountData.cashInSystem}
            onChange={(e) => handleInputChange("cashInSystem", e)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Cash Variance</label>
          <Input
            type="number"
            value={cashCountData.cashVariance}
            onChange={(e) => handleInputChange("cashVariance", e)}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Remark</label>
        <Input
          type="text"
          value={cashCountData.remark}
          onChange={(e) => handleInputChange("remark", e)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Reference File</label>
        <Input
          type="file"
          onChange={(e) => handleInputChange("referenceFile", e)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Attach File</label>
        <Input
          type="file"
          onChange={(e) => handleInputChange("attachFile", e)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1">Line Manager</label>
          <Input
            type="text"
            value={cashCountData.lineManager}
            onChange={(e) => handleInputChange("lineManager", e)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Approved By</label>
          <Input
            type="text"
            value={cashCountData.approvedBy}
            onChange={(e) => handleInputChange("approvedBy", e)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Checked By</label>
          <Input
            type="text"
            value={cashCountData.checkedBy}
            onChange={(e) => handleInputChange("checkedBy", e)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Cash Custodian</label>
          <Input
            type="text"
            value={cashCountData.cashCustodian}
            onChange={(e) => handleInputChange("cashCustodian", e)}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>

      <div className="mt-4">
        <Button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          {initialData ? "Update Cash Count" : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default CashCountForm;
