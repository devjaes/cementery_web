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

interface RHFTimeRangeSelectProps {
  name: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

// Generar opciones de hora en formato 24h (07:00 a 18:00 cada 30 min)
const generateTimeOptions = () => {
  const options: { value: string; label: string }[] = [];
  for (let hour = 7; hour <= 18; hour++) {
    for (const minutes of [0, 30]) {
      // No incluir 18:30 (solo hasta 18:00)
      if (hour === 18 && minutes === 30) continue;
      
      const h = hour.toString().padStart(2, "0");
      const m = minutes.toString().padStart(2, "0");
      const value = `${h}:${m}`;
      const label = `${h}h${m}`;
      options.push({ value, label });
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

// Formatear hora para mostrar: "09:00" -> "09h00"
const formatTimeDisplay = (t: string) => t.replace(":", "h");

export default function RHFTimeRangeSelect({
  name,
  label,
  disabled,
  className,
}: RHFTimeRangeSelectProps) {
  const { control, formState } = useFormContext();
  const {
    field: { value, onChange },
  } = useController({ name, control });

  // Estado local para manejar las selecciones
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");

  // Sincronizar estado local con el valor del formulario
  React.useEffect(() => {
    if (!value) {
      setStartTime("");
      setEndTime("");
      return;
    }
    
    // Parsear valor existente "HHhMM a HHhMM" o "HH:MM a HH:MM"
    const normalized = String(value).replace(/h/g, ":");
    const parts = normalized.split(/\s*a\s*/i);
    
    if (parts.length === 2) {
      const start = parts[0].trim();
      const end = parts[1].trim();
      const isValidTime = (t: string) => /^\d{2}:\d{2}$/.test(t);
      
      if (isValidTime(start)) setStartTime(start);
      if (isValidTime(end)) setEndTime(end);
    }
  }, [value]);

  // Cuando cambian ambos tiempos, actualizar el formulario
  React.useEffect(() => {
    if (startTime && endTime) {
      const formatted = `${formatTimeDisplay(startTime)} a ${formatTimeDisplay(endTime)}`;
      if (formatted !== value) {
        onChange(formatted);
      }
    }
  }, [startTime, endTime, onChange, value]);

  const handleStartChange = (newStart: string) => {
    setStartTime(newStart);
    // Si la hora de fin es menor o igual a la nueva hora de inicio, limpiarla
    if (endTime && endTime <= newStart) {
      setEndTime("");
    }
  };

  const handleEndChange = (newEnd: string) => {
    setEndTime(newEnd);
  };

  // Filtrar opciones de fin para que sean mayores a la hora de inicio
  const endOptions = React.useMemo(() => {
    if (!startTime) return TIME_OPTIONS;
    return TIME_OPTIONS.filter((opt) => opt.value > startTime);
  }, [startTime]);

  return (
    <div className={`${className ?? ""} w-full`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <Select value={startTime} onValueChange={handleStartChange} disabled={disabled}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Desde">
              {startTime ? formatTimeDisplay(startTime) : "Desde"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TIME_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <span className="text-sm text-muted-foreground font-medium">a</span>
        
        <Select value={endTime} onValueChange={handleEndChange} disabled={disabled || !startTime}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Hasta">
              {endTime ? formatTimeDisplay(endTime) : "Hasta"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {endOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {formState.errors[name] && (
        <span className="text-xs text-red-500">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(formState.errors as any)[name]?.message as string}
        </span>
      )}
    </div>
  );
}
