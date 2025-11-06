# Quick Reference - Módulo de Pagos

## 🚀 Uso Rápido

### Importar
```tsx
import { CreatePaymentForm } from '@/features/payment';
```

### Implementar
```tsx
<CreatePaymentForm
  procedureType="burial"
  procedureId="uuid-del-tramite"
  defaultAmount={150.00}
  onSuccess={() => {}}
/>
```

## 📋 Props del Formulario

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `procedureType` | `'burial' \| 'exhumation' \| 'niche_sale' \| 'tomb_improvement' \| 'hole_extension'` | ✅ | Tipo de trámite |
| `procedureId` | `string` | ✅ | UUID del trámite |
| `defaultAmount` | `number` | ❌ | Monto predeterminado |
| `onSuccess` | `() => void` | ❌ | Callback al crear pago |

## 🔤 Tipos de Trámites

```typescript
'burial'            → Inhumación
'exhumation'        → Exhumación
'niche_sale'        → Venta de Nicho
'tomb_improvement'  → Mejora de Tumba
'hole_extension'    → Ampliación de Hueco
```

## ✅ Validaciones

### Cédula
- ✅ Exactamente 10 dígitos
- ❌ No letras ni caracteres especiales

### Nombre
- ✅ 2 nombres + 2 apellidos
- ✅ Separados por espacios
- ✅ Solo letras (incluyendo áéíóúñ)
- ❌ Sin números ni símbolos

**Ejemplo válido:** `Juan Carlos Pérez López`

## 🔍 Búsqueda de Personas

1. Ingresa cédula de 10 dígitos
2. Click en botón de búsqueda 🔍
3. Si encuentra: Autocompleta nombre y dirección
4. Si no: Ingresa datos manualmente

**Nota:** Solo busca personas vivas

## 📄 Respuesta del Backend

### Body
```
Blob (PDF file)
```

### Header
```
X-Payment-Data: { ...paymentData }
```

## 🖼️ Preview del PDF

Se muestra automáticamente al crear el pago con:
- Vista previa en iframe
- Botón de descarga
- Código de pago
- Monto

## 🎨 Ejemplo Completo

```tsx
import { useState } from "react";
import { CreatePaymentForm } from "@/features/payment";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";

export function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <CreatePaymentForm
          procedureType="burial"
          procedureId="123e4567-e89b-12d3-a456-426614174000"
          defaultAmount={150.00}
          onSuccess={() => {
            setOpen(false);
            // Tu lógica aquí
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
```

## 🐛 Troubleshooting

### PDF no se muestra
```bash
# Verificar en Network tab:
Content-Type: application/pdf ✅
X-Payment-Data: {...} ✅
```

### Búsqueda no funciona
```bash
# Verificar:
- Cédula tiene 10 dígitos ✅
- Endpoint /personas/search funciona ✅
- Persona no está fallecida ✅
```

### Error de validación
```bash
# Nombre debe tener:
- Exactamente 4 palabras ✅
- Un espacio entre cada una ✅
- Solo letras ✅
```

## 📚 Documentación Completa

- `README.md` - Documentación principal
- `INTEGRATION_EXAMPLE.md` - Ejemplo de integración
- Este archivo - Referencia rápida

## 🔗 Enlaces Útiles

- Componentes: `/features/payment/presentation/components/`
- Hooks: `/features/payment/presentation/hooks/`
- Entidades: `/features/payment/domain/entities/`

## ⚡ Tips

1. Siempre crea el trámite ANTES del pago
2. El preview se muestra automáticamente
3. El PDF se puede descargar sin cerrar el modal
4. El callback `onSuccess` se ejecuta DESPUÉS de crear el pago
5. La búsqueda solo encuentra personas vivas

## 📞 Soporte

- Revisar console.log() para debugging
- Verificar Network tab en DevTools
- Consultar README.md para detalles
- Revisar ejemplos en INTEGRATION_EXAMPLE.md
