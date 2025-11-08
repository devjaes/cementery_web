import { useFindAllCementeriesQuery } from "../hooks/use-cementery-queries";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { AlertCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useDeleteCementeryMutation } from "../hooks/use-cementery-mutations";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";
import clsx from "clsx";

function StatusChip({ estado }: { estado: string }) {
    const estadoLower = estado.toLowerCase();
    let className = "bg-muted text-muted-foreground";
    if (estadoLower === "activo") {
        className = "bg-primary/10 text-primary";
    } else if (estadoLower === "inactivo") {
        className = "bg-muted text-muted-foreground";
    }
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
            {estado}
        </span>
    );
}

interface CementeryListTableProps {
    onEditClick?: (id: string) => void;
}

export function CementeryListTable({ onEditClick }: CementeryListTableProps = {}) {
    const { data: cementeries, isLoading, error } = useFindAllCementeriesQuery();
    const { mutate: deleteCementery, isPending } = useDeleteCementeryMutation();

    return (
        <div className="rounded-lg border bg-card p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                    Cementerios ({cementeries?.length ?? 0})
                </h3>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <span className="flex items-center gap-1">
                                    Nombre
                                </span>
                            </TableHead>
                            <TableHead>
                                <span className="flex items-center gap-1">
                                    Dirección
                                </span>
                            </TableHead>
                            <TableHead>
                                <span className="flex items-center gap-1">
                                    Teléfono
                                </span>
                            </TableHead>
                            <TableHead>
                                <span className="flex items-center gap-1">
                                    Responsable
                                </span>
                            </TableHead>
                            <TableHead>
                                <span className="flex items-center gap-1">
                                    Estado
                                </span>
                            </TableHead>
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
                        {error && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-destructive">
                                    {error instanceof Error ? error.message : "Error desconocido"}
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && cementeries && cementeries.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                        <AlertCircle className="text-muted-foreground/50" />
                                        <span className="text-base">
                                            No existen registros para mostrar
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {cementeries?.map((cementery) => (
                            <TableRow key={cementery.idCementerio}>
                                <TableCell>{cementery.nombre}</TableCell>
                                <TableCell>{cementery.direccion}</TableCell>
                                <TableCell>{cementery.telefono}</TableCell>
                                <TableCell>{cementery.responsable}</TableCell>
                                <TableCell><StatusChip estado={cementery.estado} /></TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => onEditClick?.(cementery.idCementerio)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Eliminar cementerio?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción no se puede deshacer. ¿Deseas eliminar este cementerio?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => deleteCementery(cementery.idCementerio)}
                                                        disabled={isPending}
                                                        className={clsx(
                                                            "px-8 bg-destructive text-white hover:bg-destructive/90",
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