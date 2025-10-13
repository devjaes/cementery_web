# Ejemplo de Integración - Módulo de Pagos en Inhumaciones

## Escenario
Agregar la funcionalidad de generar pago al crear una nueva inhumación.

## Paso 1: Importar Componente

```tsx
// En tu archivo de vista o componente
import { CreatePaymentForm } from '@/features/payment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
```

## Paso 2: Estado del Modal

```tsx
function InhumacionCreate() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [createdInhumacionId, setCreatedInhumacionId] = useState<string | null>(null);
  
  // ... resto del código
}
```

## Paso 3: Crear la Inhumación Primero

```tsx
const handleCreateInhumacion = async (data: CreateInhumacionEntity) => {
  try {
    // Crear la inhumación
    const inhumacion = await createInhumacionMutation.mutateAsync(data);
    
    // Guardar el ID
    setCreatedInhumacionId(inhumacion.id_inhumacion);
    
    // Mostrar modal de pago
    setShowPaymentDialog(true);
    
  } catch (error) {
    toast.error("Error al crear la inhumación");
  }
};
```

## Paso 4: Renderizar el Modal con el Formulario de Pago

```tsx
return (
  <div>
    {/* Tu formulario de inhumación existente */}
    <InhumacionForm onSubmit={handleCreateInhumacion} />
    
    {/* Modal de pago */}
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Generar Pago para Inhumación</DialogTitle>
        </DialogHeader>
        
        {createdInhumacionId && (
          <CreatePaymentForm
            procedureType="burial"
            procedureId={createdInhumacionId}
            defaultAmount={150.00} // O calcular según tipo de nicho
            onSuccess={() => {
              toast.success("Inhumación creada y pago generado correctamente");
              setShowPaymentDialog(false);
              // Navegar a la lista o resetear formulario
              router.push('/inhumaciones');
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  </div>
);
```

## Paso 5: (Opcional) Agregar Botón para Generar Pago Después

Si quieres permitir generar el pago más tarde:

```tsx
// En la vista de detalle de inhumación
import { PaymentStatusCard, CreatePaymentForm } from '@/features/payment';

function InhumacionDetail({ inhumacion }) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { data: payments } = usePaymentsByProcedure('burial', inhumacion.id_inhumacion);
  
  const hasPayment = payments && payments.length > 0;
  
  return (
    <div>
      {/* Información de la inhumación */}
      
      {hasPayment ? (
        <PaymentStatusCard payment={payments[0]} />
      ) : (
        <Button onClick={() => setShowPaymentForm(true)}>
          Generar Pago
        </Button>
      )}
      
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="max-w-3xl">
          <CreatePaymentForm
            procedureType="burial"
            procedureId={inhumacion.id_inhumacion}
            defaultAmount={150.00}
            onSuccess={() => setShowPaymentForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

## Ejemplo Completo

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreatePaymentForm } from "@/features/payment";
import { InhumacionForm } from "@/features/inhumaciones/presentation/components/inhumacion-form.component";
import { useInhumacionMutation } from "@/features/inhumaciones/presentation/hooks/use-inhumacion-mutation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { toast } from "sonner";

export function InhumacionCreateView() {
  const router = useRouter();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [createdInhumacionId, setCreatedInhumacionId] = useState<string | null>(null);
  
  const createInhumacionMutation = useInhumacionMutation();

  const handleCreateInhumacion = async (data: any) => {
    try {
      const inhumacion = await createInhumacionMutation.mutateAsync(data);
      setCreatedInhumacionId(inhumacion.id_inhumacion);
      setShowPaymentDialog(true);
    } catch (error) {
      toast.error("Error al crear la inhumación");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Nueva Inhumación</h1>
      
      <InhumacionForm onSubmit={handleCreateInhumacion} />
      
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generar Pago para Inhumación</DialogTitle>
          </DialogHeader>
          
          {createdInhumacionId && (
            <CreatePaymentForm
              procedureType="burial"
              procedureId={createdInhumacionId}
              defaultAmount={150.00}
              onSuccess={() => {
                toast.success("Inhumación y pago generados correctamente");
                setShowPaymentDialog(false);
                router.push('/inhumaciones');
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

## Notas Importantes

1. **Orden de Creación**: Primero se crea el trámite (inhumación), luego el pago
2. **ID del Trámite**: El `procedureId` debe ser el UUID del trámite creado
3. **Tipo de Procedimiento**: Usar el correcto según el módulo:
   - `'burial'` para inhumaciones
   - `'exhumation'` para exhumaciones
   - `'niche_sale'` para venta de nichos
   - `'tomb_improvement'` para mejoras
   - `'hole_extension'` para ampliaciones

4. **Monto**: Puede ser fijo o calculado dinámicamente según el tipo de servicio

5. **Callback onSuccess**: Usar para navegar, cerrar modal o actualizar estado

## Flujo Completo

```
1. Usuario llena formulario de inhumación
2. Submit → Crear inhumación en BD
3. Obtener ID de inhumación creada
4. Abrir modal con formulario de pago
5. Usuario llena datos del comprador
6. Generar pago → PDF se muestra automáticamente
7. Usuario descarga o cierra
8. Callback onSuccess ejecuta (navegar, actualizar, etc.)
```

## Componentes Relacionados Útiles

```tsx
// Badge de estado de pago
import { PaymentStatusBadge } from '@/features/payment';
<PaymentStatusBadge status="pending" />

// Card con información del pago
import { PaymentStatusCard } from '@/features/payment';
<PaymentStatusCard payment={paymentData} />

// Botón para generar pago
import { GeneratePaymentButton } from '@/features/payment';
<GeneratePaymentButton procedureType="burial" procedureId={id} />
```
