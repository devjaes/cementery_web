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
  User,
  Users,
  Pencil,
  Trash2,
  Calendar,
  UserCheck,
  Shield,
  Hash,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import {
  InhumacionFallecidosEntity,
  SearchFallecidosInhumacionEntity,
} from "../../domain/entities/inhumacion.entity";
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
import { useDeleteInhumacionMutation } from "../hooks/use-inhumacion-mutation";

interface InhumacionSearchResultsProps {
  results: SearchFallecidosInhumacionEntity;
  searchTerm: string;
  selectedFallecido: InhumacionFallecidosEntity | null;
  onSelectFallecido: (fallecido: InhumacionFallecidosEntity) => void;
}


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

export function InhumacionSearchResults({
  results,
  searchTerm,
  selectedFallecido,
  onSelectFallecido,
}: InhumacionSearchResultsProps) {
  const isSingleResult = results.totalEncontrados === 1;
  
  // Move hook to top level to avoid conditional calling
  const { mutate: deleteInhumacion, isPending } =
    useDeleteInhumacionMutation();

  // Si hay un fallecido seleccionado, mostrar sus detalles
  if (selectedFallecido) {
    const { fallecido, inhumaciones } = selectedFallecido;

    return (
      <div className="space-y-6">
        {/* Confirmación de selección */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <CheckCircle className="w-5 h-5" />
              Detalles de Inhumacion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              Mostrando inhumacion de{" "}
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
              Inhumaciones Encontradas ({inhumaciones.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inhumaciones.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron inhumaciones
                </h3>
                <p className="text-gray-600">
                  No se encontró ninguna inhumacion para este fallecido
                </p>
              </div>
            ) : (
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
                        <span className="flex items-center gap-1">
                          Acciones
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inhumaciones?.map((inhumacion) => (
                      <TableRow key={inhumacion.idInhumacion}>
                        <TableCell>{inhumacion.codigoInhumacion}</TableCell>
                        <TableCell>
                          {inhumacion.idFallecido.nombres +
                            " " +
                            inhumacion.idFallecido.apellidos}
                        </TableCell>
                        <TableCell>
                          {inhumacion.idNicho?.sector} - Fila:{" "}
                          {inhumacion.idNicho?.fila} - Número:{" "}
                          {inhumacion.idNicho?.numero} - Tipo:{" "}
                          {inhumacion.idNicho?.tipo}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            inhumacion.fechaInhumacion
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{inhumacion.solicitante}</TableCell>
                        <TableCell>
                          {inhumacion.responsableInhumacion}
                        </TableCell>
                        <TableCell>
                          <StatusChip estado={inhumacion.estado} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link
                              href={`/inhumaciones/${inhumacion.idInhumacion}/editar`}
                            >
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
                                  <AlertDialogTitle>
                                    ¿Eliminar inhumacion?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. ¿Deseas
                                    eliminar esta inhumacion?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      deleteInhumacion(inhumacion.idInhumacion)
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
    const { fallecido, inhumaciones } = unicoResultado;
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
              Se encontró la inhumacion de{" "}
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
              Inhumaciones Encontradas ({inhumaciones.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inhumaciones.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron inhumaciones
                </h3>
                <p className="text-gray-600">
                  No se encontró ninguna inhumacion para este fallecido
                </p>
              </div>
            ) : (
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
                        <span className="flex items-center gap-1">
                          Acciones
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inhumaciones?.map((inhumacion) => (
                      <TableRow key={inhumacion.idInhumacion}>
                        <TableCell>{inhumacion.codigoInhumacion}</TableCell>
                        <TableCell>
                          {inhumacion.idFallecido.nombres +
                            " " +
                            inhumacion.idFallecido.apellidos}
                        </TableCell>
                        <TableCell>
                          {inhumacion.idNicho?.sector} - Fila:{" "}
                          {inhumacion.idNicho?.fila} - Número:{" "}
                          {inhumacion.idNicho?.numero} - Tipo:{" "}
                          {inhumacion.idNicho?.tipo}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            inhumacion.fechaInhumacion
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{inhumacion.solicitante}</TableCell>
                        <TableCell>
                          {inhumacion.responsableInhumacion}
                        </TableCell>
                        <TableCell>
                          <StatusChip estado={inhumacion.estado} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link
                              href={`/inhumaciones/${inhumacion.idInhumacion}/editar`}
                            >
                              <Button size="icon" variant="ghost">
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </Link>
                            {/* <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    ¿Eliminar inhumacion?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. ¿Deseas
                                    eliminar esta inhumacion?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      deleteInhumacion(inhumacion.idInhumacion)
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
                            </AlertDialog> */}
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
          const { fallecido, inhumaciones } = resultado;

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
                          {inhumaciones.length > 0  && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {inhumaciones[0].idNicho?.sector} - Fila:{inhumaciones[0].idNicho?.fila} 
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de Ubicaciones y Botón */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {inhumaciones.length}
                      </div>
                      <div className="text-xs text-gray-500">
                        Ubicacion{inhumaciones.length !== 1 ? "es" : ""}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onSelectFallecido(resultado)}
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Ver detalles
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
