import { useFindAllCementeriesQuery } from "@/features/cementery/presentation/hooks/use-cementery-queries";
import RHFSelect from "@/shared/components/form/rhf/rhf-select";

interface RHFCementerySelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function RHFCementerySelect({ name, label, placeholder, disabled }: RHFCementerySelectProps) {
  const { data: cementeries, isLoading } = useFindAllCementeriesQuery();

  const options = cementeries?.map(c => ({
    value: c.idCementerio,
    label: c.nombre,
  })) ?? [];

  return (
    <RHFSelect
      name={name}
      label={label}
      options={options}
      placeholder={isLoading ? "Cargando cementerios..." : (placeholder || "Selecciona un cementerio")}
      disabled={isLoading || disabled}
    />
  );
} 