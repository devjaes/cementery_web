import {PersonEntity, CreatePersonEntity,UpdatePersonEntity } from "../entities/person.entity"

export interface PersonRepository {
  findAll(): Promise<PersonEntity[]>;
  findById(id: string): Promise<PersonEntity>;
  search(query?: string, vivos?: boolean): Promise<PersonEntity[]>;
  create(person: CreatePersonEntity): Promise<PersonEntity>;
  update(person: UpdatePersonEntity): Promise<PersonEntity>;
  delete(id: string): Promise<void>;
}