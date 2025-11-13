export const BLOQUES_QUERY_KEYS = {
  all: () => ["bloques"],
  byId: (id: string) => ["bloques", id],
  byCementery: (idCementerio: string) => ["bloques", "cementerio", idCementerio],
};
