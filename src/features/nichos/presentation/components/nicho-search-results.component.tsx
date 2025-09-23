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
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Eye, MapPin, Building, User, Users, CheckCircle } from "lucide-react";
import Link from "next/link";
import { SearchFallecidosEntity, NichoFallecidosEntity } from "../../domain/entities/nicho.entity";

interface NichoSearchResultsProps {
  results: SearchFallecidosEntity;
  searchTerm: string;
  selectedFallecido: NichoFallecidosEntity | null;
  onSelectFallecido: (fallecido: NichoFallecidosEntity) => void;
}

export function NichoSearchResults({ results, searchTerm, selectedFallecido, onSelectFallecido }: NichoSearchResultsProps) {
  const isSingleResult = results.totalEncontrados === 1;

  // Si hay un fallecido seleccionado, mostrar sus detalles
  if (selectedFallecido) {
    const { fallecido, nichos, cementerios, huecos } = selectedFallecido;

    return (
      <div className="space-y-6">
        {/* Confirmación de selección */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <CheckCircle className="w-5 h-5" />
              Detalles de Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              Mostrando ubicación de <span className="font-medium">{fallecido.nombres} {fallecido.apellidos}</span>
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
                <p className="font-medium">{fallecido.nombres} {fallecido.apellidos}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cédula</p>
                <p className="font-medium">{fallecido.cedula}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                <p className="font-medium">
                  {fallecido.fecha_nacimiento ? new Date(fallecido.fecha_nacimiento).toLocaleDateString('es-EC') : 'No disponible'}
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
              Ubicaciones Encontradas ({nichos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nichos.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron ubicaciones
                </h3>
                <p className="text-gray-600">
                  No se encontró ningún nicho para este fallecido
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
                      <TableHead>Sector</TableHead>
                      <TableHead>Fila</TableHead>
                      <TableHead>Número</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nichos.map((nicho, index) => {
                      const cementerio = cementerios[index];
                      return (
                        <TableRow key={nicho.idNicho}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{cementerio?.nombre || 'Sin especificar'}</p>
                              <p className="text-sm text-gray-600">{cementerio?.direccion || ''}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{nicho.sector}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{nicho.fila}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{nicho.numero}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{nicho.tipo}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={nicho.estado === 'Activo' ? 'default' : 'destructive'}
                            >
                              {nicho.estado}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link href={`/nichos/${nicho.idNicho}`}>
                              <Button size="sm" variant="outline" className="gap-1">
                                <Eye className="w-4 h-4" />
                                Ver Detalles del Nicho
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información Adicional de Huecos */}
        {huecos && huecos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Información de Huecos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {huecos.map((hueco, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Hueco #{hueco.numHueco}</h4>
                      <Badge variant={hueco.estado === 'Ocupado' ? 'destructive' : 'default'}>
                        {hueco.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Fecha: {new Date(hueco.fechaCreacion).toLocaleDateString('es-EC')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (isSingleResult) {
    // Auto-seleccionar el único resultado
    const unicoResultado = results.fallecidos[0];
    const { fallecido, nichos, cementerios, huecos } = unicoResultado;

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
              Se encontró la ubicación de <span className="font-medium">{fallecido.nombres} {fallecido.apellidos}</span> 
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
                <p className="font-medium">{fallecido.nombres} {fallecido.apellidos}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cédula</p>
                <p className="font-medium">{fallecido.cedula}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                <p className="font-medium">
                  {fallecido.fecha_nacimiento ? new Date(fallecido.fecha_nacimiento).toLocaleDateString('es-EC') : 'No disponible'}
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
              Ubicaciones Encontradas ({nichos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nichos.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron ubicaciones
                </h3>
                <p className="text-gray-600">
                  No se encontró ningún nicho para este fallecido
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
                      <TableHead>Sector</TableHead>
                      <TableHead>Fila</TableHead>
                      <TableHead>Número</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nichos.map((nicho, index) => {
                      const cementerio = cementerios[index];
                      return (
                        <TableRow key={nicho.idNicho}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{cementerio?.nombre || 'Sin especificar'}</p>
                              <p className="text-sm text-gray-600">{cementerio?.direccion || ''}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{nicho.sector}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{nicho.fila}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{nicho.numero}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{nicho.tipo}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={nicho.estado === 'Activo' ? 'default' : 'destructive'}
                            >
                              {nicho.estado}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link href={`/nichos/${nicho.idNicho}`}>
                              <Button size="sm" variant="outline" className="gap-1">
                                <Eye className="w-4 h-4" />
                                Ver Detalles del Nicho
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información Adicional de Huecos */}
        {huecos && huecos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Información de Huecos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {huecos.map((hueco, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Hueco #{hueco.numHueco}</h4>
                      <Badge variant={hueco.estado === 'Ocupado' ? 'destructive' : 'default'}>
                        {hueco.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Fecha: {new Date(hueco.fechaCreacion).toLocaleDateString('es-EC')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
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
            Se encontraron <span className="font-medium">{results.totalEncontrados}</span> fallecidos 
            que coinciden con &quot;{searchTerm}&quot;. Selecciona uno para ver los detalles de su ubicación.
          </p>
        </CardContent>
      </Card>

      {/* Lista COMPACTA de Fallecidos */}
      <div className="grid gap-4">
        {results.fallecidos.map((resultado, index) => {
          const { fallecido, nichos, cementerios } = resultado;
          
          return (
            <Card key={`${fallecido.id_persona}-${index}`} className="hover:shadow-md transition-shadow">
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
                          {nichos.length > 0 && cementerios[0] && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {cementerios[0].nombre} - Sector {nichos[0].sector}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de Ubicaciones y Botón */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{nichos.length}</div>
                      <div className="text-xs text-gray-500">Ubicacion{nichos.length !== 1 ? 'es' : ''}</div>
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