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

export interface statusUser {
  id: number;
  name: string;
  status: number;
}

interface DropdownProps {
  options: statusUser[];
  onSelect: (option: number) => void;
  label: string;
}

const FilterUser: React.FC<DropdownProps> = ({ options, onSelect, label }) => {
  return (
    <div data-aos="fade-left">
      <Select onValueChange={(value) => onSelect(Number(value))}>
        <SelectTrigger className="w-auto min-w-[110px]  py-1 border border-gray-300  active:border-blue-400">
          <SelectValue placeholder={`All User`} />
        </SelectTrigger>
        <SelectContent className="max-h-40 overflow-y-auto ">
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.status.toString()}>
                {option.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterUser;
