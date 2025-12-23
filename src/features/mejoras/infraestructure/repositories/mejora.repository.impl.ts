import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import { ResponseAPI } from "@/core/interfaces/api.interface";
import type { AxiosResponse } from "axios";
import { CreateMejoraEntity, MejoraEntity } from "../../domain/entities/mejora.entity";
import { MejoraRepository } from "../../domain/repositories/mejora.repository";
import { MejoraMapper } from "../mappers/mejora.mapper";
import { MejoraModel } from "../models/mejora.model";
import { SearchFallecidosRequisitoInhumacionEntity } from "@/features/requisitos-inhumacion/domain/entities/requisito-inhumacion.entity";
import {
  SearchFallecidosRequisitoInhumacionModel,
} from "@/features/requisitos-inhumacion/infraestructure/models/requisito-inhumacion.model";
import { SearchFallecidosRequisitoInhumacionMapper } from "@/features/requisitos-inhumacion/infraestructure/mappers/requisito-inhumacion-fallecido.mapper";
import { MejoraSearchAllResultsEntity, PropietarioNichoSearchResult, PropietarioNichoConBloqueEntity, MejoraFallecidoInfo } from "../../domain/entities/mejora-search.entity";
import { PersonModel } from "@/features/person/infraestrcture/models/person.model";
import { PersonMapper } from "@/features/person/infraestrcture/mappers/person.mapper";
import { PropietarioNichoModel } from "@/features/propietarios-nichos/infrastructure/models/propietario-nicho.model";

// Interfaz para el hueco con información del fallecido
interface HuecoModelConFallecido {
  id_detalle_hueco: string;
  num_hueco: number;
  estado: string;
  id_fallecido?: {
    id_persona: string;
    cedula?: string | null;
    nombres?: string;
    apellidos?: string;
    fecha_defuncion?: string | null;
    fecha_inhumacion?: string | null;
  } | null;
}

// Interfaz para inhumación con información del fallecido
interface InhumacionModelConFallecido {
  id_inhumacion: string;
  id_fallecido?: {
    id_persona: string;
    cedula?: string | null;
    nombres?: string;
    apellidos?: string;
    fecha_defuncion?: string | null;
    fecha_inhumacion?: string | null;
  } | null;
  fecha_inhumacion?: string;
  estado?: string;
}

// Interfaz extendida para el modelo de nicho con bloque completo (solo para mejoras)
interface NichoModelConBloque {
  id_nicho?: string;
  id_cementerio?: {
    id_cementerio?: string;
    nombre?: string;
  };
  id_bloque?: {
    id_bloque: string;
    nombre: string;
    descripcion?: string | null;
    numero?: number | null;
  } | string;
  fila: number;
  columna: number;
  tipo: string;
  sector?: string | null;
  numero?: string | null;
  estado: string;
  estadoVenta: string;
  num_huecos: number;
  fecha_construccion: string;
  observaciones?: string;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  huecos?: HuecoModelConFallecido[];
  inhumaciones?: InhumacionModelConFallecido[];
}

// Función para extraer fallecidos del nicho
function extractFallecidosFromNicho(model: NichoModelConBloque): MejoraFallecidoInfo[] {
  const fallecidosMap = new Map<string, MejoraFallecidoInfo>();

  // Extraer fallecidos de los huecos
  if (model.huecos) {
    for (const hueco of model.huecos) {
      if (hueco.id_fallecido) {
        fallecidosMap.set(hueco.id_fallecido.id_persona, {
          idPersona: hueco.id_fallecido.id_persona,
          cedula: hueco.id_fallecido.cedula,
          nombres: hueco.id_fallecido.nombres,
          apellidos: hueco.id_fallecido.apellidos,
          fechaDefuncion: hueco.id_fallecido.fecha_defuncion,
          fechaInhumacion: hueco.id_fallecido.fecha_inhumacion,
        });
      }
    }
  }

  // Extraer fallecidos de las inhumaciones
  if (model.inhumaciones) {
    for (const inhumacion of model.inhumaciones) {
      if (inhumacion.id_fallecido) {
        fallecidosMap.set(inhumacion.id_fallecido.id_persona, {
          idPersona: inhumacion.id_fallecido.id_persona,
          cedula: inhumacion.id_fallecido.cedula,
          nombres: inhumacion.id_fallecido.nombres,
          apellidos: inhumacion.id_fallecido.apellidos,
          fechaDefuncion: inhumacion.id_fallecido.fecha_defuncion,
          fechaInhumacion: inhumacion.id_fallecido.fecha_inhumacion,
        });
      }
    }
  }

  return Array.from(fallecidosMap.values());
}

