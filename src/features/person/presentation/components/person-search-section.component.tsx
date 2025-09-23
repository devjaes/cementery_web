import { PersonEntity } from "../../domain/entities/person.entity";
import { PersonSearch } from "./person-search.component";
import { PersonSearchResults } from "./person-search-results.component";
import { PersonDetails } from "./person-details.component";
import { Button } from "@/shared/components/ui/button";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { ArrowLeft } from "lucide-react";

interface PersonSearchSectionProps {
  searchTerm: string;
  hasSearched: boolean;
  selectedPerson: PersonEntity | null;
  searchResults: PersonEntity[] | undefined;
  isSearching: boolean;
  error: Error | null;
  onSearch: (busqueda: string) => void;
  onNewSearch: () => void;
  onSelectPerson: (person: PersonEntity) => void;
  onBackToResults: () => void;
  onPersonDeleted: () => void;
}

export function PersonSearchSection({
  searchTerm,
  hasSearched,
  selectedPerson,
  searchResults,
  isSearching,
  error,
  onSearch,
  onNewSearch,
  onSelectPerson,
  onBackToResults,
  onPersonDeleted
}: PersonSearchSectionProps) {
  if (!hasSearched) {
    // Pantalla de Búsqueda Inicial
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <PersonSearch onSearch={onSearch} isSearching={isSearching} />
      </div>
    );
  }

  // Resultados de Búsqueda
  return (
    <div className="space-y-4">
      {/* Botón para Nueva Búsqueda */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onNewSearch} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Nueva Búsqueda
        </Button>
        {selectedPerson && searchResults && searchResults.length > 1 && (
          <Button variant="outline" onClick={onBackToResults} className="gap-2">
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
            No se encontraron personas que coincidan con &quot;{searchTerm}&quot;. 
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
      {!isSearching && !error && searchResults && searchResults.length > 0 && !selectedPerson && (
        <PersonSearchResults 
          results={{
            terminoBusqueda: searchTerm,
            totalEncontrados: searchResults.length,
            personas: searchResults
          }}
          searchTerm={searchTerm}
          selectedPerson={selectedPerson}
          onSelectPerson={onSelectPerson}
        />
      )}

      {/* Selected Person Details */}
      {selectedPerson && (
        <PersonDetails 
          person={selectedPerson} 
          onDeleted={onPersonDeleted}
        />
      )}
    </div>
  );
}
