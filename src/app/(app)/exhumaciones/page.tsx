"use client";

import { useState } from "react";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Search, Plus, FileText, Calendar, User, MapPin, Eye, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import Link from "next/link";
import { useFindAllInhumacionesQuery } from "@/features/inhumaciones/presentation/hooks/use-inhumacion-queries";
import { useFindAllExhumacionesQuery } from "@/features/exhumaciones/presentation/hooks/use-exhumacion-queries";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ExhumacionesPage() {
  const [activeTab, setActiveTab] = useState("inhumaciones");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchExhumaciones, setSearchExhumaciones] = useState("");
  const [selectedInhumacion, setSelectedInhumacion] = useState<typeof inhumaciones[0] | null>(null);
  const [selectedExhumacion, setSelectedExhumacion] = useState<typeof exhumaciones[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExhumacionModalOpen, setIsExhumacionModalOpen] = useState(false);
  
  const { data: inhumaciones = [], isLoading } = useFindAllInhumacionesQuery();
  const { data: exhumaciones = [], isLoading: isLoadingExhumaciones } = useFindAllExhumacionesQuery();

  const handleViewDetails = (inhumacion: typeof inhumaciones[0]) => {
    setSelectedInhumacion(inhumacion);
    setIsModalOpen(true);
  };

  const handleViewExhumacionDetails = (exhumacion: typeof exhumaciones[0]) => {
    setSelectedExhumacion(exhumacion);
    setIsExhumacionModalOpen(true);
  };

  // Solo filtrar cuando hay término de búsqueda
  const filteredInhumaciones = searchTerm.trim() 
    ? inhumaciones.filter((inhumacion) => {
        const searchLower = searchTerm.toLowerCase();

        console.log('Inhumacion data:', inhumacion);
        return (
          inhumacion.idFallecido?.nombres?.toLowerCase().includes(searchLower) ||
          inhumacion.idFallecido?.apellidos?.toLowerCase().includes(searchLower) ||
          inhumacion.idFallecido?.cedula?.toLowerCase().includes(searchLower) ||
          inhumacion.codigoInhumacion?.toLowerCase().includes(searchLower) ||
          inhumacion.solicitante?.toLowerCase().includes(searchLower)
        );
      })
    : [];

  // Filtrar exhumaciones
  const filteredExhumaciones = searchExhumaciones.trim()
    ? exhumaciones.filter((exhumacion) => {
        const searchLower = searchExhumaciones.toLowerCase();
        return (
          exhumacion.codigo?.toLowerCase().includes(searchLower) ||
          exhumacion.duenioNicho?.toLowerCase().includes(searchLower) ||
          exhumacion.causa?.toLowerCase().includes(searchLower) ||
          exhumacion.inhumacion?.idFallecido?.nombres?.toLowerCase().includes(searchLower) ||
          exhumacion.inhumacion?.idFallecido?.apellidos?.toLowerCase().includes(searchLower) ||
          exhumacion.inhumacion?.idFallecido?.cedula?.toLowerCase().includes(searchLower)
        );
      })
    : [];

  return (
    <ContainerApp title="Exhumaciones">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exhumaciones</h1>
            <p className="text-gray-600 mt-2">
              Gestión completa de exhumaciones del cementerio.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="inhumaciones" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inhumaciones" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Exhumación
            </TabsTrigger>
            <TabsTrigger value="exhumaciones" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Exhumaciones Registradas
            </TabsTrigger>
          </TabsList>

          {/* Pestaña de Inhumaciones para crear exhumaciones */}
          <TabsContent value="inhumaciones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar Inhumaciones
                </CardTitle>
                <CardDescription>
                  Busca una inhumación existente para proceder con la exhumación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Escribe el nombre del fallecido, cédula, código o solicitante..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results for Inhumaciones */}
            <div className="grid gap-4">
              {!searchTerm.trim() ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Usa el buscador para encontrar inhumaciones</p>
                    <p className="text-sm text-gray-400">
                      Busca una inhumación existente para proceder con la exhumación
                    </p>
                  </CardContent>
                </Card>
              ) : isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Buscando inhumaciones...</p>
                </div>
              ) : filteredInhumaciones.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No se encontraron inhumaciones que coincidan con tu búsqueda
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredInhumaciones.map((inhumacion) => (
                    <Card key={inhumacion.idInhumacion} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-blue-600" />
                              <h3 className="font-semibold text-lg">
                                {inhumacion.idFallecido?.nombres} {inhumacion.idFallecido?.apellidos}
                              </h3>
                              <Badge variant="outline">
                                {inhumacion.estado}
                              </Badge>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Cédula:</span>
                                {inhumacion.idFallecido?.cedula}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Código:</span>
                                {inhumacion.codigoInhumacion}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span className="font-medium">Fecha:</span>
                                {format(new Date(inhumacion.fechaInhumacion), "dd/MM/yyyy", { locale: es })}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Solicitante:</span>
                                {inhumacion.solicitante}
                              </div>
                            </div>

                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Ubicación:</span>
                              {inhumacion.idNicho?.idCementerio?.nombre} - 
                              Sector {inhumacion.idNicho?.sector} - 
                              Fila {inhumacion.idNicho?.fila} - 
                              Nicho {inhumacion.idNicho?.numero}
                            </div>

                            {inhumacion.observaciones && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Observaciones:</span>
                                {inhumacion.observaciones}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <Link href={`/exhumaciones/nuevo?inhumacion=${inhumacion.idInhumacion}`}>
                              <Button className="w-full md:w-auto" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Proceder con Exhumación
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              className="w-full md:w-auto" 
                              size="sm"
                              onClick={() => handleViewDetails(inhumacion)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Pestaña de Exhumaciones existentes */}
          <TabsContent value="exhumaciones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar Exhumaciones
                </CardTitle>
                <CardDescription>
                  Busca exhumaciones registradas en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Escribe el código de exhumación, nombre del fallecido, dueño del nicho..."
                      value={searchExhumaciones}
                      onChange={(e) => setSearchExhumaciones(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results for Exhumaciones */}
            <div className="grid gap-4">
              {!searchExhumaciones.trim() ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Usa el buscador para encontrar exhumaciones</p>
                    <p className="text-sm text-gray-400">
                      Busca por código, nombre del fallecido, dueño del nicho o causa
                    </p>
                  </CardContent>
                </Card>
              ) : isLoadingExhumaciones ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Buscando exhumaciones...</p>
                </div>
              ) : filteredExhumaciones.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No se encontraron exhumaciones que coincidan con tu búsqueda
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredExhumaciones.map((exhumacion) => (
                    <Card key={exhumacion.idExhumacion} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-purple-600" />
                              <h3 className="font-semibold text-lg">
                                Exhumación {exhumacion.codigo || `#${exhumacion.idExhumacion}`}
                              </h3>
                              <Badge 
                                variant={exhumacion.estadoPago === 'finalizado' ? 'default' : 'secondary'}
                                className={exhumacion.estadoPago === 'finalizado' ? 'bg-green-600' : 'bg-yellow-600'}
                              >
                                {exhumacion.estadoPago === 'finalizado' ? (
                                  <><CheckCircle className="h-3 w-3 mr-1" /> Finalizado</>
                                ) : (
                                  <><AlertCircle className="h-3 w-3 mr-1" /> Pendiente</>
                                )}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Fallecido:</span> {exhumacion.inhumacion?.idFallecido?.nombres} {exhumacion.inhumacion?.idFallecido?.apellidos}
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span className="font-medium">Fecha:</span>
                                {format(new Date(exhumacion.fechaExhumacion), "dd/MM/yyyy", { locale: es })}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Hora:</span>
                                {exhumacion.horaExhumacion || 'No especificada'}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span className="font-medium">Dueño:</span>
                                {exhumacion.duenioNicho}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Causa:</span>
                                {exhumacion.causa}
                              </div>
                            </div>

                            <div className="text-sm text-gray-600">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              <span className="font-medium">Ubicación:</span>
                              {exhumacion.ubicacion}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Link href={`/exhumaciones/${exhumacion.idExhumacion}`}>
                              <Button className="w-full md:w-auto" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              className="w-full md:w-auto" 
                              size="sm"
                              onClick={() => handleViewExhumacionDetails(exhumacion)}
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Estado de Pago
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>


        {/* Modal de Detalles de Inhumación */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalles de la Inhumación
              </DialogTitle>
            </DialogHeader>
            
            {selectedInhumacion && (
              <div className="space-y-6">
                {/* Información del Fallecido */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5 text-blue-600" />
                      Información del Fallecido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-700">Nombres:</span>
                        <p className="text-gray-900">{selectedInhumacion.idFallecido?.nombres || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Apellidos:</span>
                        <p className="text-gray-900">{selectedInhumacion.idFallecido?.apellidos || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Cédula:</span>
                        <p className="text-gray-900">{selectedInhumacion.idFallecido?.cedula || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Fecha de Nacimiento:</span>
                        <p className="text-gray-900">
                          {selectedInhumacion.idFallecido?.fecha_nacimiento 
                            ? format(new Date(selectedInhumacion.idFallecido.fecha_nacimiento), "dd/MM/yyyy", { locale: es })
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Fecha de Fallecimiento:</span>
                        <p className="text-gray-900">
                          {selectedInhumacion.idFallecido?.fecha_defuncion 
                            ? format(new Date(selectedInhumacion.idFallecido.fecha_defuncion), "dd/MM/yyyy", { locale: es })
                            : 'N/A'}
                        </p>
                      </div>
                      {/* <div>
                        <span className="font-medium text-gray-700">Edad:</span>
                        <p className="text-gray-900">{selectedInhumacion.idFallecido?.edad ? `${selectedInhumacion.idFallecido.edad} años` : 'N/A'}</p>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>

                {/* Información de la Inhumación */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Información de la Inhumación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-700">Código de Inhumación:</span>
                        <p className="text-gray-900">{selectedInhumacion.codigoInhumacion || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Estado:</span>
                        <Badge variant="outline" className="ml-2">
                          {selectedInhumacion.estado}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Fecha de Inhumación:</span>
                        <p className="text-gray-900">
                          {format(new Date(selectedInhumacion.fechaInhumacion), "dd/MM/yyyy", { locale: es })}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Hora de Inhumación:</span>
                        <p className="text-gray-900">{selectedInhumacion.horaInhumacion || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Solicitante:</span>
                        <p className="text-gray-900">{selectedInhumacion.solicitante || 'N/A'}</p>
                      </div>
                      {/* <div>
                        <span className="font-medium text-gray-700">Responsable:</span>
                        <p className="text-gray-900">{selectedInhumacion.responsable || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Tipo de Servicio:</span>
                        <p className="text-gray-900">{selectedInhumacion.tipoServicio || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Costo:</span>
                        <p className="text-gray-900">
                          {selectedInhumacion.costo ? `$${selectedInhumacion.costo}` : 'N/A'}
                      </div>
                        </p> */}
                    </div>
                    {selectedInhumacion.observaciones && (
                      <div className="mt-4">
                        <span className="font-medium text-gray-700">Observaciones:</span>
                        <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                          {selectedInhumacion.observaciones}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Información del Nicho */}
                {selectedInhumacion.idNicho && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        Ubicación del Nicho
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">Cementerio:</span>
                          <p className="text-gray-900">{selectedInhumacion.idNicho?.idCementerio?.nombre || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Sector:</span>
                          <p className="text-gray-900">{selectedInhumacion.idNicho?.sector || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Fila:</span>
                          <p className="text-gray-900">{selectedInhumacion.idNicho?.fila || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Número de Nicho:</span>
                          <p className="text-gray-900">{selectedInhumacion.idNicho?.numero || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Estado del Nicho:</span>
                          <p className="text-gray-900">{selectedInhumacion.idNicho?.estado || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Tipo:</span>
                          <p className="text-gray-900">{selectedInhumacion.idNicho?.tipo || 'N/A'}</p>
                        </div>
                      </div>
                      {/* {selectedInhumacion.idNicho?.descripcion && (
                        <div className="mt-4">
                          <span className="font-medium text-gray-700">Descripción del Nicho:</span>
                          <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                            {selectedInhumacion.idNicho.descripcion}
                          </p>
                        </div>
                      )} */}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Detalles de Exhumación */}
        <Dialog open={isExhumacionModalOpen} onOpenChange={setIsExhumacionModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Estado de Pago - Exhumación
              </DialogTitle>
            </DialogHeader>
            
            {selectedExhumacion && (
              <div className="space-y-4">
                <Card className={selectedExhumacion.estadoPago === 'finalizado' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${selectedExhumacion.estadoPago === 'finalizado' ? 'text-green-800' : 'text-yellow-800'}`}>
                      <DollarSign className="h-5 w-5" />
                      Estado del Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedExhumacion.estadoPago === 'finalizado' ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Pago Confirmado</span>
                        </div>
                        <div className="text-sm text-green-600">
                          <p>• La exhumación ha sido pagada completamente</p>
                          <p>• Se puede proceder con la exhumaición programada</p>
                          <p>• El estado es definitivo</p>
                        </div>
                        <Link href={`/exhumaciones/${selectedExhumacion.idExhumacion}`}>
                          <Button className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles Completos
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-yellow-700">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-medium">Pago Pendiente</span>
                        </div>
                        <div className="text-sm text-yellow-600">
                          <p>• El pago aún no ha sido procesado</p>
                          <p>• Se requiere subir el comprobante de pago</p>
                          <p>• La exhumación no puede proceder hasta completar el pago</p>
                        </div>
                        <Link href={`/exhumaciones/${selectedExhumacion.idExhumacion}`}>
                          <Button className="w-full">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Completar Pago
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Código:</span> {selectedExhumacion.codigo || 'No asignado'}</p>
                  <p><span className="font-medium">Fecha:</span> {format(new Date(selectedExhumacion.fechaExhumacion), "dd/MM/yyyy", { locale: es })}</p>
                  <p><span className="font-medium">Fallecido:</span> {selectedExhumacion.inhumacion?.idFallecido?.nombres} {selectedExhumacion.inhumacion?.idFallecido?.apellidos}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ContainerApp>
  );
}