// Mapper interno para convertir nicho con bloque a entidad de mejoras
function mapNichoConBloqueToEntity(model: NichoModelConBloque): PropietarioNichoConBloqueEntity["idNicho"] {
  const bloque = model.id_bloque && typeof model.id_bloque === 'object' 
    ? {
        idBloque: model.id_bloque.id_bloque,
        nombre: model.id_bloque.nombre,
        descripcion: model.id_bloque.descripcion,
        numero: model.id_bloque.numero,
      }
    : undefined;

  const fallecidos = extractFallecidosFromNicho(model);

  return {
    idNicho: model.id_nicho,
    fila: model.fila,
    columna: model.columna,
    tipo: model.tipo,
    sector: model.sector,
    numero: model.numero,
    bloque,
    idCementerio: model.id_cementerio ? {
      idCementerio: model.id_cementerio.id_cementerio,
      nombre: model.id_cementerio.nombre,
    } : undefined,
    fallecidos: fallecidos.length > 0 ? fallecidos : undefined,
  };
}

// Mapper interno para convertir propietario con nicho enriquecido
function mapPropietarioConBloqueToEntity(model: PropietarioNichoModel & { id_nicho: NichoModelConBloque }): PropietarioNichoConBloqueEntity {
  return {
    idPropietarioNicho: model.id_propietario_nicho,
    idPersona: model.id_persona ? {
      idPersona: model.id_persona.id_persona,
      cedula: model.id_persona.cedula,
      nombres: model.id_persona.nombres,
      apellidos: model.id_persona.apellidos,
      fechaNacimiento: model.id_persona.fecha_nacimiento,
      fechaDefuncion: model.id_persona.fecha_defuncion,
      fechaInhumacion: model.id_persona.fecha_inhumacion,
      lugarDefuncion: model.id_persona.lugar_defuncion,
      causaDefuncion: model.id_persona.causa_defuncion,
      direccion: model.id_persona.direccion,
      telefono: model.id_persona.telefono,
      correo: model.id_persona.correo,
      nacionalidad: model.id_persona.nacionalidad,
      fallecido: model.id_persona.fallecido,
      fechaCreacion: model.id_persona.fecha_creacion,
      fechaActualizacion: model.id_persona.fecha_actualizacion,
    } : undefined,
    idNicho: mapNichoConBloqueToEntity(model.id_nicho),
    fechaAdquisicion: model.fecha_adquisicion,
    tipoDocumento: model.tipo_documento,
    numeroDocumento: model.numero_documento,
    activo: model.activo,
    razon: model.razon,
    fechaCreacion: model.fecha_creacion,
    fechaActualizacion: model.fecha_actualizacion,
    tipo: model.tipo,
  };
}

export class MejoraRepositoryImpl implements MejoraRepository {
  private httpClient: AxiosClient;

  constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  private static readonly EMPTY_CREATE_RESPONSE_ERROR = "La respuesta no incluye el identificador de la mejora creada";

  private static isMinimalCreateResponse(payload: unknown): payload is { id_mejora?: string } {
    if (typeof payload !== "object" || payload === null) {
      return true;
    }

    if (!("id_cementerio" in payload)) {
      return true;
    }

    const cementery = (payload as MejoraModel).id_cementerio;
    return !cementery;
  }

  static getInstance(): MejoraRepositoryImpl {
    return new MejoraRepositoryImpl();
  }

  private unwrapResponse<T>(payload: ResponseAPI<T> | T): T {
    const maybeResponse = payload as ResponseAPI<T>;
    if (maybeResponse && Object.prototype.hasOwnProperty.call(maybeResponse, "data")) {
      return (maybeResponse.data as T) ?? (payload as T);
    }
    return payload as T;
  }

  async findAll(): Promise<MejoraEntity[]> {
    const { data } = await this.httpClient.get<MejoraModel[]>(API_ROUTES.MEJORAS.LIST);
    const list = this.unwrapResponse<MejoraModel[]>(data);
    return list.map(MejoraMapper.toEntity);
  }

  async findById(id: string): Promise<MejoraEntity> {
    const { data } = await this.httpClient.get<MejoraModel>(API_ROUTES.MEJORAS.GET_BY_ID(id));
    const payload = this.unwrapResponse<MejoraModel>(data);
    return MejoraMapper.toEntity(payload);
  }

  async create(payload: CreateMejoraEntity): Promise<MejoraEntity> {
    const model = MejoraMapper.toModel(payload);
    const { data } = await this.httpClient.post<MejoraModel | { id_mejora?: string }>(
      API_ROUTES.MEJORAS.CREATE,
      model,
    );
    const created = this.unwrapResponse<MejoraModel | { id_mejora?: string }>(data);

    const createdId = (created as MejoraModel)?.id_mejora ?? created?.id_mejora;
    if (!createdId) {
      throw new Error(MejoraRepositoryImpl.EMPTY_CREATE_RESPONSE_ERROR);
    }

    if (MejoraRepositoryImpl.isMinimalCreateResponse(created)) {
      return await this.findById(createdId);
    }

    return MejoraMapper.toEntity(created as MejoraModel);
  }

