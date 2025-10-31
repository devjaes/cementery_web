"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Eye, UploadCloud, FileText } from "lucide-react";
import { usePaymentsByProcedure } from "@/features/payment/presentation/hooks/use-payment-query";
import { useGetReceiptBlob } from "@/features/payment/presentation/hooks/use-payment-mutation";
import { PdfPreviewDialog } from "@/features/payment/presentation/components/pdf-preview-dialog";
import { UploadReceiptDialog } from "@/features/payment/presentation/components/upload-receipt-dialog";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";
import { useSearchPersonsQuery } from "@/features/person/presentation/hooks/use-person-queries";

interface ReservationActionsProps {
  nichoId: string;
  open?: boolean; // modo controlado (opcional)
  onOpenChange?: (open: boolean) => void; // callback controlado (opcional)
  hideTrigger?: boolean; // ocultar botón trigger si se usa modo controlado desde el padre
    onReceiptUploaded?: (buyerPersonId?: string, paymentId?: string) => void; // callback cuando se sube el comprobante exitosamente, incluye el ID de la persona compradora y el ID del pago
}

export function ReservationActions({ nichoId, open: controlledOpen, onOpenChange, hideTrigger = false, onReceiptUploaded }: ReservationActionsProps) {
  const [openLocal, setOpenLocal] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? (controlledOpen as boolean) : openLocal;
  const setOpen = (v: boolean) => (isControlled ? onOpenChange?.(v) : setOpenLocal(v));
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [buyerDocument, setBuyerDocument] = useState<string | null>(null);
  const [buyerPersonId, setBuyerPersonId] = useState<string | undefined>(undefined);

  const { data: payments, isLoading } = usePaymentsByProcedure("niche_sale", nichoId, open);
  const getReceiptBlob = useGetReceiptBlob();
  const { user } = useAuthStore();
  const validatedBy = user?.email || user?.nombre || "";
  
  // Buscar persona por cédula del comprador
  const { data: searchedPersons } = useSearchPersonsQuery(buyerDocument || "", true);

  useEffect(() => {
    if (!open) return;
    if (payments && payments.length > 0) {
      const latest = payments[0];
      setPaymentId(latest.paymentId);
      setBuyerDocument(latest.buyerDocument);
      // No abrir automáticamente el PDF; el usuario decidirá con el botón "Ver Comprobante"
      setPdfBlob(null);
      setShowPdfPreview(false);
    }
  }, [open, payments]);

  // Cuando se encuentra la persona por cédula, guardar su ID
  useEffect(() => {
    if (searchedPersons && searchedPersons.length > 0) {
      setBuyerPersonId(searchedPersons[0].id_persona);
    }
  }, [searchedPersons]);

  return (
    <>
      {!hideTrigger && (
        <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
          <FileText className="h-4 w-4" /> Ver Reserva
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Reserva del Nicho</DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            {paymentId && (
              <>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={async () => {
                    if (!paymentId) return;
                    try {
                      const blob = await getReceiptBlob.mutateAsync(paymentId);
                      setPdfBlob(blob);
                      setShowPdfPreview(true);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  <Eye className="h-4 w-4" /> Ver Comprobante
                </Button>

                <UploadReceiptDialog
                  paymentId={paymentId}
                  validatedBy={validatedBy}
                  onSuccess={() => {
                    setOpen(false);
                      onReceiptUploaded?.(buyerPersonId, paymentId || undefined);
                  }}
                />
              </>
            )}
          </div>

          {!isLoading && !paymentId && (
            <p className="text-sm text-muted-foreground">
              No se encontró un pago asociado a esta reserva.
            </p>
          )}
        </DialogContent>
      </Dialog>

      <PdfPreviewDialog
        open={showPdfPreview}
        onOpenChange={setShowPdfPreview}
        pdfBlob={pdfBlob}
        payment={null}
        autoPreview
      />
    </>
  );
}
