"use client";
import { FormProvider } from "react-hook-form";
import { CementeryEntity } from "../../domain/entities/cementery.entity";
import { Button } from "@/shared/components/ui/button";
import RHFInput from "@/shared/components/form/rhf/rhf-input";
import { useCementeryForm } from "../hooks/use-cementery-form";
import clsx from "clsx";

interface CementeryFormProps {
  cementery?: CementeryEntity;
}

export function CementeryForm({ cementery }: CementeryFormProps) {
  const { methods, onSubmit, isPending } = useCementeryForm(cementery);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RHFInput name="nombre" label="Nombre" />
          <RHFInput name="direccion" label="Dirección" />
          <RHFInput name="telefono" label="Teléfono" />
          <RHFInput name="responsable" label="Responsable" />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" className={
            clsx(
              "px-8",
              isPending && "opacity-50 cursor-not-allowed"
            )
          } disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
} 