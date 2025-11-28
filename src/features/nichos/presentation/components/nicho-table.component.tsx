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
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
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

interface NichoListTableProps {
  onEditClick?: (id: string) => void;
}

export function NichoListTable({ onEditClick }: NichoListTableProps = {}) {
  const { data: nichos, isLoading, error } = useFindAllNichosQuery();
  const { mutate: deleteNicho, isPending } = useDeleteNichoMutation();

  return (
    <div className="rounded-lg border bg-card p-6 mt-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Resultados ({nichos?.length ?? 0})
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className="flex items-center gap-1">
                  Cementerio
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  Sector
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  Fila
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  Número
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  Tipo
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
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
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando...</p>
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-destructive">
                  {error instanceof Error ? error.message : "Error al cargar los nichos"}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && nichos && nichos.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mb-1" />
                    <span className="text-base md:text-lg font-medium">
                      No existen nichos registrados aún.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {nichos?.map((nicho) => (
              <TableRow key={nicho.idNicho}>
                <TableCell className="font-medium">{nicho.idCementerio?.nombre || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="outline"></Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{nicho.fila}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{nicho.columna}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{nicho.tipo}</Badge>
                </TableCell>
                <TableCell>
                  <StatusChip estado={nicho.estado} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {nicho.estadoVenta === 'Deshabilitado' ? (
                      <Button 
                        size="icon" 
                        variant="ghost"
                        disabled
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Link href={`/nichos/${nicho.idNicho}`}>
                        <Button 
                          size="icon" 
                          variant="ghost"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    {onEditClick ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEditClick(nicho.idNicho!)}
                        disabled={nicho.estadoVenta === 'Deshabilitado'}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    ) : nicho.estadoVenta === 'Deshabilitado' ? (
                      <Button 
                        size="icon" 
                        variant="ghost"
                        disabled
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Link href={`/nichos/${nicho.idNicho}/editar`}>
                        <Button 
                          size="icon" 
                          variant="ghost"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          disabled={nicho.estadoVenta === 'Deshabilitado'}
                        >
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
                              "px-8 bg-destructive hover:bg-destructive/90",
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
