"use client";

import Link from "next/link";
import {
  RequisitoInhumacionFallecidosEntity,
  RequisitoInhumacionEntity,
} from "@/features/requisitos-inhumacion/domain/entities/requisito-inhumacion.entity";
import { MejoraEntity } from "../../domain/entities/mejora.entity";
import { MejoraSearchAllResultsEntity } from "../../domain/entities/mejora-search.entity";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Check, CheckCircle, Download, Eye, Loader2, MapPin, Pencil, User, Users, Calendar, FileText, Building, UserCheck, Home } from "lucide-react";
import { useState } from "react";
import { useApproveMejoraMutation, useDownloadMejoraPdfMutation } from "../hooks/use-mejora-mutation";
import { Separator } from "@/shared/components/ui/separator";

const DEFAULT_APPROVER_ID = "11657f06-85d6-42bb-84f6-7e3ffe06965d";

interface MejoraSearchResultsProps {
  results: MejoraSearchAllResultsEntity;
  searchTerm: string;
  relatedMejoras: MejoraEntity[];
  isLoadingRelated?: boolean;
}

const formatDate = (value?: string) => {
  if (!value) return "No disponible";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "No disponible" : date.toLocaleDateString("es-EC");
};

const fullName = (person?: { nombres?: string; apellidos?: string }) => {
  if (!person) return "Sin información";
  const parts = [person.nombres, person.apellidos].filter(Boolean);
  return parts.length ? parts.join(" ") : "Sin información";
};

