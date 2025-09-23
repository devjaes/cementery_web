"use client";
import { useState } from "react";
import ContainerApp from "@/core/layout/container-app";
import { NichoSearch } from "../components/nicho-search.component";
import { NichoSearchResults } from "../components/nicho-search-results.component";
import { NichoListTable } from "../components/nicho-table.component";
import { useSearchFallecidosQuery } from "../hooks/use-nicho-queries";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Plus, ArrowLeft, Search, Table, Filter } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { NichoFallecidosEntity } from "../../domain/entities/nicho.entity";
import { Badge } from "@/shared/components/ui/badge";

type ViewMode = "search" | "table";

export default function NichoListView() {
  const [viewMode, setViewMode] = useState<ViewMode>("search");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFallecido, setSelectedFallecido] = useState<NichoFallecidosEntity | null>(null);

  const { 
    data: searchResults, 
    isLoading: isSearching, 
    error
  } = useSearchFallecidosQuery(searchTerm);

  const handleSearch = (busqueda: string) => {
    setSearchTerm(busqueda);
    setHasSearched(true);
    setSelectedFallecido(null); // Reset selected fallecido
  };

  const handleNewSearch = () => {
    setSearchTerm("");
    setHasSearched(false);
    setSelectedFallecido(null);
  };

  const handleSelectFallecido = (fallecido: NichoFallecidosEntity) => {
    setSelectedFallecido(fallecido);
  };

  const handleBackToResults = () => {
    setSelectedFallecido(null);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    // Reset search state when switching modes
    if (mode === "table") {
      setSearchTerm("");
      setHasSearched(false);
      setSelectedFallecido(null);
    }
  };

  return (
    <ContainerApp title="Gestión de Nichos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {viewMode === "search" ? "Localización de Fallecidos" : "Lista de Nichos"}
            </h2>
            <p className="text-gray-600 mt-1">
              {viewMode === "search" 
                ? "Busca por cédula, nombres o apellidos del fallecido"
                : "Administra todos los nichos registrados en el sistema"
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Toggle de Vista */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "search" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("search")}
                className="gap-2"
              >
                <Search className="w-4 h-4" />
                Búsqueda
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("table")}
                className="gap-2"
              >
                <Table className="w-4 h-4" />
                Tabla
              </Button>
            </div>

            {/* Botón Nuevo Nicho */}
            <Link href="/nichos/nuevo">
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Nuevo Nicho
              </Button>
            </Link>
          </div>
        </div>

        {/* Indicador de Modo Activo */}
        <div className="flex items-center gap-2">
          <Badge variant={viewMode === "search" ? "default" : "secondary"}>
            {viewMode === "search" ? (
              <>
                <Search className="w-3 h-3 mr-1" />
                Modo Búsqueda
              </>
            ) : (
              <>
                <Filter className="w-3 h-3 mr-1" />
                Modo Tabla
              </>
            )}
          </Badge>
          {viewMode === "search" && (
            <span className="text-sm text-gray-500">
              Busca fallecidos específicos para ver su ubicación
            </span>
          )}
          {viewMode === "table" && (
            <span className="text-sm text-gray-500">
              Vista completa de todos los nichos registrados
            </span>
          )}
        </div>

        {/* Contenido según el modo */}
        {viewMode === "search" ? (
          // MODO BÚSQUEDA
          <>
            {!hasSearched ? (
              // Pantalla de Búsqueda Inicial
              <div className="min-h-[400px] flex items-center justify-center">
                <NichoSearch onSearch={handleSearch} isSearching={isSearching} />
              </div>
            ) : (
              // Resultados de Búsqueda
              <div className="space-y-4">
                {/* Botón para Nueva Búsqueda */}
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={handleNewSearch} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Nueva Búsqueda
                  </Button>
                  {selectedFallecido && searchResults && searchResults.totalEncontrados > 1 && (
                    <Button variant="outline" onClick={handleBackToResults} className="gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Volver a Resultados
                    </Button>
                  )}
                  <div className="text-sm text-gray-600">
                    Resultados para: <span className="font-medium">&quot;{searchTerm}&quot;</span>
                  </div>
                </div>

                {/* Error State */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      No se encontraron fallecidos que coincidan con &quot;{searchTerm}&quot;. 
                      Intenta con otros términos de búsqueda.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Loading State */}
                {isSearching && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Buscando coincidencias...</p>
                  </div>
                )}

                {/* Results */}
                {!isSearching && !error && searchResults && searchResults.totalEncontrados > 0 && (
                  <NichoSearchResults 
                    results={searchResults} 
                    searchTerm={searchTerm}
                    selectedFallecido={selectedFallecido}
                    onSelectFallecido={handleSelectFallecido}
                  />
                )}
              </div>
            )}
          </>
        ) : (
          // MODO TABLA
          <NichoListTable />
        )}
      </div>
    </ContainerApp>
  );
} 