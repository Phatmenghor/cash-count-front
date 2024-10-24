import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface DropdownProps {
  options: string[];
  onSelect: (option: string) => void;
  label: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, label }) => {
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
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="text-gray-900 px-4 py-2 rounded-md flex justify-between items-center w-full transition duration-150 ease-in-out focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className={`text-white`}>
          {selectedOption ? selectedOption : label}
        </span>
        <svg
          className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
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
          className="absolute right-0 z-10 bg-gray-200 text-gray-900 rounded-md shadow-lg mt-1 w-full"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {options.map((option) => (
            <motion.li
              key={option}
              className={`relative px-4 py-2 cursor-pointer transition-colors duration-150 group ${
                pathname === option ? "font-semibold" : ""
              } hover:bg-gray-300`}
              onClick={() => handleSelect(option)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="block relative">
                <span
                  className={`${
                    pathname === option
                      ? "font-semibold underline text-gray-900"
                      : "text-gray-800"
                  }`}
                >
                  {option}
                </span>
                <span
                  className={`absolute left-0 right-0 bottom-0 h-0.5 bg-gray-900 scale-x-0 transition-transform duration-300 ease-in-out ${
                    pathname === option
                      ? "scale-x-100" // Show border when active
                      : "group-hover:scale-x-100" // Show border on hover
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
