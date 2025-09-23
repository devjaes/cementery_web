"use client";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { InhumacionFallecidosEntity } from "../../domain/entities/inhumacion.entity";
import { useSearchInhumacionFallecidosQuery } from "../hooks/use-inhumacion-queries";
import { InhumacionSearch } from "../components/inhumacion-search.component";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { InhumacionSearchResults } from "../components/inhumacion-search-results.component";

export default function InhumacionListView() {
 const [searchTerm, setSearchTerm] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFallecido, setSelectedFallecido] = useState<InhumacionFallecidosEntity | null>(null);

  const {
    data: searchResults,
    isLoading: isSearching,
    error
  } = useSearchInhumacionFallecidosQuery(searchTerm);

  
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
  
    const handleSelectFallecido = (fallecido: InhumacionFallecidosEntity) => {
      setSelectedFallecido(fallecido);
    };
  
    const handleBackToResults = () => {
      setSelectedFallecido(null);
    };
  return (
    <ContainerApp title="Búsqueda de Inhumaciones">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Localización de Fallecidos</h2>
            <p className="text-gray-600 mt-1">
              Busca por cédula, nombres o apellidos del fallecido
            </p>
          </div>
          <Link href="/inhumaciones/nuevo">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nueva Inhumación
            </Button>
          </Link>
        </div>

        {/* Contenido Principal */}
        {!hasSearched ? (
          // Pantalla de Búsqueda Inicial
          <div className="min-h-[400px] flex items-center justify-center">
            <InhumacionSearch onSearch={handleSearch} isSearching={isSearching} />
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
              <InhumacionSearchResults 
                results={searchResults} 
                searchTerm={searchTerm}
                selectedFallecido={selectedFallecido}
                onSelectFallecido={handleSelectFallecido}
              />
            )}
          </div>
        )}
      </div>
    </ContainerApp>
  );
}
