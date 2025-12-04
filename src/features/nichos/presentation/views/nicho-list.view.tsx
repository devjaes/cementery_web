"use client";
import { useState, useMemo } from "react";
import ContainerApp from "@/core/layout/container-app";
import { NichoSearchBar } from "../components/nicho-search-bar.component";

type NichoSearchFilters = {
  cementerio?: string;
  fila?: string;
  numero?: string;
};
import { NichoSearchResults } from "../components/nicho-search-results.component";

type SearchType = "fallecido" | "nicho";
import { NichoListTable } from "../components/nicho-table.component";
import { NichoForm } from "../components/nicho-form.component";
import { useSearchFallecidosQuery, useFindAllNichosQuery, useFindNichoByIdQuery } from "../hooks/use-nicho-queries";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { NichoFallecidosEntity, NichoEntity } from "../../domain/entities/nicho.entity";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { NICHO_QUERY_KEYS } from "../../domain/constants/nicho-keys";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Eye, Pencil, Trash2, AlertCircle } from "lucide-react";
import { StatusChip } from "../utils/nichos-status-chip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { useDeleteNichoMutation } from "../hooks/use-nicho-mutations";
import clsx from "clsx";

export default function NichoListView() {
  const [searchType, setSearchType] = useState<SearchType>("fallecido");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [nichoFilters, setNichoFilters] = useState<NichoSearchFilters | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFallecido, setSelectedFallecido] = useState<NichoFallecidosEntity | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNichoId, setEditingNichoId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: fallecidosResults,
    isLoading: isSearchingFallecidos,
    error: fallecidosError
  } = useSearchFallecidosQuery(searchTerm);

  const {
    data: allNichos,
    isLoading: isLoadingNichos
  } = useFindAllNichosQuery();

  // Filter nichos based on search criteria
  const filteredNichos = useMemo(() => {
    if (!nichoFilters || !allNichos) return allNichos;

    return allNichos.filter((nicho) => {
      const matchesCementerio = !nichoFilters.cementerio ||
        String(nicho.idCementerio?.nombre ?? '').toLowerCase().includes(nichoFilters.cementerio.toLowerCase());

      const matchesFila = !nichoFilters.fila ||
        String(nicho.fila ?? '').toLowerCase().includes(nichoFilters.fila.toLowerCase());

      const matchesNumero = !nichoFilters.numero ||
        String(nicho.columna ?? '').toLowerCase().includes(nichoFilters.numero.toLowerCase());

      return matchesCementerio && matchesFila && matchesNumero;
    });
  }, [allNichos, nichoFilters]);

  const handleSearchFallecido = (busqueda: string) => {
    setSearchTerm(busqueda);
    setHasSearched(true);
    setSelectedFallecido(null);
    setNichoFilters(null);
  };

  const handleSearchNicho = (filters: NichoSearchFilters) => {
    setNichoFilters(filters);
    setHasSearched(true);
    setSearchTerm("");
    setSelectedFallecido(null);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setNichoFilters(null);
    setHasSearched(false);
    setSelectedFallecido(null);
  };

  const handleSelectFallecido = (fallecido: NichoFallecidosEntity) => {
    setSelectedFallecido(fallecido);
  };

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type);
    handleClearSearch();
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
  };

  const handleEditSuccess = () => {
    setEditingNichoId(null);
    queryClient.invalidateQueries({ queryKey: NICHO_QUERY_KEYS.all() });
  };

  const handleEditClick = (id: string) => {
    setEditingNichoId(id);
  };

  const isSearching = searchType === "fallecido" ? isSearchingFallecidos : isLoadingNichos;

  // Cast the imported component to any to allow passing extra prop names not present in its TS props type
  const SearchBar = NichoSearchBar as unknown as any;

  return (
  <ContainerApp title="Gestión de Nichos">
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Gestión de Nichos
          </h2>
          <p className="text-muted-foreground mt-1">
            Administra nichos y busca la ubicación de fallecidos
          </p>
        </div>
      </div>

      {/* 👉 SI NO HA BUSCADO: MOSTRAR SOLO EL BUSCADOR */}
      {!hasSearched ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <SearchBar
            onSearchFallecido={handleSearchFallecido}
            onSearchNicho={handleSearchNicho}
            onClear={handleClearSearch}
            isSearching={isSearching}
            searchTerm={searchTerm}
            searchType={searchType}
            onSearchTypeChange={handleSearchTypeChange}
          />
        </div>
      ) : (
        /* 👉 SI YA BUSCÓ: MOSTRAR RESULTADOS + BOTÓN */
        <div className="space-y-4">

          {/* 🔙 Botón para nueva búsqueda */}
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleClearSearch} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Nueva búsqueda
            </Button>

            <div className="text-sm text-muted-foreground">
              Resultados para: <span className="font-medium">"{searchTerm}"</span>
            </div>
          </div>

          {/* 👉 Resultados cuando busca por fallecido */}
          {searchType === "fallecido" && searchTerm && (
            <div className="space-y-4">
              {fallecidosError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    No se encontraron fallecidos que coincidan con "{searchTerm}".
                  </AlertDescription>
                </Alert>
              )}

              {isSearchingFallecidos && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Buscando coincidencias...</p>
                </div>
              )}

              {!isSearchingFallecidos &&
                !fallecidosError &&
                fallecidosResults &&
                fallecidosResults.totalEncontrados > 0 && (
                  <NichoSearchResults
                    results={fallecidosResults}
                    searchTerm={searchTerm}
                    selectedFallecido={selectedFallecido}
                    onSelectFallecido={handleSelectFallecido}
                  />
                )}
            </div>
          )}

          {/* 👉 Resultados cuando busca por nicho (tabla oculta) */}
          {searchType === "nicho" && nichoFilters && (
            <p className="text-center text-muted-foreground">
              Resultados disponibles, pero la tabla está oculta temporalmente.
            </p>
          )}
        </div>
      )}

      {/* ---------------- MODALES (NO TOCADO) ---------------- */}

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Nicho</DialogTitle>
          </DialogHeader>
          {isCreateModalOpen && (
            <NichoForm key="create" onSuccess={handleCreateSuccess} />
          )}
        </DialogContent>
      </Dialog>

      {editingNichoId && (
        <NichoEditModal
          nichoId={editingNichoId}
          open={!!editingNichoId}
          onOpenChange={(open) => !open && setEditingNichoId(null)}
          onSuccess={handleEditSuccess}
        />
      )}

    </div>
  </ContainerApp>
);


