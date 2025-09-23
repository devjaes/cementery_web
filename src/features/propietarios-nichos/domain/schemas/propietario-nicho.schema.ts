import { z } from "zod";

export const CreatePropietarioNichoSchema = z.object({
  idPersona: z.string().uuid("El ID de la persona es requerido y debe ser un UUID válido"),
  idNicho: z.string().uuid("El ID del nicho es requerido y debe ser un UUID válido"),
  fechaAdquisicion: z.string().min(1, "La fecha de adquisición es requerida"),
  tipoDocumento: z.enum(["Escritura", "Contrato", "Factura", "Otro"] as const, {
    message: "Tipo de documento inválido",
  }),
  numeroDocumento: z.string().min(1, "El número de documento es requerido"),
  razon: z.string().min(1, "La razón es requerida"),
  tipo: z.enum(["Dueño", "Heredero"] as const, {
    message: "Tipo de propietario inválido",
  }),
});

export const UpdatePropietarioNichoSchema = z.object({
  idPropietarioNicho: z.string().uuid("El ID del propietario es requerido y debe ser un UUID válido"),
  activo: z.boolean().optional(),
  razon: z.string().min(1, "La razón es requerida").optional(),
  tipoDocumento: z.enum(["Escritura", "Contrato", "Factura", "Otro"] as const, {
    message: "Tipo de documento inválido",
  }).optional(),
  numeroDocumento: z.string().min(1, "El número de documento es requerido").optional(),
  tipo: z.enum(["Dueño", "Heredero"] as const, {
    message: "Tipo de propietario inválido",
  }).optional(),
});

export type CreatePropietarioNichoDTO = z.infer<typeof CreatePropietarioNichoSchema>;
export type UpdatePropietarioNichoDTO = z.infer<typeof UpdatePropietarioNichoSchema>; 