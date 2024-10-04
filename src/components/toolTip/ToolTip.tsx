// components/Tooltip.tsx
import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

const ToolTip: React.FC<TooltipProps> = ({ children, text }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
        {text}
      </span>
    </div>
  );
};

export default ToolTip;
