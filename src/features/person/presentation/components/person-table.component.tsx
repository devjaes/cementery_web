import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  AlertCircle,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { PersonEntity } from "../../domain/entities/person.entity";
import clsx from "clsx";

interface PersonListTableProps {
  persons?: PersonEntity[];
  isLoading?: boolean;
  hasError?: boolean;
  searchTerm?: string;
  onSelectPerson?: (person: PersonEntity) => void;
}

export function PersonListTable({
  persons,
  isLoading,
  hasError,
  searchTerm,
  onSelectPerson
}: PersonListTableProps) {

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {searchTerm ? (
            <>Resultados de búsqueda ({persons?.length ?? 0})</>
          ) : (
            <>Personas ({persons?.length ?? 0})</>
          )}
        </h3>
        {searchTerm && (
          <p className="text-sm text-muted-foreground mt-1">
            Búsqueda: &quot;{searchTerm}&quot;
          </p>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cédula</TableHead>
              <TableHead>Nombres</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead>Fecha de Nacimiento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Cargando...
                </TableCell>
              </TableRow>
            )}
            {hasError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-destructive">
                  Error al cargar los datos
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !hasError && persons && persons.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <AlertCircle className="text-muted-foreground/50" />
                    <span className="text-base">
                      {searchTerm
                        ? `No se encontraron resultados para "${searchTerm}"`
                        : "No existen registros para mostrar"
                      }
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              !hasError &&
              persons?.map((person) => (
                <TableRow
                  key={person.id_persona}
                  className={onSelectPerson ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => onSelectPerson?.(person)}
                >
                  <TableCell>{person.cedula}</TableCell>
                  <TableCell>{person.nombres}</TableCell>
                  <TableCell>{person.apellidos}</TableCell>
                  <TableCell>
                    {new Date(person.fecha_nacimiento).toLocaleDateString(
                      "es-ES"
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={clsx(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        person.fallecido
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {person.fallecido ? "Fallecido" : "Propietario"}
                    </span>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <Link href={`/persons/${person.id_persona}/editar`}>
                        <Button size="icon" variant="ghost">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
