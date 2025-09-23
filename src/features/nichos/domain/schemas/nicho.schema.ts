import { z } from "zod";

const NichoBaseSchema = z.object({
  idCementerio: z.string().uuid("El cementerio es requerido y debe ser un UUID válido"),
  sector: z.string().min(1, "El sector es requerido").max(2, "Máximo 2 caracteres"),
  fila: z.string().min(1, "La fila es requerida").max(3, "Máximo 3 caracteres"),
  numero: z.string().min(1, "El número es requerido").max(4, "Máximo 4 caracteres"),
  tipo: z.enum(["Nicho", "Mausoleo", "Fosa"], { message: "Tipo inválido" }),
  fechaConstruccion: z.string().min(1, "La fecha de adquisición es requerida"),
  observaciones: z.string().max(500, "Máximo 500 caracteres").optional(),
  numHuecos: z.coerce.number().min(1, "Mínimo 1 hueco"),
});

export const CreateNichoSchema = NichoBaseSchema.refine(
  (data) => {
    if (data.tipo === "Mausoleo") {
      return data.numHuecos >= 1 && data.numHuecos <= 9;
    }
    // Para Nicho y Fosa
    return data.numHuecos === 1;
  },
  {
    message: "El número de huecos debe ser entre 1 y 9.",
    path: ["numHuecos"],
  }
);

export const UpdateNichoSchema = NichoBaseSchema.partial().extend({
  idNicho: z.string().uuid("ID de nicho inválido"),
}).refine(
  (data) => {
    if (data.tipo === "Mausoleo") {
      return data.numHuecos === undefined || (data.numHuecos >= 1 && data.numHuecos <= 9);
    }
    if (data.tipo === "Nicho" || data.tipo === "Fosa") {
      return data.numHuecos === undefined || data.numHuecos === 1;
    }
    return true;
  },
  {
    message: "El número de huecos debe ser entre 1 y 9.",
    path: ["numHuecos"],
  }
);

export type CreateNichoDTO = z.infer<typeof CreateNichoSchema>;
export type UpdateNichoDTO = z.infer<typeof UpdateNichoSchema>; 