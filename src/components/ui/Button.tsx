import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "submid" | "cancel";
}

const Button: React.FC<ButtonProps> = ({
  variant = "submid",
  className,
  ...props
}) => {
  const baseStyles =
    "px-4 rounded focus:outline-none transition cursor-pointer transition-transform duration-300 hover:scale-x-105";
  const variantStyles =
    variant === "submid"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-300 text-gray-700 hover:bg-gray-400";

  return (
    <button className={clsx(baseStyles, variantStyles, className)} {...props} />
  );
};

export default Button;
