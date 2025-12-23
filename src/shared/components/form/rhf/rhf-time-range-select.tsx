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

/**
 * Parsea un valor de horario y extrae las horas de inicio y fin en formato HH:MM
 */
const parseTimeRange = (value: string | null | undefined): { start: string; end: string } => {
  if (!value) return { start: "", end: "" };
  
  // Normalizar: reemplazar 'h' por ':' para unificar formatos
  const normalized = String(value).replace(/h/gi, ":");
  
  // Buscar patrón de dos horarios separados por 'a', '-', ' - ', etc.
  const match = normalized.match(/(\d{1,2}):(\d{2})\s*[-aA]\s*(\d{1,2}):(\d{2})/);
  
  if (match) {
    const startHour = match[1].padStart(2, "0");
    const startMin = match[2];
    const endHour = match[3].padStart(2, "0");
    const endMin = match[4];
    
    return {
      start: `${startHour}:${startMin}`,
      end: `${endHour}:${endMin}`,
    };
  }
  
  return { start: "", end: "" };
};

export default function RHFTimeRangeSelect({
  name,
  label,
  disabled,
  className,
}: RHFTimeRangeSelectProps) {
  const { control, formState, watch } = useFormContext();
  const {
    field: { value, onChange },
  } = useController({ name, control });

  // Observar el valor del formulario para detectar cambios externos (como reset)
  const watchedValue = watch(name);

  // Estado local para manejar las selecciones
  const [startTime, setStartTime] = React.useState(() => {
    const parsed = parseTimeRange(value);
    return parsed.start;
  });
  const [endTime, setEndTime] = React.useState(() => {
    const parsed = parseTimeRange(value);
    return parsed.end;
  });

  // Referencia para evitar actualizaciones cíclicas
  const isInternalUpdate = React.useRef(false);

  // Sincronizar estado local con el valor del formulario cuando cambia externamente
  React.useEffect(() => {
    // Ignorar si el cambio fue interno
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const parsed = parseTimeRange(watchedValue);
    
    if (parsed.start !== startTime || parsed.end !== endTime) {
      setStartTime(parsed.start);
      setEndTime(parsed.end);
    }
  }, [watchedValue]); // Solo depende del valor observado

  // Cuando cambian los tiempos locales, actualizar el formulario
  React.useEffect(() => {
    if (startTime && endTime) {
      const formatted = `${formatTimeDisplay(startTime)} a ${formatTimeDisplay(endTime)}`;
      if (formatted !== value) {
        isInternalUpdate.current = true;
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
