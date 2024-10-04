import React from "react";
import { FiAlertCircle } from "react-icons/fi"; // Import an icon (you can choose any icon)
import Button from "../ui/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ModalVerify: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white py-6 rounded-lg shadow-lg transform transition-transform duration-300 scale-95 hover:scale-100">
        <div className="flex items-center mb-4 px-6">
          <FiAlertCircle className="text-red-500 w-6 h-6 mr-2" />
          <h2 className="text-xl font-bold">Alert</h2>
        </div>
        <hr className="my-2 border-gray-300" /> {/* Divider line */}
        <div className="px-6">
          <p>{message}</p>
          <div className="flex justify-end mt-4">
            <Button className="py-1.5" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerify;
