"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { PaymentStatusBadge } from "./payment-status-badge";
import { UploadReceiptDialog } from "./upload-receipt-dialog";
import { PdfPreviewDialog } from "./pdf-preview-dialog";
import { usePaymentsByProcedure } from "../hooks/use-payment-query";
import { ProcedureType } from "../../domain/entities/payment.entity";
import { Loader2, Download, AlertCircle, Eye } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  useDownloadReceipt,
  useGetReceiptBlob,
} from "../hooks/use-payment-mutation";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { useState } from "react";

interface PaymentStatusCardProps {
  procedureType: ProcedureType;
  procedureId: string;
  validatedBy: string;
}

export const PaymentStatusCard = ({
  procedureType,
  procedureId,
  validatedBy,
}: PaymentStatusCardProps) => {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const {
    data: payments,
    isLoading,
    error,
  } = usePaymentsByProcedure(procedureType, procedureId);
  const downloadReceipt = useDownloadReceipt();
  const getReceiptBlob = useGetReceiptBlob();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar la información de pagos
        </AlertDescription>
      </Alert>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No hay pagos registrados para este trámite
        </AlertDescription>
      </Alert>
    );
  }

  const latestPayment = payments[0];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Estado del Pago</CardTitle>
              <CardDescription>
                Código: {latestPayment.paymentCode}
              </CardDescription>
            </div>
            <PaymentStatusBadge status={latestPayment.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Monto:</span>
              <p className="font-semibold">
                ${latestPayment.amount.toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">
                Fecha de generación:
              </span>
              <p className="font-semibold">
                {new Date(latestPayment.generatedDate).toLocaleDateString()}
              </p>
            </div>
            {latestPayment.paidDate && (
              <div>
                <span className="text-muted-foreground">Fecha de pago:</span>
                <p className="font-semibold">
                  {new Date(latestPayment.paidDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {latestPayment.validatedBy && (
              <div>
                <span className="text-muted-foreground">Validado por:</span>
                <p className="font-semibold">{latestPayment.validatedBy}</p>
              </div>
            )}
          </div>

          {latestPayment.observations && (
            <div className="text-sm">
              <span className="text-muted-foreground">Observaciones:</span>
              <p className="mt-1">{latestPayment.observations}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => downloadReceipt.mutate(latestPayment.paymentId)}
              disabled={downloadReceipt.isPending}
            >
              {downloadReceipt.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Descargar Comprobante
            </Button>

            <Button
              variant="outline"
              className="gap-2"
              onClick={async () => {
                try {
                  const blob = await getReceiptBlob.mutateAsync(
                    latestPayment.paymentId
                  );
                  setPdfBlob(blob);
                  setShowPdfPreview(true);
                } catch (error) {
                  console.error("Error getting receipt:", error);
                }
              }}
              disabled={getReceiptBlob.isPending}
            >
              {getReceiptBlob.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              Ver Comprobante
            </Button>

            {latestPayment.status === "pending" && (
              <UploadReceiptDialog
                paymentId={latestPayment.paymentId}
                validatedBy={validatedBy}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <PdfPreviewDialog
        open={showPdfPreview}
        onOpenChange={setShowPdfPreview}
        pdfBlob={pdfBlob}
        payment={latestPayment}
      />
    </>
  );
};
