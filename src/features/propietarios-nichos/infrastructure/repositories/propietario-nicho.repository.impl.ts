import { API_ROUTES } from "@/core/constants/api-routes";
import { PropietarioNichoModel } from "../models/propietario-nicho.model";
import { PropietarioNichoRepository } from "../../domain/repositories/propietario-nicho.repository";
import { PropietarioNichoEntity, CreatePropietarioNichoEntity, UpdatePropietarioNichoEntity } from "../../domain/entities/propietario-nicho.entity";
import { PropietarioNichoMapper } from "../mappers/propietario-nicho.mapper";
import AxiosClient from "@/core/infrastructure/axios-client";

export class PropietarioNichoRepositoryImpl implements PropietarioNichoRepository {
  private httpClient: AxiosClient;

  constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  static getInstance(): PropietarioNichoRepositoryImpl {
    return new PropietarioNichoRepositoryImpl();
  }

  async findAll(): Promise<PropietarioNichoEntity[]> {
    const { data } = await this.httpClient.get<PropietarioNichoModel[]>(API_ROUTES.PROPIETARIOS_NICHOS.LIST);
    return data.data.map(PropietarioNichoMapper.toEntity);
  }

  async findById(id: string): Promise<PropietarioNichoEntity> {
    const { data } = await this.httpClient.get<PropietarioNichoModel>(API_ROUTES.PROPIETARIOS_NICHOS.GET_BY_ID(id));
    return PropietarioNichoMapper.toEntity(data.data);
  }

  async findByNicho(idNicho: string): Promise<PropietarioNichoEntity[]> {
    const { data } = await this.httpClient.get<PropietarioNichoModel[]>(API_ROUTES.PROPIETARIOS_NICHOS.GET_BY_NICHO(idNicho));
    return data.data.map(PropietarioNichoMapper.toEntity);
  }

  async findByPersona(idPersona: string): Promise<PropietarioNichoEntity[]> {
    const { data } = await this.httpClient.get<PropietarioNichoModel[]>(API_ROUTES.PROPIETARIOS_NICHOS.GET_BY_PERSONA(idPersona));
    return data.data.map(PropietarioNichoMapper.toEntity);
  }

  async findHistorialByNicho(idNicho: string): Promise<PropietarioNichoEntity[]> {
    const { data } = await this.httpClient.get<PropietarioNichoModel[]>(API_ROUTES.PROPIETARIOS_NICHOS.GET_HISTORIAL_BY_NICHO(idNicho));
    return data.data.map(PropietarioNichoMapper.toEntity);
  }

  async findByPersonaCedula(cedula: string): Promise<PropietarioNichoEntity[]> {
    const { data } = await this.httpClient.get<PropietarioNichoModel[]>(API_ROUTES.PROPIETARIOS_NICHOS.GET_BY_PERSONA_CEDULA(cedula));
    return data.data.map(PropietarioNichoMapper.toEntity);
  }

  async create(propietario: CreatePropietarioNichoEntity): Promise<PropietarioNichoEntity> {
    const model = PropietarioNichoMapper.toModel(propietario);
    const { data } = await this.httpClient.post<PropietarioNichoModel>(API_ROUTES.PROPIETARIOS_NICHOS.CREATE, model);
    return PropietarioNichoMapper.toEntity(data.data);
  }

  async update(propietario: UpdatePropietarioNichoEntity): Promise<PropietarioNichoEntity> {
    const model = PropietarioNichoMapper.toUpdateModel(propietario);
    const { data } = await this.httpClient.patch<PropietarioNichoModel>(
      API_ROUTES.PROPIETARIOS_NICHOS.UPDATE(model.id_propietario_nicho),
      model
    );
    return PropietarioNichoMapper.toEntity(data.data);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete(API_ROUTES.PROPIETARIOS_NICHOS.DELETE(id));
  }
} 