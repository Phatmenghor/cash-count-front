"use client";

import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface DateRangePickerProps {
  onDateChange: (date: string) => void;
  initialDate?: string; // Optional prop to set the initial date
}

export function DateRangePicker({
  onDateChange,
  initialDate,
}: DateRangePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (initialDate) {
      const parsedDate = new Date(initialDate);
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate); // Set valid date
      }
    }
  }, [initialDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // Pass formatted date as string to parent component
      onDateChange(format(date, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="flex space-x-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="text-left w-[200px]">
            {selectedDate && !isNaN(selectedDate.getTime())
              ? format(selectedDate, "PPP")
              : "Pick a date"}
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white">
          <Calendar
            mode="single"
            selected={selectedDate} // Should be `undefined` or `Date`, not `null`
            onSelect={handleDateSelect} // Handle the date selection
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
