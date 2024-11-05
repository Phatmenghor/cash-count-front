import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface CustomSelectProps<T> {
  id: string;
  value: T | null;
  onChange: (option: T | null) => void;
  options: T[] | null;
  label: string;
  getOptionLabel: (option: T) => string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
}

const CustomSelect = <T,>({
  id,
  value,
  onChange,
  options,
  label,
  getOptionLabel,
  errorMessage,
  required = false,
  disabled = false,
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce the search term to reduce the number of filter calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (disabled) {
      return;
    }
    setIsOpen((prev) => !prev);
    setSearchTerm("");
  };

  const handleOptionClick = (option: T) => {
    onChange(option); // Pass the entire option
    setIsOpen(false);
    setSearchTerm(""); // Clear search term after selection
  };

  // Filter options based on the debounced search term
  const filteredOptions = debouncedSearchTerm
    ? options?.filter((option) =>
        getOptionLabel(option)
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      ) || []
    : options || [];

  return (
    <div className="relative" ref={dropdownRef}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div
          className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-1 cursor-pointer"
          onClick={toggleDropdown}
        >
          <span
            className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis ${
              !value ? "text-gray-500" : "text-black"
            }`}
          >
            {value ? getOptionLabel(value) : `Select ${label.toLowerCase()}`}
          </span>
          <FiChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center border-b border-gray-300 px-1 py-0.5">
                <input
                  type="text"
                  className="flex-grow px-2 py-0.5 border-none focus:ring-transparent"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <FiX
                    className="absolute right-2 cursor-pointer text-gray-500"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  />
                )}
              </div>
              <div className="max-h-48 overflow-y-auto pb-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className={`block py-1 px-2 cursor-pointer hover:bg-gray-200`}
                    >
                      <span className="text-sm">{getOptionLabel(option)}</span>
                    </div>
                  ))
                ) : (
                  <span className="block text-sm py-4 px-2 text-gray-500">
                    No options found
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {errorMessage && (
        <span className="text-red-500 text-sm">{errorMessage}</span>
      )}
    </div>
  );
};

export default CustomSelect;
