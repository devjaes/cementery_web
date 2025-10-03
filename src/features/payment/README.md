# Payment Module - Frontend

Módulo completo de pagos para el sistema de gestión del cementerio de Píllaro.

## Estructura del Módulo

```
payment/
├── domain/
│   ├── entities/          # Entidades y tipos
│   ├── repositories/      # Interfaces de repositorios
│   └── constants/         # Query keys de React Query
├── infrastructure/
│   ├── models/            # Modelos de API
│   ├── mappers/           # Transformadores de datos
│   └── repositories/      # Implementación de repositorios
└── presentation/
    ├── hooks/             # Hooks de React Query
    └── components/        # Componentes reutilizables
```

## Instalación

El módulo ya está creado en `src/features/payment/`. Asegúrate de tener instaladas las dependencias del proyecto.

## Componentes Principales

### 1. GeneratePaymentButton

Botón para generar un nuevo pago. Muestra un diálogo de confirmación y descarga automáticamente el comprobante.

```tsx
import { GeneratePaymentButton } from '@/features/payment';

<GeneratePaymentButton
  procedureType="burial" // 'burial' | 'exhumation' | 'niche_sale' | 'tomb_improvement' | 'hole_extension'
  procedureId="uuid-del-tramite"
  amount={150.50}
  generatedBy="admin-user"
  observations="Observaciones opcionales"
  onSuccess={(paymentId) => {
    console.log('Pago creado:', paymentId);
  }}
/>
```

### 2. PaymentStatusCard

Tarjeta que muestra el estado del pago con opciones para descargar y subir comprobante.

```tsx
import { PaymentStatusCard } from '@/features/payment';

<PaymentStatusCard
  procedureType="burial"
  procedureId="uuid-del-tramite"
  validatedBy="admin-user"
/>
```

### 3. UploadReceiptDialog

Diálogo para subir el comprobante de pago escaneado.

```tsx
import { UploadReceiptDialog } from '@/features/payment';

<UploadReceiptDialog
  paymentId="uuid-del-pago"
  validatedBy="admin-user"
  onSuccess={() => {
    console.log('Comprobante subido exitosamente');
  }}
/>
```

### 4. PaymentFlowComponent

Componente completo que maneja todo el flujo de pago automáticamente.

```tsx
import { PaymentFlowComponent } from '@/features/payment';

<PaymentFlowComponent
  procedureType="burial"
  procedureId="uuid-del-tramite"
  amount={150.50}
  generatedBy="admin-user"
  validatedBy="admin-user"
  observations="Observaciones"
/>
```

## Hooks Disponibles

### Queries

```tsx
import {
  usePayments,
  usePayment,
  usePaymentByCode,
  usePaymentsByProcedure
} from '@/features/payment';

// Obtener todos los pagos con filtros
const { data: payments } = usePayments({
  status: 'pending',
  procedureType: 'burial'
});

// Obtener un pago por ID
const { data: payment } = usePayment('payment-id');

// Obtener un pago por código
const { data: payment } = usePaymentByCode('PAY-250928-143022-75');

// Obtener pagos de un trámite específico
const { data: payments } = usePaymentsByProcedure('burial', 'procedure-id');
```

### Mutations

```tsx
import {
  useCreatePayment,
  useUpdatePayment,
  useConfirmPayment,
  useUploadReceipt,
  useDeletePayment,
  useDownloadReceipt
} from '@/features/payment';

// Crear un pago
const createPayment = useCreatePayment();
createPayment.mutate({
  procedureType: 'burial',
  procedureId: 'uuid',
  amount: 150.50,
  generatedBy: 'admin-user'
});

// Subir comprobante
const uploadReceipt = useUploadReceipt();
uploadReceipt.mutate({
  paymentId: 'uuid',
  file: fileObject,
  validatedBy: 'admin-user'
});

// Confirmar pago manualmente
const confirmPayment = useConfirmPayment();
confirmPayment.mutate({
  paymentId: 'uuid',
  validatedBy: 'admin-user'
});

// Descargar comprobante
const downloadReceipt = useDownloadReceipt();
downloadReceipt.mutate('payment-id');

// Eliminar pago (solo pendientes)
const deletePayment = useDeletePayment();
deletePayment.mutate('payment-id');
```

