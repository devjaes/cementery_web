import { PersonEntity } from "../../domain/entities/person.entity";
import { Button } from "@/shared/components/ui/button";
import {
  Pencil,
  IdCard,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Globe,
  Heart,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { DateFormatter } from "@/shared/lib/date-formatter";
import clsx from "clsx";

interface PersonDetailsProps {
  person: PersonEntity;
  onDeleted?: () => void;
  onEdit?: () => void;
}

export function PersonDetails({ person, onEdit }: PersonDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 pb-4 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h3 className="text-xl font-bold text-foreground">
              {person.nombres} {person.apellidos}
            </h3>
            <Badge
              variant={person.fallecido ? "destructive" : "default"}
              className={clsx(
                "w-fit",
                person.fallecido
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              {person.fallecido ? "Fallecido" : "Propietario"}
            </Badge>
          </div>
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 shrink-0"
              onClick={onEdit}
            >
              <Pencil className="w-4 h-4" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Información Personal
          </h4>
          <div className="space-y-3">
            <InfoItem
              icon={<IdCard className="w-4 h-4" />}
              label="Cédula"
              value={person.cedula}
            />
            <InfoItem
              icon={<Calendar className="w-4 h-4" />}
              label="Fecha de Nacimiento"
              value={DateFormatter.toLocaleDateString(person.fecha_nacimiento)}
            />
            {person.nacionalidad && (
              <InfoItem
                icon={<Globe className="w-4 h-4" />}
                label="Nacionalidad"
                value={person.nacionalidad}
              />
            )}
          </div>
        </div>

        <div className="border-t pt-5 space-y-3">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Información de Contacto
          </h4>
          <div className="space-y-3">
            {person.telefono ? (
              <InfoItem
                icon={<Phone className="w-4 h-4" />}
                label="Teléfono"
                value={person.telefono}
              />
            ) : (
              <EmptyField label="Teléfono" />
            )}
            {person.correo ? (
              <InfoItem
                icon={<Mail className="w-4 h-4" />}
                label="Correo Electrónico"
                value={person.correo}
              />
            ) : (
              <EmptyField label="Correo Electrónico" />
            )}
            {person.direccion ? (
              <InfoItem
                icon={<MapPin className="w-4 h-4" />}
                label="Dirección"
                value={person.direccion}
              />
            ) : (
              <EmptyField label="Dirección" />
            )}
          </div>
        </div>

        {person.fallecido && (
          <div className="border-t pt-5 space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Datos de Defunción
            </h4>
            <div className="space-y-3">
              {person.fecha_defuncion && (
                <InfoItem
                  icon={<Calendar className="w-4 h-4" />}
                  label="Fecha de Defunción"
                  value={DateFormatter.toLocaleDateString(
                    person.fecha_defuncion
                  )}
                />
              )}
              {person.lugar_defuncion && (
                <InfoItem
                  icon={<MapPin className="w-4 h-4" />}
                  label="Lugar de Defunción"
                  value={person.lugar_defuncion}
                />
              )}
              {person.causa_defuncion && (
                <InfoItem
                  icon={<Heart className="w-4 h-4" />}
                  label="Causa de Defunción"
                  value={person.causa_defuncion}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-1">
      <div className="text-muted-foreground mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-foreground break-words leading-relaxed">
          {value}
        </p>
      </div>
    </div>
  );
}

function EmptyField({ label }: { label: string }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <div className="text-muted-foreground/30 mt-0.5 flex-shrink-0">
        <div className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-muted-foreground/70 italic">No registrado</p>
      </div>
    </div>
  );
}
