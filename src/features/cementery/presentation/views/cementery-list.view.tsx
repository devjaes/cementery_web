import { CementeryListTable } from "../components/cementery-table.component";
import { CementeryFilters } from "../components/cementery-filters.component";
import ContainerApp from "@/core/layout/container-app";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";

export default function CementeryListView() {
  return (
    <ContainerApp title="Cementerios">
      <h2 className="text-2xl font-bold">Catastro de Cementerio</h2>
      <div className="rounded-lg border bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <Link href="/cementerio/nuevo">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nuevo Cementerio
            </Button>
          </Link>
        </div>
        <CementeryFilters />
      </div>
      <CementeryListTable />
    </ContainerApp>
  );
} 