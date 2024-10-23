import React from "react";

interface FormMessageProps {
  message?: string; // Make message optional
  type: "error" | "success";
}

const FormMessage: React.FC<FormMessageProps> = ({ message, type }) => {
  if (!message) return null; // Don't render if message is not provided

  return (
    <div
      className={`mt-2 text-xs ${
        type === "error" ? "text-red-500" : "text-green-500"
      }`}
    >
      {message}
    </div>
  );
};

export default FormMessage;
