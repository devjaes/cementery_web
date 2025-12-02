"use client";

import Link from "next/link";
import { useState } from "react";
import { MejoraDocumento, MejoraEntity } from "../../../domain/entities/mejora.entity";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Check, Download, Eye, FileText, Loader2, MapPin, Pencil, XCircle } from "lucide-react";
import {
  useApproveMejoraMutation,
  useDownloadMejoraPdfMutation,
  useRejectMejoraMutation,
} from "../../hooks/use-mejora-mutation";
import { formatDate, fullName } from "./formatters";
import { DEFAULT_APPROVER_ID } from "./constants";
import { MejoraDetailDialog } from "./mejora-detail-dialog.component";

interface RelatedMejorasPanelProps {
  mejoras: MejoraEntity[];
  isLoading?: boolean;
  searchTerm: string;
}

const DOCUMENT_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "").replace(/\/$/, "");

const buildDocumentUrl = (relative?: string) => {
  if (!relative) return undefined;
  return `${DOCUMENT_BASE_URL}${relative}`;
};

const formatBytes = (value: number) => {
  if (value === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.floor(Math.log(value) / Math.log(1024));
  const formatted = (value / Math.pow(1024, exponent)).toFixed(1);
  return `${formatted} ${units[exponent]}`;
};

type MejoraDocumentListDialogProps = {
  documents: MejoraDocumento[];
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

const MejoraDocumentListDialog = ({ documents, open, onOpenChange }: MejoraDocumentListDialogProps) => {
  if (!documents.length) {
    return null;
  }

  const handleView = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Documentos adjuntos</DialogTitle>
          <DialogDescription>
            {documents.length} archivo{documents.length === 1 ? "" : "s"} disponibles para consultar.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pt-3">
          {documents.map((doc) => {
            const url = buildDocumentUrl(doc.url);
            const uploadedAt = doc.uploadedAt
              ? new Date(doc.uploadedAt).toLocaleString()
              : "Fecha desconocida";

            return (
              <div
                key={doc.filename}
                className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{doc.originalName}</p>
                    <p className="text-xs text-muted-foreground">Subido el {uploadedAt}</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!url}
                    className="gap-2"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      handleView(url);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    Ver
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatBytes(doc.size)}</span>
                  <span>{doc.contentType}</span>
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Panel that displays mejoras related to the search results
 */
export const RelatedMejorasPanel = ({
  mejoras,
  isLoading,
  searchTerm,
}: RelatedMejorasPanelProps) => {
  const approveMutation = useApproveMejoraMutation();
  const rejectMutation = useRejectMejoraMutation();
  const downloadMutation = useDownloadMejoraPdfMutation();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [activeDocuments, setActiveDocuments] = useState<MejoraDocumento[]>([]);

  const handleOpenDocuments = (documents: MejoraDocumento[]) => {
    setActiveDocuments(documents);
    setDocumentDialogOpen(true);
  };

  const handleDocumentDialogOpenChange = (value: boolean) => {
    setDocumentDialogOpen(value);
    if (!value) {
      setActiveDocuments([]);
    }
  };

  const handleApprove = (mejora: MejoraEntity) => {
    setApprovingId(mejora.idMejora);
    approveMutation.mutate(
      { id: mejora.idMejora, aprobadoPorId: DEFAULT_APPROVER_ID },
      {
        onSettled: () => setApprovingId(null),
      },
    );
  };

  const handleReject = (mejora: MejoraEntity) => {
    setRejectingId(mejora.idMejora);
    rejectMutation.mutate(
      { id: mejora.idMejora, negadoPorId: DEFAULT_APPROVER_ID },
      {
        onSettled: () => setRejectingId(null),
      },
    );
  };

  const handleDownload = (mejora: MejoraEntity) => {
    if (downloadMutation.isPending) return;
    setDownloadingId(mejora.idMejora);
    downloadMutation.mutate(
      { id: mejora.idMejora },
      {
        onSettled: () => setDownloadingId(null),
      },
    );
  };

  if (!isLoading && mejoras.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Mejoras relacionadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Buscando mejoras asociadas…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Fallecido</TableHead>
                  <TableHead>Cementerio</TableHead>
                  <TableHead>Tipo servicio</TableHead>
                  <TableHead>Fecha inicio</TableHead>
                  <TableHead className="w-[180px]">Estado</TableHead>
                  <TableHead className="w-[140px] text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mejoras.map((mejora) => (
                    <TableRow key={mejora.idMejora}>
                    <TableCell>{fullName(mejora.solicitante)}</TableCell>
                    <TableCell>{fullName(mejora.fallecido)}</TableCell>
                    <TableCell>{mejora.idCementerio?.nombre ?? "Sin cementerio"}</TableCell>
                    <TableCell>{mejora.tipoServicio}</TableCell>
                    <TableCell>{formatDate(mejora.fechaInicio ?? mejora.fechaSolicitud)}</TableCell>
                      <TableCell className="align-top">
                        <div className="flex flex-col gap-2">
                          <Badge
                            className={
                              mejora.estado === "Aprobado"
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white w-fit"
                                : mejora.estado === "Negado"
                                  ? "bg-rose-500 hover:bg-rose-600 text-white w-fit"
                                  : "w-fit"
                            }
                            variant={mejora.estado === "Aprobado" ? "default" : "secondary"}
                          >
                            {mejora.estado ?? "Sin estado"}
                          </Badge>
                          {mejora.estado === "Solicitado" && (
                            <div className="flex flex-wrap gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white w-fit"
                                    disabled={approveMutation.isPending}
                                  >
                                    {approveMutation.isPending && approvingId === mejora.idMejora ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Check className="h-4 w-4" />
                                    )}
                                    {approveMutation.isPending && approvingId === mejora.idMejora
                                      ? "Aprobando…"
                                      : "Aprobar"}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Aprobar esta mejora?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Confirmar actualizará el estado a &quot;Aprobado&quot; y dejará la solicitud lista para ejecutar.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel disabled={approveMutation.isPending}>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      disabled={approveMutation.isPending}
                                      onClick={() => handleApprove(mejora)}
                                      className="gap-1.5 bg-emerald-500 hover:bg-emerald-600"
                                    >
                                      {approveMutation.isPending && approvingId === mejora.idMejora ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Check className="h-4 w-4" />
                                      )}
                                      Confirmar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="gap-1.5 bg-rose-500 hover:bg-rose-600 text-white w-fit"
                                    disabled={rejectMutation.isPending}
                                  >
                                    {rejectMutation.isPending && rejectingId === mejora.idMejora ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <XCircle className="h-4 w-4" />
                                    )}
                                    {rejectMutation.isPending && rejectingId === mejora.idMejora ? "Negando…" : "Negar"}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Negar esta mejora?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Confirmar actualizará el estado a &quot;Negado&quot; y cancelará la ejecución de la solicitud.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel disabled={rejectMutation.isPending}>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      disabled={rejectMutation.isPending}
                                      onClick={() => handleReject(mejora)}
                                      className="gap-1.5 bg-rose-500 hover:bg-rose-600"
                                    >
                                      {rejectMutation.isPending && rejectingId === mejora.idMejora ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <XCircle className="h-4 w-4" />
                                      )}
                                      Confirmar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" title="Ver detalle">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <MejoraDetailDialog mejora={mejora} />
                        </Dialog>
                        {mejora.estado === "Solicitado" ? (
                          <Link href={`/mejoras/${mejora.idMejora}/editar${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ""}`}>
                            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" title="Editar">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                        ) : null}
                        {mejora.estado === "Aprobado" ? (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title="Descargar formulario PDF"
                            disabled={downloadMutation.isPending && downloadingId === mejora.idMejora}
                            onClick={() => handleDownload(mejora)}
                          >
                            {downloadMutation.isPending && downloadingId === mejora.idMejora ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                        ) : null}
                        {mejora.documentos && mejora.documentos.length > 0 ? (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title="Ver documentos adjuntos"
                            onClick={() => handleOpenDocuments(mejora.documentos ?? [])}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <MejoraDocumentListDialog
        documents={activeDocuments}
        open={documentDialogOpen}
        onOpenChange={handleDocumentDialogOpenChange}
      />
    </Card>
  );
};
