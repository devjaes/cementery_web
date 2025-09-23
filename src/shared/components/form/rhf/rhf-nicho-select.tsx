import { useFindAllNichosQuery } from "@/features/nichos/presentation/hooks/use-nicho-queries";
import RHFSelect from "./rhf-select";

interface RHFNichoSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  className?: string;
}

export default function RHFNichoSelect({
  name,
  label,
  placeholder,
  disabled,
}: RHFNichoSelectProps) {
  const { data: nichos, isLoading } = useFindAllNichosQuery();

  const options = (nichos ?? [])
    .filter((n) => n.idNicho !== undefined)
    .map((n) => ({
      value: n.idNicho as string,
      label: `${n.sector} - Fila: ${n.fila} - Número: ${n.numero} - Tipo: ${n.tipo}`,
    }));

  return (
    <RHFSelect
      name={name}
      label={label}
      options={options}
      placeholder={
        isLoading ? "Cargando nichos..." : placeholder || "Selecciona un nicho"
      }
      disabled={isLoading || disabled}
    />
  );
}
