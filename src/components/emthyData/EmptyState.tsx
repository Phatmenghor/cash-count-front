import React from "react";

interface EmptyStateProps {
  message: string; // Custom message to display
  icon: React.ReactNode; // Icon to display
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-pulse h-64">
      {/* Increased height here */}
      <div className="text-gray-400 mb-4">{icon}</div>{" "}
      {/* Render the icon here */}
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;
