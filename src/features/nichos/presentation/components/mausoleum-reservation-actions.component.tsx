"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/components/ui/dialog";
import { Eye, FileText, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { usePaymentsByProcedure } from '@/features/payment/presentation/hooks/use-payment-query';
import { useGetReceiptBlob } from '@/features/payment/presentation/hooks/use-payment-mutation';
import { useCancelarReservaMausoleo } from '@/features/nichos/hooks/use-nicho-sales';
import { PdfPreviewDialog } from '@/features/payment/presentation/components/pdf-preview-dialog';
import { UploadReceiptDialog } from '@/features/payment/presentation/components/upload-receipt-dialog';
import { useAuthStore } from '@/features/auth/presentation/context/auth.store';
import { useSearchPersonsQuery } from '@/features/person/presentation/hooks/use-person-queries';
import { BloqueRepositoryImpl } from '@/features/bloques/infrastructure/repositories/bloque.repository.impl';
import { toast } from 'sonner';
import { useRegistrarPropietarioMausoleo, useConfirmarVentaMausoleo } from '@/features/nichos/hooks/use-nicho-sales';

interface MausoleumReservationActionsProps {
  bloqueId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  onReceiptUploaded?: (paymentId?: string) => void;
}

export function MausoleumReservationActions({ bloqueId, open: controlledOpen, onOpenChange, hideTrigger = false, onReceiptUploaded }: MausoleumReservationActionsProps) {
  const [openLocal, setOpenLocal] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? (controlledOpen as boolean) : openLocal;
  const setOpen = (v: boolean) => (isControlled ? onOpenChange?.(v) : setOpenLocal(v));

  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [currentPayment, setCurrentPayment] = useState<any>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { data: payments, isLoading } = usePaymentsByProcedure("mausoleum_sale", bloqueId, open);
  const cancelarReservaMutation = useCancelarReservaMausoleo();
  const registrarPropietarioMausoleo = useRegistrarPropietarioMausoleo();
  const confirmarVentaMausoleoMutation = useConfirmarVentaMausoleo();
  const getReceiptBlob = useGetReceiptBlob();
  const { user } = useAuthStore();
  const validatedBy = user?.email || user?.nombre || "";
  const [buyerDocument, setBuyerDocument] = useState<string | null>(null);
  const [buyerPersonId, setBuyerPersonId] = useState<string | undefined>(undefined);

  const { data: searchedPersons } = useSearchPersonsQuery(buyerDocument || "", true);

  useEffect(() => {
    if (!open) return;
    if (payments && payments.length > 0) {
      const latest = payments[0];
      setPaymentId(latest.paymentId);
      setCurrentPayment(latest);
      setPdfBlob(null);
      setShowPdfPreview(false);
      setBuyerDocument(latest.buyerDocument || null);
    }
  }, [open, payments]);

  useEffect(() => {
    if (searchedPersons && searchedPersons.length > 0) {
      setBuyerPersonId(searchedPersons[0].id_persona);
    }
  }, [searchedPersons]);

  const isPaymentPending = currentPayment?.status === "pending";

  const handleCancelReservation = async () => {
    if (!cancelReason.trim()) return;
    try {
      await cancelarReservaMutation.mutateAsync({ idBloque: bloqueId, motivo: cancelReason });
      setShowCancelDialog(false);
      setCancelReason("");
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

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
            <DialogTitle>Reserva del Mausoleo</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {isPaymentPending && (
              <Alert variant="default" className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Esta reserva de mausoleo está pendiente de confirmación de pago. Puede cancelarla si es necesario.
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
                    onSuccess={async () => {
                      setOpen(false);

                      // Intentar forzar la confirmación de venta del mausoleo (convierte RESERVADO -> VENDIDO)
                      try {
                        if (paymentId) {
                          await confirmarVentaMausoleoMutation.mutateAsync({ idPago: paymentId, validadoPor: validatedBy });
                        }
                      } catch (e) {
                        console.warn('Error forzando confirmarVentaMausoleo (se intentará polling):', e);
                      }

                      // Esperar a que el backend marque los nichos como VENDIDO antes de intentar registrar propietarios.
                      const waitForNichosVendidos = async (idBloque: string, retries = 5, delayMs = 1000) => {
                        for (let i = 0; i < retries; i++) {
                          try {
                                const repo = BloqueRepositoryImpl.getInstance();
                                const data = await repo.findNichosByBloque(idBloque);
                                const allVendido = data.nichos.every((n: any) => {
                                  const estadoVenta = (n.estadoVenta ?? n.estado ?? '').toString().trim().toLowerCase();
                                  return estadoVenta === 'vendido';
                                });
                            if (allVendido) return true;
                          } catch (err) {
                            console.warn('Error comprobando estado de nichos:', err);
                          }
                          // esperar antes del siguiente intento
                          await new Promise((r) => setTimeout(r, delayMs));
                        }
                        return false;
                      };

                      if (buyerPersonId) {
                        // Llamar explícitamente al endpoint de confirmar venta de mausoleo por si no se ejecutó previamente
                        try {
                          // useConfirmarVentaMausoleo is a hook factory; call repository directly via hook function
                          await (async () => {
                            const repo = BloqueRepositoryImpl.getInstance();
                            // no-op here; the actual confirmation happens in the payment hook. We still attempt to call the mutation via nichos hook
                          })();
                        } catch (e) {
                          // ignorar errores aquí, se manejarán en el polling/registro
                          console.warn('No se pudo forzar confirmación del mausoleo:', e);
                        }

                        const ok = await waitForNichosVendidos(bloqueId, 12, 1000);
                        if (!ok) {
                          toast.error('No fue posible verificar que los nichos estén marcados como VENDIDO. Intenta de nuevo más tarde o confirma la venta manualmente.');
                        } else {
                          try {
                            // Obtener datos del bloque para usar su número como número de documento
                            let numeroDocumentoToSend: string | undefined = undefined;
                            try {
                              const bloqueRepo = BloqueRepositoryImpl.getInstance();
                              const bloqueData = await bloqueRepo.findById(bloqueId);
                              if (bloqueData && (bloqueData.numero !== null && bloqueData.numero !== undefined)) {
                                numeroDocumentoToSend = String(bloqueData.numero);
                              }
                            } catch (err) {
                              console.warn('No se pudo obtener número de bloque, se usará buyerDocument si existe', err);
                              numeroDocumentoToSend = buyerDocument || undefined;
                            }

                            await registrarPropietarioMausoleo.mutateAsync({
                              idBloque: bloqueId,
                              idPersona: buyerPersonId,
                              tipoDocumento: 'Factura',
                              numeroDocumento: numeroDocumentoToSend,
                              razon: 'Compra de mausoleo'
                            });

                            toast.success('Propietario registrado correctamente');
                          } catch (e: any) {
                            console.error('Error registrando propietario del mausoleo:', e);
                            const message = e?.message || e?.response?.data?.message || String(e);
                            toast.error('No se pudo registrar el propietario del mausoleo', { description: message });
                          }
                        }
                      }

                      onReceiptUploaded?.(paymentId || undefined);
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PdfPreviewDialog
        open={showPdfPreview}
        onOpenChange={setShowPdfPreview}
        pdfBlob={pdfBlob}
        payment={currentPayment}
        autoPreview
      />

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
            <DialogDescription>Esta acción eliminará la orden de pago y los nichos volverán a estar disponibles.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Motivo de Cancelación *</label>
              <textarea
                placeholder="Ej: Cliente cambió de opinión"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full min-h-[100px] border rounded p-2"
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
            <Button variant="outline" onClick={() => { setShowCancelDialog(false); setCancelReason(""); }} disabled={cancelarReservaMutation.isPending}>Volver</Button>
            <Button variant="destructive" onClick={handleCancelReservation} disabled={!cancelReason.trim() || cancelarReservaMutation.isPending}>
              {cancelarReservaMutation.isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Cancelando...</>) : (<><XCircle className="mr-2 h-4 w-4" />Confirmar Cancelación</>)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
