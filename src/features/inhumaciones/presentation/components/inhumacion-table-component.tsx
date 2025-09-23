import { AlertCircle, Hash, User, MapPin, Calendar, UserCheck, Shield, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useDeleteInhumacionMutation } from "../hooks/use-inhumacion-mutation";
import { useFindAllInhumacionesQuery } from "../hooks/use-inhumacion-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";
import clsx from "clsx";

function StatusChip({ estado }: { estado: string }) {
  let color = "bg-gray-200 text-gray-800";
  if (estado.toLowerCase() === "realizada")
    color = "bg-green-100 text-green-800";
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {estado}
    </span>
  );
}

export function InhumacionListTable() {
  const {
    data: inhumaciones,
    isLoading,
    error,
  } = useFindAllInhumacionesQuery();
  const { mutate: deleteInhumacion, isPending } = useDeleteInhumacionMutation();

  return (
    <div className="rounded-lg border bg-white p-6 mt-4">
      <h3 className="text-lg font-semibold mb-4">
        Resultados ({inhumaciones?.length ?? 0})
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className="flex items-center gap-1">
                  <Hash className="w-4 h-4" />
                  CODIGO INHUMACION
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Fallecido
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Nicho
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Fecha de inhumacion
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-4 h-4" />
                  Solicitante
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Responsable
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <Hash className="w-4 h-4" />
                  Estado
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
                <TableCell colSpan={8}>Cargando...</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={8} className="text-red-500">
                  {error instanceof Error ? error.message : "Error desconocido"}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && inhumaciones && inhumaciones.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mb-1 text-gray-400" />
                    <span className="text-base md:text-lg font-medium">
                      No existen inhumaciones registradas aún.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {inhumaciones?.map((inhumacion) => (
              <TableRow key={inhumacion.idInhumacion}>
                <TableCell>{inhumacion.codigoInhumacion}</TableCell>
                <TableCell>{inhumacion.idFallecido.nombres + ' ' +  inhumacion.idFallecido.apellidos}</TableCell>
                <TableCell>{inhumacion.idNicho?.sector} - Fila: {inhumacion.idNicho?.fila} - Número: {inhumacion.idNicho?.numero} - Tipo: {inhumacion.idNicho?.tipo}</TableCell>
                <TableCell>{new Date(inhumacion.fechaInhumacion).toLocaleDateString()}</TableCell>
                <TableCell>{inhumacion.solicitante}</TableCell>
                <TableCell>{inhumacion.responsableInhumacion}</TableCell>
                <TableCell>
                  <StatusChip estado={inhumacion.estado} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/inhumaciones/${inhumacion.idInhumacion}/editar`}>
                      <Button size="icon" variant="ghost">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar inhumacion?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. ¿Deseas eliminar esta inhumacion?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteInhumacion(inhumacion.idInhumacion)}
                            disabled={isPending}
                            className={clsx(
                              "px-8 bg-red-500 hover:bg-red-600",
                              isPending && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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