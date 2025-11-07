"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Separator } from "@/shared/components/ui/separator";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User, 
  MapPin, 
  Clock,
  DollarSign,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit
} from "lucide-react";
import Link from "next/link";
import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useFindExhumacionByIdQuery } from "@/features/exhumaciones/presentation/hooks/use-exhumacion-queries";
import { useUploadComprobanteMutation, useDeleteExhumacionMutation } from "@/features/exhumaciones/presentation/hooks/use-exhumacion-mutations";

// Helper function para formatear fechas de manera segura
const formatDateSafely = (dateValue: string | Date | null | undefined, formatString: string = "dd/MM/yyyy"): string => {
  if (!dateValue) return 'No disponible';
  
  try {
    let date: Date;
    if (typeof dateValue === 'string') {
      // Intentar parsear como ISO string primero
      date = parseISO(dateValue);
      // Si no es válido, intentar con new Date
      if (!isValid(date)) {
        date = new Date(dateValue);
      }
    } else {
      date = dateValue;
    }
    
    if (!isValid(date)) {
      return 'Fecha inválida';
    }
    
    return format(date, formatString, { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error, 'Value:', dateValue);
    return 'Error en fecha';
  }
};

export default function ExhumacionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const exhumacionId = params.id as string;
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: exhumacion, isLoading, error } = useFindExhumacionByIdQuery(exhumacionId);
  const uploadComprobanteMutation = useUploadComprobanteMutation();
  const deleteExhumacionMutation = useDeleteExhumacionMutation();

  // Debug: Log para ver la estructura de datos
  if (exhumacion) {
    console.log("📋 Datos de exhumación cargados:", exhumacion);
    console.log("📁 Campo archivos:", {
      archivos: exhumacion.archivos,
      tipo: typeof exhumacion.archivos,
      esArray: Array.isArray(exhumacion.archivos),
      longitud: exhumacion.archivos?.data?.length,
      propiedades: exhumacion.archivos ? Object.keys(exhumacion.archivos) : 'No disponible'
    });
    console.log("📅 Fechas recibidas:", {
      fechaExhumacion: exhumacion.fechaExhumacion,
      fechaCreacion: exhumacion.fechaCreacion,
      fechaActualizacion: exhumacion.fechaActualizacion,
    });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadComprobante = async () => {
    if (!selectedFile || !exhumacion) return;

    setUploading(true);
    try {
      await uploadComprobanteMutation.mutateAsync({
        id: exhumacion.idExhumacion,
        file: selectedFile
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error al subir comprobante:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!exhumacion) return;
    
    if (confirm("¿Estás seguro de que deseas eliminar esta exhumación? Esta acción no se puede deshacer.")) {
      try {
        await deleteExhumacionMutation.mutateAsync(exhumacion.idExhumacion);
        router.push("/exhumaciones");
      } catch (error) {
        console.error("Error al eliminar exhumación:", error);
      }
    }
  };

  const handleDownloadArchivo = () => {
    if (!exhumacion?.archivos || exhumacion.archivos.type !== 'Buffer' || !exhumacion.archivos.data) {
      console.error('No hay archivo disponible para descargar');
      return;
    }

    try {
      // Convertir el array de bytes a Uint8Array
      const byteArray = new Uint8Array(exhumacion.archivos.data);
      
      // Crear un Blob con el contenido del archivo
      const blob = new Blob([byteArray], { 
        type: exhumacion.archivos.data[0] === 37 && exhumacion.archivos.data[1] === 80 
          ? 'application/pdf' 
          : 'application/octet-stream' 
      });
      
      // Crear URL para descargar
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `exhumacion-${exhumacion.codigo || exhumacion.idExhumacion}-documento.${
        exhumacion.archivos.data[0] === 37 && exhumacion.archivos.data[1] === 80 ? 'pdf' : 'bin'
      }`;
      
      // Agregar al DOM temporalmente y hacer clic
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Archivo descargado exitosamente');
    } catch (error) {
      console.error(' Error al descargar archivo:', error);
    }
  };

  const handleDownloadComprobante = () => {
    if (!exhumacion?.comprobantePago || exhumacion.comprobantePago.type !== 'Buffer' || !exhumacion.comprobantePago.data) {
      console.error('No hay comprobante de pago disponible para descargar');
      return;
    }

    try {
      // Convertir el array de bytes a Uint8Array
      const byteArray = new Uint8Array(exhumacion.comprobantePago.data);
      
      // Crear un Blob con el contenido del archivo
      const blob = new Blob([byteArray], { 
        type: exhumacion.comprobantePago.data[0] === 37 && exhumacion.comprobantePago.data[1] === 80 
          ? 'application/pdf' 
          : 'application/octet-stream' 
      });
      
      // Crear URL para descargar
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `exhumacion-${exhumacion.codigo || exhumacion.idExhumacion}-comprobante.${
        exhumacion.comprobantePago.data[0] === 37 && exhumacion.comprobantePago.data[1] === 80 ? 'pdf' : 'bin'
      }`;
      
      // Agregar al DOM temporalmente y hacer clic
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Comprobante descargado exitosamente');
    } catch (error) {
      console.error('❌ Error al descargar comprobante:', error);
    }
  };

  const handleDownloadAutorizacion = () => {
    if (!exhumacion) {
      console.error('No hay datos de exhumación disponibles');
      return;
    }

    try {
      // Generar un PDF simple como autorización
      const autorizacionContent = `
        AUTORIZACIÓN DE EXHUMACIÓN
        
        Municipio de Píllaro
        Registro de Cementerios
        
        Fecha de emisión: ${formatDateSafely(new Date())}
        
        DATOS DE LA EXHUMACIÓN:
        - Código: ${exhumacion.codigo || 'No asignado'}
        - Fecha programada: ${formatDateSafely(exhumacion.fechaExhumacion)}
        - Hora: ${exhumacion.horaExhumacion || 'No especificada'}
        - Solicitante: ${exhumacion.duenioNicho}
        - Ubicación: ${exhumacion.ubicacion}
        - Causa: ${exhumacion.causa}
        ${exhumacion.observacion ? `- Observaciones: ${exhumacion.observacion}` : ''}
        
        DATOS DEL FALLECIDO:
        - Nombre: ${exhumacion.inhumacion?.idFallecido?.nombres || 'No disponible'} ${exhumacion.inhumacion?.idFallecido?.apellidos || ''}
        - Cédula: ${exhumacion.inhumacion?.idFallecido?.cedula || 'No disponible'}
        
        ESTADO DE PAGO: ${exhumacion.estadoPago.toUpperCase()}
        
        Esta autorización permite proceder con la exhumación programada
        bajo las condiciones establecidas y con el cumplimiento de todos
        los requisitos legales y administrativos.
        
        _________________________________________________
        Autoridad Municipal
        Registro de Cementerios - Municipio de Píllaro
      `;

      // Crear un Blob con el contenido de texto
      const blob = new Blob([autorizacionContent], { type: 'text/plain;charset=utf-8' });
      
      // Crear URL para descargar
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `autorizacion-exhumacion-${exhumacion.codigo || exhumacion.idExhumacion}.txt`;
      
      // Agregar al DOM temporalmente y hacer clic
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Autorización descargada exitosamente');
    } catch (error) {
      console.error('❌ Error al generar autorización:', error);
    }
  };

  if (isLoading) {
    return (
      <ContainerApp title="Detalles de Exhumación">
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando detalles de la exhumación...</p>
        </div>
      </ContainerApp>
    );
  }

  if (error || !exhumacion) {
    return (
      <ContainerApp title="Detalles de Exhumación">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los detalles de la exhumación. Por favor intenta nuevamente.
          </AlertDescription>
        </Alert>
      </ContainerApp>
    );
  }

  return (
    <ContainerApp title="Detalles de Exhumación">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/exhumaciones">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detalles de Exhumación</h1>
              <p className="text-gray-600 mt-1">Código: {exhumacion.codigo || 'No asignado'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={exhumacion.estadoPago === 'finalizado' ? 'default' : 'secondary'}
              className={exhumacion.estadoPago === 'finalizado' ? 'bg-green-600' : 'bg-yellow-600'}
            >
              {exhumacion.estadoPago === 'finalizado' ? 'Finalizado' : 'Pendiente'}
            </Badge>
          </div>
        </div>

        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Fecha y Hora</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>{formatDateSafely(exhumacion.fechaExhumacion)}</span>
                    <Clock className="h-4 w-4 text-blue-600 ml-2" />
                    <span>{exhumacion.horaExhumacion || 'No disponible'}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Dueño del Nicho</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-blue-600" />
                    <span>{exhumacion.duenioNicho}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Ubicación</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{exhumacion.ubicacion}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Causa</Label>
                  <p className="mt-1">{exhumacion.causa}</p>
                </div>

                {exhumacion.observacion && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Observaciones</Label>
                    <p className="mt-1 text-sm">{exhumacion.observacion}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-500">Fechas del Sistema</Label>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>Creado: {formatDateSafely(exhumacion.fechaCreacion, "dd/MM/yyyy HH:mm")}</p>
                    {exhumacion.fechaActualizacion && (
                      <p>Actualizado: {formatDateSafely(exhumacion.fechaActualizacion, "dd/MM/yyyy HH:mm")}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de la Inhumación Original */}
        {exhumacion.inhumacion ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Inhumación Original
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">
                      {exhumacion.inhumacion.idFallecido?.nombres || 'No disponible'} {exhumacion.inhumacion.idFallecido?.apellidos || ''}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Cédula:</span> {exhumacion.inhumacion.idFallecido?.cedula || 'No disponible'}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Código:</span> {exhumacion.inhumacion.codigoInhumacion || 'No disponible'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Fecha de Inhumación:</span> {formatDateSafely(exhumacion.inhumacion.fechaInhumacion)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Solicitante:</span> {exhumacion.inhumacion.solicitante || 'No disponible'}
                  </div>
                  <Link href={`/inhumaciones/${exhumacion.inhumacion.idInhumacion}`}>
                    <Button variant="outline" size="sm" className="mt-2">
                      Ver Detalles de Inhumación
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Inhumación Original
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-gray-500">
                <p>Información de inhumación no disponible</p>
                <p className="text-sm mt-1">ID: {exhumacion.inhumacionId}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Archivos de Documentación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentación de Respaldo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {exhumacion.archivos && 
             exhumacion.archivos.type === 'Buffer' && 
             exhumacion.archivos.data && 
             Array.isArray(exhumacion.archivos.data) ? (
              <div className="grid gap-2">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Archivo de Documentación</span>
                      <span className="text-xs text-gray-500">
                        Tamaño: {(exhumacion.archivos.data.length / 1024).toFixed(1)} KB
                        {exhumacion.archivos.data[0] === 37 && exhumacion.archivos.data[1] === 80 ? ' • PDF' : ' • Archivo binario'}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadArchivo}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay archivos cargados</p>
            )}
          </CardContent>
        </Card>

        {/* Estado de Pago */}
        <Card className={exhumacion.estadoPago === 'finalizado' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${exhumacion.estadoPago === 'finalizado' ? 'text-green-800' : 'text-yellow-800'}`}>
              <DollarSign className="h-5 w-5" />
              Estado del Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            {exhumacion.estadoPago === 'finalizado' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Pago Confirmado</span>
                </div>
                {exhumacion.comprobantePago && (
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-green-200">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Comprobante de Pago</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDownloadComprobante}>
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                )}
                <Button className="w-full" onClick={handleDownloadAutorizacion}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Autorización de Exhumación (PDF)
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Pago Pendiente</span>
                </div>
                
                <div className="bg-white p-4 rounded border border-yellow-200">
                  <div className="text-center mb-4">
                    <p className="font-medium text-yellow-800">Código de Pago</p>
                    <p className="text-2xl font-mono font-bold text-yellow-900 mt-1">
                      PAY-{formatDateSafely(exhumacion.fechaCreacion || new Date(), "yyyy-MM-dd")}-{exhumacion.codigo?.slice(-5) || '00000'}
                    </p>
                    <p className="text-sm text-yellow-600 mt-2">Monto: $150.00 USD</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Subir Comprobante de Pago</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleUploadComprobante}
                      disabled={!selectedFile || uploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Subiendo..." : "Subir"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Formatos permitidos: PDF, JPG, PNG. Máximo 5MB.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteExhumacionMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteExhumacionMutation.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>
    </ContainerApp>
  );
}