const MejoraDetailDialog = ({ mejora }: { mejora: MejoraEntity }) => {
  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Detalle de la Mejora
        </DialogTitle>
        <DialogDescription>
          Código de autorización: {mejora.codigoAutorizacion ?? "N/A"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Estado y tipo de servicio */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Estado:</span>
            <Badge 
              className={mejora.estado === "Aprobado" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""} 
              variant={mejora.estado === "Aprobado" ? "default" : "secondary"}
            >
              {mejora.estado ?? "Sin estado"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Tipo:</span>
            <Badge variant="outline">{mejora.tipoServicio}</Badge>
          </div>
        </div>

        <Separator />

        {/* Información general */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Building className="h-4 w-4" />
            Información General
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Cementerio:</span>
              <p className="font-medium">{mejora.idCementerio?.nombre ?? "N/A"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Panteonero:</span>
              <p className="font-medium">{mejora.panteoneroACargo}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Método solicitud:</span>
              <p className="font-medium capitalize">{mejora.metodoSolicitud}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Entidad:</span>
              <p className="font-medium">{mejora.entidad ?? "N/A"}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Solicitante */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Solicitante
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="col-span-2">
              <span className="text-muted-foreground">Nombre:</span>
              <p className="font-medium">{fullName(mejora.solicitante)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Teléfono:</span>
              <p className="font-medium">{mejora.solicitanteTelefono ?? "N/A"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Correo:</span>
              <p className="font-medium">{mejora.correoSolicitante ?? "N/A"}</p>
            </div>
            {mejora.direccionSolicitante && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Dirección:</span>
                <p className="font-medium">{mejora.direccionSolicitante}</p>
              </div>
            )}
            {mejora.observacionSolicitante && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Observaciones:</span>
                <p className="font-medium">{mejora.observacionSolicitante}</p>
              </div>
            )}
          </div>
        </div>

        {/* Fallecido */}
        {mejora.fallecido && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Fallecido
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2">
                  <span className="text-muted-foreground">Nombre:</span>
                  <p className="font-medium">{fullName(mejora.fallecido)}</p>
                </div>
                {mejora.fechaFallecimiento && (
                  <div>
                    <span className="text-muted-foreground">Fecha fallecimiento:</span>
                    <p className="font-medium">{formatDate(mejora.fechaFallecimiento)}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Programación */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Programación de la Intervención
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Fecha inicio:</span>
              <p className="font-medium">{formatDate(mejora.fechaInicio)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Fecha fin:</span>
              <p className="font-medium">{formatDate(mejora.fechaFin)}</p>
            </div>
            {mejora.horarioTrabajo && (
              <div>
                <span className="text-muted-foreground">Horario:</span>
                <p className="font-medium">{mejora.horarioTrabajo}</p>
              </div>
            )}
            {mejora.observacionServicio && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Observaciones:</span>
                <p className="font-medium">{mejora.observacionServicio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Información del nicho si existe */}
        {(mejora.propietarioNicho || mejora.lugarNicho || mejora.administradorNicho) && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Información del Nicho
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {mejora.propietarioNicho && (
                  <div>
                    <span className="text-muted-foreground">Propietario:</span>
                    <p className="font-medium">{mejora.propietarioNicho}</p>
                  </div>
                )}
                {mejora.administradorNicho && (
                  <div>
                    <span className="text-muted-foreground">Administrador:</span>
                    <p className="font-medium">{mejora.administradorNicho}</p>
                  </div>
                )}
                {mejora.lugarNicho && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Ubicación:</span>
                    <p className="font-medium">{mejora.lugarNicho}</p>
                  </div>
                )}
                {mejora.codigoSitio && (
                  <div>
                    <span className="text-muted-foreground">Código sitio:</span>
                    <p className="font-medium">{mejora.codigoSitio}</p>
                  </div>
                )}
                {mejora.numeroNichos !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Número de nichos:</span>
                    <p className="font-medium">{mejora.numeroNichos}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Fecha de solicitud */}
        <Separator />
        <div className="text-xs text-muted-foreground text-center">
          Fecha de solicitud: {formatDate(mejora.fechaSolicitud)}
        </div>
      </div>
    </DialogContent>
  );
};

const RelatedMejorasPanel = ({
  mejoras,
  isLoading,
  searchTerm,
}: {
  mejoras: MejoraEntity[];
  isLoading?: boolean;
  searchTerm: string;
}) => {
  const approveMutation = useApproveMejoraMutation();
  const downloadMutation = useDownloadMejoraPdfMutation();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleApprove = (mejora: MejoraEntity) => {
    setApprovingId(mejora.idMejora);
    approveMutation.mutate(
      { id: mejora.idMejora, aprobadoPorId: DEFAULT_APPROVER_ID },
      {
        onSettled: () => setApprovingId(null),
      },
    );
  };

  const handleDownload = (mejora: MejoraEntity) => {
    if (downloadMutation.isPending) return;
    setDownloadingId(mejora.idMejora);
    downloadMutation.mutate(
      { id: mejora.idMejora },
      {
        onSettled: () => setDownloadingId(null),
      },
    );
  };

  if (!isLoading && mejoras.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Mejoras relacionadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Buscando mejoras asociadas…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Fallecido</TableHead>
                  <TableHead>Cementerio</TableHead>
                  <TableHead>Tipo servicio</TableHead>
                  <TableHead>Fecha inicio</TableHead>
                  <TableHead className="w-[180px]">Estado</TableHead>
                  <TableHead className="w-[140px] text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mejoras.map((mejora) => (
                    <TableRow key={mejora.idMejora}>
                    <TableCell>{fullName(mejora.solicitante)}</TableCell>
                    <TableCell>{fullName(mejora.fallecido)}</TableCell>
                    <TableCell>{mejora.idCementerio?.nombre ?? "Sin cementerio"}</TableCell>
                    <TableCell>{mejora.tipoServicio}</TableCell>
                    <TableCell>{formatDate(mejora.fechaInicio ?? mejora.fechaSolicitud)}</TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-col gap-2">
                        <Badge 
                          className={mejora.estado === "Aprobado" ? "bg-emerald-500 hover:bg-emerald-600 text-white w-fit" : "w-fit"} 
                          variant={mejora.estado === "Aprobado" ? "default" : "secondary"}
                        >
                          {mejora.estado ?? "Sin estado"}
                        </Badge>
                        {mejora.estado === "Solicitado" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                className="gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white w-fit"
                                disabled={approveMutation.isPending}
                              >
                                {approveMutation.isPending && approvingId === mejora.idMejora ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                                {approveMutation.isPending && approvingId === mejora.idMejora
                                  ? "Aprobando…"
                                  : "Aprobar"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Aprobar esta mejora?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Confirmar actualizará el estado a &quot;Aprobado&quot; y dejará la solicitud lista para ejecutar.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={approveMutation.isPending}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={approveMutation.isPending}
                                  onClick={() => handleApprove(mejora)}
                                  className="gap-1.5 bg-emerald-500 hover:bg-emerald-600"
                                >
                                  {approveMutation.isPending && approvingId === mejora.idMejora ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                  Confirmar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" title="Ver detalle">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <MejoraDetailDialog mejora={mejora} />
                        </Dialog>
                        {mejora.estado === "Solicitado" ? (
                          <Link href={`/mejoras/${mejora.idMejora}/editar${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ""}`}>
                            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" title="Editar">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                        ) : null}
                        {mejora.estado === "Aprobado" ? (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title="Descargar formulario PDF"
                            disabled={downloadMutation.isPending && downloadingId === mejora.idMejora}
                            onClick={() => handleDownload(mejora)}
                          >
                            {downloadMutation.isPending && downloadingId === mejora.idMejora ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                        ) : null}
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
  );
};

const formatHueco = (requisito: RequisitoInhumacionEntity) => {
  const hueco = requisito.idHuecoNicho;
  const nicho = hueco?.idNicho;
  if (!hueco || !nicho) return "Sin información";
  const sector = nicho.sector ? `Sector ${nicho.sector}` : "";
  const fila = nicho.fila ? `Fila ${nicho.fila}` : "";
  const numero = nicho.numero ? `Nicho ${nicho.numero}` : "";
  const huecoLabel = hueco.numHueco ? `Hueco ${hueco.numHueco}` : "";
  return [sector, fila, numero, huecoLabel].filter(Boolean).join(" • ") || "Sin información";
};

const getResumenSolicitante = (requisito?: RequisitoInhumacionEntity) => {
  if (!requisito) return "Solicitante no disponible";
  return fullName(requisito.idSolicitante);
};

const SingleResultView = ({
  fallecido,
  requisitos,
  searchTerm,
}: {
  fallecido: RequisitoInhumacionFallecidosEntity;
  requisitos: RequisitoInhumacionEntity[];
  searchTerm: string;
}) => {
  const requisitoPrincipal = requisitos[0];
  const solicitanteNombre = getResumenSolicitante(requisitoPrincipal);
  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            Fallecido encontrado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">
            Se encontró la inhumación de <span className="font-medium">{fullName(fallecido.fallecido)}</span> que coincide con &quot;{searchTerm}&quot;.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Información del fallecido y solicitante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Fallecido</p>
              <p className="font-medium">{fullName(fallecido.fallecido)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cédula fallecido</p>
              <p className="font-medium">{fallecido.fallecido.cedula ?? "Sin cédula"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Solicitante</p>
              <p className="font-medium">{solicitanteNombre}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Requisitos asociados ({requisitos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requisitos.length === 0 ? (
            <Alert>
              <AlertDescription>No se encontraron requisitos de inhumación asociados a este fallecido.</AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead># Requisito</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Cementerio</TableHead>
                    <TableHead>Hueco / Nicho</TableHead>
                    <TableHead>Fecha inhumación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisitos.map((req) => (
                    <TableRow key={req.idRequsitoInhumacion}>
                      <TableCell className="font-semibold">{req.idRequsitoInhumacion}</TableCell>
                      <TableCell>{getResumenSolicitante(req)}</TableCell>
                      <TableCell>{req.idCementerio?.nombre ?? "Sin cementerio"}</TableCell>
                      <TableCell>{formatHueco(req)}</TableCell>
                      <TableCell>{formatDate(req.fechaInhumacion)}</TableCell>
                      <TableCell>
                        <Link
                          href={`/mejoras/nuevo?requisito=${req.idRequsitoInhumacion}${searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : ""}`}
                          className="inline-flex px-3 py-2 border rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                        >
                          Crear mejora
                        </Link>
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
};

const MultipleResultsView = ({
  fallecidos,
  searchTerm,
}: {
  fallecidos: RequisitoInhumacionFallecidosEntity[];
  searchTerm: string;
}) => {
  return (
    <div className="space-y-4">
      {fallecidos.map((resultado) => {
        const { fallecido, requisitos } = resultado;
        return (
          <Card key={fallecido.id_persona} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {fullName(fallecido)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <p>Cédula: <span className="font-medium">{fallecido.cedula ?? "Sin cédula"}</span></p>
                  <p>
                    Requisitos encontrados: <span className="font-medium">{requisitos.length}</span>
                  </p>
                </div>
                <div>
                  {requisitos[0] ? (
                    <Button variant="outline" asChild>
                      <Link href={`/requisitos-inhumacion/${requisitos[0].idRequsitoInhumacion}`}>
                        Ver requisito
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>

              {requisitos.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No hay requisitos de inhumación asociados a este registro. Comunícate con administración para validar la información.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead># Requisito</TableHead>
                        <TableHead>Solicitante</TableHead>
                        <TableHead>Cementerio</TableHead>
                        <TableHead>Hueco / Nicho</TableHead>
                        <TableHead>Fecha inhumación</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requisitos.map((req) => (
                        <TableRow key={req.idRequsitoInhumacion}>
                          <TableCell className="font-semibold">{req.idRequsitoInhumacion}</TableCell>
                          <TableCell>{getResumenSolicitante(req)}</TableCell>
                          <TableCell>{req.idCementerio?.nombre ?? "Sin cementerio"}</TableCell>
                          <TableCell>{formatHueco(req)}</TableCell>
                          <TableCell>{formatDate(req.fechaInhumacion)}</TableCell>
                          <TableCell>
                            <Link
                              href={`/mejoras/nuevo?requisito=${req.idRequsitoInhumacion}${searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : ""}`}
                              className="inline-flex px-3 py-2 border rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                            >
                              Crear mejora
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const PropietariosResultsView = ({
  propietarios,
  searchTerm,
}: {
  propietarios: MejoraSearchAllResultsEntity["propietarios"];
  searchTerm: string;
}) => {
  if (propietarios.length === 0) return null;

  const formatNichoLocation = (nicho?: { sector?: string; fila?: string; numero?: string; idCementerio?: { nombre?: string } }) => {
    if (!nicho) return "Sin información";
    const parts = [];
    if (nicho.sector) parts.push(`Sector ${nicho.sector}`);
    if (nicho.fila) parts.push(`Fila ${nicho.fila}`);
    if (nicho.numero) parts.push(`Nicho ${nicho.numero}`);
    return parts.length > 0 ? parts.join(" • ") : "Sin ubicación";
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Home className="w-5 h-5" />
          Propietarios de nichos encontrados ({propietarios.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {propietarios.map((resultado) => {
          const { propietario, nichos } = resultado;
          const nichosActivos = nichos.filter((n) => n.activo);
          const nichosInactivos = nichos.filter((n) => !n.activo);

          return (
            <Card key={propietario.id_persona} className="bg-white">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{fullName(propietario)}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cédula: {propietario.cedula ?? "Sin cédula"} • {nichosActivos.length} nicho(s) activo(s)
                      {nichosInactivos.length > 0 && ` • ${nichosInactivos.length} inactivo(s)`}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {nichos.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No hay nichos registrados para este propietario. Comunícate con administración para validar la información.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Estado</TableHead>
                          <TableHead>Cementerio</TableHead>
                          <TableHead>Ubicación</TableHead>
                          <TableHead>Tipo propietario</TableHead>
                          <TableHead>Fecha adquisición</TableHead>
                          <TableHead>Documento</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {nichos.map((prop) => (
                          <TableRow key={prop.idPropietarioNicho} className={!prop.activo ? "opacity-60 bg-gray-50" : ""}>
                            <TableCell>
                              <Badge 
                                variant={prop.activo ? "default" : "secondary"}
                                className={prop.activo ? "bg-emerald-500 hover:bg-emerald-600" : "bg-gray-400"}
                              >
                                {prop.activo ? "Activo" : "Inactivo"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {prop.idNicho?.idCementerio?.nombre ?? "N/A"}
                            </TableCell>
                            <TableCell>
                              {formatNichoLocation(prop.idNicho)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{prop.tipo}</Badge>
                            </TableCell>
                            <TableCell>
                              {formatDate(prop.fechaAdquisicion)}
                            </TableCell>
                            <TableCell>
                              <div className="text-xs">
                                <p className="font-medium">{prop.tipoDocumento}</p>
                                <p className="text-muted-foreground">{prop.numeroDocumento}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {prop.activo ? (
                                <Link
                                  href={`/mejoras/nuevo?nicho=${prop.idNicho?.idNicho}&propietario=${propietario.id_persona}${searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : ""}`}
                                  className="inline-flex px-3 py-2 border rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-sm"
                                >
                                  Crear mejora
                                </Link>
                              ) : (
                                <Button
                                  disabled
                                  size="sm"
                                  variant="outline"
                                  className="text-xs cursor-not-allowed"
                                  title="No se pueden crear mejoras en nichos inactivos"
                                >
                                  No disponible
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

const MejoraSearchResults: React.FC<MejoraSearchResultsProps> = ({ results, searchTerm, relatedMejoras, isLoadingRelated }) => {
  const totalFallecidos = results.fallecidos.totalEncontrados;
  const totalPropietarios = results.propietarios.length;

  return (
    <div className="space-y-6">
      {/* Resultados de fallecidos */}
      {totalFallecidos > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Fallecidos encontrados ({totalFallecidos})</h3>
          </div>
          {totalFallecidos === 1 ? (
            <SingleResultView 
              fallecido={results.fallecidos.fallecidos[0]} 
              requisitos={results.fallecidos.fallecidos[0].requisitos} 
              searchTerm={searchTerm} 
            />
          ) : (
            <MultipleResultsView 
              fallecidos={results.fallecidos.fallecidos} 
              searchTerm={searchTerm} 
            />
          )}
        </div>
      )}

      {/* Resultados de propietarios */}
      {totalPropietarios > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">Propietarios de nichos</h3>
          </div>
          <PropietariosResultsView 
            propietarios={results.propietarios} 
            searchTerm={searchTerm} 
          />
        </div>
      )}

      {/* Mejoras relacionadas */}
      <RelatedMejorasPanel mejoras={relatedMejoras} isLoading={isLoadingRelated} searchTerm={searchTerm} />
    </div>
  );
};

export default MejoraSearchResults;
