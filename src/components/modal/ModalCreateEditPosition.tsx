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

interface ModalCreateEditPositionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string }) => void;
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setPositionName(initialData.name);
    } else {
      resetFields();
    }
  }, [initialData, isOpen]);

  const handleConfirm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!positionName) newErrors.mnemonic = "Position role is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const firstInput = document.getElementById(firstErrorField);
      if (firstInput) firstInput.focus();
      return;
    }

    onConfirm({ name: positionName });
    resetFields();
  };

  const resetFields = () => {
    setPositionName("");
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
              id="positionRole"
              type="text"
              placeholder="Position role ..."
              value={positionName}
              onChange={(e) => {
                setPositionName(e.target.value);
                setErrors((prev) => ({ ...prev, mnemonic: "" }));
              }}
              required
            />
            {errors.mnemonic && (
              <FormMessage message={errors.mnemonic} type="error" />
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

export default ModalCreateEditPosition;
