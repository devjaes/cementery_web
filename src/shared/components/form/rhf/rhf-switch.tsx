"use client";
import { useFormContext, Controller } from "react-hook-form";
import { Switch } from "@/shared/components/ui/switch"; // Asegúrate de importar tu componente correcto
import { Label } from "@/shared/components/ui/label";

type RHFSwitchProps = {
  name: string;
  label: string;
};

function RHFSwitch({ name, label }: RHFSwitchProps) {
  const { control, formState } = useFormContext();

  const getErrorMessage = (name: string) => {
    return formState.errors[name]?.message as string | undefined;
  };

  return (
    <div className="w-full space-y-2 mb-4">
      <div className="flex items-center gap-2">
        <Controller
          name={name}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Switch
              id={name}
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
              ref={field.ref}
            />
          )}
        />

        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
      </div>
      <p className="text-sm text-destructive mt-1">{getErrorMessage(name)}</p>
    </div>
  );
}

export default RHFSwitch;
