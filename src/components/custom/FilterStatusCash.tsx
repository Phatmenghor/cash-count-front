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
import { CashStatusEnum } from "@/redux/models/cashManagement/StatusEnum";

interface DropdownProps {
  options: CashStatusEnum[];
  onSelect: (option: string) => void;
  label: string;
}

const FilterStatusCash: React.FC<DropdownProps> = ({
  options,
  onSelect,
  label,
}) => {
  return (
    <div data-aos="fade-left">
      <Select onValueChange={(value) => onSelect((value))}>
        <SelectTrigger className="w-auto min-w-[110px]  py-1 border border-gray-300  active:border-blue-400">
          <SelectValue placeholder={`All User`} />
        </SelectTrigger>
        <SelectContent className="max-h-40 overflow-y-auto ">
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((option, index) => (
              <SelectItem
                key={option + index}
                value={option.toString()}
                className=""
              >
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterStatusCash;
