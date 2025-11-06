import { z } from "zod";

export const CreateMejoraSchema = z.object({
  idCementerio: z.string().uuid("El cementerio es requerido y debe ser un UUID válido"),
  id_nicho: z.string().uuid().optional(),
  panteoneroACargo: z.string().min(1, "El panteonero a cargo es requerido").max(150, "Máximo 150 caracteres"),
  metodoSolicitud: z.enum(["escrito", "verbal"], {
    required_error: "El método de solicitud es requerido",
  }),

  id_solicitante: z.string().uuid("El solicitante es requerido"),
  solicitanteDireccion: z.string().max(200).optional(),
  solicitanteTelefono: z.string().max(30).optional(),
  solicitanteCorreo: z.string().email("Formato de correo inválido").max(100).optional(),
  observacionSolicitante: z.string().max(200).optional(),

  id_fallecido: z.string().uuid().optional(),
  fechaFallecimiento: z.string().optional(),

  propietarioNicho: z.string().max(200).optional(),
  propietarioNombre: z.string().max(200).optional(),
  propietarioFechaAdquisicion: z.string().optional(),
  propietarioTipoTenencia: z.string().max(50).optional(),
  numeroNichos: z.coerce.number().int().min(0).optional(),
  lugarNicho: z.string().max(100).optional(),
  codigoSitio: z.string().max(120).optional(),
  administradorNicho: z.string().max(120).optional(),
  esPropio: z
    .preprocess((v) => {
      if (v === undefined || v === null || v === "") return undefined;
      if (v === true || v === false) return v;
      if (typeof v === "string") return v.toLowerCase() === "true";
      return Boolean(v);
    }, z.boolean().optional()),
  observacionNicho: z.string().max(200).optional(),

  tipoServicio: z.enum(["ARREGLOS", "CONSTRUCCION", "LAPIDA"], {
    required_error: "El tipo de servicio es requerido",
  }),
  observacionServicio: z.string().max(200).optional(),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  horarioTrabajo: z.string().max(120).optional(),

  entidad: z.string().min(1, "La entidad emisora es requerida").max(150),
  codigoAutorizacion: z.string().max(150).optional(),
  condicion: z.string().max(200).optional(),
  autorizacionTexto: z.string().max(200).optional(),
  normativaAplicable: z.string().max(200).optional(),
  obligacionesPostObra: z.string().max(200).optional(),
  escombreraMunicipal: z.string().max(200).optional(),
  direccionEntidad: z.string().max(200).optional(),
});

export type CreateMejoraDTO = z.infer<typeof CreateMejoraSchema>;


