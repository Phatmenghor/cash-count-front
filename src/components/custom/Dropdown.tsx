import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdKeyboardArrowDown } from "react-icons/md";

export interface MenuOption {
  label: string;
  href: string;
}

interface DropdownProps {
  options: MenuOption[];
  onSelect: (option: MenuOption) => void;
  label: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, label }) => {
  const pathname = usePathname();
  const [selectedOption, setSelectedOption] = useState<MenuOption | null>(null);

  useEffect(() => {
    // Find an option matching the current pathname or clear selection if not found
    const currentOption = options.find((option) => option.href === pathname);
    setSelectedOption(currentOption || null);
  }, [pathname, options]);

  const handleSelect = (option: MenuOption) => {
    setSelectedOption(option); // Update immediately on click
    onSelect(option); // Trigger the onSelect handler with the clicked option
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-md flex justify-between items-center transition duration-150 ease-in-out focus:outline-none"
          aria-haspopup="true"
          aria-expanded={!!selectedOption}
        >
          <span
            className={`text-white flex items-center ${
              selectedOption?.href === pathname ? "underline" : ""
            }`}
          >
            {selectedOption ? selectedOption.label : label}
          </span>
          <MdKeyboardArrowDown className="w-4 h-4 ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-200 text-gray-900 rounded-md shadow-lg mt-2 w-auto">
        <DropdownMenuLabel>Select a menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuItem
            disabled={selectedOption?.href === option.href}
            key={option.label}
            className={`cursor-pointer transition-colors duration-150 ${
              selectedOption?.href === option.href
                ? "bg-gray-500 text-white"
                : "text-gray-800"
            } hover:bg-gray-300`}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
