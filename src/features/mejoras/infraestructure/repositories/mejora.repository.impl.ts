import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";
import { CreateMejoraEntity, MejoraEntity } from "../../domain/entities/mejora.entity";
import { MejoraRepository } from "../../domain/repositories/mejora.repository";
import { MejoraMapper } from "../mappers/mejora.mapper";
import { MejoraModel } from "../models/mejora.model";

export class MejoraRepositoryImpl implements MejoraRepository {
  private httpClient: AxiosClient;

  constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  static getInstance(): MejoraRepositoryImpl {
    return new MejoraRepositoryImpl();
  }

  async findAll(): Promise<MejoraEntity[]> {
    const { data } = await this.httpClient.get<MejoraModel[]>(API_ROUTES.MEJORAS.LIST);
    // @ts-expect-error backend envelope
    const list: MejoraModel[] = (data.data ?? data) as any;
    return list.map(MejoraMapper.toEntity);
  }

  async findById(id: string): Promise<MejoraEntity> {
    const { data } = await this.httpClient.get<MejoraModel>(API_ROUTES.MEJORAS.GET_BY_ID(id));
    // @ts-expect-error backend envelope
    return MejoraMapper.toEntity((data.data ?? data) as any);
  }

  async create(payload: CreateMejoraEntity): Promise<MejoraEntity> {
    const model = MejoraMapper.toModel(payload);
    const { data } = await this.httpClient.post<MejoraModel>(API_ROUTES.MEJORAS.CREATE, model);
    // @ts-expect-error backend envelope
    return MejoraMapper.toEntity((data.data ?? data) as any);
  }

  async update(id: string, payload: Partial<CreateMejoraEntity>): Promise<MejoraEntity> {
    const { data } = await this.httpClient.patch<MejoraModel>(API_ROUTES.MEJORAS.UPDATE(id), payload);
    // @ts-expect-error backend envelope
    return MejoraMapper.toEntity((data.data ?? data) as any);
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
    const res = (await this.httpClient.get(API_ROUTES.MEJORAS.DOWNLOAD_PDF(id), {
      responseType: "blob",
    })) as any;
    return res.data as Blob;
  }

  async search(query: string): Promise<MejoraEntity[]> {
    const { data } = await this.httpClient.get<MejoraModel[]>(API_ROUTES.MEJORAS.SEARCH(query));
    // @ts-expect-error envelope
    const list: MejoraModel[] = (data.data ?? data) as any;
    return list.map(MejoraMapper.toEntity);
  }
}


