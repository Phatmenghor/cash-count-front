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
import { DepartmentModel } from "@/redux/models/register/DepartmentModel";

interface ModalCreateEditDepartmentProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { code: string; name: string }) => void;
  title: string;
  loadingButton?: boolean;
  initialData?: DepartmentModel;
}

const ModalCreateEditDepartment: React.FC<ModalCreateEditDepartmentProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  initialData,
  loadingButton = false,
}) => {
  const [departmentCode, setDepartmentCode] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setDepartmentCode(initialData.code);
      setDepartmentName(initialData.name);
    } else {
      resetFields();
    }
  }, [initialData, isOpen]);

  const handleConfirm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!departmentCode) newErrors.branchCode = "Department code is required.";
    if (!departmentName) newErrors.mnemonic = "Departname name is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const firstInput = document.getElementById(firstErrorField);
      if (firstInput) firstInput.focus();
      return;
    }

    onConfirm({ code: departmentCode, name: departmentName });
    resetFields();
  };

  const resetFields = () => {
    setDepartmentCode("");
    setDepartmentName("");
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
              htmlFor="mnemonic"
              className="block text-sm font-medium text-gray-700 mb-1 "
            >
              Department name<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              id="departmentName"
              type="text"
              placeholder="Department name ..."
              value={departmentName}
              onChange={(e) => {
                setDepartmentName(e.target.value);
                setErrors((prev) => ({ ...prev, mnemonic: "" }));
              }}
              required
            />
            {errors.mnemonic && (
              <FormMessage message={errors.mnemonic} type="error" />
            )}

            <label
              htmlFor="departmentCode"
              className="block text-sm font-medium text-gray-700 mb-1 mt-3"
            >
              Department Code<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              id="departmentCode"
              type="text"
              placeholder="Department code ..."
              value={departmentCode}
              onChange={(e) => {
                setDepartmentCode(e.target.value);
                setErrors((prev) => ({ ...prev, branchCode: "" }));
              }}
              required
            />
            {errors.branchCode && (
              <FormMessage message={errors.branchCode} type="error" />
            )}
          </div>
          <div className="flex justify-end space-x-2 mt-8">
            <Button onClick={onClose} className="px-4 py-1.5" variant="cancel">
              Cancel
            </Button>
            <Button
              loading={loadingButton}
              textLoading={initialData ? "Updating ..." : "Creating ..."}
              onClick={handleConfirm}
              className="px-4 py-1.5 transition"
            >
              {initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateEditDepartment;
