// src/components/ui/ConfirmationDialog.tsx
import React from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title: string; // Title prop for the dialog
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-lg py-6 shadow-lg max-w-sm w-full transform transition-transform duration-300 scale-95 hover:scale-100">
        <div className="flex items-center mb-4 px-6">
          <h2 className="text-lg font-semibold text-black">{title}</h2>
        </div>
        <hr className="my-2 border-gray-300" /> {/* Divider line */}
        <div className="px-6">
          <p className="text-lg mb-6 text-black">{message}</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
