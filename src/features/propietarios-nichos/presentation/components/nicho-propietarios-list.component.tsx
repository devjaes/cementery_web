"use client";
import { useFindPropietariosByNichoQuery } from "../hooks/use-propietario-nicho-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { AlertCircle, FileText, User2, BadgeCheck, History } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
// import { useDeletePropietarioNichoMutation } from "../hooks/use-propietario-nicho-mutations";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";
import { useState } from "react";
import { useFindHistorialPropietariosByNichoQuery } from "../hooks/use-propietario-nicho-queries";
// import clsx from "clsx";

function ActivoChip({ activo }: { activo: boolean }) {
  const color = activo 
    ? "bg-green-100 text-green-700" 
    : "bg-gray-300 text-gray-500";
  const texto = activo ? "Activo" : "Inactivo";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{texto}</span>
  );
}

interface NichoPropietariosListProps {
  nichoId: string;
  nichoInfo?: string;
}

export function NichoPropietariosList({ nichoId, nichoInfo }: NichoPropietariosListProps) {
  const { data: propietarios, isLoading, error } = useFindPropietariosByNichoQuery(nichoId);
  // const { mutate: deletePropietario, isPending } = useDeletePropietarioNichoMutation();
  const { data: historial, isLoading: loadingHistorial, error: errorHistorial } = useFindHistorialPropietariosByNichoQuery(nichoId);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Propietario Actual</h3>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead><span className="flex items-center gap-1"><User2 className="w-4 h-4" />Propietario</span></TableHead>
            <TableHead><span className="flex items-center gap-1"><FileText className="w-4 h-4" />Tipo Documento</span></TableHead>
            <TableHead><span className="flex items-center gap-1"><FileText className="w-4 h-4" />Número Documento</span></TableHead>
            <TableHead><span className="flex items-center gap-1"><BadgeCheck className="w-4 h-4" />Estado</span></TableHead>
            <TableHead><span className="flex items-center gap-1">Tipo</span></TableHead>
            {/* <TableHead><span className="flex items-center gap-1">Acciones</span></TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5}>Cargando...</TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={5} className="text-red-500">
                {error instanceof Error ? error.stack : "Error desconocido"}
              </TableCell>
            </TableRow>
          )}
          {!isLoading && propietarios && propietarios.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mb-1 text-gray-400" />
                  <span className="text-base md:text-lg font-medium">No existen propietarios registrados para este nicho.</span>
                </div>
              </TableCell>
            </TableRow>
          )}
          {propietarios?.map((propietario) => (
            <TableRow key={propietario.idPropietarioNicho}>
              <TableCell>{`${propietario.idPersona?.nombres} ${propietario.idPersona?.apellidos}`}</TableCell>
              <TableCell>{propietario.tipoDocumento}</TableCell>
              <TableCell>{propietario.numeroDocumento}</TableCell>
              <TableCell><ActivoChip activo={propietario.activo} /></TableCell>
              <TableCell>{propietario.tipo}</TableCell>
              {/* <TableCell>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar propietario?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. ¿Deseas eliminar este propietario?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deletePropietario(propietario.idPropietarioNicho)}
                          disabled={isPending}
                          className={clsx(
                            "px-8 bg-red-500 hover:bg-red-600",
                            isPending && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    {/* Historial mostrado en línea (ya no en modal) */}
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Historial de Propietarios</h3>
      <div className="overflow-auto border rounded-lg">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader>
              <TableRow className="text-sm">
                <TableHead className="w-[220px] font-semibold">Propietario</TableHead>
                <TableHead className="w-[140px] font-semibold">Tipo Doc.</TableHead>
                <TableHead className="w-[140px] font-semibold">Núm. Doc.</TableHead>
                <TableHead className="w-[150px] font-semibold">F. Adquisición</TableHead>
                <TableHead className="w-[120px] font-semibold">Estado</TableHead>
                <TableHead className="w-[120px] font-semibold">Tipo</TableHead>
                <TableHead className="w-[250px] font-semibold">Razón</TableHead>
                <TableHead className="w-[150px] font-semibold">F. Registro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingHistorial && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Cargando historial...</TableCell>
                </TableRow>
              )}
              {errorHistorial && (
                <TableRow>
                  <TableCell colSpan={8} className="text-red-500 text-center py-8">{errorHistorial instanceof Error ? errorHistorial.message : 'Error al cargar historial'}</TableCell>
                </TableRow>
              )}
              {!loadingHistorial && historial && historial.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <AlertCircle className="w-12 h-12 mb-1 text-gray-400" />
                      <span className="text-base md:text-lg font-medium">No existe historial de propietarios para este nicho.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {historial
                ?.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
                ?.map((propietario) => (
                  <TableRow key={propietario.idPropietarioNicho} className={
                    propietario.activo && (propietario.tipo === 'Dueño' || propietario.tipo === 'Heredero') ? 'bg-emerald-50 ring-1 ring-emerald-100' : (!propietario.activo ? 'opacity-75' : '')
                  }>
                    <TableCell className="font-medium">{`${propietario.idPersona?.nombres} ${propietario.idPersona?.apellidos}`}</TableCell>
                    <TableCell>{propietario.tipoDocumento}</TableCell>
                    <TableCell>{propietario.numeroDocumento}</TableCell>
                    <TableCell>{propietario.fechaAdquisicion ? new Date(propietario.fechaAdquisicion).toLocaleDateString('es-ES') : ''}</TableCell>
                    <TableCell><ActivoChip activo={propietario.activo} /></TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${propietario.tipo === 'Dueño' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {propietario.tipo}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-48 truncate" title={propietario.razon}>{propietario.razon}</TableCell>
                    <TableCell className="text-sm text-gray-500">{propietario.fechaCreacion ? new Date(propietario.fechaCreacion).toLocaleDateString('es-ES') : ''}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </>
  );
} 