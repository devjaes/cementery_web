"use client";

import { useState } from "react";
import {
  PaymentFlowComponent,
  PaymentStatusCard,
  UploadReceiptDialog,
  CreatePaymentForm,
  PdfPreviewDialog,
} from "@/features/payment";
import { useCreatePayment } from "@/features/payment/presentation/hooks/use-payment-mutation";
import {
  CreatePaymentEntity,
  PaymentEntity,
} from "@/features/payment/domain/entities/payment.entity";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Info, Code2 } from "lucide-react";

export default function PaymentsDemoPage() {
  const [procedureId, setProcedureId] = useState<string>(
    "123e4567-e89b-12d3-a456-426614174000"
  );
  const [paymentId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showPdfPreviewManual, setShowPdfPreviewManual] = useState(false);

  const [realPdfBlob, setRealPdfBlob] = useState<Blob | null>(null);
  const [realPayment, setRealPayment] = useState<PaymentEntity | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const createPaymentMutation = useCreatePayment();

  const generateRealPayment = async () => {
    setIsGeneratingPdf(true);
    try {
      const paymentData: CreatePaymentEntity = {
        procedureType: "burial",
        procedureId: procedureId,
        amount: 150.0,
        generatedBy: "Demo User",
        buyerDocument: "1234567890",
        buyerName: "Juan Carlos Pérez López",
        buyerDirection: "Calle Principal 123",
        observations: "Pago generado para demo del preview",
      };

      const result = await createPaymentMutation.mutateAsync(paymentData);
      setRealPdfBlob(result.pdfBlob);
      setRealPayment(result.payment);
      return result;
    } catch (error) {
      console.error("Error generating payment:", error);
      throw error;
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const ComponentHeader = ({ name, file }: { name: string; file: string }) => (
    <div className="mb-4 pb-3 border-b">
      <div className="flex items-center gap-2 mb-2">
        <Code2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold">{name}</h3>
      </div>
      <code className="text-xs bg-muted px-2 py-1 rounded">{file}</code>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Demo - Módulo de Pagos</h1>
        <p className="text-muted-foreground mt-2">
          Visualiza y prueba todos los componentes del módulo de pagos
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Información</AlertTitle>
        <AlertDescription>
          Esta página muestra ejemplos visuales de todos los componentes del
          módulo de pagos. Algunos componentes requieren datos reales del
          backend para funcionar completamente.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="create-form" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create-form">Crear Pago</TabsTrigger>
          <TabsTrigger value="pdf-preview">Preview PDF</TabsTrigger>
          <TabsTrigger value="flow">Flujo Completo</TabsTrigger>
          <TabsTrigger value="status">Estado y Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="create-form" className="space-y-4">
          <Card>
            <CardHeader>
              <ComponentHeader
                name="CreatePaymentForm"
                file="src/features/payment/presentation/components/create-payment-form.tsx"
              />
              <CardTitle>Formulario de Creación de Pago</CardTitle>
              <CardDescription>
                Formulario completo con búsqueda de personas, validaciones y
                generación de PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreatePaymentForm
                procedureType="burial"
                procedureId={procedureId}
                defaultAmount={150.0}
                onSuccess={() => {
                  console.log("Pago creado exitosamente");
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Props del Componente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Badge variant="outline">procedureType</Badge>
                  <div className="flex-1">
                    <code className="text-xs">ProcedureType</code>
                    <p className="text-muted-foreground mt-1">
                      Tipo de trámite (burial, exhumation, etc.)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline">procedureId</Badge>
                  <div className="flex-1">
                    <code className="text-xs">string</code>
                    <p className="text-muted-foreground mt-1">
                      UUID del trámite asociado
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline">defaultAmount?</Badge>
                  <div className="flex-1">
                    <code className="text-xs">number</code>
                    <p className="text-muted-foreground mt-1">
                      Monto predeterminado (opcional)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline">onSuccess?</Badge>
                  <div className="flex-1">
                    <code className="text-xs">() =&gt; void</code>
                    <p className="text-muted-foreground mt-1">
                      Callback al crear el pago exitosamente
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Características del Formulario</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>
                    <strong>Búsqueda de personas:</strong> Ingresa una cédula de
                    10 dígitos y presiona el botón de búsqueda
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>
                    <strong>Auto-completado:</strong> Si encuentra la persona,
                    se llenan automáticamente nombre y dirección
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>
                    <strong>Validación de cédula:</strong> Debe tener
                    exactamente 10 dígitos numéricos
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>
                    <strong>Validación de nombre:</strong> Debe tener 2 nombres
                    y 2 apellidos (4 palabras separadas por espacios)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>
                    <strong>Vista previa automática:</strong> Al crear el pago,
                    se muestra el PDF generado
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdf-preview" className="space-y-4">
          <Card>
            <CardHeader>
              <ComponentHeader
                name="PdfPreviewDialog"
                file="src/features/payment/presentation/components/pdf-preview-dialog.tsx"
              />
              <CardTitle>Vista Previa de PDF</CardTitle>
              <CardDescription>
                Modal para visualizar y descargar el comprobante de pago
                generado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={async () => {
                    try {
                      await generateRealPayment();
                      setShowPdfPreview(true);
                    } catch (error) {
                      console.error(
                        "Error generating payment for preview:",
                        error
                      );
                    }
                  }}
                  disabled={isGeneratingPdf || createPaymentMutation.isPending}
                >
                  {isGeneratingPdf || createPaymentMutation.isPending
                    ? "Generando PDF..."
                    : "Preview Automático (PDF Real)"}
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      await generateRealPayment();
                      setShowPdfPreviewManual(true);
                    } catch (error) {
                      console.error(
                        "Error generating payment for preview:",
                        error
                      );
                    }
                  }}
                  variant="secondary"
                  disabled={isGeneratingPdf || createPaymentMutation.isPending}
                >
                  {isGeneratingPdf || createPaymentMutation.isPending
                    ? "Generando PDF..."
                    : "Preview Manual (PDF Real)"}
                </Button>
              </div>

              <div className="text-sm space-y-3">
                <div>
                  <p className="font-semibold mb-2">Props del Componente:</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline">open</Badge>
                      <div className="flex-1">
                        <code className="text-xs">boolean</code>
                        <p className="text-muted-foreground mt-1">
                          Controla si el modal está abierto
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline">onOpenChange</Badge>
                      <div className="flex-1">
                        <code className="text-xs">
                          (open: boolean) =&gt; void
                        </code>
                        <p className="text-muted-foreground mt-1">
                          Callback para cambiar el estado
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline">pdfBlob</Badge>
                      <div className="flex-1">
                        <code className="text-xs">Blob | null</code>
                        <p className="text-muted-foreground mt-1">
                          Blob del PDF a mostrar
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline">payment</Badge>
                      <div className="flex-1">
                        <code className="text-xs">PaymentEntity | null</code>
                        <p className="text-muted-foreground mt-1">
                          Datos del pago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline">autoPreview?</Badge>
                      <div className="flex-1">
                        <code className="text-xs">boolean (default: true)</code>
                        <p className="text-muted-foreground mt-1">
                          Si true, muestra el iframe automáticamente. Si false,
                          muestra botón
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-2">Funcionalidades:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      Genera un pago real en el backend para obtener PDF
                      auténtico
                    </li>
                    <li>Visualización del PDF en iframe</li>
                    <li>Botón de descarga del comprobante</li>
                    <li>Información del pago (código y monto)</li>
                    <li>Cierre con escape o botón X</li>
                    <li>Preview automático o manual según prop</li>
                    <li>Diseño responsivo</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <PdfPreviewDialog
            open={showPdfPreview}
            onOpenChange={setShowPdfPreview}
            pdfBlob={realPdfBlob}
            payment={realPayment}
            autoPreview={true}
          />

          <PdfPreviewDialog
            open={showPdfPreviewManual}
            onOpenChange={setShowPdfPreviewManual}
            pdfBlob={realPdfBlob}
            payment={realPayment}
            autoPreview={false}
          />
        </TabsContent>

        <TabsContent value="flow" className="space-y-4">
          <Card>
            <CardHeader>
              <ComponentHeader
                name="PaymentFlowComponent"
                file="src/features/payment/presentation/components/payment-flow-component.tsx"
              />
              <CardTitle>Flujo Completo de Pago</CardTitle>
              <CardDescription>
                Componente que maneja todo el flujo: generar, visualizar estado
                y subir comprobante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentFlowComponent
                procedureType="burial"
                procedureId={procedureId}
                amount={150.5}
                generatedBy="1850046317"
                validatedBy="1850046317"
                observations="Pago demo desde página de pruebas"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tipos de Trámites Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <code className="text-sm font-mono">burial</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Inhumación
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <code className="text-sm font-mono">exhumation</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Exhumación
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <code className="text-sm font-mono">niche_sale</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Venta de Nicho
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <code className="text-sm font-mono">tomb_improvement</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mejora de Tumba
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <code className="text-sm font-mono">hole_extension</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ampliación de Hueco
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <ComponentHeader
                name="PaymentStatusCard"
                file="src/features/payment/presentation/components/payment-status-card.tsx"
              />
              <CardTitle>Estado de Pago</CardTitle>
              <CardDescription>
                Visualiza el estado del pago actual del trámite
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PaymentStatusCard
                procedureType="burial"
                procedureId={procedureId}
                validatedBy="1850046317"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <ComponentHeader
                name="UploadReceiptDialog"
                file="src/features/payment/presentation/components/upload-receipt-dialog.tsx"
              />
              <CardTitle>Subida de Comprobante</CardTitle>
              <CardDescription>
                Permite subir el comprobante de pago y confirmar el pago
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setProcedureId("123e4567-e89b-12d3-a456-426614174000")
                  }
                >
                  Cambiar ProcedureId
                </Button>
                <Button
                  onClick={() => setShowUpload(true)}
                  disabled={!paymentId}
                >
                  Abrir Dialog de Upload (requiere paymentId)
                </Button>
              </div>

              {showUpload && paymentId && (
                <UploadReceiptDialog
                  paymentId={paymentId}
                  validatedBy="demo-admin"
                  onSuccess={() => setShowUpload(false)}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estados de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Pendiente
                  </div>
                  <span className="text-sm text-muted-foreground">
                    El pago ha sido generado pero aún no se ha confirmado
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Pagado
                  </div>
                  <span className="text-sm text-muted-foreground">
                    El pago ha sido confirmado y el comprobante ha sido subido
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Validaciones Implementadas</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  Cédula:
                </span>
                <code className="ml-2 text-xs">/^\d{"{10}"}$/</code>
                <p className="text-muted-foreground ml-2 mt-1">
                  Exactamente 10 dígitos numéricos
                </p>
              </div>
              <div>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  Nombre:
                </span>
                <code className="ml-2 text-xs break-all">
                  2 nombres + 2 apellidos separados por espacios
                </code>
                <p className="text-muted-foreground ml-2 mt-1">
                  Solo letras y caracteres españoles permitidos
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Respuesta del Backend</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Body:</strong> Blob (PDF file) con Content-Type:
                application/pdf
              </p>
              <p>
                <strong>Header:</strong> X-Payment-Data con JSON del pago creado
                (opcional)
              </p>
              <p className="text-muted-foreground">
                El repository maneja ambos casos automáticamente
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Archivos Principales</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">create-payment-form.tsx</code> -
                Formulario de creación
              </li>
              <li>
                <code className="text-xs">pdf-preview-dialog.tsx</code> -
                Preview del PDF
              </li>
              <li>
                <code className="text-xs">payment.repository.impl.ts</code> -
                Lógica de API
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
