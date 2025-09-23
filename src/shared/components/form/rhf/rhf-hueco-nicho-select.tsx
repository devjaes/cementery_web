import { useFindHuecosByCementerioQuery } from "@/features/huecos/presentation/hooks/use-hueco-queries";
import RHFSelect from "./rhf-select";
import { useWatch } from "react-hook-form";


interface RHFHuecoNichoSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  className?: string;
}


export default function RHFHuecoNichoSelect({
  name,
  label,
  placeholder,
  disabled,
}: RHFHuecoNichoSelectProps) {
  
  const idCementerio = useWatch({ name: "idCementerio" }); 

  const { data: huecosNichos, isLoading } = useFindHuecosByCementerioQuery(idCementerio);
  
  const options = (huecosNichos ?? []).map((h) => ({
    value: h.idDetalleHueco as string,
    label: `Sector: ${h.idNicho?.sector} - Fila: ${h.idNicho?.fila} - Número: ${h.idNicho?.numero} - Hueco: ${h.numHueco} - Tipo: ${h.idNicho?.tipo}`,
  }));

  return (
    <RHFSelect 
      name={name}
      label={label}
      options={options}
      placeholder={isLoading ? "Cargando huecos..." : placeholder || "Selecciona un hueco"}
      disabled={isLoading || disabled || !idCementerio} // se desactiva si no hay cementerio
    />
  );
}
