import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropdownProps {
  options: number[];
  onSelect: (option: number) => void;
  label: string;
}

const DropdownSize: React.FC<DropdownProps> = ({
  options,
  onSelect,
  label,
}) => {
  return (
    <Select onValueChange={(value) => onSelect(Number(value))}>
      <SelectTrigger className="w-auto min-w-[110px]  border border-gray-700  active:border-blue-400">
        <SelectValue placeholder={`Select size`} />
      </SelectTrigger>
      <SelectContent className="max-h-40 overflow-y-auto ">
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()} className="">
              Size {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DropdownSize;
