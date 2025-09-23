"use client";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Eye,
  MapPin,
  Building,
  User,
  Users,
  CheckCircle,
  Trash2,
  Calendar,
  UserCheck,
  Download,
  Clock,
} from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/shared/components/ui/alert-dialog";
import clsx from "clsx";
import {
  RequisitoInhumacionFallecidosEntity,
  SearchFallecidosRequisitoInhumacionEntity,
} from "../../domain/entities/requisito-inhumacion.entity";
import {
  useDeleteRequisitoInhumacionMutation,
  useDownloadRequisitoInhumacionPdfMutation,
} from "../hooks/use-requisito-inhumacion-mutation";

interface RequisitoInhumacionSearchResultsProps {
  results: SearchFallecidosRequisitoInhumacionEntity;
  searchTerm: string;
  selectedFallecido: RequisitoInhumacionFallecidosEntity | null;
  onSelectFallecido: (fallecido: RequisitoInhumacionFallecidosEntity) => void;
}

export function RequisitoInhumacionSearchResults({
  results,
  searchTerm,
  selectedFallecido,
  onSelectFallecido,
}: RequisitoInhumacionSearchResultsProps) {
  const isSingleResult = results.totalEncontrados === 1;

  // Move hooks to top level to avoid conditional calling
  const { mutate: deleteRequisitoInhumacion, isPending } =
    useDeleteRequisitoInhumacionMutation();

  const { mutate: downloadRequisitoInhumacionPdf, isPending: isDownloading } =
    useDownloadRequisitoInhumacionPdfMutation();

  // Si hay un fallecido seleccionado, mostrar sus detalles
  if (selectedFallecido) {
    const { fallecido, requisitos } = selectedFallecido;
    return (
      <div className="space-y-6">
        {/* Confirmación de selección */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <CheckCircle className="w-5 h-5" />
              Detalles de Requisito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              Mostrando requisito de{" "}
              <span className="font-medium">
                {fallecido.nombres} {fallecido.apellidos}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Información del Fallecido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Información del Fallecido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre Completo</p>
                <p className="font-medium">
                  {fallecido.nombres} {fallecido.apellidos}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cédula</p>
                <p className="font-medium">{fallecido.cedula}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                <p className="font-medium">
                  {fallecido.fecha_nacimiento
                    ? new Date(fallecido.fecha_nacimiento).toLocaleDateString(
                        "es-EC"
                      )
                    : "No disponible"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ubicaciones del fallecido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Requisitos Encontrados ({requisitos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {requisitos.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron requisitos
                </h3>
                <p className="text-gray-600">
                  No se encontró ningun requisito para este fallecido
                </p>
              </div>
            ) : (
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
                        <span className="flex items-center gap-1">
                          Acciones
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requisitos?.map((requisito) => (
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
                          {requisito.idHuecoNicho
                            ? `${requisito.idHuecoNicho.idNicho?.sector} - Fila: ${requisito.idHuecoNicho.idNicho?.fila} 
                    - Número: ${requisito.idHuecoNicho.idNicho?.numero} - Hueco: ${requisito.idHuecoNicho.numHueco}`
                            : "Sin nicho"}
                        </TableCell>
                        <TableCell>
                          {requisito.idFallecido
                            ? `${requisito.idFallecido.nombres} ${requisito.idFallecido.apellidos}`
                            : "No hay fallecido"}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            requisito.fechaInhumacion
                          ).toLocaleDateString()}
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
                                    Esta acción no se puede deshacer. ¿Deseas
                                    eliminar este requisito de inhumación?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      deleteRequisitoInhumacion(
                                        requisito.idRequsitoInhumacion
                                      )
                                    }
                                    disabled={isPending}
                                    className={clsx(
                                      "px-8 bg-red-500 hover:bg-red-600",
                                      isPending &&
                                        "opacity-50 cursor-not-allowed"
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
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSingleResult) {
    // Auto-seleccionar el único resultado
    const unicoResultado = results.fallecidos[0];
    const { fallecido, requisitos } = unicoResultado;
    return (
      <div className="space-y-6">
        {/* Confirmación de búsqueda exitosa */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Fallecido Encontrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">
              Se encontró el requisito de{" "}
              <span className="font-medium">
                {fallecido.nombres} {fallecido.apellidos}
              </span>
              que coincide con &quot;{searchTerm}&quot;.
            </p>
          </CardContent>
        </Card>

        {/* Información del Fallecido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Información del Fallecido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre Completo</p>
                <p className="font-medium">
                  {fallecido.nombres} {fallecido.apellidos}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cédula</p>
                <p className="font-medium">{fallecido.cedula}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                <p className="font-medium">
                  {fallecido.fecha_nacimiento
                    ? new Date(fallecido.fecha_nacimiento).toLocaleDateString(
                        "es-EC"
                      )
                    : "No disponible"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ubicaciones del fallecido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Requisitos Encontrados ({requisitos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {requisitos.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron requisitos
                </h3>
                <p className="text-gray-600">
                  No se encontró ningun requisito para este fallecido
                </p>
              </div>
            ) : (
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
            
            {requisitos?.map((requisito) => (
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
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista COMPACTA para MÚLTIPLES resultados
  return (
    <div className="space-y-6">
      {/* Resumen de Resultados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Múltiples Coincidencias Encontradas ({results.totalEncontrados})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Se encontraron{" "}
            <span className="font-medium">{results.totalEncontrados}</span>{" "}
            fallecidos que coinciden con &quot;{searchTerm}&quot;. Selecciona
            uno para ver los detalles de su ubicación.
          </p>
        </CardContent>
      </Card>

      {/* Lista COMPACTA de Fallecidos */}
      <div className="grid gap-4">
        {results.fallecidos.map((resultado, index) => {
          const { fallecido, requisitos } = resultado;

          return (
            <Card
              key={`${fallecido.id_persona}-${index}`}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  {/* Información Básica */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {fallecido.nombres} {fallecido.apellidos}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Cédula: {fallecido.cedula}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de Ubicaciones y Botón */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {requisitos.length}
                      </div>
                      <div className="text-xs text-gray-500">
                        Requisito {requisitos.length !== 1 ? "es" : ""}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onSelectFallecido(resultado)}
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Ubicación
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
