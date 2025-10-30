"use client";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { RequisitoInhumacionFallecidosEntity } from "../../domain/entities/requisito-inhumacion.entity";
import { useSearchRequisitoInhumacionFallecidosQuery } from "../hooks/use-requisito-inhumacion-queries";
import { RequisitoInhumacionSearch } from "../components/requisito-inhumacion-search.component";
import { RequisitoInhumacionSearchResults } from "../components/requisito-inhumacion-search-results.component";
import { useDownloadRequisitoInhumacionPdfMutation } from "../hooks/use-requisito-inhumacion-mutation";
import { useRouter } from "next/navigation";

export default function InhumacionListView() {
 const [searchTerm, setSearchTerm] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFallecido, setSelectedFallecido] = useState<RequisitoInhumacionFallecidosEntity | null>(null);
  const params = useSearchParams();
  const router = useRouter();
  const { mutate: downloadRequisitoPdf, isPending: isDownloading } = useDownloadRequisitoInhumacionPdfMutation();

  const {
    data: searchResults,
    isLoading: isSearching,
    error
  } = useSearchRequisitoInhumacionFallecidosQuery(searchTerm);

  useEffect(() => {
    const q = params?.get("q");
    if (q) {
      setSearchTerm(q);
      setHasSearched(true);
    }
    // Auto-download behavior: if autoDownloadId is present, trigger download and remove param
    const autoId = params?.get("autoDownloadId");
    if (autoId) {
      // Trigger download
      try {
        downloadRequisitoPdf(autoId);
      } catch (e) {
        console.warn("Auto-download failed:", e);
      }
      // Remove autoDownloadId from URL without refreshing the page
      const searchParams = new URLSearchParams(Array.from(params.entries()));
      searchParams.delete("autoDownloadId");
      const qPart = searchParams.toString();
      router.replace(qPart ? `/requisitos-inhumacion?${qPart}` : `/requisitos-inhumacion`);
    }
  }, [params]);

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
  
    const handleSelectFallecido = (fallecido: RequisitoInhumacionFallecidosEntity) => {
      setSelectedFallecido(fallecido);
    };
  
    const handleBackToResults = () => {
      setSelectedFallecido(null);
    };
  return (
    <ContainerApp title="Búsqueda de Requisitos de Inhumaciones">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Localización de Fallecidos</h2>
            <p className="text-gray-600 mt-1">
              Busca por cédula, nombres o apellidos del fallecido
            </p>
          </div>
          <Link href="/requisitos-inhumacion/nuevo">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nuevo Registro
            </Button>
          </Link>
        </div>

        {/* Contenido Principal */}
        {!hasSearched ? (
          // Pantalla de Búsqueda Inicial
          <div className="min-h-[400px] flex items-center justify-center">
            <RequisitoInhumacionSearch onSearch={handleSearch} isSearching={isSearching} />
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
              <RequisitoInhumacionSearchResults 
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
