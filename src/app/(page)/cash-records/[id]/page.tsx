"use client";
import ModalVerify from "@/components/modal/ModalVerify";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

type Currency = "USD" | "KHR" | "THB"; // Define a type for currency keys

interface CashRow {
  description: string;
  vault: Record<Currency, number>; // Use Record to define the structure
  nostro: Record<Currency, number>;
}

const EditCashCountPage = () => {
  // State for cash on hand input
  const [cashOnHand, setCashOnHand] = useState<CashRow>({
    description: "Cash On Hand",
    vault: { USD: 0, KHR: 0, THB: 0 },
    nostro: { USD: 0, KHR: 0, THB: 0 },
  });
  const [isVerified, setIsVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const router = useRouter();

  // Static data for the other categories
  const cashInSystem: CashRow = {
    description: "Cash In System",
    vault: { USD: 999999.0, KHR: 3000000.0, THB: 28000.0 },
    nostro: { USD: 500000.0, KHR: 800000.0, THB: 1000000.0 },
  };

  const [cashVariance, setCashVariance] = useState<CashRow>({
    description: "Cash Variance",
    vault: { USD: 0, KHR: 0, THB: 0 },
    nostro: { USD: 0, KHR: 0, THB: 0 },
  });

  // Handle input changes
  const handleCashOnHandChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "vault" | "nostro",
    currency: Currency
  ) => {
    let value = e.target.value;

    // Allow empty input, decimal numbers, and prevent leading zeros
    if (value === "") {
      value = ""; // Allow empty input
    } else if (/^0\d+$/.test(value)) {
      // If the input starts with "0" followed by another digit, replace it with just the number
      value = value.replace(/^0+/, ""); // Replace leading zeros
    } else if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      // Allow valid decimal inputs
      // Do nothing, keep the value as it is
    } else {
      // If the value doesn't match the criteria, ignore it
      return;
    }

    // Convert to number if not empty
    const numericValue = value ? parseFloat(value) : ""; // Default to 0 if NaN

    setCashOnHand((prev) => ({
      ...prev,
      [type]: { ...prev[type], [currency]: numericValue },
    }));
  };

  const handleVerifyClick = () => {
    setIsVerified(true);

    const newCashVariance: CashRow = {
      description: "Cash Variance",
      vault: {
        USD:
          cashInSystem.vault.USD === cashOnHand.vault.USD
            ? cashInSystem.vault.USD
            : cashOnHand.vault.USD - cashInSystem.vault.USD,
        KHR:
          cashInSystem.vault.KHR === cashOnHand.vault.KHR
            ? cashInSystem.vault.KHR
            : cashOnHand.vault.KHR - cashInSystem.vault.KHR,
        THB:
          cashInSystem.vault.THB === cashOnHand.vault.THB
            ? cashInSystem.vault.THB
            : cashOnHand.vault.THB - cashInSystem.vault.THB,
      },
      nostro: {
        USD:
          cashInSystem.nostro.USD === cashOnHand.nostro.USD
            ? cashInSystem.nostro.USD
            : cashOnHand.nostro.USD - cashInSystem.nostro.USD,
        KHR:
          cashInSystem.nostro.KHR === cashOnHand.nostro.KHR
            ? cashInSystem.nostro.KHR
            : cashOnHand.nostro.KHR - cashInSystem.nostro.KHR,
        THB:
          cashInSystem.nostro.THB === cashOnHand.nostro.THB
            ? cashInSystem.nostro.THB
            : cashOnHand.nostro.THB - cashInSystem.nostro.THB,
      },
    };
    setCashVariance(newCashVariance);
  };

  const handleSaveClick = () => {
    if (!isVerified) {
      setIsModalOpen(true); // Open modal if not verified
    } else {
      router.back(); // Proceed to save if verified
    }
  };

  console.log("## ===isVerified", isVerified);

  return (
    <div className="2xl:container mx-auto p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Edit Cashcount</h1>

        <Button
          onClick={handleVerifyClick}
          className="flex items-center py-1.5"
        >
          <FiCheckCircle className="mr-2 animate-spin" />
          {/* Icon with margin for spacing */}
          Verify
        </Button>
      </div>
      {/* Display the message */}
      <div className="overflow-auto">
        {/* Table Header */}
        <table>
          <thead>
            <tr>
              <th rowSpan={2}>Description</th>
              <th colSpan={3} className="text-center">
                Vault
              </th>
              <th colSpan={3} className="text-center">
                Nostro Account
              </th>
              <th rowSpan={2}>Supporting Documents</th>
            </tr>
            <tr>
              <th>USD</th>
              <th>KHR</th>
              <th>THB</th>
              <th>USD</th>
              <th>KHR</th>
              <th>THB</th>
            </tr>
          </thead>
          <tbody>
            {/* Cash On Hand (Editable) */}
            <tr>
              <td>{cashOnHand.description}</td>
              <td>
                <Input
                  value={cashOnHand.vault.USD}
                  onChange={(e) => handleCashOnHandChange(e, "vault", "USD")}
                  className="rounded w-full px-1 py-[1px] -mx-1.5"
                />
              </td>
              <td>
                <Input
                  value={cashOnHand.vault.KHR}
                  onChange={(e) => handleCashOnHandChange(e, "vault", "KHR")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
              <td>
                <Input
                  value={cashOnHand.vault.THB}
                  onChange={(e) => handleCashOnHandChange(e, "vault", "THB")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
              <td>
                <Input
                  value={cashOnHand.nostro.USD}
                  onChange={(e) => handleCashOnHandChange(e, "nostro", "USD")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
              <td>
                <Input
                  value={cashOnHand.nostro.KHR}
                  onChange={(e) => handleCashOnHandChange(e, "nostro", "KHR")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
              <td>
                <Input
                  value={cashOnHand.nostro.THB}
                  onChange={(e) => handleCashOnHandChange(e, "nostro", "THB")}
                  className="border rounded w-full px-1 py-0.5 -mx-1.5"
                />
              </td>
              <td
                className="cursor-pointer hover:bg-white underline underline-offset-1"
                rowSpan={3} // Merge the document cell for all rows
              >
                Can view file upload
              </td>
            </tr>

            {/* Cash In System (Static) */}
            <tr>
              <td>{cashInSystem.description}</td>
              <td>{isVerified ? cashInSystem.vault.USD.toFixed(2) : "0.00"}</td>
              <td>{isVerified ? cashInSystem.vault.KHR.toFixed(2) : "0.00"}</td>
              <td>{isVerified ? cashInSystem.vault.THB.toFixed(2) : "0.00"}</td>
              <td>
                {isVerified ? cashInSystem.nostro.USD.toFixed(2) : "0.00"}
              </td>
              <td>
                {isVerified ? cashInSystem.nostro.KHR.toFixed(2) : "0.00"}
              </td>
              <td>
                {isVerified ? cashInSystem.nostro.THB.toFixed(2) : "0.00"}
              </td>
            </tr>

            {/* Cash Variance (Static) */}
            <tr>
              <td>{cashVariance.description}</td>
              <td>{isVerified ? cashVariance.vault.USD.toFixed(2) : "0.00"}</td>
              <td>{isVerified ? cashVariance.vault.KHR.toFixed(2) : "0.00"}</td>
              <td>{isVerified ? cashVariance.vault.THB.toFixed(2) : "0.00"}</td>
              <td>
                {isVerified ? cashVariance.nostro.USD.toFixed(2) : "0.00"}
              </td>
              <td>
                {isVerified ? cashVariance.nostro.KHR.toFixed(2) : "0.00"}
              </td>
              <td>
                {isVerified ? cashVariance.nostro.THB.toFixed(2) : "0.00"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Remarks and file upload sections */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-start">
        <div className="max-w-2xl flex-1 mb-4 sm:mr-2">
          <label className="block mb-1">
            Remark <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            className="border rounded px-4 py-1 w-full resize-none text-sm"
            rows={1}
            placeholder="Enter your remark here..."
            onInput={(e) => {
              e.currentTarget.style.height = "auto"; // Reset the height
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`; // Set it to the scroll height
            }}
            style={{ overflow: "hidden", minHeight: "2rem" }} // Initial height and hide overflow
          ></textarea>
        </div>
        <div className="flex-1 sm:ml-8">
          <label className="block mb-1">
            Reference File <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            type="file"
            className="rounded p-1 w-full max-w-full" // Adjust max width to full width of its container
            accept=".pdf"
          />
        </div>
      </div>
      {/* Approvals section */}
      <div className="grid grid-cols-3 gap-4 mt-4 sm:mt-0">
        <div>
          <label className="block mb-1">
            Approved By <span className="text-red-500 ml-1">*</span>
          </label>
          <select className="px-2 py-1">
            <option value="">Select</option>
            <option value="approver1">Approver 1</option>
            <option value="approver2">Approver 2</option>
            <option value="approver3">Approver 3</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">
            Checked By <span className="text-red-500 ml-1">*</span>
          </label>
          <select className="px-2 py-1">
            <option value="">Select</option>
            <option value="checker1">Checker 1</option>
            <option value="checker2">Checker 2</option>
            <option value="checker3">Checker 3</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">
            Cash Custodian <span className="text-red-500 ml-1">*</span>
          </label>
          <select className="px-2 py-1">
            <option value="">Select</option>
            <option value="custodian1">Custodian 1</option>
            <option value="custodian2">Custodian 2</option>
            <option value="custodian3">Custodian 3</option>
          </select>
        </div>
      </div>
      {/* Save and Cancel Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          onClick={() => {
            router.back();
          }}
           variant="cancel"
          className="py-1"
        >
          Cancel
        </Button>
        <Button onClick={handleSaveClick} className="py-1">
          Save
        </Button>
      </div>
      {/* Modal for alert */}
      <ModalVerify
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Please click 'Verify' before saving."
      />
    </div>
  );
};

export default EditCashCountPage;
