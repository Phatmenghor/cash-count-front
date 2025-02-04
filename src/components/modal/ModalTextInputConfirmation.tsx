import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../custom/Button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title: string;
  isNotCancel?: boolean;
  remarkRejectChange: string;
  onRemarkRejectChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ModalTextInputConfirmation: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title,
  isNotCancel = false,
  remarkRejectChange,
  onRemarkRejectChange,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg pt-3.5 py-6 shadow-lg max-w-sm w-full"
            initial={{ y: "-100vh", scale: 0.8 }} // Start from the top
            animate={{ y: 0, scale: 1 }} // Move to center
            exit={{ y: "-100vh", scale: 0.8 }} // Exit to the top
            transition={{ duration: 0.3 }} // Adjust duration as needed
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
            }} // Hover effect
          >
            <div className="flex items-center mb-2.5 px-6">
              <h2 className="text-lg font-semibold text-black">{title}</h2>
            </div>
            <hr className="my-2 border-gray-300" /> {/* Divider line */}
            <div className="px-6">
              <p className="text-lg mb-6 text-black">{message}</p>

              <div className="max-w-xl flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1 line1">
                  Remark for rejection
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  className="border border-gray-300 rounded px-2 py-2 mb-8 w-full resize-none text-xs disabled:bg-gray-100 disabled:text-gray-700"
                  rows={4}
                  placeholder="Enter your remark here..."
                  style={{ maxHeight: "130", overflowY: "auto" }}
                  value={remarkRejectChange}
                  onInput={onRemarkRejectChange}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  onClick={onClose}
                  className="px-4 py-1"
                  variant="cancel"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  className={`px-4 py-1 ${
                    isNotCancel ? "" : "bg-red-600 hover:bg-red-700 "
                  }`}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalTextInputConfirmation;
