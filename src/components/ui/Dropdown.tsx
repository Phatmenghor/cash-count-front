import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface DropdownProps {
  options: string[];
  onSelect: (option: string) => void;
  label: string;
  isSize?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  label,
  isSize,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const pathname = usePathname();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 150);
    setTimeoutId(id);
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <div
      className="relative inline-block " // Add border and rounded corners
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`${
          isSize ? "border border-gray-800 rounded-md px-3" : ""
        } rounded-md flex justify-between items-center w-full transition duration-150 ease-in-out focus:outline-none`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className={`${isSize ? "text-gray-600" : "text-white"}`}>
          {selectedOption
            ? `${isSize ? "Size " : ""}${selectedOption}`
            : `${isSize ? "Size " : ""}${label}`}
        </span>
        <svg
          className={`${
            isSize ? "-mr-0.5" : ""
          } w-4 h-4 ml-1 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke={isSize ? "black" : "white"} // Change color based on selection
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <motion.ul
          className="absolute right-0 z-10 bg-gray-200 text-gray-900 rounded-md shadow-lg mt-2 w-auto overflow-y-auto"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          style={isSize ? { maxHeight: "120px" } : { maxHeight: "250px" }}
        >
          {options.map((option) => (
            <motion.li
              key={option}
              className={`relative px-4 py-2 cursor-pointer transition-colors duration-150 group ${
                pathname === option ? "bg-gray-900 text-white" : "text-gray-800"
              } hover:bg-gray-300 hover:rounded`}
              onClick={() => handleSelect(option)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="block relative">
                <span
                  className={`text-black ${
                    pathname === option ? "font-semibold" : ""
                  }`}
                >
                  {option}
                </span>
                <span
                  className={`absolute left-0 right-0 bottom-0 h-0.5 bg-gray-900 scale-x-0 transition-transform duration-300 ease-in-out ${
                    pathname === option ? "scale-x-100" : ""
                  }`}
                ></span>
              </span>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default Dropdown;
