import { API_ROUTES } from "@/core/constants/api-routes";
import { HuecoModel } from "../models/hueco.model";
import { HuecoRepository } from "../../domain/repositories/hueco.repository";
import { HuecoEntity, CreateHuecoEntity, UpdateHuecoEntity } from "../../domain/entities/hueco.entity";
import { HuecoMapper } from "../mappers/hueco.mapper";
import AxiosClient from "@/core/infrastructure/axios-client";

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
    const model = HuecoMapper.toModel(hueco);
    const { data } = await this.httpClient.post<HuecoModel>(API_ROUTES.HUECOS.CREATE, model);
    return HuecoMapper.toEntity(data.data);
  }

  async update(hueco: UpdateHuecoEntity): Promise<HuecoEntity> {
    const model = HuecoMapper.toUpdateModel(hueco);
    const { data } = await this.httpClient.patch<HuecoModel>(
      API_ROUTES.HUECOS.UPDATE(model.id_detalle_hueco),
      model
    );
    return HuecoMapper.toEntity(data.data);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete(API_ROUTES.HUECOS.DELETE(id));
  }
} 