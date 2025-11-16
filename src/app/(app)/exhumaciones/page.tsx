"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Search, Plus, FileText, Calendar, User, Eye, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useFindAllInhumacionesQuery } from "@/features/inhumaciones/presentation/hooks/use-inhumacion-queries";
import { useFindAllExhumacionesQuery } from "@/features/exhumaciones/presentation/hooks/use-exhumacion-queries";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ExhumacionesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: inhumaciones = [], isLoading } = useFindAllInhumacionesQuery();
  const { data: exhumaciones = [], isLoading: isLoadingExhumaciones } = useFindAllExhumacionesQuery();

  // Función para verificar si una inhumación ya tiene exhumación
  const getExhumacionForInhumacion = (inhumacionId: string) => {
    return exhumaciones.find(exh => exh.inhumacionId === inhumacionId);
  };

  // Buscar en ambas colecciones con un solo término
  const searchResults = searchTerm.trim() 
    ? (() => {
        const searchLower = searchTerm.toLowerCase();
        
        // Buscar en inhumaciones
        const matchedInhumaciones = inhumaciones.filter((inhumacion) => {
          return (
            inhumacion.idFallecido?.nombres?.toLowerCase().includes(searchLower) ||
            inhumacion.idFallecido?.apellidos?.toLowerCase().includes(searchLower) ||
            inhumacion.idFallecido?.cedula?.toLowerCase().includes(searchLower) ||
            inhumacion.codigoInhumacion?.toLowerCase().includes(searchLower) ||
            inhumacion.solicitante?.toLowerCase().includes(searchLower)
          );
        });

        // Buscar en exhumaciones
        const matchedExhumaciones = exhumaciones.filter((exhumacion) => {
          return (
            exhumacion.codigo?.toLowerCase().includes(searchLower) ||
            exhumacion.duenioNicho?.toLowerCase().includes(searchLower) ||
            exhumacion.causa?.toLowerCase().includes(searchLower) ||
            exhumacion.inhumacion?.idFallecido?.nombres?.toLowerCase().includes(searchLower) ||
            exhumacion.inhumacion?.idFallecido?.apellidos?.toLowerCase().includes(searchLower) ||
            exhumacion.inhumacion?.idFallecido?.cedula?.toLowerCase().includes(searchLower)
          );
        });

        // Crear array combinado con información de estado
        const results: Array<{
          type: 'inhumacion' | 'exhumacion';
          data: typeof inhumaciones[0] | typeof exhumaciones[0];
          exhumacion: typeof exhumaciones[0] | null;
          hasExhumacion: boolean;
        }> = [];

        // Agregar inhumaciones (verificando si ya tienen exhumación)
        matchedInhumaciones.forEach(inhumacion => {
          const existingExhumacion = getExhumacionForInhumacion(inhumacion.idInhumacion);
          results.push({
            type: 'inhumacion',
            data: inhumacion,
            exhumacion: existingExhumacion || null,
            hasExhumacion: !!existingExhumacion
          });
        });

        // Agregar exhumaciones que no se agregaron ya por la inhumación
        matchedExhumaciones.forEach(exhumacion => {
          const alreadyAdded = results.some(r => 
            r.type === 'inhumacion' && (r.data as any).idInhumacion === exhumacion.inhumacionId
          );
          if (!alreadyAdded) {
            results.push({
              type: 'exhumacion',
              data: exhumacion,
              exhumacion: exhumacion,
              hasExhumacion: true
            });
          }
        });

        return results;
      })()
    : [];

  return (
    <ContainerApp title="Exhumaciones">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exhumaciones</h1>
            <p className="text-gray-600 mt-2">
              Busca personas para ver su estado de inhumación y exhumación.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Personas
            </CardTitle>
            <CardDescription>
              Busca por nombre, cédula, código de inhumación o solicitante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Ej: 1804465803, Elvia Haro, 001-2025..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid gap-4">
          {!searchTerm.trim() ? (
            <Card>
              <CardContent className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Usa el buscador para encontrar personas</p>
                <p className="text-sm text-gray-400">
                  Busca por nombre, cédula, código de inhumación o solicitante
                </p>
              </CardContent>
            </Card>
          ) : (isLoading || isLoadingExhumaciones) ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Buscando...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No se encontraron resultados que coincidan con tu búsqueda
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {searchResults.map((result, index) => {
                // Obtener los datos con el tipado correcto
                const exhumacionData = result.type === 'exhumacion' ? result.data as any : null;
                const inhumacionData = result.type === 'inhumacion' ? result.data as any : (exhumacionData?.inhumacion || null);
                
                // Variables para facilitar el acceso a los datos
                const person = inhumacionData;
                const inhumacion = inhumacionData;
                const exhumacion = result.exhumacion;
                
                return (
                  <Card key={`${result.type}-${index}`} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          {/* Encabezado con nombre y estado */}
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <h3 className="font-semibold text-lg">
                              {person?.idFallecido?.nombres} {person?.idFallecido?.apellidos}
                            </h3>
                            {result.hasExhumacion ? (
                              <Badge variant="default" className="bg-purple-600">
                                <FileText className="h-3 w-3 mr-1" />
                                Exhumado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-green-600 text-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {inhumacion?.estado || 'Inhumado'}
                              </Badge>
                            )}
                          </div>
                          
                          {/* Información básica */}
                          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Cédula:</span>
                              {person?.idFallecido?.cedula}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Código:</span>
                              {result.hasExhumacion ? (exhumacion as any)?.codigo : inhumacion?.codigoInhumacion}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span className="font-medium">Fecha:</span>
                              {result.hasExhumacion 
                                ? ((exhumacion as any)?.fechaExhumacion ? format(new Date((exhumacion as any).fechaExhumacion), "dd/MM/yyyy", { locale: es }) : 'N/A')
                                : (inhumacion?.fechaInhumacion ? format(new Date(inhumacion.fechaInhumacion), "dd/MM/yyyy", { locale: es }) : 'N/A')
                              }
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Solicitante:</span>
                              {result.hasExhumacion ? (exhumacion as any)?.duenioNicho : inhumacion?.solicitante}
                            </div>
                          </div>

                          {/* Ubicación */}
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Ubicación:</span> {' '}
                            {result.hasExhumacion 
                              ? (exhumacion as any)?.ubicacion
                              : `${inhumacion?.idNicho?.idCementerio?.nombre} - Sector ${inhumacion?.idNicho?.sector} - Fila ${inhumacion?.idNicho?.fila} - Nicho ${inhumacion?.idNicho?.numero}`
                            }
                          </div>

                          {/* Información Detallada del Fallecido */}
                          <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                            <div className="text-sm text-blue-800">
                              <div className="font-semibold mb-2 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Información del Fallecido
                              </div>
                              <div className="grid md:grid-cols-2 gap-2">
                                <div><span className="font-medium">Nombres:</span> {person?.idFallecido?.nombres || 'N/A'}</div>
                                <div><span className="font-medium">Apellidos:</span> {person?.idFallecido?.apellidos || 'N/A'}</div>
                                <div><span className="font-medium">Cédula:</span> {person?.idFallecido?.cedula || 'N/A'}</div>
                                {person?.idFallecido?.fecha_nacimiento && (
                                  <div><span className="font-medium">Fecha de Nacimiento:</span> {format(new Date(person.idFallecido.fecha_nacimiento), "dd/MM/yyyy", { locale: es })}</div>
                                )}
                                {person?.idFallecido?.fecha_defuncion && (
                                  <div><span className="font-medium">Fecha de Fallecimiento:</span> {format(new Date(person.idFallecido.fecha_defuncion), "dd/MM/yyyy", { locale: es })}</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Información de la Inhumación */}
                          <div className="mt-3 p-4 bg-green-50 rounded-md border border-green-200">
                            <div className="text-sm text-green-800">
                              <div className="font-semibold mb-2 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Información de la Inhumación
                              </div>
                              <div className="grid md:grid-cols-2 gap-2">
                                <div><span className="font-medium">Código:</span> {inhumacionData?.codigoInhumacion || 'N/A'}</div>
                                <div><span className="font-medium">Estado:</span> {inhumacionData?.estado || 'N/A'}</div>
                                <div><span className="font-medium">Fecha:</span> {inhumacionData?.fechaInhumacion ? format(new Date(inhumacionData.fechaInhumacion), "dd/MM/yyyy", { locale: es }) : 'N/A'}</div>
                                <div><span className="font-medium">Hora:</span> {inhumacionData?.horaInhumacion || 'N/A'}</div>
                                <div><span className="font-medium">Solicitante:</span> {inhumacionData?.solicitante || 'N/A'}</div>
                              </div>
                              {inhumacionData?.observaciones && (
                                <div className="mt-2">
                                  <span className="font-medium">Observaciones:</span> {inhumacionData.observaciones}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Información del Nicho */}
                          {inhumacionData?.idNicho && (
                            <div className="mt-3 p-4 bg-amber-50 rounded-md border border-amber-200">
                              <div className="text-sm text-amber-800">
                                <div className="font-semibold mb-2 flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Ubicación del Nicho
                                </div>
                                <div className="grid md:grid-cols-2 gap-2">
                                  <div><span className="font-medium">Cementerio:</span> {inhumacionData.idNicho?.idCementerio?.nombre || 'N/A'}</div>
                                  <div><span className="font-medium">Sector:</span> {inhumacionData.idNicho?.sector || 'N/A'}</div>
                                  <div><span className="font-medium">Fila:</span> {inhumacionData.idNicho?.fila || 'N/A'}</div>
                                  <div><span className="font-medium">Número:</span> {inhumacionData.idNicho?.numero || 'N/A'}</div>
                                  <div><span className="font-medium">Estado del Nicho:</span> {inhumacionData.idNicho?.estado || 'N/A'}</div>
                                  <div><span className="font-medium">Tipo:</span> {inhumacionData.idNicho?.tipo || 'N/A'}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Información de Exhumación (solo si existe) */}
                          {result.hasExhumacion && exhumacion && (
                            <div className="mt-3 p-4 bg-purple-50 rounded-md border border-purple-200">
                              <div className="text-sm text-purple-800">
                                <div className="font-semibold mb-2 flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Información de la Exhumación
                                </div>
                                <div className="grid md:grid-cols-2 gap-2">
                                  <div><span className="font-medium">Código:</span> {(exhumacion as any).codigo || 'N/A'}</div>
                                  <div><span className="font-medium">Fecha:</span> {(exhumacion as any).fechaExhumacion ? format(new Date((exhumacion as any).fechaExhumacion), "dd/MM/yyyy", { locale: es }) : 'N/A'}</div>
                                  <div><span className="font-medium">Hora:</span> {(exhumacion as any).horaExhumacion || 'N/A'}</div>
                                  <div><span className="font-medium">Dueño del Nicho:</span> {(exhumacion as any).duenioNicho || 'N/A'}</div>
                                  <div><span className="font-medium">Causa:</span> {(exhumacion as any).causa || 'N/A'}</div>
                                  <div><span className="font-medium">Estado de Pago:</span> 
                                    <Badge variant={(exhumacion as any).estadoPago === 'finalizado' ? 'default' : 'secondary'} className={`ml-1 ${(exhumacion as any).estadoPago === 'finalizado' ? 'bg-green-600' : 'bg-yellow-600'}`}>
                                      {(exhumacion as any).estadoPago === 'finalizado' ? 'Finalizado' : 'Pendiente'}
                                    </Badge>
                                  </div>
                                </div>
                                {(exhumacion as any).observacion && (
                                  <div className="mt-2">
                                    <span className="font-medium">Observaciones:</span> {(exhumacion as any).observacion}
                                  </div>
                                )}
                                <div className="mt-2">
                                  <span className="font-medium">Ubicación:</span> {(exhumacion as any).ubicacion}
                                </div>
                                <div className="mt-2 text-xs text-purple-600">
                                  <div>Creado: {(exhumacion as any).fechaCreacion ? format(new Date((exhumacion as any).fechaCreacion), "dd/MM/yyyy HH:mm", { locale: es }) : 'N/A'}</div>
                                  {(exhumacion as any).fechaActualizacion && (
                                    <div>Actualizado: {format(new Date((exhumacion as any).fechaActualizacion), "dd/MM/yyyy HH:mm", { locale: es })}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Acciones */}
                        <div className="flex flex-col gap-2">
                          {!result.hasExhumacion ? (
                            <Link href={`/exhumaciones/nuevo?inhumacion=${inhumacion?.idInhumacion}`}>
                              <Button className="w-full md:w-auto" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Proceder con Exhumación
                              </Button>
                            </Link>
                          ) : (
                            <Link href={`/exhumaciones/${(exhumacion as any)?.idExhumacion}`}>
                              <Button className="w-full md:w-auto" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles de Exhumación
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>


      </div>
    </ContainerApp>
  );
}
