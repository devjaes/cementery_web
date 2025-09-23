import { z } from "zod";

export const CreateHuecoSchema = z.object({
  idNicho: z.string().uuid("El nicho es requerido y debe ser un UUID válido"),
  numeroHueco: z.coerce
    .number()
    .min(1, "El número de hueco debe ser mayor a 0")
    .optional(),
  estado: z.enum(["Disponible", "Ocupado", "Reservado"], {
    message: "Estado inválido",
  }).optional(),
  idFallecido: z.string().uuid("ID de fallecido inválido").optional(),
});

export const UpdateHuecoSchema = z.object({
  idDetalleHueco: z.string().uuid("ID de hueco inválido"),
  estado: z.enum(["Disponible", "Ocupado", "Reservado"], {
    message: "Estado inválido",
  }),
  idFallecido: z.string().uuid("ID de fallecido inválido").optional(),
});

export type CreateHuecoDTO = z.infer<typeof CreateHuecoSchema>;
export type UpdateHuecoDTO = z.infer<typeof UpdateHuecoSchema>;
