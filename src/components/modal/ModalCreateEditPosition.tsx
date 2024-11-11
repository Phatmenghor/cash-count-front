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
import { PositionModel } from "@/redux/models/register/PositionModel";
import CustomSelect from "../custom/CustomSelect"; // Import the CustomSelect component

interface ModalCreateEditPositionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; fullName: string; status: number }) => void;
  title: string;
  loadingButton?: boolean;
  initialData?: PositionModel;
}

const ModalCreateEditPosition: React.FC<ModalCreateEditPositionProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  initialData,
  loadingButton = false,
}) => {
  const [positionName, setPositionName] = useState("");
  const [positionFullName, setPositionFullName] = useState("");
  const [positionStatus, setPositionStatus] = useState<number | string>("0");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setPositionName(initialData.name);
      setPositionFullName(initialData.fullName || "");
      setPositionStatus(initialData.status?.toString() || "0");
    } else {
      resetFields();
    }
  }, [initialData, isOpen]);

  const handleConfirm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!positionName) newErrors.positionName = "Position role is required.";
    if (!positionFullName)
      newErrors.positionFullName = "Position full name is required.";
    if (positionStatus === "")
      newErrors.positionStatus = "Position status is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const firstInput = document.getElementById(firstErrorField);
      if (firstInput) firstInput.focus();
      return;
    }

    onConfirm({
      name: positionName,
      fullName: positionFullName,
      status: Number(positionStatus),
    });
    resetFields();
  };

  const resetFields = () => {
    setPositionName("");
    setPositionFullName("");
    setPositionStatus("0");
    setErrors({});
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleConfirm();
    }
  };

  // Options for the CustomSelect dropdown
  const statusOptions = [
    { label: "Inactive", value: "0" },
    { label: "Active", value: "1" },
  ];

  // Get the label for the selected option
  const getStatusLabel = (option: { label: string; value: string }) =>
    option.label;

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
              htmlFor="positionName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Position name<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              id="positionName"
              type="text"
              placeholder="Position role ..."
              value={positionName}
              onChange={(e) => {
                setPositionName(e.target.value);
                setErrors((prev) => ({ ...prev, positionName: "" }));
              }}
              required
            />
            {errors.positionName && (
              <FormMessage message={errors.positionName} type="error" />
            )}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="positionFullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Position full name<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              id="positionFullName"
              type="text"
              placeholder="Position full name ..."
              value={positionFullName}
              onChange={(e) => {
                setPositionFullName(e.target.value);
                setErrors((prev) => ({ ...prev, positionFullName: "" }));
              }}
              required
            />
            {errors.positionFullName && (
              <FormMessage message={errors.positionFullName} type="error" />
            )}
          </div>

          <div className="flex flex-col mb-4">
            <CustomSelect
              id="positionStatus"
              value={
                statusOptions.find(
                  (option) => option.value === positionStatus
                ) || null
              }
              onChange={(option) => {
                setPositionStatus(option ? option.value : "0");
                setErrors((prev) => ({ ...prev, positionStatus: "" }));
              }}
              options={statusOptions}
              label="Position status"
              getOptionLabel={getStatusLabel}
              errorMessage={errors.positionStatus}
              required
              buttonClassName="py-2"
            />
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

export default ModalCreateEditPosition;
