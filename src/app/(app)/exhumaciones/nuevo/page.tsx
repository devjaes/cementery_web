"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";

import { Badge } from "@/shared/components/ui/badge";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Calendar, 
  User, 
  MapPin, 
  Clock,
  AlertCircle,
  DollarSign,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFindInhumacionByIdQuery } from "@/features/inhumaciones/presentation/hooks/use-inhumacion-queries";
import { useCreateExhumacionMutation } from "@/features/exhumaciones/presentation/hooks/use-exhumacion-mutations";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const exhumacionSchema = z.object({
  fechaExhumacion: z.string().min(1, "La fecha es requerida"),
  horaExhumacion: z.string().min(1, "La hora es requerida"),
  duenioNicho: z.string().min(1, "El dueño del nicho es requerido"),
  causa: z.string().min(1, "La causa es requerida"),
  observacion: z.string().optional(),
  archivo: z.instanceof(File).optional(),
});

type ExhumacionFormData = z.infer<typeof exhumacionSchema>;

export default function NuevaExhumacionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inhumacionId = searchParams.get("inhumacion");
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [paymentGenerated, setPaymentGenerated] = useState(false);
  const [paymentCode, setPaymentCode] = useState("");

  const { data: inhumacion, isLoading } = useFindInhumacionByIdQuery(inhumacionId || "");
  const createExhumacionMutation = useCreateExhumacionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ExhumacionFormData>({
    resolver: zodResolver(exhumacionSchema),
    defaultValues: {
      fechaExhumacion: format(new Date(), "yyyy-MM-dd"),
      horaExhumacion: format(new Date(), "HH:mm"),
    }
  });

  // Auto-completar campos basados en la inhumación
  useEffect(() => {
    if (inhumacion) {
      setValue("duenioNicho", inhumacion.solicitante || "");
    }
  }, [inhumacion, setValue]);

  // Sincronizar archivo con el formulario
  useEffect(() => {
    setValue("archivo", uploadedFile || undefined);
  }, [uploadedFile, setValue]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    // Limpiar también el input
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const onSubmit = async (data: ExhumacionFormData) => {
    if (!inhumacion) {
      console.error("No hay inhumación seleccionada");
      return;
    }

    if (!inhumacion.idNicho?.idNicho) {
      console.error("La inhumación no tiene un nicho válido", {
        idNicho: inhumacion.idNicho,
        hasIdNicho: !!inhumacion.idNicho?.idNicho
      });
      return;
    }

    if (!inhumacion.idInhumacion) {
      console.error("ID de inhumación no válido");
      return;
    }

    console.log("📋 Datos del formulario:", data);
    console.log("📁 Archivo subido:", uploadedFile);
    console.log("🏠 Inhumación completa:", inhumacion);

    const ubicacion = `${inhumacion.idNicho?.idCementerio?.nombre} - Sector ${inhumacion.idNicho?.sector} - Fila ${inhumacion.idNicho?.fila} - Nicho ${inhumacion.idNicho?.numero}`;

    // Crear FormData para enviar archivo junto con datos
    const formData = new FormData();
    
    // Agregar campos de datos
    formData.append('fecha_exhumacion', data.fechaExhumacion);
    formData.append('hora_exhumacion', data.horaExhumacion);
    formData.append('duenio_nicho', data.duenioNicho);
    formData.append('ubicacion', ubicacion);
    formData.append('causa', data.causa);
    formData.append('nicho_original_id', inhumacion.idNicho.idNicho);
    formData.append('inhumacion_id', inhumacion.idInhumacion);
    
    if (data.observacion) {
      formData.append('observacion', data.observacion);
    }
    
    // Agregar archivo si existe
    if (uploadedFile) {
      formData.append('archivos', uploadedFile);
    }

    console.log(" Datos a enviar:");
    console.log("  • nicho_original_id:", inhumacion.idNicho.idNicho);
    console.log("  • inhumacion_id:", inhumacion.idInhumacion);
    console.log("  • archivo:", uploadedFile ? uploadedFile.name : 'Sin archivo');
    console.log("  • ubicacion:", ubicacion);

    try {
      const result = await createExhumacionMutation.mutateAsync(formData);
      // Simular generación de pago
      setPaymentGenerated(true);
      setPaymentCode(`PAY-${format(new Date(), "yyyy-MM-dd")}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`);
      
      // Mostrar el código de pago por 5 segundos antes de redirigir
      setTimeout(() => {
        router.push(`/exhumaciones/${result.idExhumacion}`);
      }, 5000);
    } catch (error) {
      console.error("Error al crear exhumación:", error);
    }
  };

  if (!inhumacionId) {
    return (
      <ContainerApp title="Nueva Exhumación">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No se especificó una inhumación. Por favor regresa y selecciona una inhumación.
          </AlertDescription>
        </Alert>
      </ContainerApp>
    );
  }

  if (isLoading) {
    return (
      <ContainerApp title="Nueva Exhumación">
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando datos de la inhumación...</p>
          <p className="text-xs text-gray-400 mt-2">ID: {inhumacionId}</p>
        </div>
      </ContainerApp>
    );
  }

  if (!inhumacion) {
    return (
      <ContainerApp title="Nueva Exhumación">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No se encontró la inhumación especificada.
          </AlertDescription>
        </Alert>
      </ContainerApp>
    );
  }

  // Verificar que tenemos todos los datos necesarios
  console.log("🔍 Verificando datos de la inhumación:", {
    inhumacion: inhumacion,
    idInhumacion: inhumacion?.idInhumacion,
    idNicho: inhumacion?.idNicho,
    idNichoValue: inhumacion?.idNicho?.idNicho,
    propiedades: Object.keys(inhumacion || {}),
    propiedadesNicho: inhumacion?.idNicho ? Object.keys(inhumacion.idNicho) : []
  });

  if (!inhumacion?.idInhumacion || !inhumacion?.idNicho?.idNicho) {
    return (
      <ContainerApp title="Nueva Exhumación">
        <div className="text-center py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error: Datos de inhumación incompletos
            </AlertDescription>
          </Alert>
          <div className="text-xs text-gray-500 mt-4 text-left max-w-2xl mx-auto">
            <p><strong>ID Inhumación:</strong> {inhumacion?.idInhumacion || 'No disponible'}</p>
            <p><strong>ID Nicho:</strong> {inhumacion?.idNicho?.idNicho || 'No disponible'}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-600">Ver datos completos</summary>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto mt-2">
                {JSON.stringify(inhumacion, null, 2)}
              </pre>
            </details>
          </div>
          <button 
            onClick={() => router.back()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Volver
          </button>
        </div>
      </ContainerApp>
    );
  }

  if (paymentGenerated) {
    return (
      <ContainerApp title="Nueva Exhumación">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                ¡Exhumación Registrada Exitosamente!
              </h2>
              <p className="text-green-700 mb-6">
                Se ha generado automáticamente una orden de pago para proceder con la exhumación.
              </p>
              
              <div className="bg-white p-4 rounded-lg border border-green-200 mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Código de Pago</span>
                </div>
                <div className="text-2xl font-mono font-bold text-green-900">
                  {paymentCode}
                </div>
                <p className="text-sm text-green-600 mt-2">
                  Monto: $150.00 USD
                </p>
              </div>

              <div className="text-sm text-green-700 mb-4">
                <p>• Guarda este código para realizar el pago</p>
                <p>• Una vez realizado el pago, sube el comprobante para finalizar el proceso</p>
                <p>• Serás redirigido automáticamente en unos segundos...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContainerApp>
    );
  }

  return (
    <ContainerApp title="Nueva Exhumación">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/exhumaciones">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nueva Exhumación</h1>
            <p className="text-gray-600 mt-1">
              Registra una nueva exhumación basada en la inhumación seleccionada
            </p>
          </div>
        </div>

        {/* Información de la Inhumación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información de la Inhumación Original
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">
                    {inhumacion.idFallecido?.nombres} {inhumacion.idFallecido?.apellidos}
                  </span>
                  <Badge variant="outline">{inhumacion.estado}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Cédula:</span> {inhumacion.idFallecido?.cedula}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Código:</span> {inhumacion.codigoInhumacion}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium">Fecha:</span>
                  {format(new Date(inhumacion.fechaInhumacion), "dd/MM/yyyy", { locale: es })}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span className="font-medium">Ubicación:</span>
                  {inhumacion.idNicho?.idCementerio?.nombre} - 
                  Sector {inhumacion.idNicho?.sector} - 
                  Fila {inhumacion.idNicho?.fila} - 
                  Nicho {inhumacion.idNicho?.numero}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Solicitante:</span> {inhumacion.solicitante}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de Exhumación */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos de la Exhumación</CardTitle>
              <CardDescription>
                Completa la información necesaria para proceder con la exhumación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaExhumacion" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Fecha de Exhumación *
                  </Label>
                  <Input
                    id="fechaExhumacion"
                    type="date"
                    {...register("fechaExhumacion")}
                  />
                  {errors.fechaExhumacion && (
                    <p className="text-sm text-red-600">{errors.fechaExhumacion.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horaExhumacion" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Hora de Exhumación *
                  </Label>
                  <Input
                    id="horaExhumacion"
                    type="time"
                    {...register("horaExhumacion")}
                  />
                  {errors.horaExhumacion && (
                    <p className="text-sm text-red-600">{errors.horaExhumacion.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duenioNicho" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Dueño del Nicho (Contribuyente) *
                </Label>
                <Input
                  id="duenioNicho"
                  {...register("duenioNicho")}
                  placeholder="Nombre completo del propietario del nicho"
                />
                {errors.duenioNicho && (
                  <p className="text-sm text-red-600">{errors.duenioNicho.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="causa">Causa de la Exhumación *</Label>
                <Input
                  id="causa"
                  {...register("causa")}
                  placeholder="Ej: Traslado familiar, cambio de ubicación, etc."
                />
                {errors.causa && (
                  <p className="text-sm text-red-600">{errors.causa.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacion">Observaciones</Label>
                <Textarea
                  id="observacion"
                  {...register("observacion")}
                  placeholder="Observaciones adicionales (opcional)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Archivo de Documentación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Documentación de Respaldo
              </CardTitle>
              <CardDescription>
                Sube un archivo con la documentación necesaria para la exhumación (opcional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="archivo">Subir Archivo</Label>
                <Input
                  id="archivo"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500">
                  Formatos permitidos: PDF, JPG, PNG. Máximo 5MB por archivo.
                </p>
              </div>

              {uploadedFile && (
                <div className="space-y-2">
                  <Label>Archivo Subido</Label>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{uploadedFile.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeFile}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              )}

              {errors.archivo && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.archivo.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Información de Pago */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <DollarSign className="h-5 w-5" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-yellow-700">
                <p className="mb-2">
                  <span className="font-semibold">Costo de Exhumación:</span> $150.00 USD
                </p>
                <p className="text-sm">
                  • Al registrar la exhumación se generará automáticamente una orden de pago
                </p>
                <p className="text-sm">
                  • Recibirás un código de pago único para realizar el pago
                </p>
                <p className="text-sm">
                  • Una vez realizado el pago, deberás subir el comprobante para finalizar el proceso
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex justify-end gap-4">
            <Link href="/exhumaciones">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button 
              type="submit" 
              disabled={createExhumacionMutation.isPending}
              className="min-w-32"
            >
              {createExhumacionMutation.isPending ? "Registrando..." : "Registrar Exhumación"}
            </Button>
          </div>
        </form>
      </div>
    </ContainerApp>
  );
}
