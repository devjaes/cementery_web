export const PROPIETARIO_NICHO_QUERY_KEYS = {
  all: () => ["propietarios-nichos"],
  byId: (id: string) => ["propietarios-nichos", id],
  byNicho: (idNicho: string) => ["propietarios-nichos", "nicho", idNicho],
  byPersona: (idPersona: string) => ["propietarios-nichos", "persona", idPersona],
}; 