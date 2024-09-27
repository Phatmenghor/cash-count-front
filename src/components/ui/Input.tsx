import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`p-3 border border-gray-300 rounded focus:ring focus:ring-blue-500 focus:outline-none ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
