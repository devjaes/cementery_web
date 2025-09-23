"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { AlertCircle, Hash, User2, BadgeCheck, Trash2, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";
import clsx from "clsx";
import { StatusChip } from "../utils/status-chip";
import { useNichoHuecosList } from "../hooks/use-nicho-huecos-list";


interface NichoHuecosListProps {
  nichoId: string;
}

export function NichoHuecosList({ nichoId }: NichoHuecosListProps) {
  const {
    huecos,
    isLoading,
    error,
    isDeleting,
    isCreating,
    handleDelete,
    handleCreateHueco,
    canCreateHueco,
    getCreateButtonMessage,
    canDeleteHueco,
  } = useNichoHuecosList({ nichoId });

  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Huecos</h3>
        <Button 
          onClick={handleCreateHueco}
          disabled={isCreating || !canCreateHueco()}
          size="sm"
          className="gap-1"
          variant={!canCreateHueco() ? "secondary" : "default"}
        >
          <Plus className="w-4 h-4" />
          {isCreating ? "Creando..." : getCreateButtonMessage()}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><span className="flex items-center gap-1"><Hash className="w-4 h-4" />Número</span></TableHead>
              <TableHead><span className="flex items-center gap-1"><BadgeCheck className="w-4 h-4" />Estado</span></TableHead>
              <TableHead><span className="flex items-center gap-1"><User2 className="w-4 h-4" />Fallecido</span></TableHead>
              <TableHead><span className="flex items-center gap-1">Acciones</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>Cargando...</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={4} className="text-red-500">
                  {error instanceof Error ? error.stack : "Error desconocido"}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && huecos && huecos.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mb-1 text-gray-400" />
                    <span className="text-base md:text-lg font-medium">No existen huecos registrados aún.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {huecos?.map((hueco) => (
              <TableRow key={hueco.idDetalleHueco}>
                <TableCell>{hueco.numHueco}</TableCell>
                <TableCell><StatusChip estado={hueco.estado} /></TableCell>
                <TableCell>{hueco.idFallecido ? `${hueco.idFallecido.nombres} ${hueco.idFallecido.apellidos} (${hueco.idFallecido.cedula})` : '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {canDeleteHueco(hueco) ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar hueco?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. ¿Deseas eliminar este hueco?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(hueco.idDetalleHueco)}
                              disabled={isDeleting}
                              className={clsx(
                                "px-8 bg-red-500 hover:bg-red-600",
                                isDeleting && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        disabled 
                        title="No se puede eliminar un hueco ocupado. Se requiere proceso de exhumación."
                      >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </Button>
                    )}
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