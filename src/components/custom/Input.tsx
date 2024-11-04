// src/components/ui/Input.tsx
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`border text-sm border-gray-300 rounded w-full duration-150 ease-in-out focus:outline-none 
                  focus:border-blue-400 focus:ring-0 focus:ring-blue-400 placeholder-gray-500 
                  transition-all  focus:border-2 active:border-2 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
