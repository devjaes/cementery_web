"use client";
import { useFindBloquesByCementeryQuery } from "../hooks/use-bloques-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useDeleteBloqueMutation } from "../hooks/use-bloques-mutations";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";
import clsx from "clsx";

export function BloquesTable({ idCementerio }: { idCementerio: string }) {
  const { data: bloques, isLoading, error } = useFindBloquesByCementeryQuery(idCementerio);
  const { mutate: deleteBloque, isPending } = useDeleteBloqueMutation(idCementerio);

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-2">
        <h3 className="text-base font-semibold text-foreground">Bloques ({bloques?.length ?? 0})</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Filas</TableHead>
              <TableHead>Columnas</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">Cargando...</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-destructive">
                  {error instanceof Error ? error.message : "Error"}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && bloques && bloques.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <AlertCircle className="text-muted-foreground/50" />
                    <span>No hay bloques registrados</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {bloques?.map((b) => (
              <TableRow key={b.idBloque}>
                <TableCell>{b.numero ?? '-'}</TableCell>
                <TableCell>{b.nombre}</TableCell>
                <TableCell className="max-w-xs truncate" title={b.descripcion ?? ''}>{b.descripcion}</TableCell>
                <TableCell>{b.numeroFilas}</TableCell>
                <TableCell>{b.numeroColumnas}</TableCell>
                <TableCell>{b.estado}</TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar bloque?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. ¿Deseas eliminar este bloque?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteBloque(b.idBloque)}
                          disabled={isPending}
                          className={clsx("px-8 bg-destructive text-white hover:bg-destructive/90", isPending && "opacity-50")}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
