import { useFormContext } from "react-hook-form";
import { Label } from "@/shared/components/ui/label";
import { PasswordInput } from "@/features/auth/presentation/components/password-input";

interface RHFPasswordInputProps {
  name: string;
  label: string;
  placeholder?: string;
}

function RHFPasswordInput({ name, label, placeholder }: RHFPasswordInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const getErrorMessage = (name: string) => {
    return errors[name]?.message as string | undefined;
  };

  return (
    <div className="w-full space-y-2 mb-4">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <PasswordInput id={name} placeholder={placeholder} {...register(name)} />
      <p className="text-sm text-destructive mt-1">{getErrorMessage(name)}</p>
    </div>
  );
}

export default RHFPasswordInput;
