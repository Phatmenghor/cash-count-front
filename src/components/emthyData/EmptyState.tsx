import React from "react";
import { HiOutlineDocumentPlus } from "react-icons/hi2";

interface EmptyStateProps {
  message: string; // Custom message to display
  icon?: React.ReactNode; // Icon to display (optional)
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon = <HiOutlineDocumentPlus className="w-32 h-32" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-[50vh]">
      <div className="text-gray-400 mb-4 animate-pulse">{icon}</div>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;
