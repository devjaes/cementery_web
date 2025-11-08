"use client";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

type RHFInputProps = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  required?: boolean;
};

function RHFInput({ name, label, type = "text", placeholder, disabled, min, max, required = false }: RHFInputProps) {
  const { control, formState } = useFormContext();

  const getErrorMessage = (name: string) => {
    return formState.errors[name]?.message as string | undefined;
  };

  return (
    <div className="w-full space-y-2 mb-4">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? "Este campo es requerido" : false }}
        render={({ field }) => (
          <Input type={type} placeholder={placeholder} disabled={disabled} {...field} value={field.value ?? ''} min={min} max={max} required={required} />
        )}
      />
      <p className="text-sm text-destructive mt-1">{getErrorMessage(name)}</p>
    </div>
  );
}

export default RHFInput;
