import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

export function CementeryFilters() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input placeholder="Buscar por ID, nombre o cédula..." className="w-full md:w-1/3" />
      <Select>
        <SelectTrigger className="w-full md:w-1/4">
          <SelectValue placeholder="Todas las secciones" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las secciones</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-full md:w-1/4">
          <SelectValue placeholder="Todos los bloques" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los bloques</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-full md:w-1/4">
          <SelectValue placeholder="Todos los estados" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 