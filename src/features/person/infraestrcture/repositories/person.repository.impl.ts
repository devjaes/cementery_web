import AxiosClient from "@/core/infrastructure/axios-client";
import { PersonRepository } from "../../domain/repositories/person.repository";
import { CreatePersonEntity, PersonEntity, UpdatePersonEntity } from "../../domain/entities/person.entity";
import { API_ROUTES } from "@/core/constants/api-routes";
import { PersonModel } from "../models/person.model";
import { PersonMapper } from "../mappers/person.mapper";

export class PersonRepositoryImpl implements PersonRepository {
  private httpClient: AxiosClient;

  constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  static getInstance(): PersonRepositoryImpl {
    return new PersonRepositoryImpl();
  }

  async findAll(): Promise<PersonEntity[]> {
    const { data } = await this.httpClient.get<PersonModel[]>(API_ROUTES.PERSONS.LIST);
    return data.data.map(PersonMapper.toEntity);
  }

  async findById(id: string): Promise<PersonEntity> {
    const { data } = await this.httpClient.get<PersonModel>(API_ROUTES.PERSONS.GET_BY_ID(id));
    return PersonMapper.toEntity(data.data);
  }

  async search(query?: string, vivos?: boolean): Promise<PersonEntity[]> {
    const { data } = await this.httpClient.get<PersonModel[]>(API_ROUTES.PERSONS.SEARCH(query, vivos));
    return data.data.map(PersonMapper.toEntity);
  }

  async create(person: CreatePersonEntity): Promise<PersonEntity> {
    console.log("Creating person with data promise:", person);
    const model = PersonMapper.toModel(person);
    console.log("Creating person with model promise:", model);
    const { data } = await this.httpClient.post<PersonModel>(API_ROUTES.PERSONS.CREATE, model);
    return PersonMapper.toEntity(data.data);
  }

  async update(person: UpdatePersonEntity): Promise<PersonEntity> {
    const model = PersonMapper.toUpdateModel(person);
    const { data } = await this.httpClient.patch<PersonModel>(
      API_ROUTES.PERSONS.UPDATE(model.id_persona),
      model
    );
    return PersonMapper.toEntity(data.data);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete(API_ROUTES.PERSONS.DELETE(id));
  }
}