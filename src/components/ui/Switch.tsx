// src/components/ui/switch.tsx
import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`block w-14 h-8 rounded-full bg-gray-300 ${checked ? 'bg-green-500' : ''}`}></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${checked ? 'translate-x-full bg-green-500' : ''}`}
        ></div>
      </div>
    </label>
  );
};
