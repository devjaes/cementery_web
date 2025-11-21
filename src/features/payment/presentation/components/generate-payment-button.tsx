"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FileText, Loader2 } from "lucide-react";
import { useCreatePayment } from "../hooks/use-payment-mutation";
import { PdfPreviewDialog } from "./pdf-preview-dialog";
import {
  CreatePaymentEntity,
  ProcedureType,
  PaymentEntity,
} from "../../domain/entities/payment.entity";

interface GeneratePaymentButtonProps {
  procedureType: ProcedureType;
  procedureId: string;
  amount: number;
  generatedBy: string;
  observations?: string;
  disabled?: boolean;
  onSuccess?: (paymentId: string) => void;
  // Optional buyer fields to include in the payment payload when available
  buyerDocument?: string | null;
  buyerName?: string | null;
  buyerDirection?: string | null;
  /** Called when the PDF preview dialog is closed after generation */
  onPreviewClose?: (paymentId: string) => void;
}

export const GeneratePaymentButton = ({
  procedureType,
  procedureId,
  amount,
  generatedBy,
  observations,
  disabled,
  onSuccess,
  buyerDocument,
  buyerName,
  buyerDirection,
  onPreviewClose,
}: GeneratePaymentButtonProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [createdPayment, setCreatedPayment] = useState<PaymentEntity | null>(
    null
  );
  const createPayment = useCreatePayment();

  const handleGeneratePayment = async () => {
    const paymentData: CreatePaymentEntity = {
      procedureType,
      procedureId,
      amount,
      generatedBy,
      observations,
      buyerDocument: buyerDocument ?? undefined,
      buyerName: buyerName ?? undefined,
      buyerDirection: buyerDirection ?? undefined,
    };

    createPayment.mutate(paymentData, {
      onSuccess: (result) => {
        setShowConfirmDialog(false);
        setPdfBlob(result.pdfBlob);
        setCreatedPayment(result.payment);
        setShowPdfPreview(true);
        onSuccess?.(result.payment.paymentId);
      },
    });
  };

  const isLoading = createPayment.isPending;

  return (
    <>
      <Button
        type="button"
        onClick={() => setShowConfirmDialog(true)}
        disabled={disabled || isLoading}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        Generar Comprobante de Pago
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generar Comprobante de Pago</DialogTitle>
            <DialogDescription>
              Se generará un comprobante de pago por ${amount.toFixed(2)}. El
              trámite quedará en estado pendiente hasta que se suba el
              comprobante pagado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monto:</span>
              <span className="font-semibold">${amount.toFixed(2)}</span>
            </div>
            {observations && (
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Observaciones:</span>
                <span className="text-sm">{observations}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleGeneratePayment} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generar y Descargar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PdfPreviewDialog
        open={showPdfPreview}
        onOpenChange={(open) => {
          setShowPdfPreview(open);
          if (!open && createdPayment) {
            onPreviewClose?.(createdPayment.paymentId);
          }
        }}
        pdfBlob={pdfBlob}
        payment={createdPayment}
      />
    </>
  );
};
