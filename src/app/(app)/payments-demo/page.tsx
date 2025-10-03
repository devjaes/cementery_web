"use client";

import { useState } from "react";
import {
  PaymentFlowComponent,
  PaymentStatusCard,
  UploadReceiptDialog,
} from "@/features/payment";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function PaymentsDemoPage() {
  const [procedureId, setProcedureId] = useState<string>(
    "123e4567-e89b-12d3-a456-426614174000"
  );
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Demo de Pagos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Flujo Completo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PaymentFlowComponent
            procedureType="burial"
            procedureId={procedureId}
            amount={150.5}
            generatedBy="1850046317"
            validatedBy="1850046317"
            observations="Pago demo desde página de pruebas"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estado de Pago y Subida de Comprobante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() =>
                setProcedureId("123e4567-e89b-12d3-a456-426614174000")
              }
            >
              Cambiar ProcedureId
            </Button>
            <Button onClick={() => setShowUpload(true)} disabled={!paymentId}>
              Subir comprobante (requiere paymentId)
            </Button>
          </div>

          <PaymentStatusCard
            procedureType="burial"
            procedureId={procedureId}
            validatedBy="1850046317"
          />

          {showUpload && paymentId && (
            <UploadReceiptDialog
              paymentId={paymentId}
              validatedBy="demo-admin"
              onSuccess={() => setShowUpload(false)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
