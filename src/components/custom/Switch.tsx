import React from "react";

interface SwitchProps {
  checked: boolean;
  disable?: boolean;
  onChange: () => void;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disable = false,
}) => {
  return (
    <label className="flex items-center cursor-pointer relative">
      <input
        disabled={disable}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`block w-9 h-5 rounded-full bg-gray-300 ${
          checked ? "bg-green-500" : ""
        }`}
      ></div>
      <div
        className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
          checked ? "translate-x-4 bg-green-500" : ""
        }`}
      ></div>
    </label>
  );
};
