"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/components/ui/dialog";
import { Eye, FileText, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { usePaymentsByProcedure } from "@/features/payment/presentation/hooks/use-payment-query";
import { useGetReceiptBlob } from "@/features/payment/presentation/hooks/use-payment-mutation";
import { useCancelarReserva } from "@/features/nichos/hooks/use-nicho-sales";
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
  const [currentPayment, setCurrentPayment] = useState<any>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { data: payments, isLoading } = usePaymentsByProcedure("niche_sale", nichoId, open);
  const cancelarReservaMutation = useCancelarReserva();
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
      setCurrentPayment(latest);
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

  const handleCancelReservation = async () => {
    if (!cancelReason.trim()) {
      return;
    }

    try {
      await cancelarReservaMutation.mutateAsync({
        idNicho: nichoId,
        motivo: cancelReason,
      });
      setShowCancelDialog(false);
      setCancelReason("");
      setOpen(false);
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
    }
  };

  // Verificar si el pago está pendiente (no confirmado)
  const isPaymentPending = currentPayment?.status === "pending";

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

          <div className="space-y-4">
            {isPaymentPending && (
              <Alert variant="default" className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Esta reserva está pendiente de confirmación de pago. Puede cancelarla si es necesario.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 flex-wrap">
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

                  {isPaymentPending && (
                    <Button
                      variant="destructive"
                      className="gap-2"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      <XCircle className="h-4 w-4" /> Cancelar Reserva
                    </Button>
                  )}

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
        payment={currentPayment}
        autoPreview
      />

      {/* Diálogo de confirmación para cancelar reserva */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
            <DialogDescription>
              Esta acción eliminará la orden de pago y el nicho volverá a estar disponible.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Motivo de Cancelación *</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Ej: Cliente cambió de opinión, Error en la reserva, etc."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Advertencia:</strong> Esta acción no se puede deshacer. La reserva será cancelada permanentemente.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelDialog(false);
                setCancelReason("");
              }}
              disabled={cancelarReservaMutation.isPending}
            >
              Volver
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelReservation}
              disabled={!cancelReason.trim() || cancelarReservaMutation.isPending}
            >
              {cancelarReservaMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Confirmar Cancelación
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
