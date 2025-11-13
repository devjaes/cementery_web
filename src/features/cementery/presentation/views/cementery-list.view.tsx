"use client";

import { useState } from "react";
import { CementeryListTable } from "../components/cementery-table.component";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { CementeryForm } from "../components/cementery-form.component";
import { useFindCementeryByIdQuery } from "../hooks/use-cementery-queries";
import { useQueryClient } from "@tanstack/react-query";
import { CEMENTERY_QUERY_KEYS } from "../../domain/constants/cementery-keys";

export default function CementeryListView() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCementeryId, setEditingCementeryId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    queryClient.invalidateQueries({ queryKey: CEMENTERY_QUERY_KEYS.all() });
  };

  const handleEditSuccess = () => {
    setEditingCementeryId(null);
    queryClient.invalidateQueries({ queryKey: CEMENTERY_QUERY_KEYS.all() });
  };

  const handleEditClick = (id: string) => {
    setEditingCementeryId(id);
  };

  return (
    <ContainerApp title="Cementerios">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Catastro de Cementerio</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Administra los cementerios registrados en el sistema
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Cementerio
          </Button>
        </div>
        <CementeryListTable onEditClick={handleEditClick} />

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Cementerio</DialogTitle>
            </DialogHeader>
            {isCreateModalOpen && (
              <CementeryForm key="create" onSuccess={handleCreateSuccess} />
            )}
          </DialogContent>
        </Dialog>

        {editingCementeryId && (
          <CementeryEditModal
            cementeryId={editingCementeryId}
            open={!!editingCementeryId}
            onOpenChange={(open) => !open && setEditingCementeryId(null)}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </ContainerApp>
  );
}

function CementeryEditModal({
  cementeryId,
  open,
  onOpenChange,
  onSuccess,
}: {
  cementeryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const { data: cementery, isLoading } = useFindCementeryByIdQuery(cementeryId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Cementerio</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Cargando...</div>
        ) : cementery ? (
          <CementeryForm cementery={cementery} onSuccess={onSuccess} />
        ) : (
          <div className="text-center py-8 text-destructive">
            No se encontró el cementerio.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 