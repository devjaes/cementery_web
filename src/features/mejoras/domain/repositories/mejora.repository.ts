import { CreateMejoraEntity, MejoraEntity } from "../entities/mejora.entity";
import { SearchFallecidosRequisitoInhumacionEntity } from "@/features/requisitos-inhumacion/domain/entities/requisito-inhumacion.entity";

export interface MejoraRepository {
  findAll(): Promise<MejoraEntity[]>;
  findById(id: string): Promise<MejoraEntity>;
  create(data: CreateMejoraEntity): Promise<MejoraEntity>;
  update(id: string, data: Partial<CreateMejoraEntity>): Promise<MejoraEntity>;
  delete(id: string): Promise<void>;
  uploadFiles(id: string, files: File[]): Promise<void>;
  downloadPdf(id: string): Promise<{ blob: Blob; filename?: string; contentType?: string }>;
  approve(id: string, payload: { aprobadoPorId: string }): Promise<MejoraEntity>;
  search(query: string): Promise<SearchFallecidosRequisitoInhumacionEntity>;
}


