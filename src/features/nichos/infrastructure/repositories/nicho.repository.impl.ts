import { API_ROUTES } from "@/core/constants/api-routes";
import { NichoModel, NichosFallecidosModel, SearchFallecidosModel } from "../models/nicho.model";
import { NichoRepository, NichoPropietariosResponse } from "../../domain/repositories/nicho.repository";
import { NichoEntity, CreateNichoEntity, UpdateNichoEntity, NichoFallecidosEntity, SearchFallecidosEntity } from "../../domain/entities/nicho.entity";
import { NichoMapper } from "../mappers/nicho.mapper";
import AxiosClient from "@/core/infrastructure/axios-client";
import { NichoFallecidosMapper, SearchFallecidosMapper } from "../mappers/nicho-facellido.mapper";

export class NichoRepositoryImpl implements NichoRepository {
  private httpClient: AxiosClient;

  constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  static getInstance(): NichoRepositoryImpl {
    return new NichoRepositoryImpl();
  }

  async findAll(): Promise<NichoEntity[]> {
    const { data } = await this.httpClient.get<NichoModel[]>(API_ROUTES.NICHOS.LIST);
    return data.data.map(NichoMapper.toEntity);
  }

  async findById(id: string): Promise<NichoEntity> {
    const { data } = await this.httpClient.get<NichoModel>(API_ROUTES.NICHOS.GET_BY_ID(id));
    return NichoMapper.toEntity(data.data);
  }

  async create(nicho: CreateNichoEntity): Promise<NichoEntity> {
    const model = NichoMapper.toModel(nicho);
    const { data } = await this.httpClient.post<NichoModel>(API_ROUTES.NICHOS.CREATE, model);
    return NichoMapper.toEntity(data.data);
  }

  async update(nicho: UpdateNichoEntity): Promise<NichoEntity> {
    const model = NichoMapper.toUpdateModel(nicho);
    const { data } = await this.httpClient.patch<NichoModel>(
      API_ROUTES.NICHOS.UPDATE(model.id_nicho),
      model
    );
    return NichoMapper.toEntity(data.data);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete(API_ROUTES.NICHOS.DELETE(id));
  }

  async findPropietariosByNichoId(id: string): Promise<NichoPropietariosResponse> {
    const { data } = await this.httpClient.get<NichoPropietariosResponse>(API_ROUTES.NICHOS.GET_PROPIETARIOS(id));
    return data.data;
  }

  async findByCedulaFallecido(cedula: string): Promise<NichoFallecidosEntity> {
    const { data } = await this.httpClient.get<NichosFallecidosModel>(API_ROUTES.NICHOS.GET_BY_CEDULA_FALLECIDO(cedula));
    return NichoFallecidosMapper.toEntity(data.data);
  }

  async searchFallecidos(busqueda: string): Promise<SearchFallecidosEntity> {
    const { data } = await this.httpClient.get<SearchFallecidosModel>(API_ROUTES.NICHOS.SEARCH_FALLECIDOS(busqueda));
    return SearchFallecidosMapper.toEntity(data.data);
  }
}