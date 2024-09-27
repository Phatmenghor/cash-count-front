// src/components/ui/Select.tsx
import React, { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  id,
  value,
  onChange,
  children,
  className,
}) => {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={`border rounded-md p-2 ${className}`}
    >
      {children}
    </select>
  );
};

export default Select;
