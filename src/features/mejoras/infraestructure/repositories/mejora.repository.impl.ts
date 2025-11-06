import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import { ResponseAPI } from "@/core/interfaces/api.interface";
import { CreateMejoraEntity, MejoraEntity } from "../../domain/entities/mejora.entity";
import { MejoraRepository } from "../../domain/repositories/mejora.repository";
import { MejoraMapper } from "../mappers/mejora.mapper";
import { MejoraModel } from "../models/mejora.model";
import { SearchFallecidosRequisitoInhumacionEntity } from "@/features/requisitos-inhumacion/domain/entities/requisito-inhumacion.entity";
import {
  SearchFallecidosRequisitoInhumacionModel,
} from "@/features/requisitos-inhumacion/infraestructure/models/requisito-inhumacion.model";
import { SearchFallecidosRequisitoInhumacionMapper } from "@/features/requisitos-inhumacion/infraestructure/mappers/requisito-inhumacion-fallecido.mapper";

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

  async downloadPdf(id: string): Promise<Blob> {
    const res = await this.httpClient.get<Blob>(API_ROUTES.MEJORAS.DOWNLOAD_PDF(id), {
      responseType: "blob",
    });
  const payload = this.unwrapResponse<Blob>(res.data as ResponseAPI<Blob> | Blob);
    return payload;
  }

  async search(query: string): Promise<SearchFallecidosRequisitoInhumacionEntity> {
    const { data } = await this.httpClient.get<SearchFallecidosRequisitoInhumacionModel>(
      API_ROUTES.REQUISITOS_INHUMACION.SEARCH_FALLECIDOS(query)
    );
    const payload = this.unwrapResponse<SearchFallecidosRequisitoInhumacionModel>(data);
    return SearchFallecidosRequisitoInhumacionMapper.toEntity(payload);
  }
}


