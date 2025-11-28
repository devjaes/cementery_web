"use client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { 
  Search, 
  Plus, 
  FileText, 
  Calendar, 
  User, 
  Eye, 
  CheckCircle,
  AlertTriangle 
} from "lucide-react";
import Link from "next/link";

// Tipos para evitar el uso de any
type InhumacionData = {
  idFallecido?: {
    nombres?: string;
    apellidos?: string;
    cedula?: string;
  };
  idInhumacion?: string;
  codigoInhumacion?: string;
  fechaInhumacion?: string;
  estado?: string;
  solicitante?: string;
  idNicho?: {
    idCementerio?: { nombre?: string };
    sector?: string | number;
    fila?: number;
    numero?: string | number;
  };
} & Record<string, unknown>;

type ExhumacionData = {
  idExhumacion?: string;
  codigo?: string;
  fechaExhumacion?: string;
  horaExhumacion?: string;
  duenioNicho?: string;
  causa?: string;
  estadoPago?: string;
  observacion?: string;
  ubicacion?: string;
} & Record<string, unknown>;

interface SearchResult {
  type: 'inhumacion' | 'exhumacion';
  data: unknown;
  exhumacion: unknown | null;
  hasExhumacion: boolean;
}

interface ExhumacionSearchResultsProps {
  results: SearchResult[];
  searchTerm: string;
  isLoading?: boolean;
}

export function ExhumacionSearchResults({ 
  results, 
  searchTerm, 
  isLoading 
}: ExhumacionSearchResultsProps) {

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Buscando coincidencias...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sin resultados
          </h3>
          <p className="text-gray-500 mb-4">
            No se encontraron resultados que coincidan con &quot;{searchTerm}&quot;
          </p>
          <p className="text-sm text-gray-400">
            Intenta con otros términos de búsqueda como cédula, nombres o códigos
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Search className="h-4 w-4" />
          <span>
            Se encontraron <strong>{results.length}</strong> resultado{results.length !== 1 ? 's' : ''} 
            para &quot;{searchTerm}&quot;
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {results.map((result, index) => {
          // Obtener los datos con el tipado correcto
          const inhumacionData = result.type === 'inhumacion' ? result.data : null;
          
          // Variables para facilitar el acceso a los datos
          const person = inhumacionData as InhumacionData;
          const inhumacion = inhumacionData as InhumacionData;
          const exhumacion = result.exhumacion as ExhumacionData;
          
          return (
            <Card key={`${result.type}-${index}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Encabezado con nombre y estado */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-purple-600" />
                          <h3 className="font-semibold text-xl">
                            {person?.idFallecido?.nombres} {person?.idFallecido?.apellidos}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
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
                          <span className="text-sm text-gray-500">
                            • {person?.idFallecido?.cedula}
                          </span>
                        </div>
                      </div>
                    </div>
                    

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">Fecha:</span>
                          <span>
                            {result.hasExhumacion 
                              ? (exhumacion?.fechaExhumacion ? format(new Date(exhumacion.fechaExhumacion), "dd/MM/yyyy", { locale: es }) : 'N/A')
                              : (inhumacion?.fechaInhumacion ? format(new Date(inhumacion.fechaInhumacion), "dd/MM/yyyy", { locale: es }) : 'N/A')
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">Código:</span>
                          <span>
                            {result.hasExhumacion ? exhumacion?.codigo : inhumacion?.codigoInhumacion}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4" />
                          <span className="font-medium">Solicitante:</span>
                          <span>
                            {result.hasExhumacion ? exhumacion?.duenioNicho : inhumacion?.solicitante}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Ubicación:</span>{' '}
                          <span className="text-sm">
                            {result.hasExhumacion 
                              ? exhumacion?.ubicacion
                              : `${inhumacion?.idNicho?.idCementerio?.nombre} - Sector ${inhumacion?.idNicho?.sector} - Fila ${inhumacion?.idNicho?.fila} - Nicho ${inhumacion?.idNicho?.numero}`
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Información adicional si es exhumación */}
                    {result.hasExhumacion && exhumacion && (
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-purple-800">Detalles de Exhumación</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-purple-700">
                          <div><span className="font-medium">Causa:</span> {exhumacion?.causa || 'N/A'}</div>
                          <div>
                            <span className="font-medium">Estado de Pago:</span>{' '}
                            <Badge 
                              variant={exhumacion?.estadoPago === 'finalizado' ? 'default' : 'secondary'} 
                              className={`ml-1 ${exhumacion?.estadoPago === 'finalizado' ? 'bg-green-600' : 'bg-yellow-600'}`}
                            >
                              {exhumacion?.estadoPago === 'finalizado' ? 'Finalizado' : 'Pendiente'}
                            </Badge>
                          </div>
                          {exhumacion?.horaExhumacion && (
                            <div><span className="font-medium">Hora:</span> {exhumacion.horaExhumacion}</div>
                          )}
                          {exhumacion?.observacion && (
                            <div className="md:col-span-2">
                              <span className="font-medium">Observaciones:</span> {exhumacion.observacion}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 md:min-w-[160px]">
                    {!result.hasExhumacion ? (
                      <Link href={`/exhumaciones/nuevo?inhumacion=${inhumacion?.idInhumacion}`}>
                        <Button className="w-full" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Proceder con Exhumación
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/exhumaciones/${exhumacion?.idExhumacion || ''}`}>
                        <Button className="w-full" size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
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
    </div>
  );
}
