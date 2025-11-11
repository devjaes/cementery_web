"use client";
import { FormProvider } from "react-hook-form";
import { CementeryEntity } from "../../domain/entities/cementery.entity";
import { Button } from "@/shared/components/ui/button";
import RHFInput from "@/shared/components/form/rhf/rhf-input";
import { useCementeryForm } from "../hooks/use-cementery-form";
import clsx from "clsx";

interface CementeryFormProps {
  cementery?: CementeryEntity;
  onSuccess?: () => void;
}

export function CementeryForm({ cementery, onSuccess }: CementeryFormProps) {
  const { methods, onSubmit, isPending } = useCementeryForm({ cementery, onSuccess });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RHFInput name="nombre" label="Nombre" placeholder="Nombre del cementerio" required />
          <RHFInput name="direccion" label="Dirección" placeholder="Dirección del cementerio" required />
          <RHFInput name="telefono" label="Teléfono" placeholder="Teléfono del cementerio" required type="tel" />
          <RHFInput name="responsable" label="Responsable" placeholder="Responsable del cementerio" required />
        </div>
        <div className="flex justify-end">
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