  async update(id: string, payload: Partial<CreateMejoraEntity>): Promise<MejoraEntity> {
    const { data } = await this.httpClient.patch<MejoraModel>(API_ROUTES.MEJORAS.UPDATE(id), payload);
    const updated = this.unwrapResponse<MejoraModel>(data);
    return MejoraMapper.toEntity(updated);
  }

  async approve(id: string, payload: { aprobadoPorId: string }): Promise<MejoraEntity> {
    const { data } = await this.httpClient.patch<MejoraModel>(API_ROUTES.MEJORAS.APPROVE(id), payload);
    const updated = this.unwrapResponse<MejoraModel>(data);
    return MejoraMapper.toEntity(updated);
  }

  async reject(id: string, payload: { negadoPorId: string }): Promise<MejoraEntity> {
    const { data } = await this.httpClient.patch<MejoraModel>(API_ROUTES.MEJORAS.REJECT(id), payload);
    const updated = this.unwrapResponse<MejoraModel>(data);
    return MejoraMapper.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete(API_ROUTES.MEJORAS.DELETE(id));
  }

  async uploadFiles(id: string, files: File[]): Promise<void> {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    await this.httpClient.post(API_ROUTES.MEJORAS.UPLOAD_FILE(id), form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async deleteFile(id: string, filename: string): Promise<void> {
    await this.httpClient.delete(API_ROUTES.MEJORAS.DELETE_FILE(id, filename));
  }

  async downloadPdf(id: string): Promise<{ blob: Blob; filename?: string; contentType?: string }> {
    const response = await this.httpClient.get<Blob, AxiosResponse<Blob>>(
      API_ROUTES.MEJORAS.DOWNLOAD_PDF(id),
      {
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
        },
      },
    );

    let blobData = response.data;

    let disposition: string | undefined;
    if (typeof response.headers?.get === "function") {
      const disp = response.headers.get("content-disposition") ?? response.headers.get("Content-Disposition");
      disposition = typeof disp === "string" ? disp : undefined;
    } else if (response.headers) {
      const dispHeader = (response.headers as unknown as Record<string, string | number | boolean | string[] | undefined>)["content-disposition"]
        ?? (response.headers as unknown as Record<string, string | number | boolean | string[] | undefined>)["Content-Disposition"];
      disposition = typeof dispHeader === "string" ? dispHeader : undefined;
    }
    let contentType: string | undefined;
    if (typeof response.headers?.get === "function") {
      const ct = response.headers.get("content-type") ?? response.headers.get("Content-Type");
      contentType = typeof ct === "string" ? ct : undefined;
    } else if (response.headers) {
      const ctHeader = (response.headers as unknown as Record<string, string | number | boolean | string[] | undefined>)["content-type"]
        ?? (response.headers as unknown as Record<string, string | number | boolean | string[] | undefined>)["Content-Type"];
      contentType = typeof ctHeader === "string" ? ctHeader : undefined;
    }

    let filename: string | undefined;

    if (disposition) {
      const match = /filename\*=UTF-8''([^;\n]+)|filename="?([^";]+)"?/i.exec(disposition);
      const raw = match?.[1] ?? match?.[2];
      if (raw) {
        try {
          filename = decodeURIComponent(raw);
        } catch {
          filename = raw;
        }
      }
    }

    if (contentType && (!blobData.type || blobData.type === "application/octet-stream")) {
      blobData = blobData.slice(0, blobData.size, contentType);
    }

