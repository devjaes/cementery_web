import { useFindAllNichosQuery } from "../hooks/use-nicho-queries";
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
  Hash,
  Landmark,
  Layers,
  ListOrdered,
  User2,
  BadgeCheck,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { useDeleteNichoMutation } from "../hooks/use-nicho-mutations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import clsx from "clsx";
import { StatusChip } from "../utils/nichos-status-chip";

export function NichoListTable() {
  const { data: nichos, isLoading, error } = useFindAllNichosQuery();
  const { mutate: deleteNicho, isPending } = useDeleteNichoMutation();

  return (
    <div className="rounded-lg border bg-white p-6 mt-4">
      <h3 className="text-lg font-semibold mb-4">
        Resultados ({nichos?.length ?? 0})
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className="flex items-center gap-1">
                  <Hash className="w-4 h-4" />
                  ID
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <Landmark className="w-4 h-4" />
                  Cementerio
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <Layers className="w-4 h-4" />
                  Sector
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <ListOrdered className="w-4 h-4" />
                  Fila
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <ListOrdered className="w-4 h-4" />
                  Número
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <User2 className="w-4 h-4" />
                  Tipo
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4" />
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
                  {error instanceof Error ? error.stack : "Error desconocido"}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && nichos && nichos.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mb-1 text-gray-400" />
                    <span className="text-base md:text-lg font-medium">
                      No existen nichos registrados aún.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {nichos?.map((nicho) => (
              <TableRow key={nicho.idNicho}>
                <TableCell>{nicho.idNicho}</TableCell>
                <TableCell>{nicho.idCementerio?.nombre || ""}</TableCell>
                <TableCell>{nicho.sector}</TableCell>
                <TableCell>{nicho.fila}</TableCell>
                <TableCell>{nicho.numero}</TableCell>
                <TableCell>{nicho.tipo}</TableCell>
                <TableCell>
                  <StatusChip estado={nicho.estado} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/nichos/${nicho.idNicho}`}>
                      <Button size="icon" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/nichos/${nicho.idNicho}/editar`}>
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
                          <AlertDialogTitle>¿Eliminar nicho?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. ¿Deseas eliminar
                            este nicho?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteNicho(nicho.idNicho!)}
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