// Modal for editing nicho
function NichoEditModal({
  nichoId,
  open,
  onOpenChange,
  onSuccess,
}: {
  nichoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const { data: nicho, isLoading } = useFindNichoByIdQuery(nichoId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Nicho</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Cargando...</div>
        ) : nicho ? (
          <NichoForm nicho={nicho} onSuccess={onSuccess} />
        ) : (
          <div className="text-center py-8 text-destructive">
            No se encontró el nicho.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


{/* Edit Modal 
// Component for filtered nichos results
function FilteredNichosTable({ nichos, isLoading, onEditClick }: { nichos: NichoEntity[] | undefined; isLoading: boolean; onEditClick: (id: string) => void }) {
  const { mutate: deleteNicho, isPending } = useDeleteNichoMutation();

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Resultados ({nichos?.length ?? 0})
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cementerio</TableHead>
              <TableHead>Fila</TableHead>
              <TableHead>Columna</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando...</p>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && (!nichos || nichos.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mb-1" />
                    <span className="text-base md:text-lg font-medium">
                      No se encontraron nichos con los criterios especificados.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {nichos?.map((nicho) => (
              <TableRow key={nicho.idNicho}>
                <TableCell className="font-medium">{nicho.idCementerio?.nombre || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{nicho.fila}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{nicho.columna}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{nicho.tipo}</Badge>
                </TableCell>
                <TableCell>
                  <StatusChip estado={nicho.estado} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {nicho.estadoVenta === 'Deshabilitado' ? (
                      <Button 
                        size="icon" 
                        variant="ghost"
                        disabled
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Link href={`/nichos/${nicho.idNicho}`}>
                        <Button 
                          size="icon" 
                          variant="ghost"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEditClick(nicho.idNicho!)}
                      disabled={nicho.estadoVenta === 'Deshabilitado'}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          disabled={nicho.estadoVenta === 'Deshabilitado'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar nicho?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. ¿Deseas eliminar este nicho?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteNicho(nicho.idNicho!)}
                            disabled={isPending}
                            className={clsx(
                              "px-8 bg-destructive hover:bg-destructive/90",
                              isPending && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} */}