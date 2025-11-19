import { API_ROUTES } from "@/core/constants/api-routes";
import AxiosClient from "@/core/infrastructure/axios-client";
import { BloqueRepository } from "../../domain/repositories/bloque.repository";
import { BloqueCreateEntity, BloqueEntity, BloqueUpdateEntity, BloqueWithNichosEntity } from "../../domain/entities/bloque.entity";
import { BloqueMapper } from "../mappers/bloque.mapper";
import { BloqueModel } from "../models/bloque.model";
import { NichoMapper } from "@/features/nichos/infrastructure/mappers/nicho.mapper";

export class BloqueRepositoryImpl implements BloqueRepository {
  private httpClient: AxiosClient;

  constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  static getInstance(): BloqueRepositoryImpl {
    return new BloqueRepositoryImpl();
  }

  async findAll(): Promise<BloqueEntity[]> {
    const { data } = await this.httpClient.get<any>(API_ROUTES.BLOQUES.LIST);
    const raw: any = data;
    const arr: any[] = raw?.data ?? raw?.bloques ?? [];
    const source: BloqueModel[] = Array.isArray(arr) ? arr : [];
    return source.map(BloqueMapper.toEntity);
  }

  async findById(id: string): Promise<BloqueEntity> {
    const { data } = await this.httpClient.get<any>(API_ROUTES.BLOQUES.GET_BY_ID(id));
    const raw: any = data;
    const model: BloqueModel = raw?.data ?? raw;
    return BloqueMapper.toEntity(model);
  }

  async findByCementery(idCementerio: string): Promise<BloqueEntity[]> {
    const { data } = await this.httpClient.get<any>(API_ROUTES.BLOQUES.GET_BY_CEMENTERIO(idCementerio));
    const raw: any = data;
    const arr: any[] = raw?.data?.bloques ?? raw?.bloques ?? raw?.data ?? [];
    const source: BloqueModel[] = Array.isArray(arr) ? arr : [];
    return source.map(BloqueMapper.toEntity);
  }

  async findNichosByBloque(idBloque: string): Promise<BloqueWithNichosEntity> {
    const { data } = await this.httpClient.get<any>(API_ROUTES.BLOQUES.GET_NICHOS_BY_BLOQUE(idBloque));
    const raw: any = data;
    const response = raw?.data ?? raw;
    
    return {
      bloque: BloqueMapper.toEntity(response.bloque),
      nichos: response.nichos?.map((nicho: any) => NichoMapper.toEntity(nicho)) ?? [],
      totalNichos: response.total_nichos ?? 0,
      capacidadTotal: response.capacidad_total ?? 0,
      espaciosDisponibles: response.espacios_disponibles ?? 0,
    };
  }

  async create(bloque: BloqueCreateEntity): Promise<BloqueEntity> {
    const model = BloqueMapper.toCreateModel(bloque);
    const { data } = await this.httpClient.post<any>(API_ROUTES.BLOQUES.CREATE, model);
    const raw: any = data;
    const created: BloqueModel = raw?.data?.bloque ?? raw?.bloque ?? raw?.data ?? raw;
    return BloqueMapper.toEntity(created);
  }

  async update(bloque: BloqueUpdateEntity): Promise<BloqueEntity> {
    const model = BloqueMapper.toUpdateModel(bloque);
    const { data } = await this.httpClient.patch<any>(API_ROUTES.BLOQUES.UPDATE(model.id_bloque), model);
    const raw: any = data;
    const updated: BloqueModel = raw?.data?.bloque ?? raw?.bloque ?? raw?.data ?? raw;
    return BloqueMapper.toEntity(updated);
  }

  async delete(id: string): Promise<BloqueEntity> {
    const { data } = await this.httpClient.delete<any>(API_ROUTES.BLOQUES.DELETE(id));
    const raw: any = data;
    const deleted: BloqueModel = raw?.data?.bloque ?? raw?.bloque ?? raw?.data ?? raw;
    return BloqueMapper.toEntity(deleted);
  }
}
