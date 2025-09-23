import { Input } from "@/shared/components/ui/input";


export default function RequisitoInhumacionFilters() {
    return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input placeholder="Buscar por ID" className="w-full md:w-1/3" />
    </div>
  );
} 