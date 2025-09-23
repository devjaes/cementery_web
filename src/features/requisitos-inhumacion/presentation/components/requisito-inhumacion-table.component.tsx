import {
  AlertCircle,
  User,
  MapPin,
  Calendar,
  UserCheck,
  Trash2,
  Building,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import Link from "next/link";
import {
  useDeleteRequisitoInhumacionMutation,
  useDownloadRequisitoInhumacionPdfMutation,
} from "../hooks/use-requisito-inhumacion-mutation";
import { useFindAllRequisitosInhumacionQuery } from "../hooks/use-requisito-inhumacion-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
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

export function RequisitoInhumacionListTable() {
  const {
    data: requisitosInhumacion,
    isLoading,
    error,
  } = useFindAllRequisitosInhumacionQuery();
  const { mutate: deleteRequisitoInhumacion, isPending } =
    useDeleteRequisitoInhumacionMutation();
  const { mutate: downloadRequisitoInhumacionPdf, isPending: isDownloading } =
    useDownloadRequisitoInhumacionPdfMutation();

  return (
    <div className="rounded-lg border bg-white p-6 mt-4">
      <h3 className="text-lg font-semibold mb-4">
        Resultados ({requisitosInhumacion?.length ?? 0})
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  Cementerio
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-4 h-4" />
                  Pantonero a Cargo
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Solicitante
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Hueco/Nicho
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
                  <Calendar className="w-4 h-4" />
                  Fecha Inhumación
                </span>
              </TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Hora Inhumación
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
                <TableCell colSpan={12}>Cargando...</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={12} className="text-red-500">
                  {error instanceof Error ? error.message : "Error desconocido"}
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              requisitosInhumacion &&
              requisitosInhumacion.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <AlertCircle className="w-12 h-12 mb-1 text-gray-400" />
                      <span className="text-base md:text-lg font-medium">
                        No existen requisitos de inhumación registrados aún.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            {requisitosInhumacion?.map((requisito) => (
              <TableRow key={requisito.idRequsitoInhumacion}>
                <TableCell>
                  {requisito.idCementerio?.nombre ?? "Sin cementerio"}
                </TableCell>
                <TableCell>{requisito.pantoneroACargo}</TableCell>
                <TableCell>          
                    {requisito.idSolicitante
                      ? `${requisito.idSolicitante.nombres} ${requisito.idSolicitante.apellidos}`
                      : "No hay solicitante"}
                </TableCell>
                <TableCell>
                  {requisito.idHuecoNicho ?
                    `${requisito.idHuecoNicho.idNicho?.sector} - Fila: ${requisito.idHuecoNicho.idNicho?.fila} 
                    - Número: ${requisito.idHuecoNicho.idNicho?.numero} - Hueco: ${requisito.idHuecoNicho.numHueco}`
                  : "Sin nicho"}
                </TableCell>
                <TableCell>
                  {requisito.idFallecido
                      ? `${requisito.idFallecido.nombres} ${requisito.idFallecido.apellidos}`
                      : "No hay fallecido"}
                </TableCell>
                <TableCell>
                  {new Date(requisito.fechaInhumacion).toLocaleDateString()}
                </TableCell>
                <TableCell>{requisito.horaInhumacion}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link
                      href={`/requisitos-inhumacion/${requisito.idRequsitoInhumacion}`}
                    >
                      <Button size="icon" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        downloadRequisitoInhumacionPdf(
                          requisito.idRequsitoInhumacion
                        )
                      }
                      disabled={isDownloading}
                      className={clsx(
                        isDownloading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Eliminar requisito de inhumación?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. ¿Deseas eliminar
                            este requisito de inhumación?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              deleteRequisitoInhumacion(
                                requisito.idRequsitoInhumacion
                              )
                            }
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
