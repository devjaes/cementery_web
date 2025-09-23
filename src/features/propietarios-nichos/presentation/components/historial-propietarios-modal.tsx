"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useFindHistorialPropietariosByNichoQuery } from "../hooks/use-propietario-nicho-queries";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { AlertCircle, FileText, User2, BadgeCheck, Calendar } from "lucide-react";
import { PropietarioNichoEntity } from "../../domain/entities/propietario-nicho.entity";

function ActivoChip({ activo }: { activo: boolean }) {
  const color = activo 
    ? "bg-green-100 text-green-700" 
    : "bg-gray-300 text-gray-500";
  const texto = activo ? "Activo" : "Inactivo";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{texto}</span>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

interface HistorialPropietariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  nichoId: string;
  nichoInfo?: string;
}

export function HistorialPropietariosModal({ 
  isOpen, 
  onClose, 
  nichoId, 
  nichoInfo = "Nicho"
}: HistorialPropietariosModalProps) {
  const { data: historial, isLoading, error } = useFindHistorialPropietariosByNichoQuery(nichoId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="!max-w-none !w-[98vw] max-h-[95vh] h-[95vh] overflow-hidden flex flex-col p-6" 
        style={{ width: '98vw', maxWidth: '98vw' }}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-6 h-6" />
            Historial de Propietarios - {nichoInfo}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto border rounded-lg">
          <div className="min-w-[1200px]">
            <Table>
            <TableHeader>
              <TableRow className="text-sm">
                <TableHead className="w-[220px] font-semibold"><span className="flex items-center gap-1"><User2 className="w-4 h-4" />Propietario</span></TableHead>
                <TableHead className="w-[140px] font-semibold"><span className="flex items-center gap-1"><FileText className="w-4 h-4" />Tipo Doc.</span></TableHead>
                <TableHead className="w-[140px] font-semibold"><span className="flex items-center gap-1"><FileText className="w-4 h-4" />Núm. Doc.</span></TableHead>
                <TableHead className="w-[150px] font-semibold"><span className="flex items-center gap-1"><Calendar className="w-4 h-4" />F. Adquisición</span></TableHead>
                <TableHead className="w-[120px] font-semibold"><span className="flex items-center gap-1"><BadgeCheck className="w-4 h-4" />Estado</span></TableHead>
                <TableHead className="w-[120px] font-semibold"><span className="flex items-center gap-1">Tipo</span></TableHead>
                <TableHead className="w-[250px] font-semibold"><span className="flex items-center gap-1">Razón</span></TableHead>
                <TableHead className="w-[150px] font-semibold"><span className="flex items-center gap-1"><Calendar className="w-4 h-4" />F. Registro</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Cargando historial...</TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={8} className="text-red-500 text-center py-8">
                    {error instanceof Error ? error.message : "Error al cargar el historial"}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && historial && historial.length === 0 && (
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
                ?.map((propietario: PropietarioNichoEntity) => (
                <TableRow key={propietario.idPropietarioNicho} className={!propietario.activo ? "opacity-75" : ""}>
                  <TableCell className="font-medium">
                    {`${propietario.idPersona?.nombres} ${propietario.idPersona?.apellidos}`}
                  </TableCell>
                  <TableCell>{propietario.tipoDocumento}</TableCell>
                  <TableCell>{propietario.numeroDocumento}</TableCell>
                  <TableCell>{formatDate(propietario.fechaAdquisicion)}</TableCell>
                  <TableCell><ActivoChip activo={propietario.activo} /></TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      propietario.tipo === 'Dueño' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {propietario.tipo}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-48 truncate" title={propietario.razon}>
                    {propietario.razon}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(propietario.fechaCreacion)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 