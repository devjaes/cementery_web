import { parseISO } from "date-fns";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useController, useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils";

export default function RHFDatePicker({ name, label, placeholder }: { name: string; label?: string; placeholder?: string }) {
  const { control, formState } = useFormContext();
  const { field } = useController({ name, control });

  const selectedDate = field.value ? parseISO(field.value) : undefined;

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
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={date => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
            initialFocus
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
      {formState.errors[name] && (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <span className="text-xs text-red-500">{(formState.errors as any)[name]?.message as string}</span>
      )}
    </div>
  );
}

