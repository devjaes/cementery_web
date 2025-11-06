"use client";

import { Badge } from "@/shared/components/ui/badge";
import { PaymentStatus } from "../../domain/entities/payment.entity";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  const variants = {
    pending: { label: "Pendiente", className: "bg-yellow-500 hover:bg-yellow-600" },
    paid: { label: "Pagado", className: "bg-green-500 hover:bg-green-600" },
  };

  const { label, className } = variants[status];

  return <Badge className={className}>{label}</Badge>;
};
