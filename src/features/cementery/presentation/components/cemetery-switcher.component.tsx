"use client";

import { Building2Icon, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useActiveCemetery } from "../hooks/use-active-cemetery";
import { useFindAllCementeriesQuery } from "../hooks/use-cementery-queries";
import { CementeryEntity } from "../../domain/entities/cementery.entity";

export function CemeterySwitcher() {
  const { activeCemetery, setActiveCemetery } = useActiveCemetery();
  const { data: cemeteries, isLoading } = useFindAllCementeriesQuery();

  const handleSelectCemetery = (cemetery: CementeryEntity) => {
    setActiveCemetery(cemetery);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
        <Building2Icon className="h-4 w-4" />
        <span>Cargando...</span>
      </div>
    );
  }

  if (!activeCemetery) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
        <Building2Icon className="h-4 w-4" />
        <span>Sin cementerio</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between gap-2 px-2 h-auto py-1.5"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Building2Icon className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium truncate">
              {activeCemetery.nombre}
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        <DropdownMenuLabel>Cambiar cementerio</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {cemeteries?.map((cemetery) => (
          <DropdownMenuItem
            key={cemetery.idCementerio}
            onClick={() => handleSelectCemetery(cemetery)}
            className="gap-2"
          >
            <Check
              className={`h-4 w-4 ${
                cemetery.idCementerio === activeCemetery.idCementerio
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            />
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="text-sm font-medium truncate">
                {cemetery.nombre}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {cemetery.direccion}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
