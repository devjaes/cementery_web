import { PropietarioNichoEntity, CreatePropietarioNichoEntity, UpdatePropietarioNichoEntity } from "../entities/propietario-nicho.entity";

export interface PropietarioNichoRepository {
  findAll(): Promise<PropietarioNichoEntity[]>;
  findById(id: string): Promise<PropietarioNichoEntity>;
  findByNicho(idNicho: string): Promise<PropietarioNichoEntity[]>;
  findHistorialByNicho(idNicho: string): Promise<PropietarioNichoEntity[]>;
  findByPersona(idPersona: string): Promise<PropietarioNichoEntity[]>;
  findByPersonaCedula(cedula: string): Promise<PropietarioNichoEntity[]>;
  create(propietario: CreatePropietarioNichoEntity): Promise<PropietarioNichoEntity>;
  update(propietario: UpdatePropietarioNichoEntity): Promise<PropietarioNichoEntity>;
  delete(id: string): Promise<void>;
} 