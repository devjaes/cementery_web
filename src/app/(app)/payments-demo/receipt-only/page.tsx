"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Eye } from "lucide-react";

import { ProcedureType } from "@/features/payment/domain/entities/payment.entity";
import { usePaymentsByProcedure } from "@/features/payment/presentation/hooks/use-payment-query";
import { useGetReceiptBlob } from "@/features/payment/presentation/hooks/use-payment-mutation";
import { PdfPreviewDialog } from "@/features/payment/presentation/components/pdf-preview-dialog";
import { UploadReceiptDialog } from "@/features/payment/presentation/components/upload-receipt-dialog";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";

export default function ReceiptOnlyDemoPage() {
  const [procedureType, setProcedureType] = useState<ProcedureType>("burial");
  const [procedureId, setProcedureId] = useState<string>("123e4567-e89b-12d3-a456-426614174000");
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const { user } = useAuthStore();
  const validatedBy = user?.email || user?.nombre || "";

  const { data: payments, isLoading, refetch } = usePaymentsByProcedure(procedureType, procedureId);
  const getReceiptBlob = useGetReceiptBlob();

  const latestPayment = payments && payments.length > 0 ? payments[0] : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Demo simple: Ver y Subir Comprobante</h1>
        <p className="text-muted-foreground mt-1">Solo la visualización del PDF y la subida del comprobante.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecciona el trámite</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-muted-foreground">Tipo</label>
            <Select value={procedureType} onValueChange={(v) => setProcedureType(v as ProcedureType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="burial">Inhumación</SelectItem>
                <SelectItem value="exhumation">Exhumación</SelectItem>
                <SelectItem value="niche_sale">Venta de Nicho</SelectItem>
                <SelectItem value="tomb_improvement">Mejora de Tumba</SelectItem>
                <SelectItem value="hole_extension">Ampliación de Hueco</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Procedure ID (UUID)</label>
            <Input value={procedureId} onChange={(e) => setProcedureId(e.target.value)} />
          </div>

          <div className="md:col-span-3 flex gap-2">
            <Button onClick={() => refetch()} disabled={isLoading}>Cargar pago</Button>
            {latestPayment && (
              <>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={async () => {
                    try {
                      const blob = await getReceiptBlob.mutateAsync(latestPayment.paymentId);
                      setPdfBlob(blob);
                      setShowPdfPreview(true);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  <Eye className="h-4 w-4" /> Ver Comprobante
                </Button>
                <UploadReceiptDialog paymentId={latestPayment.paymentId} validatedBy={validatedBy} />
              </>
            )}
          </div>

          {!isLoading && !latestPayment && (
            <Alert className="md:col-span-3">
              <AlertDescription>No se encontró un pago para este trámite.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <PdfPreviewDialog
        open={showPdfPreview}
        onOpenChange={setShowPdfPreview}
        pdfBlob={pdfBlob}
        payment={latestPayment}
      />
    </div>
  );
}
