import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  ...props
}) => {
  const baseStyles =
    "px-4 rounded focus:outline-none transition duration-200 cursor-pointer";
  const variantStyles =
    variant === "primary"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-300 text-gray-700 hover:bg-gray-400";

  return (
    <button className={clsx(baseStyles, variantStyles, className)} {...props} />
  );
};

export default Button;
