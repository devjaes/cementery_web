import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import { ExhumacionRepository } from "../../domain/repositories/exhumacion.repository";
import { ExhumacionEntity, CreateExhumacionEntity, UpdateExhumacionEntity } from "../../domain/entities/exhumacion.entity";
import { ExhumacionModel } from "../models/exhumacion.model";
import { ExhumacionMapper } from "../mappers/exhumacion.mapper";

export class ExhumacionRepositoryImpl implements ExhumacionRepository {
  private httpClient: AxiosClient;

  constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  static getInstance(): ExhumacionRepositoryImpl {
    return new ExhumacionRepositoryImpl();
  }

  async findAll(): Promise<ExhumacionEntity[]> {
    const { data } = await this.httpClient.get<ExhumacionModel[]>(API_ROUTES.EXHUMACIONES.LIST);
    return data.data.map(ExhumacionMapper.toEntity);
  }

  async findById(id: string): Promise<ExhumacionEntity> {
    const { data } = await this.httpClient.get<ExhumacionModel>(API_ROUTES.EXHUMACIONES.GET_BY_ID(id));
    return ExhumacionMapper.toEntity(data.data);
  }

  async create(entity: CreateExhumacionEntity | FormData): Promise<ExhumacionEntity> {
    try {
      console.log("🚀 Creando exhumación con datos:", entity);
      
      // Si ya es FormData, enviarlo directamente
      if (entity instanceof FormData) {
        console.log("📁 Enviando FormData directamente al backend");
        const { data } = await this.httpClient.post<ExhumacionModel>(
          API_ROUTES.EXHUMACIONES.CREATE,
          entity,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        console.log("Respuesta CRUDA del backend (data completo):", data);
        console.log("Estructura JSON de data:", JSON.stringify(data, null, 2));
        
        // El backend devuelve: { success, message, data: { mensaje, exhumacion, nicho_actualizado } }
        // Necesitamos acceder a data.data.exhumacion
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = (data.data as any)?.exhumacion || data.data || data;
        console.log("Datos de exhumacion a mapear:", responseData);
        
        const mappedEntity = ExhumacionMapper.toEntity(responseData);
        console.log("Entidad mapeada:", mappedEntity);
        console.log("ID en la entidad:", mappedEntity.idExhumacion);
        
        return mappedEntity;
      }

      // Si es CreateExhumacionEntity, convertir a FormData
      console.log("📋 Convirtiendo CreateExhumacionEntity a FormData");
      const formData = new FormData();
      
      // Agregar datos básicos
      formData.append('fecha_exhumacion', entity.fechaExhumacion);
      formData.append('hora_exhumacion', entity.horaExhumacion);
      formData.append('duenio_nicho', entity.duenioNicho);
      formData.append('ubicacion', entity.ubicacion);
      formData.append('causa', entity.causa);
      if (entity.observacion) {
        formData.append('observacion', entity.observacion);
      }
      formData.append('nicho_original_id', entity.nichoOriginalId);
      formData.append('inhumacion_id', entity.inhumacionId);
      
      // Agregar archivos si existen
      if (entity.archivos && entity.archivos.length > 0) {
        console.log("📁 Agregando archivos al FormData:", entity.archivos.length);
        entity.archivos.forEach((file: File) => {
          formData.append('archivos', file);
        });
      }

      const { data } = await this.httpClient.post<ExhumacionModel>(
        API_ROUTES.EXHUMACIONES.CREATE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log("📦 Respuesta del backend (data):", data);
      console.log("📦 Respuesta del backend (data.data):", data.data);
      console.log("🔍 Estructura de data:", JSON.stringify(data, null, 2));
      
      const mappedEntity = ExhumacionMapper.toEntity(data.data);
      console.log("✅ Entidad mapeada:", mappedEntity);
      console.log("🆔 ID en la entidad:", mappedEntity.idExhumacion);
      
      return mappedEntity;

    } catch (error) {
      console.error("Error al crear exhumación:", error);
      throw error;
    }
  }

  async update(data: UpdateExhumacionEntity): Promise<ExhumacionEntity> {
    const modelData = ExhumacionMapper.toUpdateModel(data);
    const { data: response } = await this.httpClient.patch<ExhumacionModel>(API_ROUTES.EXHUMACIONES.UPDATE(data.idExhumacion), modelData);
    return ExhumacionMapper.toEntity(response.data);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete(API_ROUTES.EXHUMACIONES.DELETE(id));
  }

  async findByInhumacionId(inhumacionId: string): Promise<ExhumacionEntity[]> {
    const { data } = await this.httpClient.get<ExhumacionModel[]>(API_ROUTES.EXHUMACIONES.BY_INHUMACION(inhumacionId));
    return data.data.map(ExhumacionMapper.toEntity);
  }

  async findByNichoId(nichoId: string): Promise<ExhumacionEntity[]> {
    const { data } = await this.httpClient.get<ExhumacionModel[]>(API_ROUTES.EXHUMACIONES.BY_NICHO(nichoId));
    return data.data.map(ExhumacionMapper.toEntity);
  }

  async uploadComprobante(id: string, file: File): Promise<ExhumacionEntity> {
    console.log('🔄 Subiendo comprobante usando PATCH /exhumaciones/:id');
    console.log('📁 Archivo:', file.name, file.size);
    console.log('🌐 URL:', API_ROUTES.EXHUMACIONES.UPDATE(id));
    
    // Crear FormData para enviar el archivo real
    const formData = new FormData();
    formData.append('comprobante_pago', file); // Enviar el archivo real
    
    const { data } = await this.httpClient.patch<ExhumacionModel>(
      API_ROUTES.EXHUMACIONES.UPDATE(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return ExhumacionMapper.toEntity(data.data);
  }


}
