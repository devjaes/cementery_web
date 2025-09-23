import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export function PersonFilters() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input
        placeholder="Buscar por ID, sector, fila, número..."
        className="w-full md:w-1/3"
      />
      <Select>
        <SelectTrigger className="w-full md:w-1/4">
          <SelectValue placeholder="Todos los tipos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
