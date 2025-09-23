import { useFindAllCementeriesQuery } from "../hooks/use-cementery-queries";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { AlertCircle, Landmark, MapPin, Phone, User2, BadgeCheck, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { useDeleteCementeryMutation } from "../hooks/use-cementery-mutations";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";
import clsx from "clsx";

function StatusChip({ estado }: { estado: string }) {
    let color = "bg-gray-200 text-gray-700";
    if (estado.toLowerCase() === "activo") color = "bg-green-100 text-green-700";
    if (estado.toLowerCase() === "inactivo") color = "bg-gray-300 text-gray-500";
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{estado}</span>
    );
}

export function CementeryListTable() {
    const { data: cementeries, isLoading, error } = useFindAllCementeriesQuery();
    const { mutate: deleteCementery, isPending } = useDeleteCementeryMutation();

    return (
        <div className="rounded-lg border bg-white p-6 mt-4">
            <h3 className="text-lg font-semibold mb-4">Resultados ({cementeries?.length ?? 0})</h3>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><span className="flex items-center gap-1"><Landmark className="w-4 h-4" />Nombre</span></TableHead>
                            <TableHead><span className="flex items-center gap-1"><MapPin className="w-4 h-4" />Dirección</span></TableHead>
                            <TableHead><span className="flex items-center gap-1"><Phone className="w-4 h-4" />Teléfono</span></TableHead>
                            <TableHead><span className="flex items-center gap-1"><User2 className="w-4 h-4" />Responsable</span></TableHead>
                            <TableHead><span className="flex items-center gap-1"><BadgeCheck className="w-4 h-4" />Estado</span></TableHead>
                            <TableHead><span className="flex items-center gap-1">Acciones</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={7}>Cargando...</TableCell>
                            </TableRow>
                        )}
                        {error && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-red-500">
                                    {error instanceof Error ? error.message : "Error desconocido"}
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && cementeries && cementeries.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                        <AlertCircle className="w-12 h-12 mb-1 text-gray-400" />
                                        <span className="text-base md:text-lg font-medium">No existen cementerios registrados aún.</span>
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
                                        <Link href={`/cementerio/${cementery.idCementerio}/editar`}>
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