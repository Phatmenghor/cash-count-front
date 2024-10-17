import React from "react";
import clsx from "clsx";
import { FiLoader } from "react-icons/fi";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "submid" | "cancel";
  loading?: boolean;
  textLoading?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "submid",
  className,
  loading = false,
  children,
  textLoading = "",
  ...props
}) => {
  const baseStyles =
    "px-4 rounded focus:outline-none transition cursor-pointer transition-transform duration-300 hover:scale-x-105";
  const variantStyles =
    variant === "submid"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-300 text-gray-700 hover:bg-gray-400";

  const loadingStyles = loading
    ? "bg-blue-400 text-white cursor-default hover:scale-x-100"
    : variantStyles;

  return (
    <button
      className={clsx(baseStyles, loadingStyles, className)}
      disabled={loading} // Disable button when loading
      {...props}
    >
      {loading ? (
        <>
          <FiLoader className="animate-spin mr-2 h-5 w-5" /> {/* Loader icon */}
          {textLoading}
        </>
      ) : (
        children // Render button children normally
      )}
    </button>
  );
};

export default Button;
