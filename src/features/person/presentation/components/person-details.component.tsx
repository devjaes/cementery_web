import { PersonEntity } from "../../domain/entities/person.entity";
import { Button } from "@/shared/components/ui/button";
import { Pencil, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PersonDetailsProps {
  person: PersonEntity;
  onDeleted?: () => void;
  onBack?: () => void;
}

export function PersonDetails({ person, onBack }: PersonDetailsProps) {
  return (
    <div className="bg-card border rounded-xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-2">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              {person.nombres} {person.apellidos}
            </h3>
            <p className="text-sm text-muted-foreground">Detalles de la persona</p>
          </div>
        </div>
        <Link href={`/persons/${person.id_persona}/editar`}>
          <Button variant="outline" className="gap-2">
            <Pencil className="w-4 h-4" />
            Editar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <Info label="Cédula" value={person.cedula} />
        <Info
          label="Fecha de Nacimiento"
          value={person.fecha_nacimiento}
        />
        <div>
          <span className="font-semibold text-foreground block mb-1">Estado:</span>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              person.fallecido
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            }`}
          >
            {person.fallecido ? "Fallecido" : "Propietario"}
          </span>
        </div>
        {person.telefono && <Info label="Teléfono" value={person.telefono} />}
        {person.correo && <Info label="Correo" value={person.correo} />}
        {person.nacionalidad && <Info label="Nacionalidad" value={person.nacionalidad} />}
        {person.direccion && <Info label="Dirección" value={person.direccion} full />}

        {/* Datos de fallecimiento */}
        {person.fallecido && (
          <>
            <Divider label="Datos de Defunción" />
            {person.fecha_defuncion && (
              <Info
                label="Fecha de Defunción"
                value={person.fecha_defuncion}
              />
            )}
            {person.lugar_defuncion && (
              <Info label="Lugar de Defunción" value={person.lugar_defuncion} />
            )}
            {person.causa_defuncion && (
              <Info label="Causa de Defunción" value={person.causa_defuncion} full />
            )}
            {person.fecha_inhumacion && (
              <Info
                label="Fecha de Inhumación"
                value={person.fecha_inhumacion}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <span className="font-semibold text-foreground block mb-1">{label}:</span>
      <p className="text-muted-foreground">{value}</p>
    </div>
  );
}


function Divider({ label }: { label: string }) {
  return (
    <div className="md:col-span-2 border-t pt-4 mt-2">
      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}
