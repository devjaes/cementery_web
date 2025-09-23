import React from "react";
import {
  useController,
  Control,
  FieldPath,
  FieldValues,
} from "react-hook-form";

interface RHFCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control?: Control<TFieldValues>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export default function RHFCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  description,
  disabled = false,
  className = "",
}: RHFCheckboxProps<TFieldValues, TName>) {
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({
    name,
    control,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValue: false as any,
  });

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex items-center h-5">
          <input
            id={name}
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            onBlur={onBlur}
            disabled={disabled}
            className={`
              w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
              focus:ring-blue-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? "border-red-500 focus:ring-red-500" : ""}
            `}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor={name}
            className={`
              text-sm font-medium cursor-pointer select-none
              ${error ? "text-red-700" : "text-gray-700"}
              ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-gray-900"
              }
            `}
          >
            {label}
          </label>
          {description && (
            <p
              className={`text-xs mt-1 ${
                error ? "text-red-600" : "text-gray-500"
              }`}
            >
              {description}
            </p>
          )}
          {error && (
            <p className="text-xs text-red-600 mt-1">{error.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