    return { blob: blobData, filename, contentType };
  }

  async search(query: string): Promise<SearchFallecidosRequisitoInhumacionEntity> {
    const { data } = await this.httpClient.get<SearchFallecidosRequisitoInhumacionModel>(
      API_ROUTES.REQUISITOS_INHUMACION.SEARCH_FALLECIDOS(query)
    );
    const payload = this.unwrapResponse<SearchFallecidosRequisitoInhumacionModel>(data);
    return SearchFallecidosRequisitoInhumacionMapper.toEntity(payload);
  }

  async searchAll(query: string): Promise<MejoraSearchAllResultsEntity> {
    try {
      // 1. Búsqueda en paralelo: fallecidos y personas (propietarios potenciales)
      // COMENTADO: Búsqueda de fallecidos desactivada - solo buscamos por propietarios de nichos
      const [fallecidosResponse, personasResponse] = await Promise.allSettled([
        // this.httpClient.get<SearchFallecidosRequisitoInhumacionModel>(
        //   API_ROUTES.REQUISITOS_INHUMACION.SEARCH_FALLECIDOS(query)
        // ).catch((error) => {
        //   // Silenciar errores 404 ya que son esperados cuando no hay resultados
        //   if (error?.response?.status === 404) {
        //     return { data: { termino_busqueda: query, total_encontrados: 0, fallecidos: [] } };
        //   }
        //   throw error;
        // }),
        Promise.resolve({ data: { termino_busqueda: query, total_encontrados: 0, fallecidos: [] } }), // Retornar vacío directamente
        this.httpClient.get<PersonModel[]>(
          API_ROUTES.PERSONS.SEARCH(query, true) // vivos=true para buscar propietarios
        ).catch((error) => {
          // Silenciar errores 404 ya que son esperados cuando no hay resultados
          if (error?.response?.status === 404) {
            return { data: [] };
          }
          throw error;
        }),
      ]);

      // 2. Procesar resultado de fallecidos
      let fallecidosEntity: SearchFallecidosRequisitoInhumacionEntity;
      if (fallecidosResponse.status === "fulfilled") {
        const fallecidosPayload = this.unwrapResponse<SearchFallecidosRequisitoInhumacionModel>(fallecidosResponse.value.data);
        fallecidosEntity = SearchFallecidosRequisitoInhumacionMapper.toEntity(fallecidosPayload);
      } else {
        // Si falla por otra razón, crear entidad vacía
        fallecidosEntity = {
          terminoBusqueda: query,
          totalEncontrados: 0,
          fallecidos: [],
        };
      }

      // 3. Procesar resultado de personas
      let personas: PersonModel[] = [];
      if (personasResponse.status === "fulfilled") {
        const personasPayload = this.unwrapResponse<PersonModel[]>(personasResponse.value.data);
        personas = Array.isArray(personasPayload) ? personasPayload : [];
      }

      // 4. Para cada persona encontrada, buscar sus nichos
      const propietariosPromises = personas.map(async (persona): Promise<PropietarioNichoSearchResult | null> => {
        try {
          if (!persona.cedula) {
            return null;
          }

          const { data: nichosData } = await this.httpClient.get<PropietarioNichoModel[]>(
            API_ROUTES.PROPIETARIOS_NICHOS.GET_BY_PERSONA_CEDULA(persona.cedula)
          ).catch((error) => {
            // Silenciar errores 404 - persona sin nichos es válido
            if (error?.response?.status === 404) {
              return { data: [] };
            }
            throw error;
          });


          const nichosPayload = this.unwrapResponse<PropietarioNichoModel[]>(nichosData);
          const nichos = Array.isArray(nichosPayload) ? nichosPayload : [];

          // Solo retornar si tiene nichos
          if (nichos.length === 0) {
            return null;
          }

          // 4.1 Enriquecer cada nicho con información completa (incluyendo bloque)
          const nichosEnriquecidos = await Promise.all(
            nichos.map(async (propNicho) => {
              // Si el nicho ya tiene información del bloque como objeto, no hacer fetch adicional
              if (propNicho.id_nicho?.id_nicho && 
                  (!propNicho.id_nicho.id_bloque || typeof propNicho.id_nicho.id_bloque === 'string')) {
                try {
                  const { data: nichoCompleto } = await this.httpClient.get<NichoModelConBloque>(
                    API_ROUTES.NICHOS.GET_BY_ID(propNicho.id_nicho.id_nicho)
                  );
                  const nichoPayload = this.unwrapResponse<NichoModelConBloque>(nichoCompleto);
                  // Reemplazar el nicho con la información completa
                  return {
                    ...propNicho,
                    id_nicho: nichoPayload,
                  };
                } catch {
                  // Si falla, devolver el propietario original
                  return propNicho;
                }
              }
              return propNicho;
            })
          );

          return {
            propietario: PersonMapper.toEntity(persona),
            nichos: nichosEnriquecidos.map((n) => mapPropietarioConBloqueToEntity(n as PropietarioNichoModel & { id_nicho: NichoModelConBloque })),
          };
        } catch {
          // No registrar error en consola, es esperado que algunas personas no tengan nichos
          return null;
        }
      });

      const propietariosResults = await Promise.all(propietariosPromises);

      // 5. Filtrar resultados nulos
      const propietariosValidos = propietariosResults.filter(
        (resultado): resultado is PropietarioNichoSearchResult => resultado !== null
      );

      return {
        terminoBusqueda: query,
        fallecidos: fallecidosEntity,
        propietarios: propietariosValidos,
      };
    } catch (error) {
      console.error("Error in searchAll:", error);
      // En caso de error general, retornar estructura vacía
      return {
        terminoBusqueda: query,
        fallecidos: {
          terminoBusqueda: query,
          totalEncontrados: 0,
          fallecidos: [],
        },
        propietarios: [],
      };
    }
  }
}
