"use client";

import { Building2Icon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { useActiveCemetery } from "../hooks/use-active-cemetery";

export function CemeteryBadge() {
  const { activeCemetery } = useActiveCemetery();

  if (!activeCemetery) return null;

  return (
    <Badge variant="outline" className="gap-1.5 px-2 py-1">
      <Building2Icon className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">{activeCemetery.nombre}</span>
    </Badge>
  );
}
