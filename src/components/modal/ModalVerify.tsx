import React from "react";
import { FiAlertCircle } from "react-icons/fi"; // Import an icon (you can choose any icon)
import Button from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ModalVerify: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white pt-3.5 py-6 rounded-lg shadow-lg max-w-sm w-full"
            initial={{ y: "-100vh", scale: 0.8 }} // Start from the top
            animate={{ y: 0, scale: 1 }} // Move to center
            exit={{ y: "-100vh", scale: 0.8 }} // Exit to the top
            transition={{ duration: 0.3 }} // Adjust duration as needed
            whileHover={{
              scale: 1.05, // Slightly enlarge on hover
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)", // Add shadow effect
            }} // Hover effect
          >
            <div className="flex items-center mb-3.5 px-6">
              <FiAlertCircle className="text-red-500 w-6 h-6 mr-2" />
              <h2 id="modal-title" className="text-xl font-bold">Alert</h2>
            </div>
            <hr className="my-2 border-gray-300" /> {/* Divider line */}
            <div className="px-6">
              <p id="modal-description">{message}</p>
              <div className="flex justify-end mt-4">
                <Button className="py-1.5" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalVerify;
