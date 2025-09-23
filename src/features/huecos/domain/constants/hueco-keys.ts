export const HUECO_QUERY_KEYS = {
  all: () => ["huecos"],
  byId: (id: string) => ["huecos", id],
  byNicho: (idNicho: string) => ["huecos", "nicho", idNicho],
  byCementerio: (idCementerio: string) => ["huecos", "cementerio", idCementerio],
}; 