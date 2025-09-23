import { parseISO } from "date-fns";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useController, useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";

const months = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

export default function RHFDatePickerCalendar({ name, label, placeholder }: { name: string; label?: string; placeholder?: string }) {
  const { control, formState } = useFormContext();
  const { field } = useController({ name, control });

  const selectedDate = field.value ? parseISO(field.value) : undefined;
  const [viewMonth, setViewMonth] = useState(selectedDate || new Date());

  const currentYear = viewMonth.getFullYear();
  const currentMonth = viewMonth.getMonth();

  const years = Array.from({ length: 201 }, (_, i) => 1900 + i);

  const handleMonthChange = (month: string) => {
    const monthIndex = months.indexOf(month);
    const newDate = new Date(currentYear, monthIndex, 1);
    setViewMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(parseInt(year), currentMonth, 1);
    setViewMonth(newDate);
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            {selectedDate ? format(selectedDate, "dd/MM/yyyy") : (placeholder || "Selecciona una fecha")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
          <div className="p-3 space-y-3">
            <div className="flex gap-2">
              <Select value={months[currentMonth]} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={currentYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={date => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
              month={viewMonth}
              onMonthChange={setViewMonth}
              className="rounded-md border-0"
              classNames={{
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                nav: "hidden"
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
      {formState.errors[name] && (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <span className="text-xs text-red-500">{(formState.errors as any)[name]?.message as string}</span>
      )}
    </div>
  );
}