import { API_ROUTES } from "@/core/constants/api-routes";
import { HuecoModel } from "../models/hueco.model";
import { HuecoRepository } from "../../domain/repositories/hueco.repository";
import { HuecoEntity, CreateHuecoEntity, UpdateHuecoEntity } from "../../domain/entities/hueco.entity";
import { HuecoMapper } from "../mappers/hueco.mapper";
import AxiosClient from "@/core/infrastructure/axios-client";
import { AxiosResponse } from "axios";

export class HuecoRepositoryImpl implements HuecoRepository {
  private httpClient: AxiosClient;

  constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  static getInstance(): HuecoRepositoryImpl {
    return new HuecoRepositoryImpl();
  }

  async findAll(): Promise<HuecoEntity[]> {
    const { data } = await this.httpClient.get<HuecoModel[]>(API_ROUTES.HUECOS.LIST);
    return data.data.map(HuecoMapper.toEntity);
  }

  async findById(id: string): Promise<HuecoEntity> {
    const { data } = await this.httpClient.get<HuecoModel>(API_ROUTES.HUECOS.GET_BY_ID(id));
    return HuecoMapper.toEntity(data.data);
  }

  async findByNicho(idNicho: string): Promise<HuecoEntity[]> {
    const { data } = await this.httpClient.get<HuecoModel[]>(API_ROUTES.HUECOS.GET_BY_NICHO(idNicho));
    return data.data.map(HuecoMapper.toEntity);
  }


  async findByCementerio(idCementerio: string): Promise<HuecoEntity[]> {
    const { data } = await this.httpClient.get<HuecoModel[]>(API_ROUTES.HUECOS.GET_BY_CEMENTERIO(idCementerio));
        return data.data.map(HuecoMapper.toEntity);
  }
  
  async findAllDisponibles(): Promise<HuecoEntity[]> {
    const { data } = await this.httpClient.get<HuecoModel[]>(API_ROUTES.HUECOS.GET_DISPONIBLES);
    return data.data.map(HuecoMapper.toEntity);
  }

  async create(hueco: CreateHuecoEntity): Promise<HuecoEntity> {
    // Enviar multipart/form-data
    const formData = new FormData();
    formData.append('id_nicho', hueco.idNicho);
    if (hueco.numeroHueco !== undefined) {
      formData.append('num_hueco', hueco.numeroHueco.toString());
    }
    if (hueco.estado) {
      formData.append('estado', hueco.estado);
    }
    if (hueco.idFallecido) {
      formData.append('id_fallecido', hueco.idFallecido);
    }
    if (hueco.observacionAmpliacion) {
      formData.append('observacion_ampliacion', hueco.observacionAmpliacion);
    }
    if (hueco.pdfFile) {
      formData.append('file', hueco.pdfFile);
    } else {
      throw new Error('El archivo PDF de ampliación es obligatorio');
    }

    // Logs de depuración del FormData
    try {
      const debugEntries: Array<{ key: string; value: unknown }> = [];
      // Nota: entries() no es tipado, pero funciona en navegadores
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const [key, value] of (formData as any).entries()) {
        if (value instanceof File) {
          debugEntries.push({ key, value: { name: value.name, type: value.type, size: value.size } });
        } else {
          debugEntries.push({ key, value });
        }
      }
      console.log('[HuecoRepositoryImpl.create] FormData entries:', debugEntries);
    } catch (_e) {
      // ignorar fallo de introspección
    }

    const { data } = await this.httpClient.post<HuecoModel>(
      API_ROUTES.HUECOS.CREATE,
      formData
    );
    return HuecoMapper.toEntity(data.data);
  }

  async update(hueco: UpdateHuecoEntity): Promise<HuecoEntity> {
    // Enviar multipart/form-data (PDF opcional)
    const formData = new FormData();
    formData.append('id_detalle_hueco', hueco.idDetalleHueco);
    formData.append('estado', hueco.estado);
    if (hueco.idFallecido) {
      formData.append('id_fallecido', hueco.idFallecido);
    }
    if (hueco.observacionAmpliacion) {
      formData.append('observacion_ampliacion', hueco.observacionAmpliacion);
    }
    if (hueco.pdfFile) {
      formData.append('file', hueco.pdfFile);
    }

    const { data } = await this.httpClient.patch<HuecoModel>(
      API_ROUTES.HUECOS.UPDATE(hueco.idDetalleHueco),
      formData
    );
    return HuecoMapper.toEntity(data.data);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete(API_ROUTES.HUECOS.DELETE(id));
  }

  async descargarArchivo(id: string): Promise<Blob> {
    const { data } = await this.httpClient.get<Blob, AxiosResponse<Blob>>(
      API_ROUTES.HUECOS.GET_ARCHIVO(id),
      { responseType: 'blob' }
    );
    return data;
  }
} 