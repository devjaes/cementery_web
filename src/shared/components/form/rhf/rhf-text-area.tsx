import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";

type RHFTextareaProps = {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  className?: string;
};

function RHFTextarea({ 
  name, 
  label, 
  placeholder, 
  rows = 3,
  className 
}: RHFTextareaProps) {
  const { control, formState } = useFormContext();

  const getErrorMessage = (name: string) => {
    return formState.errors[name]?.message as string | undefined;
  };

  return (
    <div className="w-full space-y-2 mb-4">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea 
            rows={rows}
            placeholder={placeholder} 
            className={`min-h-[80px] resize-none ${className || ''}`}
            {...field} 
          />
        )}
      />
      <p className="text-sm text-destructive mt-1">{getErrorMessage(name)}</p>
    </div>
  );
}

export default RHFTextarea;