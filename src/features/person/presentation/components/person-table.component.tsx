import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useFindAllPersonsQuery } from "../hooks/use-person-queries";
import {
  AlertCircle,
  Columns4,
  House,
  IdCard,
  Pencil,
  User,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

import clsx from "clsx";

export function PersonListTable() {
  const { data: persons, isLoading } = useFindAllPersonsQuery();

  return (
    <div className="rounded-lg border bg-white p-6 mt-4">
      <h3 className="text-lg font-semibold mb-4">
        Resultados ({persons?.length ?? 0})
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className="flex items-center gap-1">
                  <IdCard className="w-4 h-4" />
                  Cédula
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> Nombres
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> Apellidos
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <House className="w-4 h-4" />
                  Fecha de Nacimiento
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <Columns4 className="w-4 h-4" />
                  Tipo
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={13}>Cargando...</TableCell>
              </TableRow>
            )}
            {!isLoading && persons && persons.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mb-1 text-gray-400" />
                    <span className="text-base md:text-lg font-medium">
                      No existen personas registradas aún.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              persons?.map((person) => (
                <TableRow key={person.id_persona}>
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
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      )}
                    >
                      {person.fallecido ? "Fallecido" : "Propietario"}
                    </span>
                  </TableCell>

                  <TableCell>
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
