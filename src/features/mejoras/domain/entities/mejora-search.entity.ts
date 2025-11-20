import { PersonEntity } from "@/features/person/domain/entities/person.entity";
import { PropietarioNichoEntity } from "@/features/propietarios-nichos/domain/entities/propietario-nicho.entity";
import { SearchFallecidosRequisitoInhumacionEntity } from "@/features/requisitos-inhumacion/domain/entities/requisito-inhumacion.entity";

export interface PropietarioNichoSearchResult {
  propietario: PersonEntity;
  nichos: PropietarioNichoEntity[];
}

export interface MejoraSearchAllResultsEntity {
  terminoBusqueda: string;
  fallecidos: SearchFallecidosRequisitoInhumacionEntity;
  propietarios: PropietarioNichoSearchResult[];
}
