"use client";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface RHFSelectProps {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function RHFSelect({
  name,
  label,
  options,
  placeholder,
  disabled,
  className,
}: RHFSelectProps) {
  const { control, formState } = useFormContext();
  const {
    field: { value, onChange },
  } = useController({ name, control });

  return (
    <div className={`${className} w-full`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <Select value={value ?? ""} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder || "Selecciona una opción"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {formState.errors[name] && (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <span className="text-xs text-red-500">{(formState.errors as any)[name]?.message as string}</span>
      )}
    </div>
  );
} 