"use client";

import Link from "next/link";
import {
  RequisitoInhumacionFallecidosEntity,
  RequisitoInhumacionEntity,
  SearchFallecidosRequisitoInhumacionEntity,
} from "@/features/requisitos-inhumacion/domain/entities/requisito-inhumacion.entity";
import { MejoraEntity } from "../../domain/entities/mejora.entity";
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
import { Check, CheckCircle, Download, Eye, Loader2, MapPin, Pencil, User, Users } from "lucide-react";
import { useState } from "react";
import { useApproveMejoraMutation, useDownloadMejoraPdfMutation } from "../hooks/use-mejora-mutation";

const DEFAULT_APPROVER_ID = "11657f06-85d6-42bb-84f6-7e3ffe06965d";

interface MejoraSearchResultsProps {
  results: SearchFallecidosRequisitoInhumacionEntity;
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

const RelatedMejorasPanel = ({
  mejoras,
  isLoading,
  searchTerm: _searchTerm,
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
                      <div className="inline-flex min-w-[170px] flex-col gap-2 rounded-md border bg-muted/40 p-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <div>
                            <p className="text-[11px] font-medium uppercase text-muted-foreground tracking-wide">
                              Estado actual
                            </p>
                            <Badge className="mt-1" variant={mejora.estado === "Aprobado" ? "default" : "secondary"}>
                              {mejora.estado ?? "Sin estado"}
                            </Badge>
                          </div>
                          {mejora.estado === "Solicitado" ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="xs"
                                  className="gap-1.5"
                                  disabled={approveMutation.isPending}
                                >
                                  {approveMutation.isPending && approvingId === mejora.idMejora ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                  {approveMutation.isPending && approvingId === mejora.idMejora
                                    ? "Registrando…"
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
                                  <AlertDialogCancel size="sm" disabled={approveMutation.isPending}>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    size="sm"
                                    disabled={approveMutation.isPending}
                                    onClick={() => handleApprove(mejora)}
                                    className="gap-1.5"
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
                          ) : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {mejora.estado === "Solicitado" ? (
                          <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        ) : null}
                        {mejora.estado === "Aprobado" ? (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
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
                          href={`/mejoras/nuevo?requisito=${req.idRequsitoInhumacion}`}
                          className="inline-flex px-3 py-2 border rounded-md bg-emerald-500 text-white hover:bg-emerald-600"
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
}: {
  fallecidos: RequisitoInhumacionFallecidosEntity[];
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
                              href={`/mejoras/nuevo?requisito=${req.idRequsitoInhumacion}`}
                              className="inline-flex px-3 py-2 border rounded-md bg-emerald-500 text-white hover:bg-emerald-600"
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

const MejoraSearchResults: React.FC<MejoraSearchResultsProps> = ({ results, searchTerm, relatedMejoras, isLoadingRelated }) => {
  let mainContent: React.ReactNode;

  if (!results || results.totalEncontrados === 0) {
    mainContent = (
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-800">Sin coincidencias</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            No se encontraron inhumaciones que coincidan con &quot;{searchTerm}&quot;. Intenta con otros términos de búsqueda o verifica la información ingresada.
          </p>
        </CardContent>
      </Card>
    );
  } else if (results.totalEncontrados === 1) {
    const unico = results.fallecidos[0];
    mainContent = (
      <SingleResultView fallecido={unico} requisitos={unico.requisitos} searchTerm={searchTerm} />
    );
  } else {
    mainContent = <MultipleResultsView fallecidos={results.fallecidos} />;
  }

  return (
    <div className="space-y-6">
      {mainContent}
      <RelatedMejorasPanel mejoras={relatedMejoras} isLoading={isLoadingRelated} searchTerm={searchTerm} />
    </div>
  );
};

export default MejoraSearchResults;
