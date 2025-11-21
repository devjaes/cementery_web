"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { GeneratePaymentButton } from "./generate-payment-button";
import { PaymentStatusCard } from "./payment-status-card";
import { ProcedureType } from "../../domain/entities/payment.entity";
import { useState } from "react";

interface PaymentFlowComponentProps {
  procedureType: ProcedureType;
  procedureId: string;
  amount: number;
  generatedBy: string;
  validatedBy: string;
  observations?: string;
}

export const PaymentFlowComponent = ({
  procedureType,
  procedureId,
  amount,
  generatedBy,
  validatedBy,
  observations,
}: PaymentFlowComponentProps) => {
  const [hasPayment, setHasPayment] = useState(false);

  return (
    <div className="space-y-4">
      {!hasPayment ? (
        <Card>
          <CardHeader>
            <CardTitle>Generar Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <GeneratePaymentButton
                procedureType={procedureType}
                procedureId={procedureId}
                amount={amount}
                generatedBy={generatedBy}
                observations={observations}
                onSuccess={() => setHasPayment(true)}
              />

              {/* Reuse the same "Generar Comprobante de Pago" button under the main one */}
              <GeneratePaymentButton
                procedureType={procedureType}
                procedureId={procedureId}
                amount={amount}
                generatedBy={generatedBy}
                observations={observations}
                onSuccess={() => setHasPayment(true)}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <PaymentStatusCard
          procedureType={procedureType}
          procedureId={procedureId}
          validatedBy={validatedBy}
        />
      )}
    </div>
  );
};
