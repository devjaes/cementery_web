import { z } from "zod";

export const CreateMejoraSchema = z.object({
  idCementerio: z.string().uuid("El cementerio es requerido y debe ser un UUID válido"),
  pantoneroACargo: z.string().min(1, "El pantonero a cargo es requerido").max(100),
  metodoSolicitud: z.string().min(1, "El método de solicitud es requerido"),

  solicitanteId: z.string().uuid("El solicitante es requerido"),
  direccionSolicitante: z.string().max(200).optional(),
  celularSolicitante: z.string().max(30).optional(),
  correoSolicitante: z.string().email().optional(),

  fallecidoId: z.string().uuid().optional(),
  fechaFallecimiento: z.string().optional(),

  propietarioNicho: z.string().optional(),
  numeroNichos: z.coerce.number().int().min(0).optional(),
  lugarNicho: z.string().optional(),
  codigoSitio: z.string().optional(),
  administradorNicho: z.string().optional(),
  esPropio: z
    .preprocess((v) => {
      if (v === undefined || v === null || v === "") return undefined;
      if (v === true || v === false) return v;
      if (typeof v === "string") return v.toLowerCase() === "true";
      return Boolean(v);
    }, z.boolean().optional()),
  observacionNicho: z.string().optional(),

  tipoServicio: z.enum(["ARREGLOS", "CONSTRUCCION", "LAPIDA"], {
    required_error: "El tipo de servicio es requerido",
  }),
  observacionAccion: z.string().optional(),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  horario: z.string().optional(),
});

export type CreateMejoraDTO = z.infer<typeof CreateMejoraSchema>;


