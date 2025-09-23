import { NichoEntity, CreateNichoEntity, UpdateNichoEntity, NichoFallecidosEntity, SearchFallecidosEntity } from "../entities/nicho.entity";
import { PropietarioNichoEntity } from "@/features/propietarios-nichos/domain/entities/propietario-nicho.entity";

export interface NichoPropietariosResponse {
  nicho: NichoEntity;
  propietarios: PropietarioNichoEntity[];
}

export interface NichoRepository {
  findAll(): Promise<NichoEntity[]>;
  findById(id: string): Promise<NichoEntity>;
  findPropietariosByNichoId(id: string): Promise<NichoPropietariosResponse>;
  findByCedulaFallecido(cedula: string): Promise<NichoFallecidosEntity>;
  searchFallecidos(busqueda: string): Promise<SearchFallecidosEntity>;
  create(nicho: CreateNichoEntity): Promise<NichoEntity>;
  update(nicho: UpdateNichoEntity): Promise<NichoEntity>;
  delete(id: string): Promise<void>;
} 