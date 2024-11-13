import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Button from "../custom/Button";
import Input from "../custom/Input";
import FormMessage from "../errorHandle/FormMessage";
import { BranchModel } from "@/redux/models/register/BranchModel";

interface ModalCreateEditBranchProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    branchCode: string;
    mnemonic: string;
    city: string;
  }) => void;
  title: string;
  loadingButton?: boolean;
  initialData?: BranchModel;
}

const ModalCreateEditBranch: React.FC<ModalCreateEditBranchProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  initialData,
  loadingButton = false,
}) => {
  const [branchCode, setBranchCode] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setBranchCode(initialData.branchCode);
      setMnemonic(initialData.mnemonic);
      setCity(initialData.city);
    } else {
      resetFields();
    }
  }, [initialData, isOpen]);

  const handleConfirm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!branchCode) newErrors.branchCode = "Branch code is required.";
    if (!mnemonic) newErrors.mnemonic = "Mnemonic is required.";
    if (!city) newErrors.city = "City is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const firstInput = document.getElementById(firstErrorField);
      if (firstInput) firstInput.focus();
      return;
    }

    onConfirm({ branchCode, mnemonic, city });
    resetFields();
  };

  const resetFields = () => {
    setBranchCode("");
    setMnemonic("");
    setCity("");
    setErrors({});
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Please fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onKeyDown={handleKeyPress}>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="branchCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Branch Code<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              id="branchCode"
              type="text"
              placeholder="Branch Code"
              value={branchCode}
              onChange={(e) => {
                setBranchCode(e.target.value);
                setErrors((prev) => ({ ...prev, branchCode: "" }));
              }}
              required
            />
            {errors.branchCode && (
              <FormMessage message={errors.branchCode} type="error" />
            )}

            <label
              htmlFor="mnemonic"
              className="block text-sm font-medium text-gray-700 mb-1 mt-2"
            >
              Mnemonic<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              id="mnemonic"
              type="text"
              placeholder="Mnemonic"
              value={mnemonic}
              onChange={(e) => {
                setMnemonic(e.target.value);
                setErrors((prev) => ({ ...prev, mnemonic: "" }));
              }}
              required
            />
            {errors.mnemonic && (
              <FormMessage message={errors.mnemonic} type="error" />
            )}

            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1 mt-2"
            >
              City<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              id="city"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setErrors((prev) => ({ ...prev, city: "" }));
              }}
              required
            />
            {errors.city && <FormMessage message={errors.city} type="error" />}
          </div>
          <div className="flex justify-end space-x-2 mt-8">
            <Button onClick={onClose} className="px-4 py-1.5" variant="cancel">
              Cancel
            </Button>
            <Button
              loading={loadingButton}
              textLoading={initialData ? "Updating..." : "Creating..."}
              onClick={handleConfirm}
              className="px-4 py-1.5"
            >
              {initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateEditBranch;
