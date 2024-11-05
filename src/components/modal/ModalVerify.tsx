import React from "react";
import { FiAlertCircle } from "react-icons/fi"; // Import an icon (you can choose any icon)
import Button from "../custom/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ModalVerify: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 w-6 h-6 mr-2" />
            <DialogTitle className="text-lg font-bold">Alert</DialogTitle>
          </div>
        </DialogHeader>
        <hr className=" border-gray-300" /> {/* Divider line */}
        <DialogDescription>
          <p className="text-base">{message}</p>
        </DialogDescription>
        <div className="flex justify-end mt-4">
          <Button className="py-1.5" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalVerify;
