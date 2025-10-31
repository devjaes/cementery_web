import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePropietarioNichoSchema, CreatePropietarioNichoDTO } from "@/features/propietarios-nichos/domain/schemas/propietario-nicho.schema";
import { useCreatePropietarioNichoMutation } from "./use-propietario-nicho-mutations";
import { useConfirmarVenta } from "@/features/nichos/hooks/use-nicho-sales";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";
import { toast } from "sonner";
import { usePaymentsByProcedure } from "@/features/payment/presentation/hooks/use-payment-query";
import { useMemo } from "react";

export function usePropietarioForm(
  nichoId: string, 
  onSuccess?: () => void, 
  initialPersonId?: string,
  paymentId?: string
) {
  const methods = useForm<CreatePropietarioNichoDTO>({
    resolver: zodResolver(CreatePropietarioNichoSchema),
    defaultValues: {
      idNicho: nichoId,
      tipo: "Dueño",
      ...(initialPersonId && { idPersona: initialPersonId }),
    },
  });

  const { mutate: create, isPending: isPendingCreate } = useCreatePropietarioNichoMutation();
  const { mutate: confirmarVenta, isPending: isPendingConfirmar } = useConfirmarVenta();
  const { user } = useAuthStore();
  // Fallback: obtener el último paymentId por nicho si no viene por props
  const { data: payments } = usePaymentsByProcedure("niche_sale", nichoId, !paymentId);
  const fallbackPaymentId = useMemo(() => payments && payments.length > 0 ? payments[0].paymentId : undefined, [payments]);

  const onSubmit = (data: CreatePropietarioNichoDTO) => {
    create(data, {
      onSuccess: () => {
        methods.reset();
        
        // Si hay paymentId (o fallback), confirmar la venta para cambiar estado a "Vendido"
        const idPagoToUse = paymentId || fallbackPaymentId;
        if (idPagoToUse) {
          const validadoPor = user?.email || user?.nombre || "Sistema";
          confirmarVenta(
            { 
              idPago: idPagoToUse, 
              validadoPor 
            },
            {
              onSuccess: () => {
                toast.success("Venta confirmada. El nicho ahora está en estado Vendido.");
                onSuccess?.();
              },
              onError: (error) => {
                console.error("Error al confirmar venta:", error);
                toast.error("Propietario guardado, pero no se pudo confirmar la venta.");
                onSuccess?.(); // Igual llamar onSuccess porque el propietario sí se creó
              }
            }
          );
        } else {
          // Si no hay paymentId, solo llamar onSuccess
          toast.message?.("Propietario guardado.", { description: "No se encontró el pago para confirmar la venta automáticamente." });
          onSuccess?.();
        }
      },
    });
  };

  return {
    methods,
    onSubmit,
    isPending: isPendingCreate || isPendingConfirmar,
  };
} 