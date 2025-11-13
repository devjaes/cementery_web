"use client";

import { MejoraEntity } from "../../../domain/entities/mejora.entity";
import { Badge } from "@/shared/components/ui/badge";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import { FileText, Building, User, UserCheck, Calendar, MapPin } from "lucide-react";
import { formatDate, fullName } from "./formatters";

interface MejoraDetailDialogProps {
  mejora: MejoraEntity;
}

/**
 * Dialog component that displays detailed information about a mejora
 */
export const MejoraDetailDialog = ({ mejora }: MejoraDetailDialogProps) => {
  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Detalle de la Mejora
        </DialogTitle>
        <DialogDescription>
          Código de autorización: {mejora.codigoAutorizacion ?? "N/A"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Estado y tipo de servicio */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Estado:</span>
            <Badge 
              className={mejora.estado === "Aprobado" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""} 
              variant={mejora.estado === "Aprobado" ? "default" : "secondary"}
            >
              {mejora.estado ?? "Sin estado"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Tipo:</span>
            <Badge variant="outline">{mejora.tipoServicio}</Badge>
          </div>
        </div>

        <Separator />

        {/* Información general */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Building className="h-4 w-4" />
            Información General
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Cementerio:</span>
              <p className="font-medium">{mejora.idCementerio?.nombre ?? "N/A"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Panteonero:</span>
              <p className="font-medium">{mejora.panteoneroACargo}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Método solicitud:</span>
              <p className="font-medium capitalize">{mejora.metodoSolicitud}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Entidad:</span>
              <p className="font-medium">{mejora.entidad ?? "N/A"}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Solicitante */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Solicitante
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="col-span-2">
              <span className="text-muted-foreground">Nombre:</span>
              <p className="font-medium">{fullName(mejora.solicitante)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Teléfono:</span>
              <p className="font-medium">{mejora.solicitanteTelefono ?? "N/A"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Correo:</span>
              <p className="font-medium">{mejora.correoSolicitante ?? "N/A"}</p>
            </div>
            {mejora.direccionSolicitante && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Dirección:</span>
                <p className="font-medium">{mejora.direccionSolicitante}</p>
              </div>
            )}
            {mejora.observacionSolicitante && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Observaciones:</span>
                <p className="font-medium">{mejora.observacionSolicitante}</p>
              </div>
            )}
          </div>
        </div>

        {/* Fallecido */}
        {mejora.fallecido && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Fallecido
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2">
                  <span className="text-muted-foreground">Nombre:</span>
                  <p className="font-medium">{fullName(mejora.fallecido)}</p>
                </div>
                {mejora.fechaFallecimiento && (
                  <div>
                    <span className="text-muted-foreground">Fecha fallecimiento:</span>
                    <p className="font-medium">{formatDate(mejora.fechaFallecimiento)}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Programación */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Programación de la Intervención
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Fecha inicio:</span>
              <p className="font-medium">{formatDate(mejora.fechaInicio)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Fecha fin:</span>
              <p className="font-medium">{formatDate(mejora.fechaFin)}</p>
            </div>
            {mejora.horarioTrabajo && (
              <div>
                <span className="text-muted-foreground">Horario:</span>
                <p className="font-medium">{mejora.horarioTrabajo}</p>
              </div>
            )}
            {mejora.observacionServicio && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Observaciones:</span>
                <p className="font-medium">{mejora.observacionServicio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Información del nicho si existe */}
        {(mejora.propietarioNicho || mejora.lugarNicho || mejora.administradorNicho) && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Información del Nicho
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {mejora.propietarioNicho && (
                  <div>
                    <span className="text-muted-foreground">Propietario:</span>
                    <p className="font-medium">{mejora.propietarioNicho}</p>
                  </div>
                )}
                {mejora.administradorNicho && (
                  <div>
                    <span className="text-muted-foreground">Administrador:</span>
                    <p className="font-medium">{mejora.administradorNicho}</p>
                  </div>
                )}
                {mejora.lugarNicho && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Ubicación:</span>
                    <p className="font-medium">{mejora.lugarNicho}</p>
                  </div>
                )}
                {mejora.codigoSitio && (
                  <div>
                    <span className="text-muted-foreground">Código sitio:</span>
                    <p className="font-medium">{mejora.codigoSitio}</p>
                  </div>
                )}
                {mejora.numeroNichos !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Número de nichos:</span>
                    <p className="font-medium">{mejora.numeroNichos}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Fecha de solicitud */}
        <Separator />
        <div className="text-xs text-muted-foreground text-center">
          Fecha de solicitud: {formatDate(mejora.fechaSolicitud)}
        </div>
      </div>
    </DialogContent>
  );
};
