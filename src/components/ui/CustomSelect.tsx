import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiX } from "react-icons/fi"; // Arrow down and clear icons
import FormMessage from "./FormMessage";
import Input from "./Input";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  label: string;
  errorMessage?: string;
  required?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  name,
  value,
  onChange,
  options,
  label,
  errorMessage,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement | null>(null); // Ref to the select div

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    setSearchTerm(""); // Reset search term when dropdown opens
  };

  const handleOptionClick = (optionValue: string) => {
    onChange({
      target: { value: optionValue, name },
    } as React.ChangeEvent<HTMLSelectElement>);
    setIsOpen(false);
    setSearchTerm(""); // Clear search term after selection
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      toggleDropdown();
    }
  };

  // Handle clicks outside the dropdown
  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // Attach click outside listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter options based on search term (search by label)
  const filteredOptions = searchTerm
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options; // Show all options if searchTerm is empty

  // Clear search input
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div ref={selectRef} className="relative ">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div
          className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-1.5 cursor-pointer"
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-labelledby={id} // Link label with dropdown
        >
          <div
            className={`flex items-center ${
              !value ? "text-gray-500" : "text-black"
            }`}
          >
            <span className="text-sm">{value || `Select ${label}`}</span>
          </div>
          <FiChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 "
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center border-b border-gray-300 p-1">
                <Input
                  type="text"
                  className="flex-grow px-2 py-0.5 border-none focus:ring-transparent"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <FiX
                    className="absolute right-2 cursor-pointer text-gray-500" // Positioned to the right
                    onClick={clearSearch}
                    aria-label="Clear search"
                  />
                )}
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleOptionClick(option.label)}
                      className={`block py-1 px-2 cursor-pointer hover:bg-gray-100 ${
                        value === option.value
                          ? "font-semibold bg-gray-200"
                          : ""
                      }`}
                      role="option"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleOptionClick(option.value);
                        }
                      }}
                    >
                      <span
                        className={`text-sm ${
                          value === option.value ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="block text-sm py-1 px-2 text-gray-500">
                    No options found
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {errorMessage && <FormMessage message={errorMessage} type="error" />}
    </div>
  );
};

export default CustomSelect;
