import { Input } from "@/shared/components/ui/input";

export function InhumacionFilters() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input placeholder="Buscar por ID, responsable, codigo de inhumacion.." className="w-full md:w-1/3" />
    </div>
  );
} 