import { NichoFallecidosEntity, SearchFallecidosEntity } from "../../domain/entities/nicho.entity";
import { NichosFallecidosModel, SearchFallecidosModel } from "../models/nicho.model";
import { PersonMapper } from "@/features/person/infraestrcture/mappers/person.mapper";
import { NichoMapper } from "./nicho.mapper";
import { CementeryMapper } from "@/features/cementery/infrastructure/mappers/cementery.mapper";
import { HuecoMapper } from "@/features/huecos/infrastructure/mappers/hueco.mapper";

export class NichoFallecidosMapper {
  static toEntity(model: NichosFallecidosModel): NichoFallecidosEntity {
    return {
      fallecido: PersonMapper.toEntity(model.fallecido),
      huecos: model.huecos.map(HuecoMapper.toEntity),
      nichos: model.nichos.map(NichoMapper.toEntity),
      cementerios: model.cementerios.map(CementeryMapper.toEntity),
    };
  }
}

export class SearchFallecidosMapper {
  static toEntity(model: SearchFallecidosModel): SearchFallecidosEntity {
    return {
      terminoBusqueda: model.termino_busqueda,
      totalEncontrados: model.total_encontrados,
      fallecidos: model.fallecidos.map(NichoFallecidosMapper.toEntity),
    };
  }
}