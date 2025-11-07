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
}


