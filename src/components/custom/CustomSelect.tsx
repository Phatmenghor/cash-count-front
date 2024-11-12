import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Debounce function
export function debounce<
  T extends (...args: Parameters<T>) => void | Promise<void>
>(func: T, delay: number = 400) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

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
  buttonClassName?: string;
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
  buttonClassName,
}: CustomSelectProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const searchInputRef = useRef<HTMLInputElement | null>(null); // Reference for input field

  const handleSearch = (query: string) => {
    setDebouncedSearchTerm(query);
  };

  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value); // Trigger the debounced search
  };

  // Filter options based on debounced search term
  const filteredOptions = debouncedSearchTerm
    ? options?.filter((option) =>
        getOptionLabel(option)
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      ) || []
    : options || [];

  // Focus management: Ensure that the search input stays focused
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [debouncedSearchTerm]); // Trigger focus management when debounced search term changes

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
            className={`flex justify-between items-center w-full border border-gray-300 rounded-md px-3 py-1 cursor-pointer ${buttonClassName}`}
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
              ref={searchInputRef} // Apply the ref to the search input
              type="text"
              className="w-full px-2 py-0.5 border-none focus:ring-transparent"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange} // Use the debounced change handler
            />
            {searchTerm && (
              <FiX
                className="cursor-pointer text-gray-500"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              />
            )}
          </div>

          {/* Make only the list scrollable */}
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
