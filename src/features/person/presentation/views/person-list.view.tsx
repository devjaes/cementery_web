"use client";
import { useState } from "react";
import ContainerApp from "@/core/layout/container-app";
import { PersonViewHeader } from "../components/person-view-header.component";
import { PersonListTable } from "../components/person-table.component";
import { PersonSearchBar } from "../components/person-search-bar.component";
import { PersonDetails } from "../components/person-details.component";
import { PersonForm } from "../components/person-form.component";
import { useSearchPersonsQuery, useFindAllPersonsQuery, useFindPersonByIdQuery } from "../hooks/use-person-queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { PERSON_QUERY_KEYS } from "../../domain/constants/person-keys";

export default function PersonListView() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingPersonId, setViewingPersonId] = useState<string | null>(null);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError
  } = useSearchPersonsQuery(searchTerm);

  const {
    data: allPersons,
    isLoading: isLoadingAll
  } = useFindAllPersonsQuery();

  const handleSearch = (busqueda: string) => {
    setSearchTerm(busqueda);
    setHasSearched(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setHasSearched(false);
  };

  const handleViewPerson = (id: string) => {
    setViewingPersonId(id);
  };

  const handleEditPerson = (id: string) => {
    setEditingPersonId(id);
    setViewingPersonId(null);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    queryClient.invalidateQueries({ queryKey: PERSON_QUERY_KEYS.all() });
  };

  const handleEditSuccess = () => {
    setEditingPersonId(null);
    queryClient.invalidateQueries({ queryKey: PERSON_QUERY_KEYS.all() });
  };

  const displayData = hasSearched && searchTerm ? searchResults : allPersons;
  const isLoading = hasSearched && searchTerm ? isSearching : isLoadingAll;
  const hasError = hasSearched && searchTerm ? !!searchError : false;

  return (
    <ContainerApp title="Gestión de Personas">
      <div className="space-y-6">
        <PersonViewHeader onNewPersonClick={() => setIsCreateModalOpen(true)} />

        <PersonSearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          isSearching={isSearching}
          searchTerm={searchTerm}
        />

        <PersonListTable
          persons={displayData}
          isLoading={isLoading}
          hasError={hasError}
          searchTerm={hasSearched ? searchTerm : undefined}
          onViewPerson={handleViewPerson}
          onEditPerson={handleEditPerson}
        />

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-[90vw] sm:max-w-5xl max-h-[90vh] overflow-y-auto w-full">
            <DialogHeader>
              <DialogTitle>Registrar Persona</DialogTitle>
            </DialogHeader>
            {isCreateModalOpen && (
              <PersonForm key="create" onSuccess={handleCreateSuccess} />
            )}
          </DialogContent>
        </Dialog>

        {viewingPersonId && (
          <PersonViewModal
            personId={viewingPersonId}
            open={!!viewingPersonId}
            onOpenChange={(open) => !open && setViewingPersonId(null)}
            onEdit={handleEditPerson}
          />
        )}

        {editingPersonId && (
          <PersonEditModal
            personId={editingPersonId}
            open={!!editingPersonId}
            onOpenChange={(open) => !open && setEditingPersonId(null)}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </ContainerApp>
  );
}

function PersonViewModal({
  personId,
  open,
  onOpenChange,
  onEdit,
}: {
  personId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (id: string) => void;
}) {
  const { data: person, isLoading } = useFindPersonByIdQuery(personId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[50vw] sm:max-w-xl max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle>Detalles de la Persona</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Cargando...</div>
        ) : person ? (
          <PersonDetails
            person={person}
            onEdit={() => onEdit?.(personId)}
          />
        ) : (
          <div className="text-center py-8 text-destructive">
            No se encontró la persona.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PersonEditModal({
  personId,
  open,
  onOpenChange,
  onSuccess,
}: {
  personId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const { data: person, isLoading } = useFindPersonByIdQuery(personId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-5xl max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle>Editar Persona</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Cargando...</div>
        ) : person ? (
          <PersonForm person={person} onSuccess={onSuccess} />
        ) : (
          <div className="text-center py-8 text-destructive">
            No se encontró la persona.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
