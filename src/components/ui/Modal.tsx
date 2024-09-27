// src/components/ui/Modal.tsx
import React from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded p-6 shadow-lg">
        <p className="mb-4">{message}</p>
        <button onClick={onClose} className="mr-2">
          Cancel
        </button>
        <button onClick={onConfirm} className="text-red-600">
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
