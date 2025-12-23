export const NICHO_QUERY_KEYS = {
  all: (idCementerio?: string) => ["nichos", idCementerio],
  byId: (id: string) => ["nichos", id],
  byCedulaFallecido: (cedula: string) => ["nichos", "cedula-fallecido", cedula],
  searchFallecidos: (busqueda: string) => [
    "nichos",
    "search-fallecidos",
    busqueda,
  ],
};
