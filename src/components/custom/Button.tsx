import React from "react";
import clsx from "clsx";
import { FiLoader } from "react-icons/fi";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "submit" | "cancel"; // Changed "submid" to "submit"
  loading?: boolean;
  textLoading?: string;
  scaleOnHover?: boolean; // New prop to control scaling on hover
}

const Button: React.FC<ButtonProps> = ({
  variant = "submit",
  className,
  loading = false,
  children,
  textLoading = "",
  scaleOnHover = true, // Default to true for scaling
  ...props
}) => {
  const baseStyles =
    "px-4 rounded focus:outline-none transition duration-300 transform flex justify-center items-center"; // Base styles for the button
  const variantStyles =
    variant === "submit"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-400 text-white hover:bg-gray-500";

  // Conditional loading styles
  const loadingStyles = loading
    ? "bg-blue-400 text-white cursor-default"
    : variantStyles;

  // Add scale effect unless loading and if scaleOnHover is true
  const scaleStyles = loading || !scaleOnHover ? "" : "hover:scale-x-105";

  return (
    <button
      type="button"
      className={clsx(baseStyles, loadingStyles, scaleStyles, className)} // Combine styles
      disabled={loading} // Disable button when loading
      {...props}
    >
      {loading ? (
        <>
          <FiLoader className="animate-spin mr-2 h-4 w-4" /> {/* Loader icon */}
          {textLoading}
        </>
      ) : (
        children // Render button children normally
      )}
    </button>
  );
};

export default Button;
