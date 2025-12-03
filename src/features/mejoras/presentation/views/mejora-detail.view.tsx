"use client";
import { useRouter } from "next/navigation";
import ContainerApp from "@/core/layout/container-app";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { ArrowLeft, Check, Loader2, Edit } from "lucide-react";
import Link from "next/link";
import { useFindMejoraByIdQuery } from "../hooks/use-mejora-queries";
import { useApproveMejoraMutation } from "../hooks/use-mejora-mutation";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";
const DOCUMENT_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "").replace(/\/$/, "");
const buildDocumentUrl = (relative: string) => (relative ? `${DOCUMENT_BASE_URL}${relative}` : relative);

export default function MejoraDetailView({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading } = useFindMejoraByIdQuery(id);
  const approveMutation = useApproveMejoraMutation();
  const { user } = useAuthStore();

  const isApproving = approveMutation.isPending;
  const canApprove = !!data && data.estado === "Solicitado";

  const handleApprove = () => {
    if (!data || !user?.id_user) return;
    approveMutation.mutate({ id: data.idMejora, aprobadoPorId: user.id_user });
  };

  if (isLoading) return <ContainerApp title="Detalle de Mejora"><div className="py-8">Cargando...</div></ContainerApp>;
  if (!data) return <ContainerApp title="Detalle de Mejora"><div className="py-8">No encontrado</div></ContainerApp>;

  return (
    <ContainerApp title={`Mejora - ${data.codigoAutorizacion ?? data.idMejora}`}>
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Link href="/mejoras">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Volver a la lista
          </Button>
        </Link>
        
        <Button 
          onClick={() => router.push(`/mejoras/${id}/editar`)}
          variant="outline"
          className="gap-2"
        >
          <Edit className="w-4 h-4" />
          Editar
        </Button>
      </div>
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="inline-flex flex-col gap-2 rounded-md border bg-muted/40 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Estado actual</p>
              <Badge className="mt-1" variant={data.estado === "Aprobado" ? "default" : "secondary"}>
                {data.estado ?? "Sin estado"}
              </Badge>
            </div>
            {canApprove ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="gap-1.5" size="sm" disabled={isApproving}>
                    {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {isApproving ? "Aprobando…" : "Aprobar"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Aprobar esta mejora?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Confirmar actualizará el estado a &quot;Aprobado&quot; y dejará esta solicitud lista para ejecutarse.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isApproving}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleApprove} disabled={isApproving} className="gap-1.5 bg-emerald-500 hover:bg-emerald-600">
                      {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {canApprove
              ? "Revisa la información y, cuando todo esté correcto, aprueba para avanzar al siguiente paso."
              : "Esta solicitud ya fue aprobada. No hay acciones adicionales disponibles."}
          </p>
        </div>
        <p><strong>Cementerio:</strong> {data.idCementerio?.nombre}</p>
        <p><strong>Panteonero:</strong> {data.panteoneroACargo}</p>
        <p><strong>Tipo de servicio:</strong> {data.tipoServicio}</p>
        <p><strong>Solicitante:</strong> {data.solicitante?.nombres} {data.solicitante?.apellidos}</p>
        <p><strong>Fecha solicitud:</strong> {new Date(data.fechaSolicitud).toLocaleDateString()}</p>
      </div>

      <div className="mt-4 space-y-3">
        <div className="space-y-3 rounded-lg border bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Documentación de respaldo</p>
              <p className="text-xs text-muted-foreground">Revisa los PDFs antes de aprobar esta solicitud.</p>
            </div>
            {!data.documentos?.length ? (
              <Badge variant="secondary">Sin documentos</Badge>
            ) : null}
          </div>
          {data.documentos?.length ? (
            <div className="space-y-4">
              {data.documentos.map((doc) => (
                <div key={doc.filename} className="space-y-3 rounded-lg border border-dashed border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{doc.originalName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(doc.uploadedAt).toLocaleString()}</p>
                    </div>
                    <a
                      href={buildDocumentUrl(doc.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-primary underline-offset-2 underline"
                    >
                      Abrir en nueva pestaña
                    </a>
                  </div>
                  <div className="overflow-hidden rounded border bg-slate-50">
                    <iframe
                      src={buildDocumentUrl(doc.url)}
                      title={`Vista previa ${doc.originalName}`}
                      className="h-72 w-full"
                    >
                      <p>Tu navegador no puede mostrar el PDF. Usa el enlace para abrirlo.</p>
                    </iframe>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No se han cargado PDFs para esta mejora.</p>
          )}
        </div>
      </div>
    </ContainerApp>
  );
}


