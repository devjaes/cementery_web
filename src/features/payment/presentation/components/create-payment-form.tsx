"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search, User, Loader2 } from "lucide-react";
import {
  CreatePaymentEntity,
  ProcedureType,
  PaymentEntity,
} from "../../domain/entities/payment.entity";
import { useCreatePayment } from "../hooks/use-payment-mutation";
import { PdfPreviewDialog } from "./pdf-preview-dialog";
import { toast } from "sonner";
import { useSearchPersonsQuery } from "@/features/person/presentation/hooks/use-person-queries";
import { useReservarNicho } from "@/features/nichos/hooks/use-nicho-sales";

const procedureTypeLabels: Record<ProcedureType, string> = {
  burial: "Inhumación",
  exhumation: "Exhumación",
  niche_sale: "Venta de Nicho",
  tomb_improvement: "Mejora de Tumba",
  hole_extension: "Ampliación de Hueco",
};

const paymentFormSchema = z.object({
  procedureType: z.enum([
    "burial",
    "exhumation",
    "niche_sale",
    "tomb_improvement",
    "hole_extension",
  ]),
  procedureId: z.string().uuid({ message: "ID de trámite inválido" }),
  amount: z.number().min(0.01, { message: "El monto debe ser mayor a 0" }),
  buyerDocument: z.string().regex(/^\d{10}$/, {
    message: "La cédula debe tener exactamente 10 dígitos",
  }),
  buyerName: z.string().min(1, { message: "El nombre es requerido" }),
  buyerDirection: z.string().optional(),
  observations: z.string().optional(),
  generatedBy: z.string().min(1, { message: "Campo requerido" }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface CreatePaymentFormProps {
  procedureType: ProcedureType;
  procedureId: string;
  defaultAmount?: number;
  onSuccess?: () => void;
}

export function CreatePaymentForm({
  procedureType,
  procedureId,
  defaultAmount = 0,
  onSuccess,
}: CreatePaymentFormProps) {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [createdPayment, setCreatedPayment] = useState<PaymentEntity | null>(
    null
  );
  const [searchDocument, setSearchDocument] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  const createPaymentMutation = useCreatePayment();
  const reservarNichoMutation = useReservarNicho();
  const searchPersonsQuery = useSearchPersonsQuery(searchDocument, true);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      procedureType,
      procedureId,
      amount: defaultAmount,
      buyerDocument: "",
      buyerName: "",
      buyerDirection: "",
      observations: "",
      generatedBy: "",
    },
  });

  const handleSearchPerson = async () => {
    const document = form.getValues("buyerDocument");

    if (!document || document.length !== 10) {
      toast.error("Ingrese una cédula válida de 10 dígitos");
      return;
    }

    setIsSearching(true);
    setSearchDocument(document);

    try {
      const result = await searchPersonsQuery.refetch();
      const persons = result.data || [];

      if (persons.length === 0) {
        setSelectedPersonId(null);
        toast.info("No se encontró ninguna persona registrada con esa cédula");
      } else if (persons.length === 1) {
        const person = persons[0];
        const fullName = `${person.nombres} ${person.apellidos}`;

        form.setValue("buyerName", fullName);
        form.setValue("buyerDirection", person.direccion || "");
        setSelectedPersonId(person.id_persona);

        toast.success("Datos de persona cargados correctamente");
      } else {
        setSelectedPersonId(null);
        toast.warning("Se encontraron múltiples personas con esa cédula");
      }
    } catch {
      toast.error("Error al buscar la persona");
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = async (values: PaymentFormValues) => {
    try {
      if (values.procedureType === 'niche_sale') {
        if (!selectedPersonId) {
          toast.error('Debe buscar y seleccionar una persona válida antes de reservar.');
          return;
        }

        const reservaParams = {
          idNicho: values.procedureId,
          idPersona: selectedPersonId,
          monto: values.amount,
          generadoPor: values.generatedBy,
          observaciones: values.observations,
          direccionComprador: values.buyerDirection,
        };

        const result = await reservarNichoMutation.mutateAsync(reservaParams);

        // result contiene: { reserva, pdfBlob, filename }
        const { reserva, pdfBlob, filename } = result as unknown as {
          reserva: { ordenPago?: { codigo?: string; id?: string; monto?: number; fechaGeneracion?: string; comprador?: { documento: string; nombre: string; direccion?: string } } };
          pdfBlob: Blob;
          filename: string;
        };

        // Guardar el PDF para que el botón de descarga funcione
        if (pdfBlob) {
          setPdfBlob(pdfBlob);
        }

        // Descargar automáticamente el PDF de la orden de pago
        if (pdfBlob && filename) {
          const url = window.URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }

        // Mantener datos del pago generado
        if (reserva?.ordenPago) {
          const paymentLike: PaymentEntity = {
            paymentId: reserva.ordenPago.id ?? 'N/D',
            procedureType: 'niche_sale',
            procedureId: values.procedureId,
            amount: reserva.ordenPago.monto ?? values.amount,
            status: 'pending',
            paymentCode: reserva.ordenPago.codigo ?? 'N/D',
            generatedDate: reserva.ordenPago.fechaGeneracion ?? new Date().toISOString(),
            paidDate: null,
            receiptFile: null,
            observations: values.observations ?? null,
            generatedBy: values.generatedBy,
            validatedBy: null,
            buyerDocument: reserva.ordenPago.comprador?.documento ?? values.buyerDocument,
            buyerName: reserva.ordenPago.comprador?.nombre ?? values.buyerName,
            buyerDirection: reserva.ordenPago.comprador?.direccion ?? values.buyerDirection ?? null,
            updatedDate: new Date().toISOString(),
          };
          setCreatedPayment(paymentLike);
        } else {
          setCreatedPayment(null);
        }

        toast.success(`Reserva creada. Código de pago: ${reserva?.ordenPago?.codigo ?? 'N/D'}`);

        // Informar al padre para que cambie a vista de estado (modal de venta en modo lectura)
        if (onSuccess) onSuccess();
        return;
      }

      // Resto de trámites: usar flujo de pagos estándar (PDF + header)
      const paymentData: CreatePaymentEntity = {
        procedureType: values.procedureType,
        procedureId: values.procedureId,
        amount: values.amount,
        generatedBy: values.generatedBy,
        buyerDocument: values.buyerDocument,
        buyerName: values.buyerName,
        buyerDirection: values.buyerDirection,
        observations: values.observations,
      };

      const result = await createPaymentMutation.mutateAsync(paymentData);

      setPdfBlob(result.pdfBlob);
      setCreatedPayment(result.payment);
      setShowPdfPreview(true);

      toast.success('Pago generado exitosamente');

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      toast.error('Ocurrió un error al procesar la solicitud');
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="procedureType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Trámite</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(procedureTypeLabels).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto a Pagar</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Datos del Comprador
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="buyerDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cédula del Comprador</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="Ingrese 10 dígitos"
                          maxLength={10}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSearchPerson}
                        disabled={isSearching || searchPersonsQuery.isLoading}
                      >
                        {isSearching || searchPersonsQuery.isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <FormDescription>
                      Puede buscar una persona registrada en el sistema
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buyerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo del Comprador</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre completo"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ejemplo: Juan Carlos Pérez López
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buyerDirection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Dirección del comprador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="generatedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Generado Por</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del funcionario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observaciones adicionales"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={createPaymentMutation.isPending || reservarNichoMutation.isPending}>
              {(createPaymentMutation.isPending || reservarNichoMutation.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {procedureType === 'niche_sale' ? 'Reservando...' : 'Generando...'}
                </>
              ) : (
                procedureType === 'niche_sale' ? 'Reservar' : 'Generar Pago'
              )}
            </Button>
          </div>
        </form>
      </Form>

      <PdfPreviewDialog
        open={showPdfPreview}
        onOpenChange={setShowPdfPreview}
        pdfBlob={pdfBlob}
        payment={createdPayment}
      />
    </>
  );
}
