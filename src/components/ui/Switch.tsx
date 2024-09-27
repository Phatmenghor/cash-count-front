// src/components/ui/switch.tsx
import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div
          className={`block w-11 h-6 rounded-full bg-gray-300 ${
            checked ? "bg-green-500" : ""
          }`}
        ></div>
        <div
          className={`dot absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
            checked ? "translate-x-5 bg-green-500" : ""
          }`}
        ></div>
      </div>
    </label>
  );
};