## Ejemplo de Integración en un Módulo

### Paso 1: En el formulario de creación del trámite

```tsx
"use client";

import { useState } from 'react';
import { GeneratePaymentButton } from '@/features/payment';

export const CreateBurialForm = () => {
  const [burialId, setBurialId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleBurialCreated = (id: string) => {
    setBurialId(id);
    setShowPayment(true);
  };

  return (
    <div>
      {/* Tu formulario de inhumación aquí */}
      
      {showPayment && burialId && (
        <div className="mt-6">
          <GeneratePaymentButton
            procedureType="burial"
            procedureId={burialId}
            amount={150.50}
            generatedBy="current-user"
            observations="Pago por servicio de inhumación"
          />
        </div>
      )}
    </div>
  );
};
```

### Paso 2: En la vista de detalles del trámite

```tsx
"use client";

import { PaymentStatusCard } from '@/features/payment';

export const BurialDetails = ({ burialId }: { burialId: string }) => {
  return (
    <div className="space-y-6">
      {/* Otros detalles del trámite */}
      
      <PaymentStatusCard
        procedureType="burial"
        procedureId={burialId}
        validatedBy="current-user"
      />
    </div>
  );
};
```

## Flujo de Trabajo Completo

1. **Usuario crea un trámite** (inhumación, exhumación, etc.)
2. **Sistema genera el pago**:
   - Se crea el registro de pago en estado "pending"
   - Se genera automáticamente el comprobante PDF
   - El PDF se descarga automáticamente
3. **Usuario imprime y paga el comprobante**
4. **Admin sube el comprobante pagado**:
   - Se sube el archivo escaneado
   - El pago cambia automáticamente a estado "paid"
   - El trámite puede continuar

## Tipos de Procedimientos

```typescript
type ProcedureType = 
  | 'burial'             // Inhumación
  | 'exhumation'         // Exhumación
  | 'niche_sale'         // Venta de nicho
  | 'tomb_improvement'   // Mejora de tumba
  | 'hole_extension';    // Ampliación de hueco
```

## Estados de Pago

```typescript
type PaymentStatus = 
  | 'pending'  // Pendiente de pago
  | 'paid';    // Pagado y confirmado
```

## Archivos Aceptados para Comprobantes

- **Formatos**: JPG, JPEG, PNG, PDF
- **Tamaño máximo**: 5MB

## Notificaciones (Toasts)

El módulo usa `sonner` para mostrar notificaciones automáticas:

- ✅ "Pago generado exitosamente"
- ✅ "Comprobante subido y pago confirmado exitosamente"
- ✅ "Comprobante descargado exitosamente"
- ❌ "Error al generar el pago"
- ❌ "Error al subir el comprobante"

## Invalidación de Caché

El módulo invalida automáticamente las queries de React Query cuando:
- Se crea un nuevo pago
- Se actualiza un pago
- Se confirma un pago
- Se sube un comprobante
- Se elimina un pago

Esto asegura que los datos siempre estén actualizados en toda la aplicación.

## Consideraciones Importantes

1. **No hay pasarela de pago**: El sistema solo genera PDFs para imprimir
2. **Validación manual**: Los pagos se validan manualmente por el admin
3. **Solo admin puede validar**: Asegúrate de pasar el usuario correcto
4. **Estados simples**: Solo 'pending' y 'paid'
5. **Eliminación**: Solo se pueden eliminar pagos pendientes

## Troubleshooting

### Error: "API_ROUTES.PAYMENTS is undefined"

Asegúrate de haber actualizado el archivo `src/core/constants/api-routes.ts` con las rutas de pagos.

### Error: "Cannot read property 'shared'"

Verifica que las rutas de importación de los componentes UI sean correctas según tu estructura de proyecto.

### Los PDFs no se descargan

Verifica que el backend esté funcionando correctamente y que el endpoint de descarga de recibos esté implementado.

## Próximos Pasos

1. Integrar el módulo en las vistas de inhumaciones
2. Integrar el módulo en las vistas de exhumaciones
3. Crear vistas de gestión de pagos (lista, búsqueda, reportes)
4. Implementar permisos basados en roles

## Soporte

Para preguntas o problemas, consulta la documentación del backend o contacta al equipo de desarrollo.
