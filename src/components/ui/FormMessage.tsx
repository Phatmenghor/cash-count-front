import React from "react";

interface FormMessageProps {
  message: string;
  type: "error" | "success"; // Define the type of message
}

const FormMessage: React.FC<FormMessageProps> = ({ message, type }) => {
  return (
    <div
      className={`mt-2 text-sm ${
        type === "error" ? "text-red-500" : "text-green-500"
      }`}
    >
      {message}
    </div>
  );
};

export default FormMessage;
