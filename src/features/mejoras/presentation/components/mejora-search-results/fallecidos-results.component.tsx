"use client";

import Link from "next/link";
import {
  RequisitoInhumacionFallecidosEntity,
  RequisitoInhumacionEntity,
} from "@/features/requisitos-inhumacion/domain/entities/requisito-inhumacion.entity";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle, MapPin, User, Users } from "lucide-react";
import { formatDate, fullName } from "./formatters";

/**
 * Formats the hueco information from a requisito
 */
const formatHueco = (requisito: RequisitoInhumacionEntity): string => {
  const hueco = requisito.idHuecoNicho;
  const nicho = hueco?.idNicho;
  if (!hueco || !nicho) return "Sin información";
  const fila = nicho.fila ? `Fila ${nicho.fila}` : "";
  const columna = nicho.columna ? `Columna ${nicho.columna}` : "";
  const huecoLabel = hueco.numHueco ? `Hueco ${hueco.numHueco}` : "";
  return [fila, columna, huecoLabel].filter(Boolean).join(" • ") || "Sin información";
};

/**
 * Gets the solicitante name from a requisito
 */
const getResumenSolicitante = (requisito?: RequisitoInhumacionEntity): string => {
  if (!requisito) return "Solicitante no disponible";
  return fullName(requisito.idSolicitante);
};

interface SingleResultViewProps {
  fallecido: RequisitoInhumacionFallecidosEntity;
  requisitos: RequisitoInhumacionEntity[];
  searchTerm: string;
}

/**
 * View for displaying a single fallecido result
 */
export const SingleResultView = ({
  fallecido,
  requisitos,
  searchTerm,
}: SingleResultViewProps) => {
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

interface MultipleResultsViewProps {
  fallecidos: RequisitoInhumacionFallecidosEntity[];
  searchTerm: string;
}

/**
 * View for displaying multiple fallecidos results
 */
export const MultipleResultsView = ({
  fallecidos,
  searchTerm,
}: MultipleResultsViewProps) => {
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
