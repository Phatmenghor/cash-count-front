// components/CustomSelect.tsx
import React, { useState, useEffect } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce the search term to reduce the number of filter calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Filter options based on the debounced search term
  const filteredOptions = debouncedSearchTerm
    ? options?.filter((option) =>
        getOptionLabel(option)
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      ) || []
    : options || [];

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex justify-between items-center w-full border border-gray-300 rounded-md px-3 py-1 cursor-pointer"
            disabled={disabled}
          >
            <span
              className={`text-xs whitespace-nowrap py-0.5 overflow-hidden text-ellipsis ${
                !value ? "text-gray-500" : "text-gray-700"
              }`}
            >
              {value ? getOptionLabel(value) : `Select ${label.toLowerCase()}`}
            </span>
            <FiChevronDown />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-full border border-gray-300 rounded-md shadow-lg bg-white">
          <div className="flex items-center border-b border-gray-300 px-2 py-1">
            <input
              type="text"
              className="w-full px-2 py-0.5 border-none focus:ring-transparent"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <FiX
                className="cursor-pointer text-gray-500"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              />
            )}
          </div>
          <div className="max-h-48 overflow-y-auto pb-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => onChange(option)}
                  className="cursor-pointer hover:bg-gray-200"
                >
                  <span className="text-sm">{getOptionLabel(option)}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <span className="block text-sm py-4 px-2 text-gray-500">
                No options found
              </span>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {errorMessage && (
        <span className="text-red-500 text-sm">{errorMessage}</span>
      )}
    </div>
  );
};

export default CustomSelect;
