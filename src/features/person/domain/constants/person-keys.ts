export const PERSON_QUERY_KEYS = {
  all: () => ["personas"],
  byId: (id: string) => ["personas", id],
  search: (query?: string, vivos?: boolean) => ["personas", "search", query, vivos],
}
