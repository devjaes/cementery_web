"use client";

import Link from "next/link";
import { MejoraSearchAllResultsEntity } from "../../../domain/entities/mejora-search.entity";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Home } from "lucide-react";
import { formatDate, fullName, formatNichoLocation } from "./formatters";

interface PropietariosResultsViewProps {
  propietarios: MejoraSearchAllResultsEntity["propietarios"];
  searchTerm: string;
}

/**
 * View for displaying propietarios de nichos results
 */
export const PropietariosResultsView = ({
  propietarios,
  searchTerm,
}: PropietariosResultsViewProps) => {
  if (propietarios.length === 0) return null;

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
