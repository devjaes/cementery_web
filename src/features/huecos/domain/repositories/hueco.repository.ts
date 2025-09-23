import { HuecoEntity, CreateHuecoEntity, UpdateHuecoEntity } from "../entities/hueco.entity";

export interface HuecoRepository {
  findAll(): Promise<HuecoEntity[]>;
  findById(id: string): Promise<HuecoEntity>;
  findByNicho(idNicho: string): Promise<HuecoEntity[]>;
  findAllDisponibles(): Promise<HuecoEntity[]>;
  create(hueco: CreateHuecoEntity): Promise<HuecoEntity>;
  update(hueco: UpdateHuecoEntity): Promise<HuecoEntity>;
  delete(id: string): Promise<void>;

  findByCementerio(idCementerio: string): Promise<HuecoEntity[]>;
} 